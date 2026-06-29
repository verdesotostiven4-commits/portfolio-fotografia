(() => {
  const waitForRibbon = () => {
    const ribbon = document.querySelector(".mockRibbon");
    const track = document.querySelector(".mockRibbonTrack");

    if (!ribbon || !track) {
      window.setTimeout(waitForRibbon, 250);
      return;
    }

    if (ribbon.dataset.enhanced === "true") return;
    ribbon.dataset.enhanced = "true";
    ribbon.classList.add("enhancedRibbon");

    const header = document.createElement("div");
    header.className = "ribbonHeader";
    header.innerHTML = `
      <div>
        <p class="ribbonKicker">Desliza el portafolio</p>
        <h2 class="ribbonTitle">Historias que se pueden recorrer.</h2>
        <p class="ribbonHint">Arrastra las imágenes, usa la rueda del mouse o controla con flechas.</p>
      </div>
      <div class="ribbonActions" aria-label="Controles del carrusel">
        <button class="ribbonBtn ribbonPrev" type="button" aria-label="Ver fotos anteriores">‹</button>
        <button class="ribbonBtn ribbonPause" type="button" aria-label="Pausar movimiento automático">Pausar</button>
        <button class="ribbonBtn ribbonNext" type="button" aria-label="Ver fotos siguientes">›</button>
      </div>
    `;

    const progress = document.createElement("div");
    progress.className = "ribbonProgress";
    progress.innerHTML = "<span></span>";

    ribbon.insertBefore(header, track);
    ribbon.appendChild(progress);

    const prev = header.querySelector(".ribbonPrev");
    const next = header.querySelector(".ribbonNext");
    const pause = header.querySelector(".ribbonPause");
    const bar = progress.querySelector("span");

    let isDown = false;
    let startX = 0;
    let startScrollLeft = 0;
    let paused = false;
    let userTouchedAt = 0;

    const cardStep = () => {
      const card = track.querySelector("figure");
      if (!card) return Math.round(window.innerWidth * 0.65);
      const styles = window.getComputedStyle(track);
      const gap = Number.parseFloat(styles.columnGap || styles.gap || "18") || 18;
      return card.getBoundingClientRect().width + gap;
    };

    const updateProgress = () => {
      const max = Math.max(1, track.scrollWidth - track.clientWidth);
      const value = Math.min(100, Math.max(0, (track.scrollLeft / max) * 100));
      if (bar) bar.style.width = `${value}%`;
    };

    const touch = () => {
      userTouchedAt = Date.now();
    };

    const moveBy = (direction) => {
      touch();
      track.scrollBy({ left: direction * cardStep() * 1.25, behavior: "smooth" });
    };

    prev?.addEventListener("click", () => moveBy(-1));
    next?.addEventListener("click", () => moveBy(1));

    pause?.addEventListener("click", () => {
      paused = !paused;
      pause.textContent = paused ? "Reanudar" : "Pausar";
      pause.setAttribute("aria-label", paused ? "Reanudar movimiento automático" : "Pausar movimiento automático");
      touch();
    });

    track.addEventListener("pointerdown", (event) => {
      isDown = true;
      startX = event.clientX;
      startScrollLeft = track.scrollLeft;
      track.classList.add("dragging");
      track.setPointerCapture?.(event.pointerId);
      touch();
    });

    track.addEventListener("pointermove", (event) => {
      if (!isDown) return;
      event.preventDefault();
      const distance = event.clientX - startX;
      track.scrollLeft = startScrollLeft - distance;
      updateProgress();
    });

    const stopDrag = (event) => {
      if (!isDown) return;
      isDown = false;
      track.classList.remove("dragging");
      track.releasePointerCapture?.(event.pointerId);
      updateProgress();
    };

    track.addEventListener("pointerup", stopDrag);
    track.addEventListener("pointercancel", stopDrag);
    track.addEventListener("mouseleave", () => {
      isDown = false;
      track.classList.remove("dragging");
    });

    track.addEventListener("wheel", (event) => {
      const horizontal = Math.abs(event.deltaX) > Math.abs(event.deltaY);
      const amount = horizontal ? event.deltaX : event.deltaY;
      if (!amount) return;
      event.preventDefault();
      touch();
      track.scrollLeft += amount;
      updateProgress();
    }, { passive: false });

    track.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    window.setInterval(() => {
      if (paused || isDown || document.hidden) return;
      if (Date.now() - userTouchedAt < 2600) return;
      const max = track.scrollWidth - track.clientWidth;
      if (max <= 0) return;
      if (track.scrollLeft >= max - 4) {
        track.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        track.scrollBy({ left: 1.2, behavior: "auto" });
      }
      updateProgress();
    }, 34);

    updateProgress();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", waitForRibbon);
  } else {
    waitForRibbon();
  }
})();
