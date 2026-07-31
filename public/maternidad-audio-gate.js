(function () {
  "use strict";

  var installed = false;
  var consentGranted = false;
  var visibilityObserver = null;
  var sourcePromise = null;

  function inlineVideos() {
    return Array.prototype.slice.call(document.querySelectorAll("video[data-inline-video]"));
  }

  function visibleRatio(video) {
    var rect = video.getBoundingClientRect();
    var viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
    var visibleHeight = Math.max(0, Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0));
    return rect.height > 0 ? visibleHeight / rect.height : 0;
  }

  function publicRootFromPoster(video) {
    var poster = video.getAttribute("poster") || "";
    var marker = "/maternidad-playa/";
    var markerIndex = poster.indexOf(marker);
    return markerIndex >= 0 ? poster.slice(0, markerIndex) : "";
  }

  function cleanVideo(video) {
    video.controls = false;
    video.removeAttribute("controls");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    video.setAttribute("controlslist", "noremoteplayback nodownload nofullscreen");
    video.setAttribute("x-webkit-airplay", "deny");
    video.setAttribute("disablepictureinpicture", "");
    video.setAttribute("disableremoteplayback", "");
    try { video.disablePictureInPicture = true; } catch (_) {}
    try { video.disableRemotePlayback = true; } catch (_) {}
  }

  function makeAudible(video) {
    video.defaultMuted = false;
    video.muted = false;
    video.removeAttribute("muted");
    video.volume = 1;
  }

  function attachKnownSource(video) {
    if (video.getAttribute("src")) return true;
    var source = video.dataset.inlineSource || "";
    if (!source) return false;
    video.preload = "auto";
    video.src = source;
    video.load();
    return true;
  }

  async function prepareSources() {
    var videos = inlineVideos();
    if (!videos.length) return false;

    videos.forEach(function (video) {
      cleanVideo(video);
      video.preload = "auto";
    });

    var root = publicRootFromPoster(videos[0]);
    if (!root) return false;

    try {
      var response = await fetch(root + "/maternidad-playa/manifest.json?v=" + Date.now(), {
        cache: "no-store",
        headers: { Accept: "application/json" }
      });
      if (!response.ok) return false;

      var manifest = await response.json();
      var media = Array.isArray(manifest.media) ? manifest.media : [];

      videos.forEach(function (video) {
        var index = Number(video.dataset.inlineVideo);
        var item = media[index];
        if (!item || item.type !== "video" || !item.originalPath) return;
        video.dataset.inlineSource = root + "/" + String(item.originalPath).replace(/^\/+/, "");
        attachKnownSource(video);
      });

      return videos.some(function (video) { return Boolean(video.getAttribute("src")); });
    } catch (_) {
      return false;
    }
  }

  function installVideoGuards(video) {
    if (video.dataset.audioGateReady === "true") return;
    video.dataset.audioGateReady = "true";
    cleanVideo(video);

    video.addEventListener("play", function () {
      if (consentGranted) makeAudible(video);
    });

    video.addEventListener("volumechange", function () {
      if (consentGranted && video.muted) makeAudible(video);
    });

    var attributeObserver = new MutationObserver(function (mutations) {
      if (!consentGranted) return;
      mutations.forEach(function (mutation) {
        if (mutation.attributeName === "muted") makeAudible(video);
      });
    });

    attributeObserver.observe(video, { attributes: true, attributeFilter: ["muted"] });
  }

  function playVisibleVideos() {
    if (!consentGranted) return;

    inlineVideos().forEach(function (video) {
      installVideoGuards(video);
      attachKnownSource(video);

      if (visibleRatio(video) >= 0.28) {
        makeAudible(video);
        video.preload = "auto";
        var promise = video.play();
        if (promise && typeof promise.catch === "function") promise.catch(function () {});
      } else if (!video.paused) {
        video.pause();
      }
    });
  }

  function installVisibilityPlayback() {
    if (visibilityObserver) visibilityObserver.disconnect();

    visibilityObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var video = entry.target;
        if (!consentGranted) return;

        if (entry.isIntersecting && entry.intersectionRatio >= 0.28) {
          attachKnownSource(video);
          makeAudible(video);
          var promise = video.play();
          if (promise && typeof promise.catch === "function") promise.catch(function () {});
        } else if (!entry.isIntersecting || entry.intersectionRatio < 0.08) {
          video.pause();
        }
      });
    }, { threshold: [0, 0.08, 0.28, 0.5, 0.8] });

    inlineVideos().forEach(function (video) {
      installVideoGuards(video);
      visibilityObserver.observe(video);
    });
  }

  function primeAudioFromTap() {
    consentGranted = true;
    window.__maternityAudioConsent = true;

    var attempts = inlineVideos().map(function (video) {
      installVideoGuards(video);
      attachKnownSource(video);
      makeAudible(video);
      video.preload = "auto";

      var promise;
      try { promise = video.play(); } catch (_) { return Promise.resolve(); }

      if (!promise || typeof promise.then !== "function") return Promise.resolve();

      return promise.then(function () {
        video.dataset.audioPrimed = "true";
        if (visibleRatio(video) < 0.15) {
          window.setTimeout(function () {
            video.pause();
            try { video.currentTime = 0; } catch (_) {}
          }, 90);
        }
      }).catch(function () {});
    });

    installVisibilityPlayback();
    window.setTimeout(playVisibleVideos, 120);
    window.setTimeout(playVisibleVideos, 500);
    return Promise.all(attempts);
  }

  function installStyles() {
    if (document.getElementById("maternityAudioGateStyles")) return;
    var style = document.createElement("style");
    style.id = "maternityAudioGateStyles";
    style.textContent = [
      ".mag{position:fixed;z-index:1200;inset:0;display:grid;place-items:end center;padding:18px 14px max(18px,env(safe-area-inset-bottom));font-family:Inter,-apple-system,BlinkMacSystemFont,\"Segoe UI\",sans-serif;transition:opacity .35s,visibility .35s}",
      ".mag.isClosing{opacity:0;visibility:hidden}",
      ".magBackdrop{position:absolute;inset:0;background:linear-gradient(180deg,rgba(9,8,7,.18),rgba(9,8,7,.72));backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}",
      ".magCard{position:relative;width:min(520px,100%);padding:25px 22px 20px;border:1px solid rgba(255,255,255,.18);border-radius:28px;background:rgba(20,18,15,.9);color:#fff;box-shadow:0 24px 80px rgba(0,0,0,.35);backdrop-filter:blur(22px);-webkit-backdrop-filter:blur(22px)}",
      ".magBrand{font-size:22px;font-weight:950;letter-spacing:-.06em}.magBrand span{color:#d9a06c}",
      ".magEyebrow{margin:26px 0 8px;color:#d9a06c;font-size:10px;font-weight:900;letter-spacing:.17em;text-transform:uppercase}",
      ".mag h2{max-width:12ch;margin:0;font:400 37px/1 Georgia,serif;letter-spacing:-.04em}",
      ".mag p{margin:13px 0 0;color:rgba(255,255,255,.66);font-size:13px;line-height:1.6}",
      ".magButton{width:100%;height:56px;margin-top:21px;border:0;border-radius:17px;background:#fff;color:#171512;font-size:14px;font-weight:950;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px}",
      ".magButton:disabled{opacity:.62;cursor:wait}",
      ".magPlay{width:25px;height:25px;border-radius:50%;background:#171512;color:#fff;display:grid;place-items:center;font-size:10px;padding-left:2px}",
      ".magHint{display:block;margin-top:11px;color:rgba(255,255,255,.42);font-size:9px;text-align:center;letter-spacing:.04em}",
      "@media(min-width:760px){.mag{place-items:center}.magCard{padding:32px}.mag h2{font-size:44px}}"
    ].join("");
    document.head.appendChild(style);
  }

  function showGate() {
    if (document.getElementById("maternityAudioGate")) return;
    installStyles();

    var gate = document.createElement("section");
    gate.id = "maternityAudioGate";
    gate.className = "mag";
    gate.setAttribute("role", "dialog");
    gate.setAttribute("aria-modal", "true");
    gate.setAttribute("aria-label", "Abrir la sesión");
    gate.innerHTML = '<div class="magBackdrop"></div><div class="magCard"><div class="magBrand"><span>by</span>Stiven</div><p class="magEyebrow">Maternidad en la playa</p><h2>Una historia para sentir.</h2><p>Descubre esta sesión como fue preparada: fotografías, movimiento y sonido.</p><button class="magButton" id="maternityAudioEnter" type="button" disabled><span class="magPlay">▶</span><span>Preparando la sesión…</span></button><small class="magHint">El sonido comenzará cuando aparezca la película.</small></div>';
    document.body.appendChild(gate);

    var previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    var button = gate.querySelector("#maternityAudioEnter");

    sourcePromise = prepareSources();
    sourcePromise.finally(function () {
      button.disabled = false;
      button.querySelector("span:last-child").textContent = "Ver la sesión";
    });

    button.addEventListener("click", function () {
      if (button.disabled) return;
      button.disabled = true;
      button.querySelector("span:last-child").textContent = "Abriendo…";

      primeAudioFromTap().finally(function () {
        gate.classList.add("isClosing");
        document.body.style.overflow = previousOverflow;
        window.setTimeout(function () { gate.remove(); }, 380);
      });
    }, { once: true });
  }

  function installWhenReady() {
    if (installed || !document.getElementById("galleryApp")) return;
    if (!inlineVideos().length) return;

    installed = true;
    inlineVideos().forEach(installVideoGuards);
    showGate();

    document.addEventListener("visibilitychange", function () {
      if (!document.hidden) window.setTimeout(playVisibleVideos, 120);
    });
    window.addEventListener("scrollend", playVisibleVideos, { passive: true });
    document.addEventListener("touchend", function () {
      if (consentGranted) window.setTimeout(playVisibleVideos, 60);
    }, { capture: true, passive: true });
  }

  var galleryObserver = new MutationObserver(function () {
    installWhenReady();
    if (installed) galleryObserver.disconnect();
  });

  galleryObserver.observe(document.documentElement, { childList: true, subtree: true });
  installWhenReady();
})();
