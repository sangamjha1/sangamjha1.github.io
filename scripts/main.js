const header = document.querySelector(".site-header");
const progress = document.querySelector(".scroll-progress");
const reveals = document.querySelectorAll(".reveal");
const tracks = document.querySelectorAll("[data-track]");
const loader = document.getElementById("page-loader");
const modal = document.getElementById("project-modal");
const modalTitle = document.getElementById("modal-title");
const modalDescription = document.getElementById("modal-description");
const modalTech = document.getElementById("modal-tech");
const modalLinks = document.getElementById("modal-links");
const modalRole = document.getElementById("modal-role");
const modalHighlights = document.getElementById("modal-highlights");
const filterButtons = document.querySelectorAll("[data-filter]");
const skillCards = document.querySelectorAll(".skill-card[data-skill]");
const toTop = document.getElementById("to-top");
const avatarVideo = document.getElementById("avatar-video");
const avatarCanvas = document.getElementById("avatar-canvas");

// Clean any leftover noload in URL (query or path)
(() => {
  try {
    const url = new URL(window.location.href);
    if (url.searchParams.has("noload")) {
      url.searchParams.delete("noload");
      window.history.replaceState({}, document.title, url.toString());
    }
    if (url.pathname.includes("/noload=1")) {
      url.pathname = url.pathname.replace("/noload=1", "");
      window.history.replaceState({}, document.title, url.toString());
    }
  } catch {
    // ignore
  }
})();

const onScroll = () => {
  if (header) {
    header.classList.toggle("scrolled", window.scrollY > 30);
  }

  if (progress) {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    progress.style.width = `${pct}%`;
  }

  if (toTop) {
    toTop.classList.toggle("show", window.scrollY > 400);
  }
};

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.15 }
);

reveals.forEach((el) => revealObserver.observe(el));
window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("load", onScroll);

if (loader) {
  const skipLoader = sessionStorage.getItem("skipLoader") === "1";
  if (skipLoader) {
    loader.classList.add("hidden");
    sessionStorage.removeItem("skipLoader");
  } else {
    window.addEventListener("load", () => {
      setTimeout(() => {
        loader.classList.add("hidden");
      }, 2100);
    });
  }
}

const scrollTrack = (track, dir) => {
  const scrollAmount = track.clientWidth * 0.8;
  track.scrollBy({ left: dir === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
};

document.querySelectorAll("[data-scroll]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const track = btn.closest(".row").querySelector("[data-track]");
    if (!track) return;
    scrollTrack(track, btn.dataset.scroll);
  });
});

tracks.forEach((track) => {
  track.addEventListener("wheel", (event) => {
    if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
      event.preventDefault();
      track.scrollBy({ left: event.deltaY, behavior: "smooth" });
    }
  }, { passive: false });
});

const openModal = (card) => {
  if (!modal || !modalTitle || !modalDescription || !modalTech || !modalLinks || !modalRole || !modalHighlights) return;
  const title = card.dataset.title || "Project";
  const desc = card.dataset.description || "";
  const tech = card.dataset.tech ? card.dataset.tech.split(",") : [];
  const role = card.dataset.role || "";
  const highlights = card.dataset.highlights ? card.dataset.highlights.split(";") : [];
  const repo = card.dataset.repo;
  const live = card.dataset.live;

  modalTitle.textContent = title;
  modalDescription.textContent = desc;
  modalRole.textContent = role ? `Role: ${role}` : "";
  modalHighlights.innerHTML = "";
  highlights.forEach((item) => {
    const span = document.createElement("span");
    span.textContent = item.trim();
    modalHighlights.appendChild(span);
  });
  modalTech.innerHTML = "";
  tech.forEach((item) => {
    const span = document.createElement("span");
    span.textContent = item.trim();
    modalTech.appendChild(span);
  });

  modalLinks.innerHTML = "";
  if (repo) {
    const repoLink = document.createElement("a");
    repoLink.className = "btn ghost";
    repoLink.href = repo;
    repoLink.target = "_blank";
    repoLink.rel = "noreferrer";
    repoLink.textContent = "GitHub Repo";
    modalLinks.appendChild(repoLink);
  }
  if (live) {
    const liveLink = document.createElement("a");
    liveLink.className = "btn primary";
    liveLink.href = live;
    liveLink.target = "_blank";
    liveLink.rel = "noreferrer";
    liveLink.textContent = "Live Site";
    modalLinks.appendChild(liveLink);
  }

  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
};

const closeModal = () => {
  if (!modal) return;
  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");
};

document.querySelectorAll("[data-project]").forEach((card) => {
  card.querySelectorAll("[data-open]").forEach((btn) => {
    btn.addEventListener("click", () => openModal(card));
  });

  card.addEventListener("click", (event) => {
    const target = event.target;
    if (target.closest("a") || target.closest("button")) return;
    openModal(card);
  });
});

if (modal) {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });
}

document.querySelectorAll("[data-close]").forEach((btn) => {
  btn.addEventListener("click", closeModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
});

if (toTop) {
  toTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

const startChromaKey = () => {
  if (!avatarVideo || !avatarCanvas) return;
  const ctx = avatarCanvas.getContext("2d");
  if (!ctx) return;

  const render = () => {
    if (avatarVideo.readyState >= 2) {
      if (avatarCanvas.width !== avatarVideo.videoWidth) {
        avatarCanvas.width = avatarVideo.videoWidth;
        avatarCanvas.height = avatarVideo.videoHeight;
      }
      ctx.drawImage(avatarVideo, 0, 0, avatarCanvas.width, avatarCanvas.height);
      const frame = ctx.getImageData(0, 0, avatarCanvas.width, avatarCanvas.height);
      const data = frame.data;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const maxRB = Math.max(r, b);
        const greenDiff = g - maxRB;
        const greenRatio = g / (r + b + 1);

        // Strong key for green screen
        if ((g > 70 && greenDiff > 18 && greenRatio > 0.6) || (g > 120 && greenDiff > 10)) {
          data[i + 3] = 0;
        } else if (g > 60 && greenDiff > 8 && greenRatio > 0.45) {
          // Soft edge fade near green
          const alpha = Math.max(0, 255 - (greenDiff - 8) * 10);
          data[i + 3] = Math.min(data[i + 3], alpha);
        }

        // Reduce green spill on edges
        if (data[i + 3] > 0 && g > r && g > b) {
          data[i + 1] = Math.min(g, maxRB + 4);
        }
      }
      ctx.putImageData(frame, 0, 0);
    }
    requestAnimationFrame(render);
  };

  avatarVideo.play().catch(() => {});
  requestAnimationFrame(render);
};

startChromaKey();

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const filter = btn.dataset.filter;
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    skillCards.forEach((card) => {
      if (filter === "all" || card.dataset.skill === filter) {
        card.classList.remove("hidden");
      } else {
        card.classList.add("hidden");
      }
    });
  });
});
