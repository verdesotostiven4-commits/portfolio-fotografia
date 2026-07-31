(function () {
  "use strict";

  var installed = false;
  var audioUnlocked = false;
  var visibilityObserver = null;
  var preloadObserver = null;
  var retryTimer = null;
  var lastGestureAt = 0;

  function inlineVideos() {
    return Array.prototype.slice.call(document.querySelectorAll("video[data-inline-video]"));
  }

  function isVisible(video, minimumRatio) {
    var rect = video.getBoundingClientRect();
    var viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
    var visibleHeight = Math.max(0, Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0));
    var ratio = rect.height > 0 ? visibleHeight / rect.height : 0;
    return ratio >= (minimumRatio || 0.3);
  }

  function installControlHidingStyles() {
    if (document.getElementById("maternity-inline-video-clean-styles")) return;

    var style = document.createElement("style");
    style.id = "maternity-inline-video-clean-styles";
    style.textContent = [
      "video[data-inline-video]{pointer-events:none!important;-webkit-user-select:none!important;user-select:none!important}",
      "video[data-inline-video]::-webkit-media-controls{display:none!important;-webkit-appearance:none!important}",
      "video[data-inline-video]::-webkit-media-controls-enclosure{display:none!important}",
      "video[data-inline-video]::-webkit-media-controls-panel{display:none!important}",
      "video[data-inline-video]::-webkit-media-controls-overlay-play-button{display:none!important;-webkit-appearance:none!important}",
      "video[data-inline-video]::-webkit-media-controls-start-playback-button{display:none!important;-webkit-appearance:none!important}",
      "video[data-inline-video]::-webkit-media-controls-play-button{display:none!important}",
      "video[data-inline-video]::-webkit-media-controls-cast-button{display:none!important}",
      "video[data-inline-video]::-internal-media-controls-overlay-cast-button{display:none!important}"
    ].join("");
    document.head.appendChild(style);
  }

  function suppressBrowserVideoControls(video) {
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
    video.style.pointerEvents = "none";
  }

  function removeManualSoundButtons() {
    document.querySelectorAll("[data-sound]").forEach(function (button) {
      button.remove();
    });
    document.querySelectorAll(".gVideoCaption").forEach(function (caption) {
      caption.style.justifyContent = "flex-start";
    });
  }

  function publicRootFromPoster(video) {
    var poster = video.getAttribute("poster") || "";
    var marker = "/maternidad-playa/";
    var markerIndex = poster.indexOf(marker);
    return markerIndex >= 0 ? poster.slice(0, markerIndex) : "";
  }

  function attachSource(video) {
    if (video.getAttribute("src")) return true;
    var source = video.dataset.inlineSource || "";
    if (!source) return false;

    video.preload = "auto";
    video.src = source;
    video.load();
    return true;
  }

  async function prepareVideoSources() {
    var videos = inlineVideos();
    if (!videos.length) return;

    videos.forEach(function (video) {
      suppressBrowserVideoControls(video);
      video.preload = "metadata";
    });

    var publicRoot = publicRootFromPoster(videos[0]);
    if (!publicRoot) return;

    try {
      var response = await fetch(publicRoot + "/maternidad-playa/manifest.json?v=" + Date.now(), {
        cache: "no-store",
        headers: { Accept: "application/json" }
      });
      if (!response.ok) return;

      var manifest = await response.json();
      var media = Array.isArray(manifest.media) ? manifest.media : [];

      videos.forEach(function (video) {
        var index = Number(video.dataset.inlineVideo);
        var item = media[index];
        if (!item || item.type !== "video" || !item.originalPath) return;
        video.dataset.inlineSource = publicRoot + "/" + String(item.originalPath).replace(/^\/+/, "");
      });

      installPreloader();
    } catch (_) {
      // La galería principal seguirá colocando la fuente como respaldo.
    }
  }

  function bufferedSeconds(video) {
    try {
      if (!video.buffered || !video.buffered.length) return 0;
      for (var index = 0; index < video.buffered.length; index += 1) {
        if (video.currentTime >= video.buffered.start(index) && video.currentTime <= video.buffered.end(index)) {
          return Math.max(0, video.buffered.end(index) - video.currentTime);
        }
      }
      return Math.max(0, video.buffered.end(video.buffered.length - 1) - video.currentTime);
    } catch (_) {
      return 0;
    }
  }

  function setAudible(video) {
    video.defaultMuted = false;
    video.muted = false;
    video.removeAttribute("muted");
    video.volume = 1;
  }

  function setSilent(video) {
    video.defaultMuted = true;
    video.muted = true;
    video.setAttribute("muted", "");
  }

  function playInline(video, preferAudio) {
    if (!attachSource(video)) return;

    if (preferAudio && audioUnlocked) setAudible(video);
    else setSilent(video);

    video.preload = "auto";
    var promise = video.play();
    if (promise && typeof promise.catch === "function") {
      promise.catch(function () {
        if (!video.muted) {
          setSilent(video);
          video.play().catch(function () {});
        }
      });
    }
  }

  function playVisibleFromGesture() {
    var now = Date.now();
    if (now - lastGestureAt < 120) return;
    lastGestureAt = now;
    audioUnlocked = true;

    inlineVideos().forEach(function (video) {
      if (!isVisible(video, 0.12)) return;
      attachSource(video);
      setAudible(video);
      video.preload = "auto";
      var promise = video.play();
      if (promise && typeof promise.catch === "function") {
        promise.catch(function () {
          // El observador volverá a intentarlo al terminar de cargar.
        });
      }
    });
  }

  function tryVisibleVideos() {
    inlineVideos().forEach(function (video) {
      if (isVisible(video, 0.3)) {
        playInline(video, true);
      } else if (!video.paused) {
        video.pause();
      }
    });
  }

  function installVideoHooks(video) {
    if (video.dataset.audioAutoReady === "true") return;
    video.dataset.audioAutoReady = "true";
    suppressBrowserVideoControls(video);

    video.addEventListener("loadedmetadata", function () {
      if (isVisible(video, 0.15)) playInline(video, true);
    });

    video.addEventListener("canplay", function () {
      if (isVisible(video, 0.15)) playInline(video, true);
    });

    video.addEventListener("progress", function () {
      if (audioUnlocked && isVisible(video, 0.2) && bufferedSeconds(video) >= 2.5) {
        playInline(video, true);
      }
    });

    video.addEventListener("waiting", function () {
      if (bufferedSeconds(video) < 0.8) video.pause();
    });
  }

  function installPreloader() {
    if (preloadObserver) preloadObserver.disconnect();

    preloadObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var video = entry.target;
        if (attachSource(video)) {
          video.preload = "auto";
          video.load();
        }
        preloadObserver.unobserve(video);
      });
    }, { rootMargin: "1800px 0px", threshold: 0 });

    inlineVideos().forEach(function (video) {
      installVideoHooks(video);
      preloadObserver.observe(video);
    });
  }

  function installVisibilityPlayback() {
    visibilityObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var video = entry.target;
        if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
          playInline(video, true);
        } else if (!entry.isIntersecting || entry.intersectionRatio < 0.1) {
          video.pause();
        }
      });
    }, { threshold: [0, 0.1, 0.3, 0.55, 0.8] });

    inlineVideos().forEach(function (video) {
      installVideoHooks(video);
      visibilityObserver.observe(video);
    });
  }

  function installInteractionUnlock() {
    document.addEventListener("touchend", playVisibleFromGesture, { capture: true, passive: true });
    document.addEventListener("pointerup", playVisibleFromGesture, { capture: true });
    document.addEventListener("click", playVisibleFromGesture, { capture: true });
    document.addEventListener("keydown", playVisibleFromGesture, { capture: true });
  }

  function installWhenReady() {
    if (installed || !document.getElementById("galleryApp")) return;

    installed = true;
    installControlHidingStyles();
    removeManualSoundButtons();
    installVisibilityPlayback();
    installInteractionUnlock();
    void prepareVideoSources();

    retryTimer = window.setInterval(function () {
      removeManualSoundButtons();
      inlineVideos().forEach(installVideoHooks);
      if (audioUnlocked) tryVisibleVideos();
    }, 900);

    window.addEventListener("pagehide", function () {
      if (retryTimer) window.clearInterval(retryTimer);
      if (visibilityObserver) visibilityObserver.disconnect();
      if (preloadObserver) preloadObserver.disconnect();
    }, { once: true });
  }

  var galleryObserver = new MutationObserver(function () {
    installWhenReady();
    if (installed) galleryObserver.disconnect();
  });

  galleryObserver.observe(document.documentElement, { childList: true, subtree: true });
  installWhenReady();
})();
