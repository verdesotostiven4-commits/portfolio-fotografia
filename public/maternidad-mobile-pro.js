(function () {
  "use strict";

  var path = decodeURIComponent(window.location.pathname).toLowerCase().replace(/\/+$/, "");
  if (path !== "/galerias/maternidad-playa" && path !== "/maternidad-playa") return;

  function ready(callback) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", callback, { once: true });
    else callback();
  }

  ready(function () {
    var app = document.getElementById("maternityDelivery");
    if (!app) return;

    var viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) viewport.setAttribute("content", "width=device-width, initial-scale=1, viewport-fit=cover");

    var style = document.createElement("style");
    style.id = "maternity-mobile-pro-styles";
    style.textContent = `
      body{overscroll-behavior-y:none}
      .mdTop{padding-top:max(17px,env(safe-area-inset-top))}
      .mdPhotoButton{-webkit-tap-highlight-color:transparent}
      .mdPhoto img{background:#17130f}
      .mdMobileBar{display:none;position:fixed;z-index:170;left:12px;right:12px;bottom:max(12px,env(safe-area-inset-bottom));grid-template-columns:1fr 1fr;gap:8px;padding:8px;border:1px solid rgba(255,255,255,.13);border-radius:22px;background:rgba(13,11,9,.91);backdrop-filter:blur(18px);box-shadow:0 20px 60px rgba(0,0,0,.45)}
      .mdMobileBar button,.mdMobileBar a{min-height:49px;border-radius:16px;display:flex;align-items:center;justify-content:center;text-decoration:none;font-weight:950}
      .mdMobileBar button{border:0;background:linear-gradient(135deg,#d9a43c,#fff0ad);color:#211402}
      .mdMobileBar a{border:1px solid rgba(255,255,255,.13);background:rgba(255,255,255,.07);color:#fff}
      .mdMaintenance{position:fixed;z-index:280;inset:0;display:grid;place-items:center;padding:18px;background:rgba(0,0,0,.82);backdrop-filter:blur(10px)}
      .mdMaintenance[hidden]{display:none}
      .mdMaintenanceCard{width:min(440px,100%);padding:30px 24px;border:1px solid rgba(255,255,255,.13);border-radius:30px;background:linear-gradient(150deg,#1a1612,#0f0d0b);text-align:center;box-shadow:0 35px 100px rgba(0,0,0,.6)}
      .mdMaintenanceMark{width:56px;height:56px;margin:0 auto 15px;border-radius:18px;display:grid;place-items:center;background:linear-gradient(135deg,#d9a43c,#fff0ad);color:#201301;font-size:25px;font-weight:950}
      .mdMaintenanceCard h3{margin:0;font-size:clamp(30px,9vw,42px);letter-spacing:-.045em;line-height:1}
      .mdMaintenanceCard p{margin:17px 0 0;color:rgba(255,255,255,.68);line-height:1.65}
      .mdMaintenanceActions{display:grid;gap:9px;margin-top:24px}
      .mdMaintenanceActions button,.mdMaintenanceActions a{min-height:50px;border-radius:999px;display:flex;align-items:center;justify-content:center;text-decoration:none;font-weight:950}
      .mdMaintenanceActions button{border:0;background:linear-gradient(135deg,#d9a43c,#fff0ad);color:#201301}
      .mdMaintenanceActions a{border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.07);color:#fff}
      .mdSwipeHint{display:none;position:fixed;z-index:220;left:50%;bottom:max(22px,env(safe-area-inset-bottom));transform:translateX(-50%);padding:9px 13px;border-radius:999px;background:rgba(0,0,0,.62);color:rgba(255,255,255,.76);font-size:12px;font-weight:850;pointer-events:none}
      .mdPhotoCountBadge{position:absolute;z-index:3;top:max(18px,env(safe-area-inset-top));left:18px;padding:9px 13px;border:1px solid rgba(255,255,255,.14);border-radius:999px;background:rgba(0,0,0,.55);font-size:12px;font-weight:900;backdrop-filter:blur(10px)}
      @media(max-width:620px){
        .mdMobileBar{display:grid}
        .mdFooter{padding-bottom:112px}
        .mdHero{min-height:92svh}
        .mdHeroContent{padding-bottom:54px}
        .mdHero h1{max-width:10ch}
        .mdTopActions .mdPortfolio{display:inline-flex;font-size:0;width:45px;height:45px;padding:0;align-items:center;justify-content:center}
        .mdTopActions .mdPortfolio:after{content:'+';font-size:24px;line-height:1}
        .mdGrid{columns:1!important}
        .mdPhoto{border-radius:20px;margin-bottom:13px}
        .mdPhoto img{min-height:0}
        .mdDownload{min-height:46px}
        .mdViewer{padding:0}
        .mdViewerInner{height:100svh!important;width:100%!important}
        .mdViewerMedia{border-radius:0!important;padding:58px 0 76px;touch-action:pan-y}
        .mdViewerMedia img{max-height:calc(100svh - 134px)}
        .mdClose{top:max(13px,env(safe-area-inset-top));right:13px}
        .mdSwipeHint{display:block}
        .mdToast{bottom:94px}
      }
    `;
    document.head.appendChild(style);

    var bar = document.createElement("div");
    bar.className = "mdMobileBar";
    bar.innerHTML = '<button type="button" id="mdMobileSharePro">Compartir</button><a href="#fotografias">Ver fotos</a>';
    document.body.appendChild(bar);

    var modal = document.createElement("div");
    modal.className = "mdMaintenance";
    modal.id = "mdMaintenance";
    modal.hidden = true;
    modal.innerHTML = '<div class="mdMaintenanceCard"><div class="mdMaintenanceMark">by</div><h3>Portafolio en mantenimiento</h3><p>Estamos preparando nuevas fotografías y una experiencia renovada. Muy pronto estará disponible.</p><div class="mdMaintenanceActions"><button type="button" id="mdMaintenanceClose">Volver a la galería</button><a href="https://www.instagram.com/bystiven/" target="_blank" rel="noreferrer">Ver Instagram</a></div></div>';
    document.body.appendChild(modal);

    var viewer = document.getElementById("mdViewer");
    var viewerMedia = viewer && viewer.querySelector(".mdViewerMedia");
    var viewerCode = document.getElementById("mdViewerCode");
    if (viewer) {
      var badge = document.createElement("div");
      badge.className = "mdPhotoCountBadge";
      badge.id = "mdPhotoCountBadge";
      viewer.appendChild(badge);
      var hint = document.createElement("div");
      hint.className = "mdSwipeHint";
      hint.textContent = "Desliza para cambiar de foto";
      viewer.appendChild(hint);
    }

    function updateBadge() {
      var badge = document.getElementById("mdPhotoCountBadge");
      if (badge && viewerCode) badge.textContent = viewerCode.textContent || "Fotografía";
    }

    function openMaintenance(event) {
      if (event) event.preventDefault();
      modal.hidden = false;
      document.body.style.overflow = "hidden";
    }

    function closeMaintenance() {
      modal.hidden = true;
      if (!viewer || viewer.hidden) document.body.style.overflow = "";
    }

    app.addEventListener("click", function (event) {
      var link = event.target.closest && event.target.closest('a[href="/"]');
      if (link) openMaintenance(event);
      window.setTimeout(updateBadge, 0);
    });

    document.getElementById("mdMaintenanceClose").addEventListener("click", closeMaintenance);
    modal.addEventListener("click", function (event) { if (event.target === modal) closeMaintenance(); });

    async function shareGallery() {
      try {
        if (navigator.share) await navigator.share({ title: document.title, text: "Galería privada de maternidad · byStiven", url: window.location.href });
        else {
          await navigator.clipboard.writeText(window.location.href);
          var toast = document.getElementById("mdToast");
          if (toast) { toast.textContent = "Enlace copiado"; toast.classList.add("show"); window.setTimeout(function () { toast.classList.remove("show"); }, 1800); }
        }
      } catch (error) {
        if (error && error.name !== "AbortError") console.warn("No se pudo compartir la galería", error);
      }
    }

    document.getElementById("mdMobileSharePro").addEventListener("click", shareGallery);

    var startX = 0;
    if (viewerMedia) {
      viewerMedia.addEventListener("touchstart", function (event) { startX = event.changedTouches[0].clientX; }, { passive: true });
      viewerMedia.addEventListener("touchend", function (event) {
        var delta = event.changedTouches[0].clientX - startX;
        if (Math.abs(delta) < 55) return;
        var button = document.getElementById(delta < 0 ? "mdNext" : "mdPrev");
        if (button) button.click();
        window.setTimeout(updateBadge, 0);
      }, { passive: true });
    }

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !modal.hidden) closeMaintenance();
    });

    var observer = viewer ? new MutationObserver(updateBadge) : null;
    if (observer && viewerCode) observer.observe(viewerCode, { childList: true, characterData: true, subtree: true });
  });
})();