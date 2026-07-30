(function () {
  "use strict";

  var route = decodeURIComponent(window.location.pathname).toLowerCase().replace(/\/+$/, "");
  if (route !== "/galerias/maternidad-playa" && route !== "/maternidad-playa") return;

  function ready(callback) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", callback, { once: true });
    else callback();
  }

  ready(function () {
    var gallery = window.BYSTIVEN_MATERNIDAD || {};
    var media = Array.isArray(gallery.photos) ? gallery.photos : [];
    var app = document.getElementById("clientGallery");
    if (!app || !media.length) return;

    var style = document.createElement("style");
    style.id = "maternity-media-pro-styles";
    style.textContent = `
      .cgPhoto.isVideo:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 48%,rgba(0,0,0,.34));pointer-events:none}
      .cgVideoBadge{position:absolute;z-index:3;left:10px;bottom:10px;display:inline-flex;align-items:center;gap:7px;padding:8px 10px;border:1px solid rgba(255,255,255,.24);border-radius:999px;background:rgba(0,0,0,.54);color:#fff;font-size:10px;font-weight:900;letter-spacing:.08em;text-transform:uppercase;backdrop-filter:blur(10px);pointer-events:none}
      .cgVideoBadge:before{content:"";width:0;height:0;border-top:5px solid transparent;border-bottom:5px solid transparent;border-left:8px solid #fff}
      .mvViewer{position:fixed;z-index:260;inset:0;display:flex;flex-direction:column;background:#050505;color:#fff}
      .mvViewer[hidden]{display:none}
      .mvTop{height:max(64px,calc(48px + env(safe-area-inset-top)));padding:max(10px,env(safe-area-inset-top)) 12px 8px;display:flex;align-items:center;justify-content:space-between;gap:12px}
      .mvButton{height:42px;padding:0 15px;border:1px solid rgba(255,255,255,.14);border-radius:999px;background:rgba(255,255,255,.09);color:#fff;display:inline-flex;align-items:center;justify-content:center;gap:7px;font-weight:850;cursor:pointer;text-decoration:none}
      .mvCount{font-size:12px;font-weight:800;color:rgba(255,255,255,.7)}
      .mvStage{position:relative;flex:1;min-height:0;display:grid;place-items:center;background:#050505;padding:0 0 8px}
      .mvStage video{display:block;width:100%;height:100%;max-width:100%;max-height:100%;object-fit:contain;background:#050505}
      .mvInfo{padding:9px 16px 5px;color:rgba(255,255,255,.7);font-size:12px;text-align:center}
      .mvFooter{display:grid;grid-template-columns:1fr;gap:8px;padding:8px 12px max(12px,env(safe-area-inset-bottom))}
      .mvDownload{height:50px;border:0;border-radius:16px;background:#fff;color:#171512;display:flex;align-items:center;justify-content:center;font-weight:900;text-decoration:none;cursor:pointer}
      @media(min-width:760px){.mvStage{padding:12px 5vw}.mvStage video{border-radius:18px;overflow:hidden}.mvFooter{max-width:520px;width:100%;margin:0 auto 12px}.mvInfo{font-size:13px}}
    `;
    document.head.appendChild(style);

    media.forEach(function (item, index) {
      if (item.type !== "video") return;
      var card = app.querySelector('[data-photo="' + index + '"]');
      if (!card) return;
      card.classList.add("isVideo");
      var badge = document.createElement("span");
      badge.className = "cgVideoBadge";
      badge.textContent = item.duration ? formatDuration(item.duration) : "Video";
      card.appendChild(badge);
    });

    var viewer = document.createElement("div");
    viewer.id = "mvViewer";
    viewer.className = "mvViewer";
    viewer.hidden = true;
    viewer.setAttribute("role", "dialog");
    viewer.setAttribute("aria-modal", "true");
    viewer.setAttribute("aria-label", "Reproductor de video");
    viewer.innerHTML = '<div class="mvTop"><button class="mvButton" id="mvClose" type="button">Cerrar</button><span class="mvCount" id="mvCount"></span><button class="mvButton" id="mvShare" type="button">Compartir</button></div><div class="mvStage"><video id="mvVideo" controls playsinline preload="metadata"></video></div><div class="mvInfo" id="mvInfo">El video se reproduce en la calidad original subida.</div><div class="mvFooter"><a class="mvDownload" id="mvDownload" href="#">Descargar video original</a></div>';
    document.body.appendChild(viewer);

    var video = document.getElementById("mvVideo");
    var count = document.getElementById("mvCount");
    var download = document.getElementById("mvDownload");
    var activeIndex = -1;
    var savedScroll = 0;

    function lockPage() {
      savedScroll = window.scrollY || document.documentElement.scrollTop || 0;
      document.body.style.position = "fixed";
      document.body.style.top = "-" + savedScroll + "px";
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
    }

    function unlockPage() {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      window.scrollTo(0, savedScroll);
    }

    function openVideo(index) {
      var item = media[index];
      if (!item || item.type !== "video") return;
      activeIndex = index;
      count.textContent = String(index + 1).padStart(2, "0") + " / " + String(media.length).padStart(2, "0");
      video.poster = item.preview || "";
      video.src = item.original || "";
      video.setAttribute("aria-label", item.alt || item.name || "Video de maternidad");
      download.href = item.downloadUrl || item.original || "#";
      download.setAttribute("download", item.name || "MATERNIDAD-VIDEO.mp4");
      viewer.hidden = false;
      lockPage();
      video.load();
      document.getElementById("mvClose").focus({ preventScroll: true });
    }

    function closeVideo() {
      if (viewer.hidden) return;
      video.pause();
      video.removeAttribute("src");
      video.removeAttribute("poster");
      video.load();
      viewer.hidden = true;
      activeIndex = -1;
      unlockPage();
    }

    async function shareVideo() {
      var item = media[activeIndex];
      try {
        if (navigator.share) {
          await navigator.share({ title: gallery.title || "Galería de maternidad", text: item && item.name ? item.name : "Video de la galería", url: window.location.href });
        } else if (navigator.clipboard) {
          await navigator.clipboard.writeText(window.location.href);
        }
      } catch (error) {
        if (!error || error.name !== "AbortError") console.warn("No se pudo compartir", error);
      }
    }

    app.addEventListener("click", function (event) {
      var card = event.target.closest && event.target.closest("[data-photo]");
      if (!card) return;
      var index = Number(card.getAttribute("data-photo"));
      if (!media[index] || media[index].type !== "video") return;
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      openVideo(index);
    }, true);

    document.getElementById("mvClose").addEventListener("click", closeVideo);
    document.getElementById("mvShare").addEventListener("click", shareVideo);
    viewer.addEventListener("click", function (event) { if (event.target === viewer) closeVideo(); });
    document.addEventListener("keydown", function (event) { if (event.key === "Escape" && !viewer.hidden) closeVideo(); });

    function formatDuration(seconds) {
      var value = Math.max(0, Math.round(Number(seconds) || 0));
      var minutes = Math.floor(value / 60);
      var remaining = String(value % 60).padStart(2, "0");
      return minutes + ":" + remaining;
    }
  });
})();
