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

  function addPortfolioExplorer() {
    if (document.getElementById('experiencias')) return;
    var anchor = document.querySelector('.collectionPanels');
    if (!anchor || !anchor.parentNode) { window.setTimeout(addPortfolioExplorer, 250); return; }

    var seaLion = 'https://blogger.googleusercontent.com/img/a/AVvXsEijmDWn4oCDM4prrw9f1pezhlyJJVqI4Mpe2xmRwzxMfWypqpEilpAhg54z_ZXUfbZXto-QPVC02H-SUQFT5T0WULTbHma6hODuKZVRJnBG2royWc0m-c1QqXpzSQ3nxQ43-RTYrdnn4Wb3RlROi0QoOKLOXb7c69wPYkvbMhaLEYFQTECs7stnJRBr7WI';
    function img(seed, index, w, h) {
      if (seed === 'sea-lion') return seaLion;
      return 'https://picsum.photos/seed/bystiven-' + seed + '-' + index + '/' + (w || 1200) + '/' + (h || 1500);
    }

    var albums = [
      { title:'Bodas', count:10, cover:'wedding-editorial', intro:'Una historia de principio a fin: preparación, ceremonia, pareja, detalles y fiesta.', tags:['Preparación','Ceremonia','Pareja','Fiesta'], photos:['prep-wedding','bride-window','wedding-rings','ceremony-light','couple-sunset','wedding-table','first-dance','party-light','family-wedding','wedding-exit'] },
      { title:'Quinceaños', count:15, cover:'quince-cover', intro:'Retratos, vestido, entrada, vals, familia, amigas y fiesta con entrega tipo galería premium.', tags:['Vestido','Retratos','Vals','Familia'], photos:['quince-dress','quince-window','quince-crown','quince-entry','quince-portrait','quince-vals','quince-family','quince-friends','quince-decor','quince-party','quince-night','quince-detail','quince-stage','quince-mom','quince-editorial'] },
      { title:'Sesiones', count:7, cover:'portrait-cover', intro:'Sesiones personales, urbanas, editoriales o de marca con dirección de pose y estética limpia.', tags:['Editorial','Urbano','Marca','Pareja'], photos:['portrait-editorial','urban-session','brand-session','studio-light','couple-session','city-portrait','product-brand'] },
      { title:'Naturaleza', count:28, cover:'sea-lion', intro:'Fauna, paisaje y aventura en Galápagos con una mirada documental y fine art.', tags:['Fauna','Paisaje','Aventura','Fine art'], photos:['sea-lion','wildlife-bird','galapagos-coast','island-sunset','iguana','turtle','cliffs','boat-trip','trail','black-white-nature','ocean-rock','nature-detail','bird-flight','lava-coast','green-island','sunset-bay'] }
    ];

    var active = 0;
    var modalIndex = 0;

    var section = document.createElement('section');
    section.id = 'experiencias';
    section.className = 'portfolioStudio';
    section.innerHTML = '<div class="studioHead"><p class="eyebrow">Colecciones del portafolio</p><h2>El cliente entra, curiosea y entiende rápido lo que haces.</h2><p>En vez de una sola galería plana, cada servicio se presenta como una colección editorial con mini recorrido visual.</p></div><div class="albumDeck"></div><div class="albumWall"></div>';
    anchor.parentNode.insertBefore(section, anchor.nextSibling);

    var css = document.createElement('style');
    css.id = 'portfolio-studio-style';
    css.textContent = [
      '.portfolioStudio{position:relative;overflow:hidden;background:#080706;color:#fff;padding:clamp(76px,8vw,124px) clamp(18px,6vw,86px)}',
      '.portfolioStudio:before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 14% 8%,rgba(216,162,58,.14),transparent 30%),linear-gradient(180deg,#080706 0%,#0f0d0a 55%,#080706 100%);pointer-events:none}',
      '.studioHead{position:relative;max-width:1120px;margin:0 auto 34px;display:grid;grid-template-columns:minmax(260px,.9fr) minmax(280px,.72fr);gap:clamp(20px,4vw,58px);align-items:end}.studioHead .eyebrow{color:var(--gold2)}.studioHead h2{font-size:clamp(38px,5vw,78px);max-width:780px}.studioHead p:last-child{color:rgba(255,255,255,.66);font-size:18px;line-height:1.65;margin:0}',
      '.albumDeck{position:relative;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;max-width:1420px;margin:0 auto 18px}.albumCard{position:relative;min-height:390px;border:1px solid rgba(255,255,255,.12);border-radius:34px;overflow:hidden;background:#14110e;color:#fff;cursor:pointer;text-align:left;padding:0;box-shadow:0 28px 80px rgba(0,0,0,.28);isolation:isolate}.albumCard img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:saturate(.95) brightness(.78);transition:transform .8s ease,filter .3s ease}.albumCard:after{content:"";position:absolute;inset:0;background:linear-gradient(0deg,rgba(0,0,0,.86),rgba(0,0,0,.25) 55%,rgba(0,0,0,.06))}.albumCard:hover img,.albumCard.active img{transform:scale(1.06);filter:saturate(1.06) brightness(.92)}.albumCard.active{border-color:rgba(255,231,163,.82)}.albumInfo{position:absolute;z-index:2;inset:auto 0 0 0;padding:24px}.albumInfo small{color:var(--gold2);font-weight:950;letter-spacing:2px;text-transform:uppercase}.albumInfo h3{font-size:clamp(26px,2.8vw,42px);margin:10px 0}.albumInfo p{margin:0;color:rgba(255,255,255,.72);line-height:1.45;font-size:14px}.albumTags{display:flex;gap:7px;flex-wrap:wrap;margin-top:14px}.albumTags span{font-size:11px;font-weight:950;border-radius:999px;padding:7px 9px;background:rgba(255,255,255,.11)}.albumCount{position:absolute;z-index:3;top:18px;left:18px;border-radius:999px;background:rgba(0,0,0,.42);border:1px solid rgba(255,255,255,.16);padding:9px 12px;font-size:12px;font-weight:950;backdrop-filter:blur(10px)}',
      '.albumWall{position:relative;max-width:1420px;margin:0 auto;border:1px solid rgba(255,255,255,.12);background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.035));border-radius:38px;padding:16px;box-shadow:0 30px 90px rgba(0,0,0,.3)}.wallTop{display:flex;justify-content:space-between;align-items:end;gap:18px;padding:12px 10px 18px}.wallTop h3{font-size:clamp(30px,4vw,58px)}.wallTop p{max-width:620px;color:rgba(255,255,255,.64);line-height:1.55;margin:8px 0 0}.wallTop .hint{color:var(--gold2);font-weight:950;letter-spacing:2px;text-transform:uppercase;font-size:12px;white-space:nowrap}',
      '.mosaic{display:grid;grid-template-columns:repeat(6,1fr);grid-auto-rows:158px;gap:10px}.mosaicTile{position:relative;border:0;border-radius:24px;overflow:hidden;padding:0;background:#111;cursor:zoom-in;box-shadow:0 16px 44px rgba(0,0,0,.24)}.mosaicTile.big{grid-column:span 2;grid-row:span 2}.mosaicTile.wide{grid-column:span 2}.mosaicTile.tall{grid-row:span 2}.mosaicTile img{width:100%;height:100%;object-fit:cover;display:block;filter:saturate(.94) brightness(.9);transition:transform .55s ease,filter .3s ease}.mosaicTile:hover img{transform:scale(1.08);filter:saturate(1.06) brightness(1)}.mosaicTile:after{content:"";position:absolute;inset:0;background:linear-gradient(0deg,rgba(0,0,0,.62),transparent 55%);opacity:.9}.tileLabel{position:absolute;z-index:2;left:12px;right:12px;bottom:11px;display:flex;justify-content:space-between;gap:12px;color:#fff;font-weight:950;font-size:12px;text-shadow:0 2px 8px rgba(0,0,0,.7)}.tileLabel span:last-child{color:var(--gold2)}',
      '.storyModal{position:fixed;inset:0;z-index:200;background:rgba(0,0,0,.92);display:grid;place-items:center;padding:24px}.storyModal[hidden]{display:none}.storyModalInner{width:min(1180px,100%);display:grid;grid-template-columns:minmax(0,1fr) 320px;gap:18px;align-items:stretch}.storyModalImg{border-radius:28px;overflow:hidden;background:#111;min-height:68vh}.storyModalImg img{width:100%;height:100%;object-fit:contain;display:block}.storyModalInfo{border:1px solid rgba(255,255,255,.12);border-radius:28px;background:rgba(255,255,255,.07);padding:24px;color:#fff}.storyModalInfo small{color:var(--gold2);font-weight:950;letter-spacing:2px;text-transform:uppercase}.storyModalInfo h3{font-size:34px;margin:14px 0}.storyModalInfo p{color:rgba(255,255,255,.68);line-height:1.6}.storyModalActions{display:flex;gap:10px;margin-top:20px}.storyModalActions button,.storyClose{border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.1);color:#fff;border-radius:999px;padding:11px 14px;font-weight:950;cursor:pointer}.storyClose{position:fixed;top:18px;right:18px;width:46px;height:46px;padding:0;font-size:24px}',
      '@media(max-width:1100px){.albumDeck{grid-template-columns:repeat(2,1fr)}.studioHead{grid-template-columns:1fr}.mosaic{grid-template-columns:repeat(3,1fr)}.storyModalInner{grid-template-columns:1fr}.storyModalInfo{display:none}}@media(max-width:640px){.portfolioStudio{padding-inline:18px}.albumDeck{grid-template-columns:1fr}.albumCard{min-height:330px}.wallTop{display:block}.mosaic{grid-template-columns:repeat(2,1fr);grid-auto-rows:132px}.mosaicTile.big,.mosaicTile.wide,.mosaicTile.tall{grid-column:span 1;grid-row:span 1}}'
    ].join('\n');
    document.head.appendChild(css);

    var deck = section.querySelector('.albumDeck');
    var wall = section.querySelector('.albumWall');
    var modal = document.createElement('div');
    modal.className = 'storyModal';
    modal.hidden = true;
    document.body.appendChild(modal);

    function tileClass(i) { return i === 0 ? 'big' : (i % 7 === 0 ? 'wide' : (i % 5 === 0 ? 'tall' : '')); }
    function render() {
      deck.innerHTML = albums.map(function (a, i) {
        return '<button class="albumCard ' + (i === active ? 'active' : '') + '" data-album="' + i + '"><img src="' + img(a.cover, 0, 1100, 1400) + '" alt="' + a.title + '"><span class="albumCount">' + a.count + ' fotos aprox.</span><div class="albumInfo"><small>' + a.tag + '</small><h3>' + a.title + '</h3><p>' + a.intro + '</p><div class="albumTags">' + a.tags.map(function (t) { return '<span>' + t + '</span>'; }).join('') + '</div></div></button>';
      }).join('');
      var a = albums[active];
      wall.innerHTML = '<div class="wallTop"><div><span class="hint">Colección activa</span><h3>' + a.title + '</h3><p>' + a.intro + '</p></div><span class="hint">Haz clic para ampliar</span></div><div class="mosaic">' + a.photos.map(function (p, i) {
        return '<button class="mosaicTile ' + tileClass(i) + '" data-photo="' + i + '"><img src="' + img(p, i, 900, 1200) + '" alt="' + a.title + ' ' + (i + 1) + '"><span class="tileLabel"><span>' + String(i + 1).padStart(2, '0') + '</span><span>' + a.title + '</span></span></button>';
      }).join('') + '</div>';
    }
    function openModal(index) {
      modalIndex = index;
      var a = albums[active];
      var photo = a.photos[modalIndex];
      modal.innerHTML = '<button class="storyClose" type="button">×</button><div class="storyModalInner"><div class="storyModalImg"><img src="' + img(photo, modalIndex, 1500, 1900) + '" alt="' + a.title + '"></div><div class="storyModalInfo"><small>' + a.tag + '</small><h3>' + a.title + '</h3><p>Vista ampliada de la colección. La idea es que el cliente pueda recorrer la experiencia como una entrega real, no solo ver una tarjeta suelta.</p><div class="storyModalActions"><button data-prev>Anterior</button><button data-next>Siguiente</button></div></div></div>';
      modal.hidden = false;
    }
    section.addEventListener('click', function (event) {
      var album = event.target.closest('[data-album]');
      var photo = event.target.closest('[data-photo]');
      if (album) { active = Number(album.getAttribute('data-album')); render(); wall.scrollIntoView({ behavior:'smooth', block:'center' }); }
      if (photo) openModal(Number(photo.getAttribute('data-photo')));
    });
    modal.addEventListener('click', function (event) {
      var a = albums[active];
      if (event.target.classList.contains('storyClose') || event.target === modal) modal.hidden = true;
      if (event.target.closest('[data-next]')) openModal((modalIndex + 1) % a.photos.length);
      if (event.target.closest('[data-prev]')) openModal((modalIndex - 1 + a.photos.length) % a.photos.length);
    });
    render();
  }

  addHeroLayoutFix();
  addPortfolioExplorer();

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

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { addPortfolioExplorer(); init(); });
  else init();
})();
