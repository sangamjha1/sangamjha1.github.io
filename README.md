# Netflix-Style Portfolio — Sangam Jha

Cinematic, Netflix-inspired personal portfolio built as a static site. Ready for GitHub Pages + custom domain.

## Highlights
- Netflix-style hero + loader
- Project carousel with modal details
- Skills filter + language proficiency bars
- Resume page with inline PDF viewer
- Social sidebar + back-to-top button
- Custom media assets (thumbnails, avatar, certificates)

## Project Structure
- `index.html` — Main site
- `resume.html` — Resume page
- `styles/main.css` — Global styles
- `scripts/main.js` — Interactions (loader, modal, carousel, chroma key)
- `assets/` — Images, certificates, videos, resume files
- `CNAME` — Custom domain for GitHub Pages
- `.nojekyll` — (Optional) disables Jekyll processing

## Local Preview
Open `index.html` directly in a browser.

For best results (PDF viewer + JS), use a simple static server. Example (PowerShell):

```powershell
python -m http.server 8000
```
Then open `http://localhost:8000`.

## Deploy (GitHub Pages)
1. Initialize git and push the repo to GitHub.
2. In GitHub repo **Settings → Pages**:
   - Source: `main` branch
   - Folder: `/root`
3. Add your custom domain in GitHub Pages settings.
4. Ensure `CNAME` matches your domain (already set to `sangamjha.com.np`).

## Resume Links
- PDF: `assets/Sangam_Jha_Resume.pdf`
- DOCX: `assets/Sangam_Jha_Resume.docx`

## Notes
- Loader skip: visiting `index.html?noload=1#home` bypasses loader.
- If you replace assets, keep filenames the same to avoid broken links.

---
If you want a build step, SEO metadata, or image optimization later, we can add it.
