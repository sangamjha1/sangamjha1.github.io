from pathlib import Path
import textwrap

text = Path('resume_extracted.txt').read_text(encoding='utf-8')
text = text.replace('  ', ' ')
lines = []
for para in text.split('•'):
    para = para.strip()
    if not para:
        continue
    wrapped = textwrap.wrap(para, width=90)
    lines.extend(wrapped)
    lines.append('')

font_size = 11
leading = 14
start_x = 50
start_y = 780

content_lines = ["BT", f"/F1 {font_size} Tf", f"{start_x} {start_y} Td"]

y = start_y
for line in lines:
    if line == "":
        y -= leading
        content_lines.append(f"0 -{leading} Td")
        continue
    safe = line.replace('\\', r'\\').replace('(', r'\(').replace(')', r'\)')
    content_lines.append(f"({safe}) Tj")
    content_lines.append(f"0 -{leading} Td")
    y -= leading
    if y < 60:
        break

content_lines.append("ET")
content_stream = "\n".join(content_lines).encode('latin-1', errors='ignore')

objects = []

def add_obj(s: bytes):
    objects.append(s)
    return len(objects)

obj1 = b"<< /Type /Catalog /Pages 2 0 R >>"
add_obj(obj1)

obj2 = b"<< /Type /Pages /Kids [3 0 R] /Count 1 >>"
add_obj(obj2)

obj3 = b"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>"
add_obj(obj3)

obj4 = b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"
add_obj(obj4)

obj5 = b"<< /Length %d >>\nstream\n" % len(content_stream) + content_stream + b"\nendstream"
add_obj(obj5)

pdf = [b"%PDF-1.4\n"]

xref_positions = [0]
for i, obj in enumerate(objects, start=1):
    xref_positions.append(sum(len(p) for p in pdf))
    pdf.append(f"{i} 0 obj\n".encode('ascii'))
    pdf.append(obj + b"\n")
    pdf.append(b"endobj\n")

xref_start = sum(len(p) for p in pdf)

xref = [b"xref\n", f"0 {len(objects)+1}\n".encode('ascii')]

xref.append(b"0000000000 65535 f \n")
for pos in xref_positions[1:]:
    xref.append(f"{pos:010d} 00000 n \n".encode('ascii'))

trailer = b"trailer\n<< /Size %d /Root 1 0 R >>\nstartxref\n%d\n%%%%EOF\n" % (len(objects)+1, xref_start)

pdf_bytes = b"".join(pdf) + b"".join(xref) + trailer

out = Path('assets/Sangam_Jha_Resume.pdf')
out.write_bytes(pdf_bytes)
print(out, out.stat().st_size)
