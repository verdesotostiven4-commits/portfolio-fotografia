(function () {
  "use strict";

  var audioUnlocked = false;
  var installed = false;

  function inlineVideos() {
    return Array.prototype.slice.call(document.querySelectorAll("[data-inline-video]"));
  }

  function removeManualSoundButtons() {
    document.querySelectorAll("[data-sound]").forEach(function (button) { button.remove(); });
    document.querySelectorAll(".gVideoCaption").forEach(function (caption) {
      caption.style.justifyContent = "flex-start";
    });
  }

  function playWithPreferredAudio(video) {
    if (!video.getAttribute("src")) return;

    if (audioUnlocked) {
      video.defaultMuted = false;
      video.muted = false;
      video.volume = 1;
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

  function unlockAudio() {
    if (audioUnlocked) return;
    audioUnlocked = true;

    inlineVideos().forEach(function (video) {
      video.defaultMuted = false;
      video.muted = false;
      video.removeAttribute("muted");
      video.volume = 1;

      var rect = video.getBoundingClientRect();
      var visible = rect.bottom > 0 && rect.top < window.innerHeight;
      if (visible && video.getAttribute("src")) playWithPreferredAudio(video);
    });
  }

  function installVisibilityPlayback() {
    var visibilityObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var video = entry.target;
        if (entry.isIntersecting && entry.intersectionRatio >= 0.45) {
          playWithPreferredAudio(video);
        }
      });
    }, { threshold: [0, 0.45, 0.75] });

    inlineVideos().forEach(function (video) { visibilityObserver.observe(video); });
  }

  function installWhenReady() {
    if (installed || !document.getElementById("galleryApp")) return;

    installed = true;
    removeManualSoundButtons();
    installVisibilityPlayback();

    document.addEventListener("pointerdown", unlockAudio, { capture: true, once: true });
    document.addEventListener("touchstart", unlockAudio, { capture: true, passive: true, once: true });
    document.addEventListener("keydown", unlockAudio, { capture: true, once: true });
  }

  var galleryObserver = new MutationObserver(function () {
    installWhenReady();
    if (installed) galleryObserver.disconnect();
  });

  galleryObserver.observe(document.documentElement, { childList: true, subtree: true });
  installWhenReady();
})();
