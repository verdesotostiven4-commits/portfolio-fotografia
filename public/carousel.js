(function () {
  function addHeroLayoutFix() {
    if (document.getElementById('hero-layout-fix')) return;
    var style = document.createElement('style');
    style.id = 'hero-layout-fix';
    style.textContent = [
      'html body main .homeHeroContent{transform:translateY(-22px)!important;padding-top:86px!important;padding-bottom:24px!important}',
      'html body main .homeHeroContent h1{font-size:clamp(44px,5.1vw,72px)!important;line-height:.93!important}',
      'html body main .homeHeroContent p:not(.eyebrow){font-size:16px!important;line-height:1.42!important;max-width:530px!important;margin-top:16px!important;margin-bottom:0!important}',
      'html body main .homeHeroContent .heroActions{margin-top:14px!important;gap:12px!important}',
      'html body main .homeHeroContent .button{min-height:45px!important;padding:11px 19px!important}',
      '@media(max-width:640px){html body main .homeHeroContent{transform:none!important;padding:118px 18px 60px!important}html body main .homeHeroContent h1{font-size:52px!important}}'
    ].join('\n');
    document.head.appendChild(style);
  }

  function addPortfolioGallery() {
    if (document.getElementById('experiencias')) return;
    var anchor = document.querySelector('.collectionPanels');
    if (!anchor || !anchor.parentNode) { window.setTimeout(addPortfolioGallery, 250); return; }

    function lf(tags, lock, w, h) {
      return 'https://loremflickr.com/' + (w || 1200) + '/' + (h || 1500) + '/' + tags + '?lock=' + lock;
    }
    var seaLion = 'https://blogger.googleusercontent.com/img/a/AVvXsEijmDWn4oCDM4prrw9f1pezhlyJJVqI4Mpe2xmRwzxMfWypqpEilpAhg54z_ZXUfbZXto-QPVC02H-SUQFT5T0WULTbHma6hODuKZVRJnBG2royWc0m-c1QqXpzSQ3nxQ43-RTYrdnn4Wb3RlROi0QoOKLOXb7c69wPYkvbMhaLEYFQTECs7stnJRBr7WI';

    var galleries = [
      { title:'Bodas', count:10, tag:'Wedding Story', desc:'Preparación, ceremonia, retratos de pareja, detalles y fiesta con una lectura elegante y emocional.', query:'wedding,couple', locks:[101,102,103,104,105,106,107,108,109,110], labels:['Preparación','Ceremonia','Pareja','Detalles','Fiesta'] },
      { title:'Quinceaños', count:15, tag:'Quince Story', desc:'Vestido, retratos, entrada, vals, familia, amigas y celebración con entrega de galería premium.', query:'birthday,dress,party', locks:[201,202,203,204,205,206,207,208,209,210,211,212,213,214,215], labels:['Vestido','Retratos','Vals','Familia','Fiesta'] },
      { title:'Sesiones', count:7, tag:'Portrait Session', desc:'Retratos personales, editoriales, urbanos o de marca con dirección de pose, luz y composición.', query:'portrait,model', locks:[301,302,303,304,305,306,307], labels:['Editorial','Urbano','Marca','Retrato'] },
      { title:'Naturaleza', count:28, tag:'Galápagos Nature', desc:'Fauna, paisaje y aventura con mirada documental, estética limpia y composición fine art.', query:'galapagos,wildlife,nature', locks:[401,402,403,404,405,406,407,408,409,410,411,412,413,414,415,416], labels:['Fauna','Paisaje','Aventura','Fine art'], custom:[seaLion] }
    ];

    var active = 0;
    var modalIndex = 0;
    function photo(g, i, w, h) {
      if (g.custom && g.custom[i]) return g.custom[i];
      return lf(g.query, g.locks[i % g.locks.length], w, h);
    }

    var section = document.createElement('section');
    section.id = 'experiencias';
    section.className = 'portfolioIndex';
    section.innerHTML = '<div class="portfolioIndexHead"><p class="eyebrow">Portafolio seleccionado</p><h2>Historias completas, organizadas por servicio.</h2><p>Bodas, quinceaños, sesiones y naturaleza presentadas como colecciones visuales reales.</p></div><div class="portfolioFilters"></div><div class="portfolioFeature"></div><div class="portfolioMasonry"></div>';
    anchor.parentNode.insertBefore(section, anchor.nextSibling);

    var css = document.createElement('style');
    css.id = 'portfolio-index-style';
    css.textContent = [
      '.portfolioIndex{position:relative;overflow:hidden;background:#080706;color:#fff;padding:clamp(76px,8vw,124px) clamp(18px,6vw,86px)}',
      '.portfolioIndex:before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 15% 0%,rgba(216,162,58,.12),transparent 32%),linear-gradient(180deg,#080706,#0e0c09 52%,#080706);pointer-events:none}',
      '.portfolioIndexHead{position:relative;max-width:1180px;margin:0 auto 28px;display:grid;grid-template-columns:minmax(300px,1fr) minmax(260px,420px);gap:clamp(22px,5vw,70px);align-items:end}.portfolioIndexHead .eyebrow{color:var(--gold2)}.portfolioIndexHead h2{font-size:clamp(38px,5.4vw,86px);max-width:820px}.portfolioIndexHead p:last-child{margin:0;color:rgba(255,255,255,.66);font-size:18px;line-height:1.65}',
      '.portfolioFilters{position:relative;max-width:1180px;margin:0 auto 18px;display:flex;gap:10px;flex-wrap:wrap}.portfolioFilter{border:1px solid rgba(255,255,255,.13);background:rgba(255,255,255,.06);color:#fff;border-radius:999px;padding:12px 16px;font-weight:950;cursor:pointer;display:flex;gap:10px;align-items:center}.portfolioFilter span{color:rgba(255,255,255,.52);font-size:12px;letter-spacing:1px;text-transform:uppercase}.portfolioFilter.active{background:linear-gradient(135deg,var(--gold),#fff1b9);color:#1d1202;border-color:rgba(255,231,163,.65)}.portfolioFilter.active span{color:rgba(29,18,2,.62)}',
      '.portfolioFeature{position:relative;max-width:1180px;margin:0 auto 14px;border-radius:38px;overflow:hidden;min-height:440px;background:#111;box-shadow:0 30px 90px rgba(0,0,0,.36);border:1px solid rgba(255,255,255,.12)}.portfolioFeature img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:saturate(1.02) brightness(.82);transform:scale(1.01);transition:transform .8s ease}.portfolioFeature:hover img{transform:scale(1.04)}.portfolioFeature:after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(0,0,0,.88),rgba(0,0,0,.58) 36%,rgba(0,0,0,.14) 70%,transparent),linear-gradient(0deg,rgba(0,0,0,.66),transparent 55%)}.featureCopy{position:relative;z-index:2;min-height:440px;display:flex;flex-direction:column;justify-content:flex-end;max-width:650px;padding:clamp(26px,4vw,48px)}.featureCopy small{color:var(--gold2);font-weight:950;letter-spacing:2px;text-transform:uppercase}.featureCopy h3{font-size:clamp(40px,6vw,88px);margin:10px 0}.featureCopy p{color:rgba(255,255,255,.74);font-size:18px;line-height:1.6}.featureTags{display:flex;flex-wrap:wrap;gap:8px;margin-top:18px}.featureTags span{border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.09);border-radius:999px;padding:9px 12px;font-weight:900;font-size:12px}',
      '.portfolioMasonry{position:relative;max-width:1180px;margin:0 auto;columns:4 220px;column-gap:12px}.portfolioShot{position:relative;display:block;width:100%;break-inside:avoid;margin:0 0 12px;border:0;padding:0;border-radius:24px;overflow:hidden;background:#111;cursor:zoom-in;box-shadow:0 18px 48px rgba(0,0,0,.25)}.portfolioShot img{width:100%;display:block;min-height:220px;object-fit:cover;filter:saturate(.96) brightness(.88);transition:transform .55s ease,filter .25s ease}.portfolioShot:nth-child(3n+1) img{height:370px}.portfolioShot:nth-child(3n+2) img{height:270px}.portfolioShot:nth-child(3n) img{height:315px}.portfolioShot:hover img{transform:scale(1.07);filter:saturate(1.06) brightness(1)}.portfolioShot:after{content:"";position:absolute;inset:0;background:linear-gradient(0deg,rgba(0,0,0,.72),transparent 52%)}.portfolioShot span{position:absolute;z-index:2;left:13px;right:13px;bottom:12px;display:flex;justify-content:space-between;color:#fff;font-weight:950;font-size:12px;text-shadow:0 2px 9px rgba(0,0,0,.7)}.portfolioShot span b{color:var(--gold2)}',
      '.portfolioViewer{position:fixed;inset:0;z-index:220;background:rgba(0,0,0,.92);display:grid;place-items:center;padding:22px}.portfolioViewer[hidden]{display:none}.viewerInner{width:min(1180px,100%);height:min(82vh,820px);display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:16px}.viewerImage{border-radius:28px;overflow:hidden;background:#111;display:grid;place-items:center}.viewerImage img{width:100%;height:100%;object-fit:contain}.viewerInfo{border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.07);border-radius:28px;padding:24px}.viewerInfo small{color:var(--gold2);font-weight:950;letter-spacing:2px;text-transform:uppercase}.viewerInfo h3{font-size:34px;margin:14px 0}.viewerInfo p{color:rgba(255,255,255,.68);line-height:1.6}.viewerActions{display:flex;gap:10px;margin-top:22px}.viewerActions button,.viewerClose{border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.1);color:#fff;border-radius:999px;padding:11px 14px;font-weight:950;cursor:pointer}.viewerClose{position:fixed;top:18px;right:18px;width:46px;height:46px;padding:0;font-size:24px}',
      '@media(max-width:900px){.portfolioIndexHead{grid-template-columns:1fr}.viewerInner{grid-template-columns:1fr}.viewerInfo{display:none}.portfolioFeature,.featureCopy{min-height:400px}}@media(max-width:640px){.portfolioIndex{padding-inline:18px}.portfolioFeature,.featureCopy{min-height:360px}.portfolioMasonry{columns:2 150px}.portfolioShot:nth-child(n) img{height:230px}}'
    ].join('\n');
    document.head.appendChild(css);

    var filters = section.querySelector('.portfolioFilters');
    var feature = section.querySelector('.portfolioFeature');
    var masonry = section.querySelector('.portfolioMasonry');
    var viewer = document.createElement('div');
    viewer.className = 'portfolioViewer';
    viewer.hidden = true;
    document.body.appendChild(viewer);

    function render() {
      var g = galleries[active];
      filters.innerHTML = galleries.map(function (item, i) { return '<button class="portfolioFilter ' + (i === active ? 'active' : '') + '" data-gallery="' + i + '">' + item.title + '<span>' + item.count + ' fotos</span></button>'; }).join('');
      feature.innerHTML = '<img src="' + photo(g, 0, 1400, 1700) + '" alt="' + g.title + '"><div class="featureCopy"><small>' + g.tag + '</small><h3>' + g.title + '</h3><p>' + g.desc + '</p><div class="featureTags">' + g.labels.map(function (label) { return '<span>' + label + '</span>'; }).join('') + '</div></div>';
      masonry.innerHTML = g.locks.map(function (_, i) { return '<button class="portfolioShot" data-shot="' + i + '"><img src="' + photo(g, i, 900, 1200) + '" alt="' + g.title + ' ' + (i + 1) + '"><span><b>' + String(i + 1).padStart(2, '0') + '</b>' + g.title + '</span></button>'; }).join('');
    }
    function openViewer(index) {
      modalIndex = index;
      var g = galleries[active];
      viewer.innerHTML = '<button class="viewerClose" type="button">×</button><div class="viewerInner"><div class="viewerImage"><img src="' + photo(g, modalIndex, 1500, 1900) + '" alt="' + g.title + '"></div><div class="viewerInfo"><small>' + g.tag + '</small><h3>' + g.title + '</h3><p>Colección visual con enfoque editorial, color cuidado y lectura profesional para entrega digital.</p><div class="viewerActions"><button data-prev>Anterior</button><button data-next>Siguiente</button></div></div></div>';
      viewer.hidden = false;
    }
    section.addEventListener('click', function (event) {
      var filter = event.target.closest('[data-gallery]');
      var shot = event.target.closest('[data-shot]');
      if (filter) { active = Number(filter.getAttribute('data-gallery')); render(); }
      if (shot) { openViewer(Number(shot.getAttribute('data-shot'))); }
    });
    viewer.addEventListener('click', function (event) {
      var g = galleries[active];
      if (event.target === viewer || event.target.classList.contains('viewerClose')) viewer.hidden = true;
      if (event.target.closest('[data-next]')) openViewer((modalIndex + 1) % g.locks.length);
      if (event.target.closest('[data-prev]')) openViewer((modalIndex - 1 + g.locks.length) % g.locks.length);
    });
    render();
  }

  addHeroLayoutFix();
  addPortfolioGallery();

  function init() {
    var track = document.querySelector('.mockRibbonTrack');
    if (!track) { window.setTimeout(init, 250); return; }
    if (track.getAttribute('data-drag-ready') === 'true') return;
    track.setAttribute('data-drag-ready', 'true');
    var duration = 46, progress = 0, lastTime = performance.now(), down = false, startX = 0, startProgress = 0, wheelVelocity = 0;
    function loopWidth() { return Math.max(1, track.scrollWidth / 2); }
    function wrap(value) { value = value % 1; return value < 0 ? value + 1 : value; }
    function apply() { track.style.transform = 'translate3d(' + (-progress * loopWidth()) + 'px,0,0)'; }
    track.addEventListener('mousedown', function (event) { down = true; wheelVelocity = 0; startX = event.clientX; startProgress = progress; track.classList.add('dragging'); });
    window.addEventListener('mousemove', function (event) { if (!down) return; event.preventDefault(); progress = wrap(startProgress - ((event.clientX - startX) / loopWidth()) * 0.85); apply(); });
    window.addEventListener('mouseup', function () { if (!down) return; down = false; track.classList.remove('dragging'); });
    track.addEventListener('wheel', function (event) { if (Math.abs(event.deltaX) <= Math.abs(event.deltaY) || event.deltaX === 0) return; event.preventDefault(); wheelVelocity += (event.deltaX / loopWidth()) * 0.12; if (wheelVelocity > 0.006) wheelVelocity = 0.006; if (wheelVelocity < -0.006) wheelVelocity = -0.006; }, { passive: false });
    function tick(now) { var dt = Math.min(48, now - lastTime) / 1000; lastTime = now; if (!down && !document.hidden) { if (Math.abs(wheelVelocity) > 0.00001) { progress = wrap(progress + wheelVelocity); wheelVelocity *= 0.82; } else { progress = wrap(progress + dt / duration); } apply(); } window.requestAnimationFrame(tick); }
    apply(); window.requestAnimationFrame(tick);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { addPortfolioGallery(); init(); });
  else init();
})();
