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
      if (isVisible(video, 0.35)) playInline(video);
      else if (!video.paused) video.pause();
    });
  }

  function unlockAndPlayVisible() {
    audioUnlocked = true;

    inlineVideos().forEach(function (video) {
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
    if (video.dataset.audioAutoReady === "true") return;
    video.dataset.audioAutoReady = "true";

    video.addEventListener("loadedmetadata", function () {
      if (audioUnlocked && isVisible(video, 0.2)) playInline(video);
    });

    video.addEventListener("canplay", function () {
      if (audioUnlocked && isVisible(video, 0.2)) playInline(video);
    });

    video.addEventListener("play", function () {
      if (audioUnlocked) setAudible(video);
    });

    var sourceObserver = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.attributeName === "src" && audioUnlocked && isVisible(video, 0.2)) {
          playInline(video);
        }
      });
    });

    sourceObserver.observe(video, { attributes: true, attributeFilter: ["src", "muted"] });
  }

  function installVisibilityPlayback() {
    visibilityObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var video = entry.target;
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
    removeManualSoundButtons();
    installVisibilityPlayback();
    installInteractionUnlock();

    retryTimer = window.setInterval(function () {
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
