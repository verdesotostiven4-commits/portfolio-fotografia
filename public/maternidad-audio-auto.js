(function () {
  "use strict";

  var audioUnlocked = false;
  var installed = false;
  var visibilityObserver = null;
  var retryTimer = null;

  function inlineVideos() {
    return Array.prototype.slice.call(document.querySelectorAll("[data-inline-video]"));
  }

  function isVisible(video, minimumRatio) {
    var rect = video.getBoundingClientRect();
    var viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
    var visibleHeight = Math.max(0, Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0));
    var ratio = rect.height > 0 ? visibleHeight / rect.height : 0;
    return ratio >= (minimumRatio || 0.35);
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
    video.disablePictureInPicture = true;
    video.disableRemotePlayback = true;
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

  function setAudible(video) {
    video.defaultMuted = false;
    video.muted = false;
    video.removeAttribute("muted");
    video.volume = 1;
  }

  function playInline(video) {
    if (!video || !video.getAttribute("src")) return;

    suppressBrowserVideoControls(video);

    if (audioUnlocked) {
      setAudible(video);
      video.play().catch(function () {
        video.defaultMuted = true;
        video.muted = true;
        video.play().catch(function () {});
      });
      return;
    }

    video.defaultMuted = true;
    video.muted = true;
    video.play().catch(function () {});
  }

  function tryVisibleVideos() {
    inlineVideos().forEach(function (video) {
      suppressBrowserVideoControls(video);
      if (isVisible(video, 0.35)) playInline(video);
      else if (!video.paused) video.pause();
    });
  }

  function unlockAndPlayVisible() {
    audioUnlocked = true;

    inlineVideos().forEach(function (video) {
      suppressBrowserVideoControls(video);
      setAudible(video);
      if (isVisible(video, 0.2) && video.getAttribute("src")) {
        video.play().catch(function () {});
      }
    });

    window.setTimeout(tryVisibleVideos, 0);
    window.setTimeout(tryVisibleVideos, 120);
    window.setTimeout(tryVisibleVideos, 350);
  }

  function installVideoHooks(video) {
    suppressBrowserVideoControls(video);

    if (video.dataset.audioAutoReady === "true") return;
    video.dataset.audioAutoReady = "true";

    video.addEventListener("loadedmetadata", function () {
      suppressBrowserVideoControls(video);
      if (audioUnlocked && isVisible(video, 0.2)) playInline(video);
    });

    video.addEventListener("canplay", function () {
      suppressBrowserVideoControls(video);
      if (audioUnlocked && isVisible(video, 0.2)) playInline(video);
    });

    video.addEventListener("play", function () {
      suppressBrowserVideoControls(video);
      if (audioUnlocked) setAudible(video);
    });

    var sourceObserver = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        suppressBrowserVideoControls(video);
        if (mutation.attributeName === "src" && audioUnlocked && isVisible(video, 0.2)) {
          playInline(video);
        }
      });
    });

    sourceObserver.observe(video, { attributes: true, attributeFilter: ["src", "muted", "controls"] });
  }

  function installVisibilityPlayback() {
    visibilityObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var video = entry.target;
        suppressBrowserVideoControls(video);
        if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
          playInline(video);
        } else if (!entry.isIntersecting || entry.intersectionRatio < 0.12) {
          video.pause();
        }
      });
    }, { threshold: [0, 0.12, 0.35, 0.55, 0.8] });

    inlineVideos().forEach(function (video) {
      installVideoHooks(video);
      visibilityObserver.observe(video);
    });
  }

  function installInteractionUnlock() {
    document.addEventListener("touchend", unlockAndPlayVisible, { capture: true, passive: true });
    document.addEventListener("pointerup", unlockAndPlayVisible, { capture: true });
    document.addEventListener("click", unlockAndPlayVisible, { capture: true });
    document.addEventListener("keydown", unlockAndPlayVisible, { capture: true });

    document.addEventListener("touchstart", function () {
      audioUnlocked = true;
    }, { capture: true, passive: true, once: true });
  }

  function installWhenReady() {
    if (installed || !document.getElementById("galleryApp")) return;

    installed = true;
    installControlHidingStyles();
    removeManualSoundButtons();
    installVisibilityPlayback();
    installInteractionUnlock();

    retryTimer = window.setInterval(function () {
      installControlHidingStyles();
      removeManualSoundButtons();
      inlineVideos().forEach(installVideoHooks);
      if (audioUnlocked) tryVisibleVideos();
    }, 700);

    window.addEventListener("pagehide", function () {
      if (retryTimer) window.clearInterval(retryTimer);
      if (visibilityObserver) visibilityObserver.disconnect();
    }, { once: true });
  }

  var galleryObserver = new MutationObserver(function () {
    installWhenReady();
    if (installed) galleryObserver.disconnect();
  });

  galleryObserver.observe(document.documentElement, { childList: true, subtree: true });
  installWhenReady();
})();
