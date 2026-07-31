let audioUnlocked = false;
let installed = false;

function inlineVideos(): HTMLVideoElement[] {
  return Array.from(document.querySelectorAll<HTMLVideoElement>("[data-inline-video]"));
}

function removeManualSoundButtons(): void {
  document.querySelectorAll<HTMLElement>("[data-sound]").forEach((button) => button.remove());
  document.querySelectorAll<HTMLElement>(".gVideoCaption").forEach((caption) => {
    caption.style.justifyContent = "flex-start";
  });
}

async function playWithPreferredAudio(video: HTMLVideoElement): Promise<void> {
  if (!video.getAttribute("src")) return;

  if (audioUnlocked) {
    video.defaultMuted = false;
    video.muted = false;
    video.volume = 1;

    try {
      await video.play();
      return;
    } catch {
      // Browser or user settings can still reject audible autoplay.
    }
  }

  video.defaultMuted = true;
  video.muted = true;
  try {
    await video.play();
  } catch {
    // Keep the poster visible when playback is blocked entirely.
  }
}

function unlockAudio(): void {
  if (audioUnlocked) return;
  audioUnlocked = true;

  inlineVideos().forEach((video) => {
    video.defaultMuted = false;
    video.muted = false;
    video.removeAttribute("muted");
    video.volume = 1;

    const rect = video.getBoundingClientRect();
    const visible = rect.bottom > 0 && rect.top < window.innerHeight;
    if (visible && video.getAttribute("src")) void playWithPreferredAudio(video);
  });
}

function installVisibilityPlayback(): void {
  const visibilityObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target as HTMLVideoElement;
        if (entry.isIntersecting && entry.intersectionRatio >= 0.45) {
          void playWithPreferredAudio(video);
        }
      });
    },
    { threshold: [0, 0.45, 0.75] },
  );

  inlineVideos().forEach((video) => visibilityObserver.observe(video));
}

function installWhenReady(): void {
  if (installed || !document.getElementById("galleryApp")) return;

  installed = true;
  removeManualSoundButtons();
  installVisibilityPlayback();

  document.addEventListener("pointerdown", unlockAudio, { capture: true, once: true });
  document.addEventListener("touchstart", unlockAudio, { capture: true, passive: true, once: true });
  document.addEventListener("keydown", unlockAudio, { capture: true, once: true });
}

const galleryObserver = new MutationObserver(() => {
  installWhenReady();
  if (installed) galleryObserver.disconnect();
});

galleryObserver.observe(document.documentElement, { childList: true, subtree: true });
installWhenReady();
