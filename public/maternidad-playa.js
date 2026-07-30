(function () {
  "use strict";

  var route = decodeURIComponent(window.location.pathname).toLowerCase().replace(/\/+$/, "");
  if (route !== "/galerias/maternidad-playa" && route !== "/maternidad-playa") return;

  var gallery = {
    title: "Maternidad en la playa",
    subtitle: "Una historia de amor que está por comenzar.",
    date: "Galápagos · 2026",
    photographer: "Stiven Verdesoto",
    brand: "byStiven",
    instagram: "https://www.instagram.com/bystiven/",
    zipUrl: "",
    photos: [
      // Ejemplo:
      // { preview: "https://.../preview/MAT-001.jpg", download: "https://.../original/MAT-001.jpg", name: "MAT-001.jpg", alt: "Sesión de maternidad en la playa" }
    ]
  };

  function start() {
    document.title = gallery.title + " · " + gallery.brand;
    document.documentElement.classList.add("client-gallery-page");

    var root = document.getElementById("root");
    if (root) root.setAttribute("hidden", "");

    var robots = document.querySelector('meta[name="robots"]') || document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex, nofollow, noarchive";
    if (!robots.parentNode) document.head.appendChild(robots);

    var viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) viewport.content = "width=device-width,initial-scale=1,viewport-fit=cover";

    var style = document.createElement("style");
    style.textContent = `
      :root{--g-bg:#f6f4f0;--g-card:#fff;--g-text:#191714;--g-muted:#746f68;--g-line:rgba(25,23,20,.1);--g-dark:#171512;--g-accent:#b78b55;--g-safe-bottom:max(14px,env(safe-area-inset-bottom))}
      html.client-gallery-page,html.client-gallery-page body{margin:0!important;min-height:100%!important;background:var(--g-bg)!important;color:var(--g-text)!important;overflow-x:hidden!important;overflow-y:auto!important;overscroll-behavior-y:auto!important;font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif!important;-webkit-font-smoothing:antialiased}
      html.client-gallery-page body{position:static!important;height:auto!important;touch-action:auto!important}
      #clientGallery,#clientGallery *{box-sizing:border-box}
      #clientGallery{min-height:100svh;background:var(--g-bg);padding-bottom:94px}
      .gHeader{position:sticky;top:0;z-index:50;display:flex;align-items:center;justify-content:space-between;padding:max(12px,env(safe-area-inset-top)) 16px 12px;background:rgba(246,244,240,.88);backdrop-filter:blur(18px);border-bottom:1px solid var(--g-line)}
      .gBrand{border:0;background:none;padding:5px 0;color:var(--g-text);font-size:22px;font-weight:900;letter-spacing:-.06em;cursor:pointer}.gBrand span{color:var(--g-accent)}
      .gHeaderActions{display:flex;gap:8px}.gRound{width:42px;height:42px;border-radius:50%;border:1px solid var(--g-line);background:var(--g-card);display:grid;place-items:center;color:var(--g-text);font-size:18px;cursor:pointer;box-shadow:0 7px 22px rgba(0,0,0,.06)}
      .gHero{padding:18px 16px 0}.gCover{position:relative;height:min(69svh,650px);min-height:470px;border-radius:28px;overflow:hidden;background:linear-gradient(145deg,#cab9a5,#806b56);box-shadow:0 22px 60px rgba(45,34,23,.18)}
      .gCoverImage{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.gCoverShade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.03),rgba(0,0,0,.12) 45%,rgba(0,0,0,.78))}
      .gCoverEmpty{position:absolute;inset:0;background:radial-gradient(circle at 76% 20%,rgba(255,255,255,.25),transparent 25%),linear-gradient(145deg,#d8cab9,#8d7762)}
      .gHeroText{position:absolute;left:22px;right:22px;bottom:24px;color:#fff}.gKicker{margin:0 0 9px;font-size:11px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;opacity:.82}.gHero h1{margin:0;max-width:12ch;font-family:Georgia,"Times New Roman",serif;font-size:clamp(40px,12vw,68px);font-weight:500;line-height:.95;letter-spacing:-.045em}.gSubtitle{margin:13px 0 0;max-width:32ch;font-size:15px;line-height:1.55;color:rgba(255,255,255,.82)}
      .gMeta{display:flex;gap:8px;overflow-x:auto;padding:14px 2px 5px;scrollbar-width:none}.gMeta::-webkit-scrollbar{display:none}.gPill{flex:0 0 auto;padding:9px 12px;border-radius:999px;background:var(--g-card);border:1px solid var(--g-line);font-size:12px;font-weight:750;color:var(--g-muted)}
      .gIntro{padding:38px 20px 24px}.gIntro h2{margin:0;font-family:Georgia,"Times New Roman",serif;font-size:34px;font-weight:500;line-height:1.05;letter-spacing:-.035em}.gIntro p{margin:14px 0 0;color:var(--g-muted);font-size:15px;line-height:1.7}
      .gTools{position:sticky;top:67px;z-index:40;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:11px 16px;background:rgba(246,244,240,.92);backdrop-filter:blur(16px);border-top:1px solid transparent;border-bottom:1px solid var(--g-line)}.gTools strong{font-size:14px}.gTools span{display:block;margin-top:2px;color:var(--g-muted);font-size:12px}.gToolBtn{border:1px solid var(--g-line);background:var(--g-card);border-radius:999px;padding:10px 13px;font-size:12px;font-weight:800;color:var(--g-text);cursor:pointer}
      .gGallery{padding:12px 10px 30px}.gGrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}.gPhoto{position:relative;aspect-ratio:4/5;border:0;border-radius:4px;overflow:hidden;padding:0;background:#ddd;cursor:zoom-in}.gPhoto:nth-child(5n+1){grid-column:1/-1;aspect-ratio:4/3}.gPhoto img{width:100%;height:100%;display:block;object-fit:cover;transition:transform .35s ease}.gPhoto:active img{transform:scale(.985)}.gPhotoIndex{position:absolute;right:8px;bottom:8px;padding:5px 7px;border-radius:999px;background:rgba(0,0,0,.48);color:#fff;font-size:10px;font-weight:800;backdrop-filter:blur(8px)}
      .gEmpty{margin:4px 6px 28px;padding:42px 24px;border-radius:26px;background:var(--g-card);border:1px solid var(--g-line);text-align:center;box-shadow:0 14px 45px rgba(0,0,0,.05)}.gEmptyIcon{width:58px;height:58px;margin:auto;border-radius:20px;background:#efe8df;display:grid;place-items:center;font-size:25px}.gEmpty h3{margin:18px 0 8px;font-family:Georgia,"Times New Roman",serif;font-size:29px;font-weight:500}.gEmpty p{margin:0;color:var(--g-muted);font-size:14px;line-height:1.65}
      .gFooter{padding:36px 22px 20px;text-align:center}.gFooterBrand{font-size:25px;font-weight:900;letter-spacing:-.06em}.gFooterBrand span{color:var(--g-accent)}.gFooter p{margin:9px auto 0;max-width:32ch;color:var(--g-muted);font-size:13px;line-height:1.6}
      .gBottom{position:fixed;z-index:80;left:12px;right:12px;bottom:var(--g-safe-bottom);display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:7px;border-radius:21px;background:rgba(23,21,18,.94);backdrop-filter:blur(20px);box-shadow:0 18px 55px rgba(0,0,0,.28)}.gBottom button,.gBottom a{height:48px;border-radius:15px;border:0;display:flex;align-items:center;justify-content:center;gap:7px;text-decoration:none;font-weight:850;font-size:13px;cursor:pointer}.gBottomPrimary{background:#fff;color:#171512}.gBottomSecondary{background:rgba(255,255,255,.1);color:#fff}
      .gViewer{position:fixed;z-index:150;inset:0;background:#050505;display:flex;flex-direction:column}.gViewer[hidden]{display:none}.gViewerTop{height:max(62px,calc(48px + env(safe-area-inset-top)));padding:max(10px,env(safe-area-inset-top)) 12px 8px;display:flex;align-items:center;justify-content:space-between;color:#fff}.gViewerTop button,.gViewerBottom button,.gViewerBottom a{border:0;background:rgba(255,255,255,.1);color:#fff;border-radius:999px;height:42px;padding:0 15px;font-weight:800;text-decoration:none;display:flex;align-items:center;justify-content:center;cursor:pointer}.gViewerMedia{flex:1;min-height:0;display:grid;place-items:center;touch-action:pan-y;background:#050505}.gViewerMedia img{max-width:100%;max-height:100%;width:auto;height:auto;object-fit:contain;user-select:none;-webkit-user-drag:none}.gViewerBottom{display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:10px 12px var(--g-safe-bottom)}.gViewerBottom a{background:#fff;color:#151515}.gViewerCount{font-size:12px;font-weight:800;color:rgba(255,255,255,.7)}
      .gModal{position:fixed;z-index:200;inset:0;display:grid;place-items:end center;padding:16px;background:rgba(0,0,0,.48);backdrop-filter:blur(8px)}.gModal[hidden]{display:none}.gModalCard{width:100%;max-width:440px;padding:28px 22px calc(22px + env(safe-area-inset-bottom));border-radius:28px 28px 22px 22px;background:#fff;box-shadow:0 30px 100px rgba(0,0,0,.35)}.gModalMark{width:52px;height:52px;border-radius:17px;background:var(--g-dark);color:#fff;display:grid;place-items:center;font-weight:900}.gModal h3{margin:20px 0 9px;font-family:Georgia,"Times New Roman",serif;font-size:31px;font-weight:500;line-height:1.05}.gModal p{margin:0;color:var(--g-muted);line-height:1.65}.gModalActions{display:grid;gap:8px;margin-top:22px}.gModalActions button,.gModalActions a{height:50px;border-radius:15px;border:0;display:flex;align-items:center;justify-content:center;text-decoration:none;font-weight:850;cursor:pointer}.gModalActions button{background:var(--g-dark);color:#fff}.gModalActions a{background:#eee9e3;color:var(--g-text)}
      .gToast{position:fixed;z-index:250;left:50%;bottom:100px;transform:translate(-50%,20px);opacity:0;padding:11px 16px;border-radius:999px;background:#171512;color:#fff;font-size:12px;font-weight:800;transition:.2s;pointer-events:none}.gToast.show{opacity:1;transform:translate(-50%,0)}
      @media(min-width:720px){#clientGallery{padding-bottom:30px}.gHeader{padding-left:clamp(24px,5vw,72px);padding-right:clamp(24px,5vw,72px)}.gHero{padding:26px clamp(24px,5vw,72px) 0}.gCover{height:78vh}.gHeroText{left:clamp(30px,5vw,70px);bottom:50px}.gIntro{max-width:900px;padding:70px clamp(24px,7vw,100px) 45px}.gTools{top:67px;padding-left:clamp(24px,5vw,72px);padding-right:clamp(24px,5vw,72px)}.gGallery{padding:18px clamp(18px,4vw,60px) 60px}.gGrid{grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.gPhoto:nth-child(5n+1){grid-column:auto;aspect-ratio:4/5}.gPhoto:nth-child(7n+1){grid-column:span 2;grid-row:span 2;aspect-ratio:auto}.gBottom{display:none}.gModal{place-items:center}.gModalCard{border-radius:28px;padding-bottom:28px}}
    `;
    document.head.appendChild(style);

    var photos = gallery.photos;
    var cover = photos.length ? (photos[0].preview || photos[0].src) : "";
    var app = document.createElement("main");
    app.id = "clientGallery";
    app.innerHTML = `
      <header class="gHeader">
        <button class="gBrand" data-maintenance type="button"><span>by</span>Stiven</button>
        <div class="gHeaderActions"><button class="gRound" id="gShareTop" type="button" aria-label="Compartir">↗</button><button class="gRound" data-maintenance type="button" aria-label="Portafolio">⋯</button></div>
      </header>
      <section class="gHero">
        <div class="gCover">
          ${cover ? `<img class="gCoverImage" src="${attr(cover)}" alt="Portada de ${attr(gallery.title)}">` : '<div class="gCoverEmpty"></div>'}
          <div class="gCoverShade"></div>
          <div class="gHeroText"><p class="gKicker">Galería privada · ${html(gallery.brand)}</p><h1>${html(gallery.title)}</h1><p class="gSubtitle">${html(gallery.subtitle)}</p></div>
        </div>
        <div class="gMeta"><span class="gPill">${html(gallery.date)}</span><span class="gPill">${photos.length} fotografías</span><span class="gPill">Descarga en alta calidad</span></div>
      </section>
      <section class="gIntro"><h2>Sus recuerdos, en un solo lugar.</h2><p>Esta galería fue creada especialmente para ustedes. Toquen cualquier fotografía para verla en pantalla completa y descargarla en su máxima calidad.</p></section>
      <section id="fotografias"><div class="gTools"><div><strong>Galería completa</strong><span>${photos.length ? photos.length + " fotografías disponibles" : "Preparada para recibir las fotografías"}</span></div>${gallery.zipUrl ? `<a class="gToolBtn" href="${attr(gallery.zipUrl)}" download>Descargar todas</a>` : '<button class="gToolBtn" id="gHowDownload" type="button">¿Cómo descargar?</button>'}</div><div class="gGallery" id="gGallery"></div></section>
      <footer class="gFooter"><div class="gFooterBrand"><span>by</span>Stiven</div><p>Fotografía por ${html(gallery.photographer)}. Esta galería es privada y fue preparada exclusivamente para el cliente.</p></footer>
      <nav class="gBottom"><button class="gBottomSecondary" id="gShareBottom" type="button">↗ Compartir</button><a class="gBottomPrimary" href="#fotografias">Ver fotografías</a></nav>
      <div class="gViewer" id="gViewer" hidden><div class="gViewerTop"><button id="gClose" type="button">Cerrar</button><span class="gViewerCount" id="gViewerCount"></span><button id="gViewerShare" type="button">↗</button></div><div class="gViewerMedia" id="gViewerMedia"><img id="gViewerImage" alt=""></div><div class="gViewerBottom"><button id="gPrev" type="button">‹ Anterior</button><a id="gDownload" href="#">Descargar</a></div></div>
      <div class="gModal" id="gMaintenance" hidden><div class="gModalCard"><div class="gModalMark">by</div><h3>Portafolio en preparación</h3><p>Estamos seleccionando y preparando nuevas fotografías. Por ahora, puedes continuar disfrutando esta galería privada.</p><div class="gModalActions"><button id="gModalClose" type="button">Volver a la galería</button><a href="${attr(gallery.instagram)}" target="_blank" rel="noreferrer">Visitar Instagram</a></div></div></div>
      <div class="gModal" id="gHelp" hidden><div class="gModalCard"><div class="gModalMark">↓</div><h3>Descargar fotografías</h3><p>Abre una fotografía, toca “Descargar” y el archivo original se guardará o se abrirá en una pestaña para que puedas guardarlo desde tu celular.</p><div class="gModalActions"><button id="gHelpClose" type="button">Entendido</button></div></div></div>
      <div class="gToast" id="gToast">Enlace copiado</div>
    `;
    document.body.appendChild(app);

    var galleryEl = document.getElementById("gGallery");
    if (!photos.length) {
      galleryEl.innerHTML = '<div class="gEmpty"><div class="gEmptyIcon">▧</div><h3>Galería lista para publicar</h3><p>El diseño y las descargas ya están preparados. Solo falta conectar los JPG finales para que aparezcan aquí.</p></div>';
    } else {
      galleryEl.innerHTML = '<div class="gGrid">' + photos.map(function(photo, index){
        var src = photo.preview || photo.src;
        var name = photo.name || "MAT-" + String(index + 1).padStart(3,"0") + ".jpg";
        return '<button class="gPhoto" type="button" data-photo="' + index + '"><img loading="lazy" decoding="async" src="' + attr(src) + '" alt="' + attr(photo.alt || gallery.title) + '"><span class="gPhotoIndex">' + String(index + 1).padStart(2,"0") + '</span></button>';
      }).join("") + '</div>';
    }

    var current = 0;
    var viewer = document.getElementById("gViewer");
    var viewerImage = document.getElementById("gViewerImage");
    var viewerCount = document.getElementById("gViewerCount");
    var download = document.getElementById("gDownload");

    function lock(value){ document.body.style.overflow = value ? "hidden" : ""; }
    function openViewer(index){
      if (!photos.length) return;
      current = (index + photos.length) % photos.length;
      var photo = photos[current];
      var name = photo.name || "MAT-" + String(current + 1).padStart(3,"0") + ".jpg";
      viewerImage.src = photo.preview || photo.src;
      viewerImage.alt = photo.alt || gallery.title;
      viewerCount.textContent = (current + 1) + " de " + photos.length;
      download.href = photo.download || photo.src || photo.preview;
      download.setAttribute("download", name);
      viewer.hidden = false;
      lock(true);
    }
    function closeViewer(){ viewer.hidden = true; lock(false); }
    function showModal(id){ document.getElementById(id).hidden = false; lock(true); }
    function closeModal(id){ document.getElementById(id).hidden = true; lock(false); }
    function toast(message){ var el=document.getElementById("gToast");el.textContent=message;el.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(function(){el.classList.remove("show");},1800); }
    async function share(){ try{ if(navigator.share) await navigator.share({title:gallery.title,text:gallery.subtitle,url:location.href}); else{await navigator.clipboard.writeText(location.href);toast("Enlace copiado");}}catch(e){if(e&&e.name!=="AbortError")toast("No se pudo compartir");} }

    app.addEventListener("click", function(event){
      var photoButton = event.target.closest && event.target.closest("[data-photo]");
      if (photoButton) openViewer(Number(photoButton.dataset.photo));
      if (event.target.closest && event.target.closest("[data-maintenance]")) showModal("gMaintenance");
    });
    document.getElementById("gShareTop").onclick = share;
    document.getElementById("gShareBottom").onclick = share;
    document.getElementById("gViewerShare").onclick = share;
    document.getElementById("gClose").onclick = closeViewer;
    document.getElementById("gPrev").onclick = function(){openViewer(current-1);};
    document.getElementById("gModalClose").onclick = function(){closeModal("gMaintenance");};
    document.getElementById("gMaintenance").onclick = function(event){if(event.target===this)closeModal("gMaintenance");};
    document.getElementById("gHowDownload").onclick = function(){showModal("gHelp");};
    document.getElementById("gHelpClose").onclick = function(){closeModal("gHelp");};
    document.getElementById("gHelp").onclick = function(event){if(event.target===this)closeModal("gHelp");};

    var startX = 0;
    document.getElementById("gViewerMedia").addEventListener("touchstart",function(event){startX=event.changedTouches[0].clientX;},{passive:true});
    document.getElementById("gViewerMedia").addEventListener("touchend",function(event){var delta=event.changedTouches[0].clientX-startX;if(Math.abs(delta)>50)openViewer(current+(delta<0?1:-1));},{passive:true});
    document.addEventListener("keydown",function(event){if(event.key==="Escape"&&!viewer.hidden)closeViewer();if(!viewer.hidden&&event.key==="ArrowRight")openViewer(current+1);if(!viewer.hidden&&event.key==="ArrowLeft")openViewer(current-1);});
  }

  function html(value){return String(value).replace(/[&<>"']/g,function(c){return({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"})[c];});}
  function attr(value){return html(value);}

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, {once:true});
  else start();
})();