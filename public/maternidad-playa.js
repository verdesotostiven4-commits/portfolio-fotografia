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
    coverIndex: 0,
    photos: []
  };

  var gallery = Object.assign({}, fallback, window.BYSTIVEN_MATERNIDAD || {});
  gallery.photos = Array.isArray(gallery.photos)
    ? gallery.photos.map(normalizeMedia).filter(function (item) { return Boolean(item.preview); })
    : [];

  function normalizeMedia(item, index) {
    item = item || {};
    var preview = item.preview || item.src || item.original || item.download || "";
    var original = item.original || item.download || item.src || item.preview || "";
    var type = item.type === "video" ? "video" : "image";
    return {
      type: type,
      preview: preview,
      original: original,
      downloadUrl: item.downloadUrl || original,
      name: professionalName(item.name, index, type),
      alt: item.alt || gallery.title || fallback.title,
      width: positiveNumber(item.width),
      height: positiveNumber(item.height),
      duration: positiveNumber(item.duration),
      position: item.position || "50% 50%"
    };
  }

  function positiveNumber(value) {
    var number = Number(value);
    return Number.isFinite(number) && number > 0 ? number : 0;
  }

  function professionalName(value, index, type) {
    var fallbackName = type === "video"
      ? "MATERNIDAD-VIDEO-" + String(index + 1).padStart(3, "0") + ".mp4"
      : "MATERNIDAD-" + String(index + 1).padStart(3, "0") + ".jpg";
    if (!value) return fallbackName;
    var clean = String(value).trim().replace(/[^a-zA-Z0-9._-]+/g, "-");
    if (!clean || clean === "." || clean === "-") return fallbackName;
    if (!/\.[a-z0-9]{2,5}$/i.test(clean)) clean += type === "video" ? ".mp4" : ".jpg";
    return clean;
  }

  function html(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (character) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character];
    });
  }

  function attr(value) { return html(value); }

  function icon(name) {
    var icons = {
      share: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 16V3m0 0 4.5 4.5M12 3 7.5 7.5"/><path d="M5 12v7h14v-7"/></svg>',
      down: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v14m0 0 6-6m-6 6-6-6"/></svg>',
      close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>',
      left: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 5-7 7 7 7"/></svg>',
      right: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>',
      download: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m0 0 5-5m-5 5-5-5"/><path d="M5 20h14"/></svg>',
      play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 7 8 5-8 5Z"/></svg>',
      info: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5h.01"/></svg>'
    };
    return icons[name] || "";
  }

  function start() {
    document.title = gallery.title + " · " + gallery.brand;
    document.documentElement.classList.add("client-gallery-page");

    var viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) viewport.content = "width=device-width,initial-scale=1,viewport-fit=cover";

    var theme = document.querySelector('meta[name="theme-color"]');
    if (theme) theme.content = "#f4f0ea";

    var robots = document.querySelector('meta[name="robots"]') || document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex, nofollow, noarchive";
    if (!robots.parentNode) document.head.appendChild(robots);

    var root = document.getElementById("root");
    if (root) root.hidden = true;

    var old = document.getElementById("clientGallery");
    if (old) old.remove();

    installStyles();
    preloadImportantImages();
    renderApp();
  }

  function installStyles() {
    var previous = document.getElementById("maternity-client-v3-styles");
    if (previous) previous.remove();

    var style = document.createElement("style");
    style.id = "maternity-client-v3-styles";
    style.textContent = `
      :root{--mg-bg:#f4f0ea;--mg-surface:#fff;--mg-ink:#171512;--mg-muted:#777068;--mg-line:rgba(23,21,18,.10);--mg-accent:#ad7b4c;--mg-dark:#11100e;--mg-safe-top:max(12px,env(safe-area-inset-top));--mg-safe-bottom:max(14px,env(safe-area-inset-bottom))}
      html.client-gallery-page,html.client-gallery-page body{width:100%!important;min-height:100%!important;margin:0!important;padding:0!important;background:var(--mg-bg)!important;color:var(--mg-ink)!important;overflow-x:hidden!important;overflow-y:auto!important;overscroll-behavior-y:auto!important;scroll-behavior:smooth!important;touch-action:pan-y!important;font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif!important;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
      html.client-gallery-page body.mgLocked{overflow:hidden!important;touch-action:none!important}
      #clientGallery,#clientGallery *{box-sizing:border-box}#clientGallery{min-height:100svh;background:var(--mg-bg)}
      #clientGallery button,#clientGallery a{-webkit-tap-highlight-color:transparent}#clientGallery button:focus-visible,#clientGallery a:focus-visible{outline:3px solid rgba(173,123,76,.35);outline-offset:3px}
      .mgHeader{position:fixed;z-index:80;top:0;left:0;right:0;display:flex;align-items:center;justify-content:space-between;padding:var(--mg-safe-top) 18px 11px;color:#fff;transition:background .25s,border-color .25s,color .25s,box-shadow .25s;pointer-events:none;border-bottom:1px solid transparent}
      .mgHeader.isScrolled{background:rgba(244,240,234,.88);color:var(--mg-ink);border-color:var(--mg-line);box-shadow:0 10px 34px rgba(35,28,21,.06);backdrop-filter:blur(22px);-webkit-backdrop-filter:blur(22px)}
      .mgBrand,.mgHeaderButton{pointer-events:auto}.mgBrand{font-size:23px;font-weight:950;letter-spacing:-.065em;color:inherit;text-decoration:none}.mgBrand span{color:#d9a16a}.mgHeader.isScrolled .mgBrand span{color:var(--mg-accent)}
      .mgHeaderButton{width:44px;height:44px;border:1px solid rgba(255,255,255,.24);border-radius:50%;background:rgba(0,0,0,.15);color:#fff;display:grid;place-items:center;cursor:pointer;backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px)}.mgHeaderButton svg{width:19px;height:19px;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}.mgHeader.isScrolled .mgHeaderButton{background:#fff;border-color:var(--mg-line);color:var(--mg-ink);box-shadow:0 7px 24px rgba(0,0,0,.05)}
      .mgHero{padding:8px 8px 0}.mgHeroCard{position:relative;height:min(78svh,720px);min-height:560px;overflow:hidden;border-radius:30px;background:#8e7661;box-shadow:0 22px 70px rgba(43,33,24,.16)}
      .mgHeroImage{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transform:scale(1.002)}.mgHeroEmpty{position:absolute;inset:0;background:radial-gradient(circle at 74% 18%,rgba(255,255,255,.26),transparent 26%),linear-gradient(145deg,#d9c9b9,#8e745e 60%,#44352a)}
      .mgHeroShade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.18),rgba(0,0,0,.02) 38%,rgba(0,0,0,.14) 60%,rgba(0,0,0,.82) 100%)}
      .mgHeroContent{position:absolute;z-index:2;left:24px;right:24px;bottom:28px;color:#fff}.mgHeroMeta{margin:0 0 13px;color:rgba(255,255,255,.72);font-size:11px;font-weight:850;letter-spacing:.16em;text-transform:uppercase}.mgHero h1{max-width:12ch;margin:0;font-family:Georgia,"Times New Roman",serif;font-size:clamp(43px,12.2vw,68px);font-weight:400;line-height:.93;letter-spacing:-.052em;text-wrap:balance}.mgHeroSubtitle{max-width:33ch;margin:14px 0 0;color:rgba(255,255,255,.82);font-size:15px;line-height:1.55}
      .mgHeroLink{display:flex;align-items:center;justify-content:space-between;gap:18px;margin-top:23px;padding-top:17px;border-top:1px solid rgba(255,255,255,.2);color:#fff;text-decoration:none}.mgHeroLink strong{font-size:13px}.mgHeroLink small{display:block;margin-top:4px;color:rgba(255,255,255,.59);font-size:10px}.mgHeroLinkIcon{width:43px;height:43px;flex:0 0 auto;border-radius:50%;background:#fff;color:#171512;display:grid;place-items:center}.mgHeroLinkIcon svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}
      .mgDetails{display:flex;align-items:center;gap:15px;overflow-x:auto;padding:21px 18px 25px;scrollbar-width:none;border-bottom:1px solid var(--mg-line)}.mgDetails::-webkit-scrollbar{display:none}.mgDetail{flex:0 0 auto;display:flex;align-items:center;gap:8px;color:var(--mg-muted);font-size:12px}.mgDetail strong{color:var(--mg-ink);font-weight:850}.mgDetail:before{content:"";width:4px;height:4px;border-radius:50%;background:var(--mg-accent)}
      .mgGallerySection{scroll-margin-top:69px}.mgGalleryHead{display:flex;align-items:end;justify-content:space-between;gap:18px;padding:42px 18px 18px}.mgGalleryHead p{margin:0 0 7px;color:var(--mg-accent);font-size:10px;font-weight:900;letter-spacing:.17em;text-transform:uppercase}.mgGalleryHead h2{margin:0;font-family:Georgia,"Times New Roman",serif;font-size:37px;font-weight:400;line-height:1;letter-spacing:-.04em}.mgGalleryHead button,.mgGalleryHead a{min-height:42px;padding:0 14px;border:1px solid var(--mg-line);border-radius:999px;background:#fff;color:var(--mg-ink);font-size:11px;font-weight:850;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;white-space:nowrap;cursor:pointer}
      .mgGrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));grid-auto-flow:dense;gap:8px;padding:0 8px 36px}.mgCard{position:relative;min-width:0;aspect-ratio:4/5;border:0;border-radius:15px;overflow:hidden;padding:0;background:#ddd4ca;cursor:zoom-in;content-visibility:auto;contain-intrinsic-size:280px 350px}.mgCard.isWide{grid-column:1/-1;aspect-ratio:4/3}.mgCard.isLandscape{aspect-ratio:4/3}.mgCard img{width:100%;height:100%;display:block;object-fit:cover;opacity:0;transform:scale(1.018);transition:opacity .35s ease,transform .55s ease}.mgCard.isLoaded img{opacity:1;transform:scale(1)}.mgCard:active img{transform:scale(.985)}
      .mgPlay{position:absolute;z-index:3;left:12px;bottom:12px;width:44px;height:44px;border-radius:50%;background:rgba(255,255,255,.94);color:#171512;display:grid;place-items:center;box-shadow:0 12px 35px rgba(0,0,0,.2);pointer-events:none}.mgPlay svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linejoin:round}.mgDuration{position:absolute;z-index:3;right:11px;bottom:12px;padding:7px 9px;border-radius:999px;background:rgba(0,0,0,.48);color:#fff;font-size:10px;font-weight:850;backdrop-filter:blur(8px)}
      .mgEmpty{margin:0 8px 40px;padding:48px 24px;border:1px solid var(--mg-line);border-radius:28px;background:#fff;text-align:center}.mgEmptyMark{width:58px;height:58px;margin:auto;border-radius:19px;background:var(--mg-dark);color:#fff;display:grid;place-items:center;font-family:Georgia,serif;font-size:22px}.mgEmpty h2{margin:19px 0 9px;font-family:Georgia,serif;font-size:30px;font-weight:400}.mgEmpty p{max-width:34ch;margin:auto;color:var(--mg-muted);font-size:14px;line-height:1.65}
      .mgFooter{padding:58px 24px calc(38px + env(safe-area-inset-bottom));text-align:center;border-top:1px solid var(--mg-line)}.mgFooterBrand{font-size:26px;font-weight:950;letter-spacing:-.065em}.mgFooterBrand span{color:var(--mg-accent)}.mgFooter p{max-width:34ch;margin:11px auto 0;color:var(--mg-muted);font-size:12px;line-height:1.65}
      .mgViewer{position:fixed;z-index:220;inset:0;display:flex;flex-direction:column;background:#050505;color:#fff}.mgViewer[hidden]{display:none}.mgViewerHeader{height:max(64px,calc(48px + env(safe-area-inset-top)));padding:max(10px,env(safe-area-inset-top)) 12px 8px;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:10px}.mgViewerHeader>div:last-child{display:flex;justify-content:flex-end}.mgViewerButton{height:42px;padding:0 14px;border:1px solid rgba(255,255,255,.14);border-radius:999px;background:rgba(255,255,255,.08);color:#fff;display:inline-flex;align-items:center;justify-content:center;gap:7px;font-weight:800;cursor:pointer}.mgViewerButton svg{width:17px;height:17px;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}.mgViewerCount{color:rgba(255,255,255,.66);font-size:11px;font-weight:850;letter-spacing:.08em}
      .mgViewerStage{position:relative;flex:1;min-height:0;display:grid;place-items:center;overflow:hidden}.mgViewerStage img,.mgViewerStage video{max-width:100%;max-height:100%;width:auto;height:auto;object-fit:contain;user-select:none;-webkit-user-drag:none}.mgViewerStage video{width:100%;height:100%;background:#050505}.mgViewerLoader{position:absolute;width:28px;height:28px;border:2px solid rgba(255,255,255,.2);border-top-color:#fff;border-radius:50%;animation:mgSpin .7s linear infinite}.mgViewerLoader[hidden]{display:none}@keyframes mgSpin{to{transform:rotate(360deg)}}
      .mgViewerFooter{display:grid;grid-template-columns:48px minmax(0,1fr) 48px;gap:9px;padding:10px 12px var(--mg-safe-bottom)}.mgViewerNav,.mgViewerDownload{height:50px;border:0;border-radius:16px;display:flex;align-items:center;justify-content:center;cursor:pointer}.mgViewerNav{background:rgba(255,255,255,.09);color:#fff}.mgViewerDownload{gap:8px;background:#fff;color:#171512;font-weight:900}.mgViewerFooter svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}
      .mgSheet{position:fixed;z-index:260;inset:0;display:grid;place-items:end center;padding:14px;background:rgba(0,0,0,.48);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}.mgSheet[hidden]{display:none}.mgSheetCard{width:min(460px,100%);padding:13px 22px calc(22px + env(safe-area-inset-bottom));border-radius:29px 29px 22px 22px;background:#fff;box-shadow:0 30px 100px rgba(0,0,0,.34)}.mgSheetHandle{width:42px;height:4px;margin:0 auto 22px;border-radius:99px;background:#ddd6ce}.mgSheetIcon{width:50px;height:50px;border-radius:16px;background:var(--mg-dark);color:#fff;display:grid;place-items:center}.mgSheetIcon svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.9}.mgSheet h3{margin:18px 0 9px;font-family:Georgia,serif;font-size:31px;font-weight:400}.mgSheet p{margin:0;color:var(--mg-muted);font-size:14px;line-height:1.65}.mgSheet button{width:100%;height:50px;margin-top:22px;border:0;border-radius:15px;background:var(--mg-dark);color:#fff;font-weight:900;cursor:pointer}
      .mgToast{position:fixed;z-index:300;left:50%;bottom:24px;transform:translate(-50%,18px);opacity:0;padding:11px 16px;border-radius:999px;background:#171512;color:#fff;font-size:11px;font-weight:850;transition:.2s;pointer-events:none}.mgToast.show{opacity:1;transform:translate(-50%,0)}
      @media(min-width:760px){.mgHero{padding:14px 14px 0}.mgHeroCard{height:min(82vh,820px);min-height:650px}.mgHeroContent{left:clamp(42px,7vw,100px);right:clamp(42px,7vw,100px);bottom:58px}.mgHero h1{font-size:clamp(62px,7.2vw,104px)}.mgHeroSubtitle{font-size:17px}.mgDetails{justify-content:center;padding:25px}.mgGalleryHead{padding:72px clamp(28px,5vw,76px) 25px}.mgGalleryHead h2{font-size:52px}.mgGrid{grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;padding:0 clamp(14px,3vw,50px) 70px}.mgCard{border-radius:18px}.mgCard.isWide{grid-column:span 2;grid-row:span 2;aspect-ratio:auto}.mgSheet{place-items:center}.mgSheetCard{border-radius:29px;padding-bottom:24px}.mgViewerStage{padding:12px 4vw}.mgViewerStage img,.mgViewerStage video{border-radius:14px;overflow:hidden}.mgViewerFooter{width:min(560px,100%);margin:0 auto 12px}}
      @media(prefers-reduced-motion:reduce){html.client-gallery-page,html.client-gallery-page body{scroll-behavior:auto!important}.mgCard img,.mgHeader,.mgToast{transition:none!important}.mgViewerLoader{animation:none}}
    `;
    document.head.appendChild(style);
  }

  function preloadImportantImages() {
    gallery.photos.slice(0, 4).forEach(function (item, index) {
      if (!item.preview) return;
      var link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = item.preview;
      if (index === 0) link.setAttribute("fetchpriority", "high");
      document.head.appendChild(link);
    });
  }

  function renderApp() {
    var photos = gallery.photos;
    var requestedCover = Number(gallery.coverIndex);
    var coverIndex = Number.isFinite(requestedCover) ? Math.max(0, Math.min(photos.length - 1, Math.round(requestedCover))) : 0;
    var cover = photos.length ? photos[coverIndex] : null;
    var videoCount = photos.filter(function (item) { return item.type === "video"; }).length;
    var photoCount = photos.length - videoCount;
    var mediaLabel = videoCount ? photoCount + " fotos · " + videoCount + (videoCount === 1 ? " video" : " videos") : photos.length + " fotografías";

    var app = document.createElement("main");
    app.id = "clientGallery";
    var coverMarkup = cover
      ? '<img class="mgHeroImage" src="' + attr(cover.preview) + '" alt="Portada de ' + attr(gallery.title) + '" fetchpriority="high" decoding="async" style="object-position:' + attr(cover.position) + '">'
      : '<div class="mgHeroEmpty" aria-hidden="true"></div>';
    var galleryAction = gallery.zipUrl
      ? '<a href="' + attr(gallery.zipUrl) + '" download>Descargar todo</a>'
      : '<button id="mgHelp" type="button">Descargas</button>';

    app.innerHTML = `
      <header class="mgHeader" id="mgHeader"><div class="mgBrand"><span>by</span>Stiven</div><button class="mgHeaderButton" id="mgShare" type="button" aria-label="Compartir galería">${icon("share")}</button></header>
      <section class="mgHero" aria-labelledby="mgTitle"><div class="mgHeroCard">${coverMarkup}<div class="mgHeroShade" aria-hidden="true"></div><div class="mgHeroContent"><p class="mgHeroMeta">${html(gallery.location)} · ${html(gallery.year)}</p><h1 id="mgTitle">${html(gallery.title)}</h1><p class="mgHeroSubtitle">${html(gallery.subtitle)}</p><a class="mgHeroLink" href="#fotografias"><span><strong>Ver la galería</strong><small>${html(mediaLabel)} preparadas para ustedes</small></span><span class="mgHeroLinkIcon">${icon("down")}</span></a></div></div></section>
      <div class="mgDetails" aria-label="Detalles de la entrega"><div class="mgDetail"><strong>${photos.length}</strong> archivos</div><div class="mgDetail"><strong>Original</strong> al descargar</div><div class="mgDetail"><strong>Optimizada</strong> para celular</div></div>
      <section class="mgGallerySection" id="fotografias"><div class="mgGalleryHead"><div><p>La sesión</p><h2>Sus recuerdos</h2></div>${galleryAction}</div><div id="mgGallery"></div></section>
      <footer class="mgFooter"><div class="mgFooterBrand"><span>by</span>Stiven</div><p>Fotografía por ${html(gallery.photographer)}. Preparado con cuidado para conservar esta historia.</p></footer>
      <div class="mgViewer" id="mgViewer" role="dialog" aria-modal="true" aria-label="Visor de la galería" hidden><div class="mgViewerHeader"><div><button class="mgViewerButton" id="mgClose" type="button">${icon("close")}<span>Cerrar</span></button></div><span class="mgViewerCount" id="mgViewerCount"></span><div><button class="mgViewerButton" id="mgViewerShare" type="button" aria-label="Compartir galería">${icon("share")}</button></div></div><div class="mgViewerStage" id="mgViewerStage"><div class="mgViewerLoader" id="mgViewerLoader"></div><img id="mgViewerImage" alt="" hidden><video id="mgViewerVideo" controls playsinline preload="metadata" hidden></video></div><div class="mgViewerFooter"><button class="mgViewerNav" id="mgPrev" type="button" aria-label="Anterior">${icon("left")}</button><button class="mgViewerDownload" id="mgDownload" type="button">${icon("download")}<span>Descargar original</span></button><button class="mgViewerNav" id="mgNext" type="button" aria-label="Siguiente">${icon("right")}</button></div></div>
      <div class="mgSheet" id="mgDownloadSheet" role="dialog" aria-modal="true" hidden><div class="mgSheetCard"><div class="mgSheetHandle"></div><div class="mgSheetIcon">${icon("info")}</div><h3>Descargar archivos</h3><p>Abre una fotografía o video y toca “Descargar original”. Recibirás el archivo completo que el fotógrafo subió, no la versión ligera que aparece en la galería.</p><button id="mgSheetClose" type="button">Entendido</button></div></div>
      <div class="mgToast" id="mgToast" role="status" aria-live="polite">Enlace copiado</div>
    `;
    document.body.appendChild(app);
    renderCards();
    bindInteractions();
  }

  function renderCards() {
    var host = document.getElementById("mgGallery");
    if (!host) return;
    if (!gallery.photos.length) {
      host.innerHTML = '<div class="mgEmpty"><div class="mgEmptyMark">by</div><h2>La galería está preparada.</h2><p>Las fotografías aparecerán aquí cuando el fotógrafo publique la entrega.</p></div>';
      return;
    }

    var cards = gallery.photos.map(function (item, index) {
      var landscape = item.width && item.height && item.width > item.height;
      var wide = index === 0 || index % 8 === 0 || (landscape && index % 5 === 0);
      var classes = "mgCard" + (landscape ? " isLandscape" : "") + (wide ? " isWide" : "") + (item.type === "video" ? " isVideo" : "");
      var loading = index < 5 ? "eager" : "lazy";
      var priority = index < 2 ? ' fetchpriority="high"' : "";
      var videoOverlay = item.type === "video"
        ? '<span class="mgPlay">' + icon("play") + '</span><span class="mgDuration">' + formatDuration(item.duration) + '</span>'
        : "";
      return '<button class="' + classes + '" type="button" data-media="' + index + '" aria-label="Abrir ' + (item.type === "video" ? "video" : "fotografía") + ' ' + (index + 1) + '"><img loading="' + loading + '" decoding="async"' + priority + ' src="' + attr(item.preview) + '" alt="' + attr(item.alt) + '" style="object-position:' + attr(item.position) + '">' + videoOverlay + '</button>';
    }).join("");

    host.innerHTML = '<div class="mgGrid">' + cards + '</div>';
    host.querySelectorAll(".mgCard img").forEach(function (image) {
      function reveal() { image.parentElement.classList.add("isLoaded"); }
      if (image.complete) reveal();
      else image.addEventListener("load", reveal, { once: true });
      image.addEventListener("error", reveal, { once: true });
    });
  }

  function bindInteractions() {
    var app = document.getElementById("clientGallery");
    var header = document.getElementById("mgHeader");
    var viewer = document.getElementById("mgViewer");
    var viewerImage = document.getElementById("mgViewerImage");
    var viewerVideo = document.getElementById("mgViewerVideo");
    var viewerLoader = document.getElementById("mgViewerLoader");
    var viewerCount = document.getElementById("mgViewerCount");
    var downloadButton = document.getElementById("mgDownload");
    var sheet = document.getElementById("mgDownloadSheet");
    var current = 0;
    var startX = 0;
    var startY = 0;
    var savedScroll = 0;

    function updateHeader() { header.classList.toggle("isScrolled", window.scrollY > 38); }
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

    function lock() {
      savedScroll = window.scrollY || document.documentElement.scrollTop || 0;
      document.body.classList.add("mgLocked");
      document.body.style.position = "fixed";
      document.body.style.top = "-" + savedScroll + "px";
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";
    }

    function unlock() {
      document.body.classList.remove("mgLocked");
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      window.scrollTo(0, savedScroll);
    }

    function openViewer(index) {
      if (!gallery.photos.length) return;
      viewer.hidden = false;
      lock();
      updateViewer(index);
      document.getElementById("mgClose").focus({ preventScroll: true });
    }

    function closeViewer() {
      viewer.hidden = true;
      viewerImage.hidden = true;
      viewerImage.removeAttribute("src");
      viewerVideo.pause();
      viewerVideo.hidden = true;
      viewerVideo.removeAttribute("src");
      viewerVideo.removeAttribute("poster");
      viewerVideo.load();
      unlock();
    }

    function updateViewer(index) {
      var items = gallery.photos;
      current = (index + items.length) % items.length;
      var item = items[current];
      viewerCount.textContent = String(current + 1).padStart(2, "0") + " / " + String(items.length).padStart(2, "0");
      viewerLoader.hidden = false;
      viewerImage.hidden = true;
      viewerVideo.pause();
      viewerVideo.hidden = true;
      viewerVideo.removeAttribute("src");
      viewerVideo.removeAttribute("poster");

      if (item.type === "video") {
        viewerVideo.poster = item.preview;
        viewerVideo.src = item.original;
        viewerVideo.setAttribute("aria-label", item.alt || item.name);
        viewerVideo.hidden = false;
        viewerVideo.onloadedmetadata = function () { viewerLoader.hidden = true; };
        viewerVideo.onerror = function () { viewerLoader.hidden = true; };
        viewerVideo.load();
      } else {
        var temp = new Image();
        temp.onload = function () {
          viewerImage.src = item.preview;
          viewerImage.alt = item.alt;
          viewerImage.style.objectPosition = item.position;
          viewerImage.hidden = false;
          viewerLoader.hidden = true;
        };
        temp.onerror = function () {
          viewerImage.src = item.preview;
          viewerImage.hidden = false;
          viewerLoader.hidden = true;
        };
        temp.src = item.preview;
      }
      preloadAdjacent(current);
    }

    function preloadAdjacent(index) {
      if (gallery.photos.length < 2) return;
      [index - 1, index + 1].forEach(function (nextIndex) {
        var item = gallery.photos[(nextIndex + gallery.photos.length) % gallery.photos.length];
        if (item && item.type !== "video" && item.preview) (new Image()).src = item.preview;
      });
    }

    async function shareGallery() {
      try {
        if (navigator.share) await navigator.share({ title: gallery.title, text: gallery.subtitle, url: window.location.href });
        else if (navigator.clipboard) { await navigator.clipboard.writeText(window.location.href); toast("Enlace copiado"); }
        else toast("Copia el enlace desde el navegador");
      } catch (error) {
        if (!error || error.name !== "AbortError") toast("No se pudo compartir");
      }
    }

    async function downloadCurrent() {
      var item = gallery.photos[current];
      if (!item || !item.original) return;
      var previous = downloadButton.innerHTML;
      downloadButton.disabled = true;
      downloadButton.textContent = "Preparando…";
      try {
        var response = await fetch(item.original, { mode: "cors", cache: "no-store" });
        if (!response.ok) throw new Error("download_failed");
        var blob = await response.blob();
        var objectUrl = URL.createObjectURL(blob);
        triggerDownload(objectUrl, item.name);
        window.setTimeout(function () { URL.revokeObjectURL(objectUrl); }, 1800);
        toast("Descargando " + item.name);
      } catch (error) {
        var target = item.downloadUrl || item.original;
        var anchor = document.createElement("a");
        anchor.href = target;
        anchor.target = "_blank";
        anchor.rel = "noopener";
        anchor.download = item.name;
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        toast("Se abrió el archivo original");
      } finally {
        downloadButton.disabled = false;
        downloadButton.innerHTML = previous;
      }
    }

    function triggerDownload(url, name) {
      var anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = name;
      anchor.style.display = "none";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
    }

    function showSheet() { sheet.hidden = false; lock(); }
    function closeSheet() { sheet.hidden = true; unlock(); }
    function toast(message) {
      var element = document.getElementById("mgToast");
      element.textContent = message;
      element.classList.add("show");
      window.clearTimeout(toast.timer);
      toast.timer = window.setTimeout(function () { element.classList.remove("show"); }, 2000);
    }

    app.addEventListener("click", function (event) {
      var card = event.target.closest && event.target.closest("[data-media]");
      if (card) openViewer(Number(card.getAttribute("data-media")));
    });
    document.getElementById("mgShare").addEventListener("click", shareGallery);
    document.getElementById("mgViewerShare").addEventListener("click", shareGallery);
    document.getElementById("mgClose").addEventListener("click", closeViewer);
    document.getElementById("mgPrev").addEventListener("click", function () { updateViewer(current - 1); });
    document.getElementById("mgNext").addEventListener("click", function () { updateViewer(current + 1); });
    document.getElementById("mgDownload").addEventListener("click", downloadCurrent);
    var help = document.getElementById("mgHelp");
    if (help) help.addEventListener("click", showSheet);
    document.getElementById("mgSheetClose").addEventListener("click", closeSheet);
    sheet.addEventListener("click", function (event) { if (event.target === sheet) closeSheet(); });

    var stage = document.getElementById("mgViewerStage");
    stage.addEventListener("touchstart", function (event) {
      var touch = event.changedTouches[0];
      startX = touch.clientX;
      startY = touch.clientY;
    }, { passive: true });
    stage.addEventListener("touchend", function (event) {
      var touch = event.changedTouches[0];
      var deltaX = touch.clientX - startX;
      var deltaY = touch.clientY - startY;
      if (Math.abs(deltaX) > 54 && Math.abs(deltaX) > Math.abs(deltaY) * 1.25) updateViewer(current + (deltaX < 0 ? 1 : -1));
    }, { passive: true });

    document.addEventListener("keydown", function (event) {
      if (!viewer.hidden) {
        if (event.key === "Escape") closeViewer();
        if (event.key === "ArrowRight") updateViewer(current + 1);
        if (event.key === "ArrowLeft") updateViewer(current - 1);
        return;
      }
      if (!sheet.hidden && event.key === "Escape") closeSheet();
    });
  }

  function formatDuration(seconds) {
    var value = Math.max(0, Math.round(Number(seconds) || 0));
    var minutes = Math.floor(value / 60);
    return minutes + ":" + String(value % 60).padStart(2, "0");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();
