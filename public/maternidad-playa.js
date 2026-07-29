(function () {
  "use strict";

  var path = decodeURIComponent(window.location.pathname).toLowerCase().replace(/\/+$/, "");
  if (path !== "/galerias/maternidad-playa" && path !== "/maternidad-playa") return;

  /*
   * GALERÍA DE ENTREGA — SESIÓN DE MATERNIDAD
   *
   * Para publicar las fotos, agrega cada URL dentro del arreglo `photos`.
   * Formato recomendado:
   * { src: "URL_DE_LA_FOTO", name: "MAT-01.jpg", alt: "Retrato de maternidad en la playa" }
   *
   * `src` puede apuntar a Supabase Storage, Cloudinary o una carpeta pública.
   * `download` es opcional y permite usar una URL distinta para la descarga.
   */
  var gallery = {
    slug: "maternidad-playa",
    title: "Sesión de maternidad en la playa",
    subtitle: "Una historia de amor que está por comenzar.",
    date: "Galápagos · 2026",
    photographer: "Stiven Verdesoto",
    brand: "byStiven",
    instagram: "https://www.instagram.com/bystiven/",
    zipUrl: "",
    photos: [
      // Ejemplo para agregar después:
      // { src: "https://.../MAT-01.jpg", name: "MAT-01.jpg", alt: "Sesión de maternidad en la playa" }
    ]
  };

  document.title = gallery.title + " · " + gallery.brand;
  var robots = document.querySelector('meta[name="robots"]') || document.createElement("meta");
  robots.setAttribute("name", "robots");
  robots.setAttribute("content", "noindex, nofollow, noarchive");
  if (!robots.parentNode) document.head.appendChild(robots);

  var root = document.getElementById("root");
  if (root) root.style.setProperty("display", "none", "important");

  var style = document.createElement("style");
  style.id = "maternity-delivery-styles";
  style.textContent = `
    :root{--md-bg:#080706;--md-card:#12100e;--md-cream:#fffaf0;--md-gold:#d9a43c;--md-gold-soft:#ffe7a3;--md-muted:rgba(255,255,255,.68)}
    html,body{margin:0;background:var(--md-bg);color:#fff;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;-webkit-font-smoothing:antialiased}
    body{overflow-x:hidden}
    #maternityDelivery,#maternityDelivery *{box-sizing:border-box}
    #maternityDelivery{min-height:100vh;background:var(--md-bg);color:#fff}
    .mdTop{position:fixed;z-index:80;top:0;left:0;right:0;display:flex;align-items:center;justify-content:space-between;padding:22px clamp(18px,5vw,72px);background:linear-gradient(180deg,rgba(5,4,3,.88),rgba(5,4,3,.34),transparent);backdrop-filter:blur(12px)}
    .mdLogo{color:#fff;text-decoration:none;font-size:clamp(27px,3vw,38px);font-weight:950;letter-spacing:-.07em;line-height:1}.mdLogo span{color:var(--md-gold)}
    .mdTopActions{display:flex;gap:9px}.mdIconButton{border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.09);color:#fff;border-radius:999px;padding:11px 15px;font-weight:900;cursor:pointer;backdrop-filter:blur(12px);text-decoration:none}
    .mdHero{position:relative;min-height:84svh;display:flex;align-items:flex-end;overflow:hidden;background:radial-gradient(circle at 70% 22%,rgba(217,164,60,.18),transparent 28%),linear-gradient(145deg,#18120d,#060504 68%)}
    .mdHeroImage{position:absolute;inset:0;background-size:cover;background-position:center 40%;transform:scale(1.02);filter:saturate(.98) contrast(1.02) brightness(.78)}
    .mdHeroOverlay{position:absolute;inset:0;background:linear-gradient(90deg,rgba(0,0,0,.86),rgba(0,0,0,.4) 48%,rgba(0,0,0,.16)),linear-gradient(0deg,#080706 0%,rgba(8,7,6,.74) 24%,transparent 68%)}
    .mdHeroContent{position:relative;z-index:3;width:min(1080px,100%);padding:150px clamp(20px,7vw,110px) 72px}
    .mdEyebrow{margin:0 0 15px;color:var(--md-gold-soft);font-size:12px;font-weight:950;letter-spacing:3.2px;text-transform:uppercase}
    .mdHero h1,.mdSection h2{margin:0;letter-spacing:-.06em;line-height:.94}.mdHero h1{font-size:clamp(48px,7vw,96px);max-width:11ch}.mdHeroLead{max-width:650px;margin:22px 0 0;color:rgba(255,255,255,.8);font-size:clamp(17px,1.6vw,21px);line-height:1.65}
    .mdMeta{display:flex;flex-wrap:wrap;gap:9px;margin-top:24px}.mdMeta span{border:1px solid rgba(255,255,255,.15);background:rgba(255,255,255,.08);border-radius:999px;padding:9px 13px;font-size:13px;font-weight:900;backdrop-filter:blur(10px)}
    .mdActions{display:flex;flex-wrap:wrap;gap:11px;margin-top:28px}.mdButton{border:0;border-radius:999px;min-height:50px;padding:14px 21px;font-weight:950;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;gap:9px;cursor:pointer}.mdPrimary{background:linear-gradient(135deg,var(--md-gold),#fff0ad);color:#1c1102;box-shadow:0 18px 48px rgba(217,164,60,.22)}.mdGhost{border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.07);color:#fff}
    .mdSection{padding:clamp(66px,7vw,105px) clamp(18px,5vw,72px)}.mdIntro{display:grid;grid-template-columns:minmax(0,1fr) minmax(300px,520px);gap:clamp(30px,6vw,88px);align-items:center;background:linear-gradient(135deg,#fffaf0,#f2e4ce);color:#17120d}.mdIntro .mdEyebrow{color:#9d7225}.mdIntro h2{font-size:clamp(38px,5vw,72px)}.mdIntro p{color:#766b5f;font-size:17px;line-height:1.75}.mdInfoCard{background:#fff;border:1px solid rgba(0,0,0,.07);border-radius:28px;padding:26px;box-shadow:0 22px 65px rgba(0,0,0,.08)}.mdInfoCard strong{display:block;color:#17120d;font-size:19px;margin-bottom:10px}.mdInfoCard p{margin:0;font-size:15px}
    .mdGalleryHead{display:flex;align-items:end;justify-content:space-between;gap:22px;padding-bottom:30px}.mdGalleryHead h2{font-size:clamp(38px,5vw,72px)}.mdCount{color:var(--md-muted);font-weight:850}
    .mdGrid{columns:4 270px;column-gap:15px}.mdPhoto{break-inside:avoid;margin:0 0 15px;border-radius:25px;overflow:hidden;background:#15120f;box-shadow:0 20px 55px rgba(0,0,0,.3);position:relative}.mdPhotoButton{display:block;width:100%;border:0;padding:0;background:transparent;cursor:zoom-in;position:relative}.mdPhoto img{display:block;width:100%;height:auto;min-height:220px;object-fit:cover;transition:transform .65s ease,filter .4s ease}.mdPhoto:hover img{transform:scale(1.025);filter:brightness(1.04)}.mdPhotoOverlay{position:absolute;left:0;right:0;bottom:0;padding:45px 16px 15px;background:linear-gradient(0deg,rgba(0,0,0,.8),transparent);display:flex;align-items:end;justify-content:space-between;gap:10px;color:#fff}.mdPhotoOverlay span{font-size:12px;font-weight:950;letter-spacing:1.2px}.mdDownload{display:flex;align-items:center;justify-content:center;margin:0 12px 12px;border-radius:999px;padding:11px 14px;background:rgba(217,164,60,.15);color:var(--md-gold-soft);text-decoration:none;font-size:13px;font-weight:950;border:1px solid rgba(255,231,163,.16)}
    .mdEmpty{border:1px dashed rgba(255,255,255,.18);border-radius:32px;padding:clamp(38px,7vw,80px) 24px;text-align:center;background:linear-gradient(145deg,rgba(255,255,255,.06),rgba(255,255,255,.025))}.mdEmptyIcon{font-size:48px}.mdEmpty h3{font-size:clamp(26px,4vw,42px);margin:16px 0 10px}.mdEmpty p{max-width:620px;margin:auto;color:var(--md-muted);line-height:1.65}
    .mdOutro{text-align:center;background:radial-gradient(circle at 50% 0,rgba(217,164,60,.18),transparent 32%),#080706}.mdOutro h2{font-size:clamp(40px,6vw,78px);max-width:850px;margin-left:auto;margin-right:auto}.mdOutro p{max-width:650px;margin:20px auto 0;color:var(--md-muted);font-size:17px;line-height:1.7}.mdOutro .mdActions{justify-content:center}
    .mdFooter{padding:24px clamp(18px,5vw,72px);border-top:1px solid rgba(255,255,255,.08);display:flex;justify-content:space-between;gap:20px;color:rgba(255,255,255,.5);font-size:13px}
    .mdViewer{position:fixed;z-index:200;inset:0;background:rgba(0,0,0,.94);display:grid;place-items:center;padding:20px}.mdViewer[hidden]{display:none}.mdViewerInner{width:min(1200px,100%);height:min(86svh,900px);display:grid;grid-template-columns:minmax(0,1fr) 270px;gap:15px}.mdViewerMedia{background:#070707;border-radius:24px;display:grid;place-items:center;overflow:hidden}.mdViewerMedia img{max-width:100%;max-height:100%;object-fit:contain}.mdViewerPanel{border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.06);border-radius:24px;padding:22px;display:flex;flex-direction:column;justify-content:space-between}.mdViewerPanel small{color:var(--md-gold-soft);font-weight:950;letter-spacing:2px}.mdViewerPanel h3{font-size:27px;margin:12px 0}.mdViewerPanel p{color:var(--md-muted);line-height:1.6}.mdViewerNav{display:grid;grid-template-columns:1fr 1fr;gap:8px}.mdViewerNav button{border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.08);color:#fff;border-radius:999px;padding:11px;font-weight:900;cursor:pointer}.mdClose{position:fixed;top:18px;right:18px;width:48px;height:48px;border:1px solid rgba(255,255,255,.15);border-radius:50%;background:rgba(0,0,0,.55);color:#fff;font-size:28px;cursor:pointer}
    .mdToast{position:fixed;z-index:300;left:50%;bottom:24px;transform:translateX(-50%) translateY(30px);opacity:0;background:#fff;color:#17120d;border-radius:999px;padding:12px 18px;font-weight:900;box-shadow:0 18px 55px rgba(0,0,0,.35);transition:.25s ease;pointer-events:none}.mdToast.show{transform:translateX(-50%) translateY(0);opacity:1}
    @media(max-width:900px){.mdIntro{grid-template-columns:1fr}.mdViewerInner{grid-template-columns:1fr}.mdViewerPanel{display:none}.mdHero{min-height:78svh}.mdGrid{columns:2 210px}}
    @media(max-width:620px){.mdTop{padding:17px 17px}.mdIconButton span{display:none}.mdHero{min-height:92svh}.mdHeroContent{padding:130px 19px 50px}.mdHero h1{font-size:clamp(43px,13vw,59px)}.mdHeroLead{font-size:16px;line-height:1.55}.mdActions{display:grid}.mdButton{width:100%}.mdSection{padding:60px 18px}.mdGalleryHead{display:block}.mdCount{display:block;margin-top:10px}.mdGrid{columns:1}.mdFooter{display:block;text-align:center;line-height:1.7}.mdTopActions .mdPortfolio{display:none}}
  `;
  document.head.appendChild(style);

  var app = document.createElement("main");
  app.id = "maternityDelivery";
  document.body.appendChild(app);

  var cover = gallery.photos.length ? gallery.photos[0].src : "";
  var heroImage = cover ? '<div class="mdHeroImage" style="background-image:url(\'' + escapeAttr(cover) + '\')"></div>' : "";
  var zipButton = gallery.zipUrl ? '<a class="mdButton mdPrimary" href="' + escapeAttr(gallery.zipUrl) + '" download>↓ Descargar galería completa</a>' : "";

  app.innerHTML = `
    <header class="mdTop">
      <a class="mdLogo" href="/"><span>by</span>Stiven</a>
      <div class="mdTopActions">
        <button class="mdIconButton" id="mdShare" type="button">⌁ <span>Compartir</span></button>
        <a class="mdIconButton mdPortfolio" href="/">Ver portafolio</a>
      </div>
    </header>
    <section class="mdHero">
      ${heroImage}
      <div class="mdHeroOverlay"></div>
      <div class="mdHeroContent">
        <p class="mdEyebrow">Entrega privada · ${gallery.brand}</p>
        <h1>${gallery.title}</h1>
        <p class="mdHeroLead">${gallery.subtitle}</p>
        <div class="mdMeta"><span>${gallery.date}</span><span id="mdHeroCount">${gallery.photos.length} fotografías</span><span>Entrega en alta calidad</span></div>
        <div class="mdActions"><a class="mdButton mdPrimary" href="#fotografias">Ver fotografías</a>${zipButton}<a class="mdButton mdGhost" href="/">Conocer el portafolio</a></div>
      </div>
    </section>
    <section class="mdSection mdIntro">
      <div><p class="mdEyebrow">Su historia</p><h2>Un recuerdo creado para volver a sentir este momento.</h2><p>Esta galería fue preparada especialmente para ustedes. Las fotografías se presentan en una experiencia limpia, elegante y adaptada para celular y computadora.</p></div>
      <aside class="mdInfoCard"><strong>Entrega final</strong><p>Pueden abrir cada fotografía, recorrer la sesión completa y descargar individualmente los archivos disponibles. Guarden este enlace para regresar cuando deseen.</p></aside>
    </section>
    <section class="mdSection" id="fotografias">
      <div class="mdGalleryHead"><div><p class="mdEyebrow">Galería privada</p><h2>La espera más bonita.</h2></div><span class="mdCount">${gallery.photos.length ? gallery.photos.length + " fotografías listas" : "Galería preparada para cargar fotografías"}</span></div>
      <div id="mdGalleryContent"></div>
    </section>
    <section class="mdSection mdOutro"><p class="mdEyebrow">byStiven</p><h2>Gracias por permitirme contar una parte de su historia.</h2><p>La llegada de una nueva vida merece recuerdos que se sientan tan especiales como el momento mismo.</p><div class="mdActions"><a class="mdButton mdPrimary" href="/">Explorar el trabajo de Stiven</a><a class="mdButton mdGhost" href="${gallery.instagram}" target="_blank" rel="noreferrer">Instagram @bystiven</a></div></section>
    <footer class="mdFooter"><span>© ${new Date().getFullYear()} ${gallery.brand} · ${gallery.photographer}</span><span>Galería privada para uso personal del cliente</span></footer>
    <div class="mdViewer" id="mdViewer" hidden><button class="mdClose" id="mdClose" aria-label="Cerrar">×</button><div class="mdViewerInner"><div class="mdViewerMedia"><img id="mdViewerImage" alt=""></div><aside class="mdViewerPanel"><div><small id="mdViewerCode"></small><h3 id="mdViewerTitle"></h3><p>Fotografía de la sesión de maternidad. Utiliza el botón inferior para guardar el archivo.</p></div><div><a class="mdButton mdPrimary" id="mdViewerDownload" href="#">↓ Descargar fotografía</a><div class="mdViewerNav"><button id="mdPrev" type="button">Anterior</button><button id="mdNext" type="button">Siguiente</button></div></div></aside></div></div>
    <div class="mdToast" id="mdToast">Enlace copiado</div>
  `;

  var galleryContent = document.getElementById("mdGalleryContent");
  if (!gallery.photos.length) {
    galleryContent.innerHTML = '<div class="mdEmpty"><div class="mdEmptyIcon">◫</div><h3>La galería ya está lista.</h3><p>Solo falta agregar las fotografías finales. Cuando estén cargadas, aparecerán aquí automáticamente con su botón de descarga y vista en pantalla completa.</p></div>';
  } else {
    galleryContent.innerHTML = '<div class="mdGrid">' + gallery.photos.map(function (photo, index) {
      var name = photo.name || ("MAT-" + String(index + 1).padStart(2, "0") + ".jpg");
      var alt = photo.alt || gallery.title;
      return '<article class="mdPhoto"><button class="mdPhotoButton" type="button" data-photo="' + index + '"><img loading="lazy" decoding="async" src="' + escapeAttr(photo.src) + '" alt="' + escapeAttr(alt) + '"><span class="mdPhotoOverlay"><span>' + escapeHtml(name.replace(/\.[^.]+$/, "")) + '</span><span>Ampliar ↗</span></span></button><a class="mdDownload" href="' + escapeAttr(photo.download || photo.src) + '" data-download="' + index + '" download="' + escapeAttr(name) + '">↓ Descargar fotografía</a></article>';
    }).join("") + "</div>";
  }

  var current = 0;
  var viewer = document.getElementById("mdViewer");
  var viewerImage = document.getElementById("mdViewerImage");
  var viewerCode = document.getElementById("mdViewerCode");
  var viewerTitle = document.getElementById("mdViewerTitle");
  var viewerDownload = document.getElementById("mdViewerDownload");

  function openViewer(index) {
    if (!gallery.photos.length) return;
    current = (index + gallery.photos.length) % gallery.photos.length;
    var photo = gallery.photos[current];
    var name = photo.name || ("MAT-" + String(current + 1).padStart(2, "0") + ".jpg");
    viewerImage.src = photo.src;
    viewerImage.alt = photo.alt || gallery.title;
    viewerCode.textContent = "FOTOGRAFÍA " + String(current + 1).padStart(2, "0") + " / " + String(gallery.photos.length).padStart(2, "0");
    viewerTitle.textContent = name.replace(/\.[^.]+$/, "");
    viewerDownload.href = photo.download || photo.src;
    viewerDownload.setAttribute("download", name);
    viewer.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeViewer() { viewer.hidden = true; document.body.style.overflow = ""; }

  document.addEventListener("click", function (event) {
    var target = event.target.closest && event.target.closest("[data-photo]");
    if (target) openViewer(Number(target.getAttribute("data-photo")));
    var download = event.target.closest && event.target.closest("[data-download]");
    if (download) {
      event.preventDefault();
      var index = Number(download.getAttribute("data-download"));
      downloadFile(gallery.photos[index].download || gallery.photos[index].src, gallery.photos[index].name || ("MAT-" + String(index + 1).padStart(2, "0") + ".jpg"));
    }
  });

  document.getElementById("mdClose").addEventListener("click", closeViewer);
  viewer.addEventListener("click", function (event) { if (event.target === viewer) closeViewer(); });
  document.getElementById("mdPrev").addEventListener("click", function () { openViewer(current - 1); });
  document.getElementById("mdNext").addEventListener("click", function () { openViewer(current + 1); });
  viewerDownload.addEventListener("click", function (event) {
    event.preventDefault();
    var photo = gallery.photos[current];
    downloadFile(photo.download || photo.src, photo.name || ("MAT-" + String(current + 1).padStart(2, "0") + ".jpg"));
  });
  document.addEventListener("keydown", function (event) {
    if (viewer.hidden) return;
    if (event.key === "Escape") closeViewer();
    if (event.key === "ArrowLeft") openViewer(current - 1);
    if (event.key === "ArrowRight") openViewer(current + 1);
  });

  document.getElementById("mdShare").addEventListener("click", async function () {
    try {
      if (navigator.share) await navigator.share({ title: gallery.title, text: gallery.subtitle, url: window.location.href });
      else { await navigator.clipboard.writeText(window.location.href); showToast("Enlace copiado"); }
    } catch (error) {
      if (error && error.name !== "AbortError") showToast("No se pudo compartir");
    }
  });

  async function downloadFile(url, filename) {
    try {
      var response = await fetch(url, { mode: "cors" });
      if (!response.ok) throw new Error("download");
      var blob = await response.blob();
      var objectUrl = URL.createObjectURL(blob);
      var anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      setTimeout(function () { URL.revokeObjectURL(objectUrl); }, 1000);
      showToast("Descarga iniciada");
    } catch (error) {
      var fallback = document.createElement("a");
      fallback.href = url;
      fallback.target = "_blank";
      fallback.rel = "noreferrer";
      document.body.appendChild(fallback);
      fallback.click();
      fallback.remove();
      showToast("Foto abierta para guardar");
    }
  }

  function showToast(message) {
    var toast = document.getElementById("mdToast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(function () { toast.classList.remove("show"); }, 1900);
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (char) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]; });
  }
  function escapeAttr(value) { return escapeHtml(value); }
})();