(function () {
  "use strict";

  var route = decodeURIComponent(window.location.pathname).toLowerCase().replace(/\/+$/, "");
  if (route !== "/galerias/maternidad-playa" && route !== "/maternidad-playa") return;

  var fallback = {
    title: "Maternidad en la playa",
    subtitle: "Una historia de amor que está por comenzar.",
    location: "Galápagos",
    year: "2026",
    photographer: "Stiven Verdesoto",
    brand: "byStiven",
    instagram: "https://www.instagram.com/bystiven/",
    zipUrl: "",
    photos: []
  };

  var gallery = Object.assign({}, fallback, window.BYSTIVEN_MATERNIDAD || {});
  gallery.photos = Array.isArray(gallery.photos)
    ? gallery.photos.map(normalizePhoto).filter(function (photo) { return Boolean(photo.preview); })
    : [];

  function normalizePhoto(photo, index) {
    photo = photo || {};
    var preview = photo.preview || photo.src || photo.original || photo.download || "";
    var original = photo.original || photo.download || photo.src || photo.preview || "";
    return {
      preview: preview,
      original: original,
      name: professionalName(photo.name, index),
      alt: photo.alt || gallery.title || fallback.title,
      width: positiveNumber(photo.width),
      height: positiveNumber(photo.height),
      position: photo.position || "50% 50%"
    };
  }

  function positiveNumber(value) {
    var number = Number(value);
    return Number.isFinite(number) && number > 0 ? number : 0;
  }

  function professionalName(value, index) {
    var fallbackName = "MATERNIDAD-" + String(index + 1).padStart(3, "0") + ".jpg";
    if (!value) return fallbackName;
    var clean = String(value).trim().replace(/[^a-zA-Z0-9._-]+/g, "-");
    if (!clean || clean === "." || clean === "-") return fallbackName;
    if (!/\.[a-z0-9]{2,5}$/i.test(clean)) clean += ".jpg";
    return clean;
  }

  function start() {
    document.title = gallery.title + " · " + gallery.brand;
    document.documentElement.classList.add("client-gallery-page");

    var viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) viewport.content = "width=device-width,initial-scale=1,viewport-fit=cover";

    var theme = document.querySelector('meta[name="theme-color"]');
    if (theme) theme.content = "#f5f2ed";

    var robots = document.querySelector('meta[name="robots"]') || document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex, nofollow, noarchive";
    if (!robots.parentNode) document.head.appendChild(robots);

    var root = document.getElementById("root");
    if (root) root.hidden = true;

    var oldApp = document.getElementById("clientGallery");
    if (oldApp) oldApp.remove();

    installStyles();
    preloadImportantImages();
    renderApp();
  }

  function installStyles() {
    var previous = document.getElementById("client-gallery-styles");
    if (previous) previous.remove();

    var style = document.createElement("style");
    style.id = "client-gallery-styles";
    style.textContent = `
      :root{--cg-bg:#f5f2ed;--cg-surface:#fff;--cg-text:#181613;--cg-muted:#746e66;--cg-line:rgba(24,22,19,.11);--cg-dark:#171512;--cg-accent:#a87747;--cg-shadow:0 20px 60px rgba(38,30,22,.12);--cg-safe-top:max(12px,env(safe-area-inset-top));--cg-safe-bottom:max(12px,env(safe-area-inset-bottom))}
      html.client-gallery-page,html.client-gallery-page body{width:100%!important;min-height:100%!important;margin:0!important;padding:0!important;background:var(--cg-bg)!important;color:var(--cg-text)!important;overflow-x:hidden!important;overflow-y:auto!important;overscroll-behavior-y:auto!important;scroll-behavior:smooth!important;touch-action:pan-y!important;font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif!important;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
      html.client-gallery-page body.cgLocked{overflow:hidden!important;touch-action:none!important}
      #clientGallery,#clientGallery *{box-sizing:border-box}#clientGallery{position:relative;isolation:isolate;min-height:100svh;background:var(--cg-bg);padding-bottom:94px}
      #clientGallery button,#clientGallery a{-webkit-tap-highlight-color:transparent}#clientGallery button:focus-visible,#clientGallery a:focus-visible{outline:3px solid rgba(168,119,71,.38);outline-offset:3px}
      .cgHeader{position:fixed;z-index:70;top:0;left:0;right:0;display:flex;align-items:center;justify-content:space-between;padding:var(--cg-safe-top) 14px 10px;transition:background .25s,border-color .25s,color .25s,box-shadow .25s;color:#fff;border-bottom:1px solid transparent}.cgHeader.isScrolled{background:rgba(245,242,237,.88);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-color:var(--cg-line);color:var(--cg-text);box-shadow:0 8px 28px rgba(36,28,20,.05)}
      .cgBrand{border:0;background:transparent;color:inherit;padding:6px 4px;font-size:23px;font-weight:950;letter-spacing:-.065em;cursor:pointer}.cgBrand span{color:#d0a16d}.cgHeader.isScrolled .cgBrand span{color:var(--cg-accent)}
      .cgHeaderActions{display:flex;gap:8px}.cgIconButton{width:44px;height:44px;border-radius:50%;border:1px solid rgba(255,255,255,.24);background:rgba(0,0,0,.16);color:#fff;display:grid;place-items:center;cursor:pointer;backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);font-size:0}.cgIconButton svg{width:19px;height:19px;stroke:currentColor;fill:none;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}.cgHeader.isScrolled .cgIconButton{border-color:var(--cg-line);background:#fff;color:var(--cg-text);box-shadow:0 7px 22px rgba(0,0,0,.05)}
      .cgHero{padding:8px 8px 0}.cgCover{position:relative;min-height:calc(100svh - 16px);border-radius:28px;overflow:hidden;background:linear-gradient(155deg,#cbb8a4 0%,#8d745d 48%,#3d3128 100%);box-shadow:var(--cg-shadow)}
      .cgCoverImage{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center;transform:scale(1.002)}.cgCoverEmpty{position:absolute;inset:0;background:radial-gradient(circle at 74% 18%,rgba(255,255,255,.28),transparent 26%),radial-gradient(circle at 12% 75%,rgba(255,226,196,.16),transparent 28%),linear-gradient(145deg,#d8c9bb,#89715d 62%,#44362b)}.cgCoverEmpty:after{content:"";position:absolute;inset:18% 13%;border:1px solid rgba(255,255,255,.15);border-radius:50% 45% 52% 44%;transform:rotate(-8deg)}.cgCoverShade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.25) 0%,rgba(0,0,0,.03) 32%,rgba(0,0,0,.12) 54%,rgba(0,0,0,.82) 100%)}
      .cgHeroContent{position:absolute;z-index:2;left:22px;right:22px;bottom:28px;color:#fff}.cgPrivacy{display:inline-flex;align-items:center;gap:7px;margin-bottom:16px;padding:8px 11px;border:1px solid rgba(255,255,255,.24);border-radius:999px;background:rgba(0,0,0,.18);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase}.cgPrivacy:before{content:"";width:6px;height:6px;border-radius:50%;background:#e7bd89;box-shadow:0 0 0 4px rgba(231,189,137,.14)}
      .cgHero h1{max-width:11ch;margin:0;font-family:Georgia,"Times New Roman",serif;font-size:clamp(43px,13.2vw,72px);font-weight:400;line-height:.92;letter-spacing:-.052em;text-wrap:balance}.cgHeroSubtitle{max-width:33ch;margin:15px 0 0;color:rgba(255,255,255,.82);font-size:15px;line-height:1.58}.cgHeroMeta{display:flex;align-items:center;gap:9px;margin-top:22px;color:rgba(255,255,255,.75);font-size:12px;font-weight:700}.cgHeroMeta i{width:3px;height:3px;border-radius:50%;background:currentColor}
      .cgHeroAction{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-top:24px;padding-top:18px;border-top:1px solid rgba(255,255,255,.18);color:#fff;text-decoration:none}.cgHeroAction strong{font-size:14px}.cgHeroAction span span{display:block;margin-top:3px;color:rgba(255,255,255,.62);font-size:11px}.cgHeroActionIcon{flex:0 0 auto;width:46px;height:46px;border-radius:50%;background:#fff;color:#171512;display:grid;place-items:center}.cgHeroActionIcon svg{width:19px;height:19px;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}
      .cgIntro{display:grid;gap:28px;padding:62px 22px 46px}.cgEyebrow{margin:0 0 11px;color:var(--cg-accent);font-size:11px;font-weight:900;letter-spacing:.18em;text-transform:uppercase}.cgIntro h2{max-width:12ch;margin:0;font-family:Georgia,"Times New Roman",serif;font-size:clamp(36px,10vw,54px);font-weight:400;line-height:.98;letter-spacing:-.045em}.cgIntroText{margin:0;color:var(--cg-muted);font-size:15px;line-height:1.75}.cgFacts{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-top:24px}.cgFact{min-width:0;padding:15px 12px;border:1px solid var(--cg-line);border-radius:18px;background:rgba(255,255,255,.68)}.cgFact strong{display:block;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.cgFact span{display:block;margin-top:5px;color:var(--cg-muted);font-size:10px;line-height:1.3}
      .cgGallerySection{scroll-margin-top:68px}.cgToolbar{position:sticky;z-index:50;top:66px;display:flex;align-items:center;justify-content:space-between;gap:14px;padding:12px 14px;background:rgba(245,242,237,.91);border-top:1px solid transparent;border-bottom:1px solid var(--cg-line);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px)}.cgToolbarTitle strong{display:block;font-size:14px}.cgToolbarTitle span{display:block;margin-top:3px;color:var(--cg-muted);font-size:11px}.cgToolbarButton{min-height:40px;padding:0 14px;border:1px solid var(--cg-line);border-radius:999px;background:#fff;color:var(--cg-text);font-size:11px;font-weight:850;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;white-space:nowrap;cursor:pointer}
      .cgGallery{padding:10px 8px 32px}.cgGrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));grid-auto-flow:dense;gap:6px}.cgPhoto{position:relative;min-width:0;aspect-ratio:4/5;border:0;border-radius:7px;overflow:hidden;padding:0;background:#ddd4ca;cursor:zoom-in;content-visibility:auto;contain-intrinsic-size:280px 350px}.cgPhoto.isWide{grid-column:1/-1;aspect-ratio:4/3}.cgPhoto.isPortrait{aspect-ratio:4/5}.cgPhoto.isLandscape{aspect-ratio:4/3}.cgPhoto img{width:100%;height:100%;display:block;object-fit:cover;opacity:0;transform:scale(1.018);transition:opacity .32s ease,transform .5s ease}.cgPhoto.isLoaded img{opacity:1;transform:scale(1)}.cgPhoto:active img{transform:scale(.985)}.cgPhotoNumber{position:absolute;right:8px;bottom:8px;min-width:28px;padding:5px 7px;border:1px solid rgba(255,255,255,.17);border-radius:999px;background:rgba(0,0,0,.42);color:#fff;font-size:9px;font-weight:850;letter-spacing:.06em;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}
      .cgEmpty{margin:2px 0 26px;padding:0 8px}.cgEmptyCard{position:relative;overflow:hidden;padding:46px 24px 40px;border:1px solid var(--cg-line);border-radius:28px;background:#fff;text-align:center;box-shadow:0 18px 55px rgba(36,29,22,.07)}.cgEmptyCard:before{content:"";position:absolute;width:190px;height:190px;top:-115px;right:-80px;border-radius:50%;background:rgba(168,119,71,.09)}.cgEmptyMark{width:58px;height:58px;margin:0 auto;border-radius:19px;background:var(--cg-dark);color:#fff;display:grid;place-items:center;font-family:Georgia,serif;font-size:23px}.cgEmpty h3{margin:19px 0 9px;font-family:Georgia,"Times New Roman",serif;font-size:30px;font-weight:400;letter-spacing:-.03em}.cgEmpty p{max-width:34ch;margin:0 auto;color:var(--cg-muted);font-size:14px;line-height:1.65}.cgEmptyStatus{display:inline-flex;align-items:center;gap:7px;margin-top:20px;padding:9px 12px;border-radius:999px;background:#f1ece6;color:#665b50;font-size:11px;font-weight:800}.cgEmptyStatus:before{content:"";width:7px;height:7px;border-radius:50%;background:#be8c58}
      .cgClosing{padding:62px 24px 36px;text-align:center}.cgClosingMark{font-size:26px;font-weight:950;letter-spacing:-.065em}.cgClosingMark span{color:var(--cg-accent)}.cgClosing p{max-width:35ch;margin:10px auto 0;color:var(--cg-muted);font-size:12px;line-height:1.65}
      .cgBottomBar{position:fixed;z-index:80;left:12px;right:12px;bottom:var(--cg-safe-bottom);display:grid;grid-template-columns:1fr 1.25fr;gap:8px;padding:7px;border:1px solid rgba(255,255,255,.08);border-radius:22px;background:rgba(23,21,18,.93);box-shadow:0 20px 60px rgba(0,0,0,.28);backdrop-filter:blur(22px);-webkit-backdrop-filter:blur(22px)}.cgBottomBar button,.cgBottomBar a{height:49px;border:0;border-radius:16px;display:flex;align-items:center;justify-content:center;gap:8px;text-decoration:none;font-size:12px;font-weight:850;cursor:pointer}.cgBottomSecondary{background:rgba(255,255,255,.09);color:#fff}.cgBottomPrimary{background:#fff;color:#171512}.cgBottomBar svg{width:17px;height:17px;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}.cgBottomPrimary[aria-disabled="true"]{opacity:.55;pointer-events:none}
      .cgViewer{position:fixed;z-index:180;inset:0;display:flex;flex-direction:column;background:#050505;color:#fff}.cgViewer[hidden]{display:none}.cgViewerHeader{flex:0 0 auto;min-height:calc(58px + env(safe-area-inset-top));padding:var(--cg-safe-top) 11px 8px;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:8px}.cgViewerHeader>div:last-child{display:flex;justify-content:flex-end}.cgViewerButton{height:42px;min-width:42px;padding:0 14px;border:1px solid rgba(255,255,255,.12);border-radius:999px;background:rgba(255,255,255,.08);color:#fff;display:inline-flex;align-items:center;justify-content:center;gap:7px;font-size:11px;font-weight:850;cursor:pointer}.cgViewerButton svg{width:17px;height:17px;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}.cgViewerCount{font-size:11px;font-weight:800;color:rgba(255,255,255,.65);letter-spacing:.04em}.cgViewerMedia{position:relative;flex:1;min-height:0;display:grid;place-items:center;overflow:hidden;touch-action:pan-y;background:#050505}.cgViewerMedia img{display:block;max-width:100%;max-height:100%;width:auto;height:auto;object-fit:contain;opacity:0;transition:opacity .18s;user-select:none;-webkit-user-drag:none}.cgViewerMedia img.isReady{opacity:1}.cgViewerLoader{position:absolute;width:28px;height:28px;border:2px solid rgba(255,255,255,.18);border-top-color:#fff;border-radius:50%;animation:cgSpin .75s linear infinite}.cgViewerLoader[hidden]{display:none}@keyframes cgSpin{to{transform:rotate(360deg)}}
      .cgViewerFooter{flex:0 0 auto;display:grid;grid-template-columns:52px 1fr 52px;gap:8px;padding:9px 11px var(--cg-safe-bottom)}.cgViewerFooter button{height:50px;border:0;border-radius:16px;display:flex;align-items:center;justify-content:center;text-decoration:none;font-size:12px;font-weight:850;cursor:pointer}.cgViewerNav{background:rgba(255,255,255,.09);color:#fff}.cgViewerDownload{background:#fff;color:#171512}.cgViewerFooter svg{width:19px;height:19px;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}
      .cgSheet{position:fixed;z-index:220;inset:0;display:grid;place-items:end center;padding:14px;background:rgba(0,0,0,.5);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}.cgSheet[hidden]{display:none}.cgSheetCard{width:100%;max-width:460px;padding:12px 20px calc(20px + env(safe-area-inset-bottom));border-radius:30px;background:#fff;box-shadow:0 32px 100px rgba(0,0,0,.34)}.cgSheetHandle{width:42px;height:4px;margin:0 auto 22px;border-radius:999px;background:#d8d2cb}.cgSheetMark{width:52px;height:52px;border-radius:17px;background:var(--cg-dark);color:#fff;display:grid;place-items:center;font-family:Georgia,serif;font-size:21px}.cgSheet h3{margin:19px 0 9px;font-family:Georgia,"Times New Roman",serif;font-size:31px;font-weight:400;line-height:1.02;letter-spacing:-.035em}.cgSheet p{margin:0;color:var(--cg-muted);font-size:14px;line-height:1.7}.cgSheetActions{display:grid;gap:8px;margin-top:22px}.cgSheetActions button,.cgSheetActions a{min-height:50px;border:0;border-radius:16px;display:flex;align-items:center;justify-content:center;text-decoration:none;font-size:13px;font-weight:850;cursor:pointer}.cgSheetPrimary{background:var(--cg-dark);color:#fff}.cgSheetSecondary{background:#eee9e3;color:var(--cg-text)}
      .cgToast{position:fixed;z-index:260;left:50%;bottom:100px;max-width:calc(100vw - 28px);transform:translate(-50%,18px);opacity:0;padding:11px 16px;border-radius:999px;background:#171512;color:#fff;font-size:11px;font-weight:850;text-align:center;box-shadow:0 15px 45px rgba(0,0,0,.25);transition:opacity .2s,transform .2s;pointer-events:none}.cgToast.show{opacity:1;transform:translate(-50%,0)}
      @media(min-width:760px){#clientGallery{padding-bottom:36px}.cgHeader{padding-left:clamp(28px,5vw,76px);padding-right:clamp(28px,5vw,76px)}.cgHero{padding:12px 12px 0}.cgCover{min-height:calc(100vh - 24px)}.cgHeroContent{left:clamp(36px,7vw,100px);right:clamp(36px,7vw,100px);bottom:64px}.cgHero h1{font-size:clamp(62px,8vw,110px)}.cgHeroSubtitle{font-size:18px}.cgHeroAction{max-width:520px}.cgIntro{grid-template-columns:minmax(0,1.1fr) minmax(300px,.9fr);align-items:end;gap:70px;padding:100px clamp(40px,8vw,130px) 72px}.cgToolbar{top:68px;padding-left:clamp(28px,5vw,76px);padding-right:clamp(28px,5vw,76px)}.cgGallery{padding:16px clamp(18px,4vw,60px) 60px}.cgGrid{grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.cgPhoto.isWide{grid-column:span 2}.cgPhoto:nth-child(11n+1){grid-column:span 2;grid-row:span 2;aspect-ratio:auto}.cgBottomBar{display:none}.cgClosing{padding-bottom:70px}.cgSheet{place-items:center}.cgSheetCard{padding-bottom:24px}.cgViewerFooter{grid-template-columns:64px minmax(220px,360px) 64px;justify-content:center}}
      @media(prefers-reduced-motion:reduce){html.client-gallery-page,html.client-gallery-page body{scroll-behavior:auto!important}.cgPhoto img,.cgViewerMedia img,.cgHeader,.cgToast{transition:none!important}.cgViewerLoader{animation-duration:1.4s}}
    `;
    document.head.appendChild(style);
  }

  function preloadImportantImages() {
    var urls = [];
    gallery.photos.slice(0, 4).forEach(function (photo) {
      if (photo.preview && urls.indexOf(photo.preview) === -1) urls.push(photo.preview);
    });
    urls.forEach(function (url, index) {
      var link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = url;
      if (index === 0) link.setAttribute("fetchpriority", "high");
      document.head.appendChild(link);
    });
  }

  function renderApp() {
    var photos = gallery.photos;
    var cover = photos.length ? photos[0] : null;
    var app = document.createElement("main");
    app.id = "clientGallery";

    var coverMarkup = cover && cover.preview
      ? '<img class="cgCoverImage" src="' + attr(cover.preview) + '" alt="Portada de ' + attr(gallery.title) + '" fetchpriority="high" decoding="async" style="object-position:' + attr(cover.position) + '">'
      : '<div class="cgCoverEmpty" aria-hidden="true"></div>';

    var primaryBottom = photos.length
      ? '<a class="cgBottomPrimary" href="#fotografias">' + icon("grid") + '<span>Ver fotografías</span></a>'
      : '<a class="cgBottomPrimary" aria-disabled="true" href="#">' + icon("clock") + '<span>Preparando galería</span></a>';

    var toolbarAction = gallery.zipUrl
      ? '<a class="cgToolbarButton" href="' + attr(gallery.zipUrl) + '" download>Descargar todas</a>'
      : '<button class="cgToolbarButton" id="cgDownloadHelp" type="button">Cómo descargar</button>';

    app.innerHTML = `
      <header class="cgHeader" id="cgHeader">
        <button class="cgBrand" type="button" data-maintenance aria-label="Información del portafolio"><span>by</span>Stiven</button>
        <div class="cgHeaderActions"><button class="cgIconButton" id="cgShareTop" type="button" aria-label="Compartir galería">${icon("share")}</button><button class="cgIconButton" type="button" data-maintenance aria-label="Más información">${icon("more")}</button></div>
      </header>
      <section class="cgHero" aria-labelledby="cgTitle"><div class="cgCover">${coverMarkup}<div class="cgCoverShade" aria-hidden="true"></div><div class="cgHeroContent"><div class="cgPrivacy">Entrega privada</div><h1 id="cgTitle">${html(gallery.title)}</h1><p class="cgHeroSubtitle">${html(gallery.subtitle)}</p><div class="cgHeroMeta"><span>${html(gallery.location)}</span><i></i><span>${html(gallery.year)}</span><i></i><span>${photos.length} fotos</span></div><a class="cgHeroAction" href="#fotografias"><span><strong>${photos.length ? "Abrir la galería" : "Galería en preparación"}</strong><span>${photos.length ? "Toca para ver todos sus recuerdos" : "Las fotografías aparecerán aquí muy pronto"}</span></span><span class="cgHeroActionIcon">${icon("arrowDown")}</span></a></div></div></section>
      <section class="cgIntro"><div><p class="cgEyebrow">Su historia</p><h2>Recuerdos para volver a sentir este momento.</h2></div><div><p class="cgIntroText">Esta entrega fue preparada especialmente para ustedes. Las fotografías pueden apreciarse en pantalla completa y descargarse en su calidad original.</p><div class="cgFacts"><div class="cgFact"><strong>${photos.length}</strong><span>fotografías</span></div><div class="cgFact"><strong>Original</strong><span>calidad de descarga</span></div><div class="cgFact"><strong>Privada</strong><span>no aparece en Google</span></div></div></div></section>
      <section class="cgGallerySection" id="fotografias"><div class="cgToolbar"><div class="cgToolbarTitle"><strong>Galería completa</strong><span>${photos.length ? photos.length + " fotografías disponibles" : "La entrega todavía no contiene fotografías"}</span></div>${toolbarAction}</div><div class="cgGallery" id="cgGallery"></div></section>
      <footer class="cgClosing"><div class="cgClosingMark"><span>by</span>Stiven</div><p>Fotografía por ${html(gallery.photographer)}. Galería privada preparada exclusivamente para el cliente.</p></footer>
      <nav class="cgBottomBar" aria-label="Acciones de galería"><button class="cgBottomSecondary" id="cgShareBottom" type="button">${icon("share")}<span>Compartir</span></button>${primaryBottom}</nav>
      <div class="cgViewer" id="cgViewer" role="dialog" aria-modal="true" aria-label="Visor de fotografías" hidden><div class="cgViewerHeader"><div><button class="cgViewerButton" id="cgClose" type="button">${icon("close")}<span>Cerrar</span></button></div><span class="cgViewerCount" id="cgViewerCount"></span><div><button class="cgViewerButton" id="cgViewerShare" type="button" aria-label="Compartir esta fotografía">${icon("share")}</button></div></div><div class="cgViewerMedia" id="cgViewerMedia"><div class="cgViewerLoader" id="cgViewerLoader"></div><img id="cgViewerImage" alt=""></div><div class="cgViewerFooter"><button class="cgViewerNav" id="cgPrev" type="button" aria-label="Fotografía anterior">${icon("left")}</button><button class="cgViewerDownload" id="cgDownload" type="button">${icon("download")}<span>Descargar original</span></button><button class="cgViewerNav" id="cgNext" type="button" aria-label="Fotografía siguiente">${icon("right")}</button></div></div>
      <div class="cgSheet" id="cgMaintenance" role="dialog" aria-modal="true" hidden><div class="cgSheetCard"><div class="cgSheetHandle"></div><div class="cgSheetMark">by</div><h3>Portafolio en preparación</h3><p>Estamos seleccionando y preparando nuevas fotografías. Por ahora, puedes continuar disfrutando esta galería privada.</p><div class="cgSheetActions"><button class="cgSheetPrimary" id="cgMaintenanceClose" type="button">Volver a la galería</button><a class="cgSheetSecondary" href="${attr(gallery.instagram)}" target="_blank" rel="noreferrer">Visitar Instagram</a></div></div></div>
      <div class="cgSheet" id="cgHelp" role="dialog" aria-modal="true" hidden><div class="cgSheetCard"><div class="cgSheetHandle"></div><div class="cgSheetMark">↓</div><h3>Descargar fotografías</h3><p>Abre una fotografía y toca “Descargar original”. El sistema intentará guardar el JPG con un nombre profesional, por ejemplo MATERNIDAD-001.jpg.</p><div class="cgSheetActions"><button class="cgSheetPrimary" id="cgHelpClose" type="button">Entendido</button></div></div></div>
      <div class="cgToast" id="cgToast" role="status" aria-live="polite">Enlace copiado</div>
    `;

    document.body.appendChild(app);
    renderPhotos();
    bindInteractions();
  }

  function renderPhotos() {
    var host = document.getElementById("cgGallery");
    var photos = gallery.photos;
    if (!photos.length) {
      host.innerHTML = '<div class="cgEmpty"><div class="cgEmptyCard"><div class="cgEmptyMark">by</div><h3>La galería está lista.</h3><p>La experiencia para el cliente ya está preparada. Cuando se conecten los JPG finales, aparecerán aquí con vista rápida y descarga original.</p><div class="cgEmptyStatus">Esperando fotografías</div></div></div>';
      return;
    }

    var cards = photos.map(function (photo, index) {
      var ratioClass = photo.width && photo.height && photo.width > photo.height ? "isLandscape" : "isPortrait";
      var wide = index === 0 || index % 7 === 0 ? " isWide" : "";
      var loading = index < 5 ? "eager" : "lazy";
      var priority = index < 2 ? ' fetchpriority="high"' : "";
      return '<button class="cgPhoto ' + ratioClass + wide + '" type="button" data-photo="' + index + '" aria-label="Abrir fotografía ' + (index + 1) + '"><img loading="' + loading + '" decoding="async"' + priority + ' src="' + attr(photo.preview) + '" alt="' + attr(photo.alt) + '" style="object-position:' + attr(photo.position) + '"><span class="cgPhotoNumber">' + String(index + 1).padStart(2, "0") + '</span></button>';
    }).join("");

    host.innerHTML = '<div class="cgGrid">' + cards + '</div>';
    host.querySelectorAll(".cgPhoto img").forEach(function (image) {
      function reveal() { image.parentElement.classList.add("isLoaded"); }
      if (image.complete) reveal();
      else image.addEventListener("load", reveal, { once: true });
      image.addEventListener("error", reveal, { once: true });
    });
  }

  function bindInteractions() {
    var app = document.getElementById("clientGallery");
    var header = document.getElementById("cgHeader");
    var viewer = document.getElementById("cgViewer");
    var viewerImage = document.getElementById("cgViewerImage");
    var viewerLoader = document.getElementById("cgViewerLoader");
    var viewerCount = document.getElementById("cgViewerCount");
    var downloadButton = document.getElementById("cgDownload");
    var current = 0;
    var startX = 0;
    var startY = 0;
    var savedScroll = 0;
    var activeLayer = "";

    function updateHeader() { header.classList.toggle("isScrolled", window.scrollY > 34); }
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

    function lock(layer) {
      savedScroll = window.scrollY || document.documentElement.scrollTop || 0;
      activeLayer = layer;
      document.body.classList.add("cgLocked");
      document.body.style.position = "fixed";
      document.body.style.top = "-" + savedScroll + "px";
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";
    }

    function unlock(layer) {
      if (activeLayer && layer && activeLayer !== layer) return;
      activeLayer = "";
      document.body.classList.remove("cgLocked");
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      window.scrollTo(0, savedScroll);
    }

    function showSheet(id) {
      var sheet = document.getElementById(id);
      if (!sheet) return;
      sheet.hidden = false;
      lock(id);
    }

    function closeSheet(id) {
      var sheet = document.getElementById(id);
      if (!sheet) return;
      sheet.hidden = true;
      unlock(id);
    }

    function updateViewer(index) {
      var photos = gallery.photos;
      if (!photos.length) return;
      current = (index + photos.length) % photos.length;
      var photo = photos[current];
      viewerLoader.hidden = false;
      viewerImage.classList.remove("isReady");
      viewerImage.alt = photo.alt;
      viewerCount.textContent = String(current + 1).padStart(2, "0") + " / " + String(photos.length).padStart(2, "0");

      var target = photo.preview;
      var temp = new Image();
      temp.onload = function () {
        viewerImage.src = target;
        viewerImage.style.objectPosition = photo.position;
        viewerImage.classList.add("isReady");
        viewerLoader.hidden = true;
      };
      temp.onerror = function () {
        viewerImage.src = target;
        viewerImage.classList.add("isReady");
        viewerLoader.hidden = true;
      };
      temp.src = target;
      preloadAdjacent(current);
    }

    function openViewer(index) {
      if (!gallery.photos.length) return;
      viewer.hidden = false;
      lock("viewer");
      updateViewer(index);
      document.getElementById("cgClose").focus({ preventScroll: true });
    }

    function closeViewer() {
      viewer.hidden = true;
      viewerImage.src = "";
      unlock("viewer");
    }

    function preloadAdjacent(index) {
      if (gallery.photos.length < 2) return;
      [index - 1, index + 1].forEach(function (nextIndex) {
        var photo = gallery.photos[(nextIndex + gallery.photos.length) % gallery.photos.length];
        if (photo && photo.preview) (new Image()).src = photo.preview;
      });
    }

    async function shareGallery() {
      try {
        if (navigator.share) await navigator.share({ title: gallery.title, text: gallery.subtitle, url: window.location.href });
        else if (navigator.clipboard) { await navigator.clipboard.writeText(window.location.href); toast("Enlace de la galería copiado"); }
        else toast("Copia el enlace desde la barra del navegador");
      } catch (error) {
        if (!error || error.name !== "AbortError") toast("No se pudo compartir");
      }
    }

    async function downloadCurrent() {
      var photo = gallery.photos[current];
      if (!photo || !photo.original) return;
      var originalLabel = downloadButton.innerHTML;
      downloadButton.disabled = true;
      downloadButton.textContent = "Preparando descarga…";
      try {
        var response = await fetch(photo.original, { mode: "cors", cache: "no-store" });
        if (!response.ok) throw new Error("download_failed");
        var blob = await response.blob();
        var objectUrl = URL.createObjectURL(blob);
        var anchor = document.createElement("a");
        anchor.href = objectUrl;
        anchor.download = photo.name;
        anchor.style.display = "none";
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        setTimeout(function () { URL.revokeObjectURL(objectUrl); }, 1500);
        toast("Descargando " + photo.name);
      } catch (error) {
        var fallbackLink = document.createElement("a");
        fallbackLink.href = photo.original;
        fallbackLink.target = "_blank";
        fallbackLink.rel = "noopener";
        fallbackLink.download = photo.name;
        fallbackLink.style.display = "none";
        document.body.appendChild(fallbackLink);
        fallbackLink.click();
        fallbackLink.remove();
        toast("Se abrió el JPG original");
      } finally {
        downloadButton.disabled = false;
        downloadButton.innerHTML = originalLabel;
      }
    }

    function toast(message) {
      var element = document.getElementById("cgToast");
      element.textContent = message;
      element.classList.add("show");
      clearTimeout(toast.timer);
      toast.timer = setTimeout(function () { element.classList.remove("show"); }, 2200);
    }

    app.addEventListener("click", function (event) {
      var photo = event.target.closest && event.target.closest("[data-photo]");
      if (photo) openViewer(Number(photo.dataset.photo));
      if (event.target.closest && event.target.closest("[data-maintenance]")) showSheet("cgMaintenance");
    });

    document.getElementById("cgShareTop").addEventListener("click", shareGallery);
    document.getElementById("cgShareBottom").addEventListener("click", shareGallery);
    document.getElementById("cgViewerShare").addEventListener("click", shareGallery);
    document.getElementById("cgClose").addEventListener("click", closeViewer);
    document.getElementById("cgPrev").addEventListener("click", function () { updateViewer(current - 1); });
    document.getElementById("cgNext").addEventListener("click", function () { updateViewer(current + 1); });
    document.getElementById("cgDownload").addEventListener("click", downloadCurrent);
    document.getElementById("cgMaintenanceClose").addEventListener("click", function () { closeSheet("cgMaintenance"); });
    document.getElementById("cgMaintenance").addEventListener("click", function (event) { if (event.target === this) closeSheet("cgMaintenance"); });

    var helpButton = document.getElementById("cgDownloadHelp");
    if (helpButton) helpButton.addEventListener("click", function () { showSheet("cgHelp"); });
    document.getElementById("cgHelpClose").addEventListener("click", function () { closeSheet("cgHelp"); });
    document.getElementById("cgHelp").addEventListener("click", function (event) { if (event.target === this) closeSheet("cgHelp"); });

    var viewerMedia = document.getElementById("cgViewerMedia");
    viewerMedia.addEventListener("touchstart", function (event) {
      var touch = event.changedTouches[0];
      startX = touch.clientX;
      startY = touch.clientY;
    }, { passive: true });
    viewerMedia.addEventListener("touchend", function (event) {
      var touch = event.changedTouches[0];
      var deltaX = touch.clientX - startX;
      var deltaY = touch.clientY - startY;
      if (Math.abs(deltaX) > 52 && Math.abs(deltaX) > Math.abs(deltaY) * 1.25) updateViewer(current + (deltaX < 0 ? 1 : -1));
    }, { passive: true });

    document.addEventListener("keydown", function (event) {
      if (!viewer.hidden) {
        if (event.key === "Escape") closeViewer();
        if (event.key === "ArrowRight") updateViewer(current + 1);
        if (event.key === "ArrowLeft") updateViewer(current - 1);
        return;
      }
      if (event.key === "Escape" && activeLayer) closeSheet(activeLayer);
    });
  }

  function icon(name) {
    var icons = {
      share: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 16V3m0 0 4.5 4.5M12 3 7.5 7.5"/><path d="M5 12v7h14v-7"/></svg>',
      more: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1" fill="currentColor" stroke="none"/></svg>',
      arrowDown: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14m0 0 6-6m-6 6-6-6"/></svg>',
      grid: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/></svg>',
      clock: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 8v5l3 2"/></svg>',
      close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>',
      left: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 5-7 7 7 7"/></svg>',
      right: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>',
      download: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m0 0 5-5m-5 5-5-5"/><path d="M5 19h14"/></svg>'
    };
    return icons[name] || "";
  }

  function html(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (character) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character];
    });
  }

  function attr(value) { return html(value); }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();
