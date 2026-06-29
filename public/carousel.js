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

  function addExperienceExplorer() {
    if (document.getElementById('experiencias')) return;
    var anchor = document.querySelector('.collectionPanels');
    if (!anchor || !anchor.parentNode) {
      window.setTimeout(addExperienceExplorer, 250);
      return;
    }

    if (!document.getElementById('experience-explorer-style')) {
      var css = document.createElement('style');
      css.id = 'experience-explorer-style';
      css.textContent = [
        '.experienceExplorer{background:#090807;color:#fff;padding:clamp(72px,8vw,118px) clamp(18px,6vw,86px);overflow:hidden;position:relative}',
        '.experienceExplorer:before{content:"";position:absolute;inset:-10% -8% auto;height:54%;background:radial-gradient(circle at 16% 12%,rgba(216,162,58,.14),transparent 35%),radial-gradient(circle at 80% 4%,rgba(255,255,255,.07),transparent 30%);pointer-events:none}',
        '.experienceShell{position:relative;display:grid;grid-template-columns:minmax(280px,.78fr) minmax(520px,1.22fr);gap:clamp(28px,5vw,76px);align-items:start}',
        '.experienceIntro{position:sticky;top:96px}.experienceIntro .eyebrow{color:var(--gold2)}.experienceIntro h2{font-size:clamp(38px,5vw,78px)}.experienceIntro p{color:rgba(255,255,255,.68);font-size:18px;line-height:1.7;max-width:520px}',
        '.experienceTabs{display:grid;gap:10px;margin-top:26px}.experienceTab{border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.06);color:#fff;border-radius:22px;padding:16px 18px;text-align:left;cursor:pointer;display:flex;justify-content:space-between;gap:16px;align-items:center;transition:transform .22s ease,background .22s ease,border-color .22s ease}.experienceTab strong{font-size:15px}.experienceTab span{color:rgba(255,255,255,.52);font-size:12px;font-weight:900;letter-spacing:1.6px;text-transform:uppercase}.experienceTab:hover{transform:translateX(4px);background:rgba(255,255,255,.09)}.experienceTab.active{background:linear-gradient(135deg,rgba(216,162,58,.92),rgba(255,231,163,.88));color:#1b1205;border-color:rgba(255,231,163,.5)}.experienceTab.active span{color:rgba(27,18,5,.66)}',
        '.experiencePanel{border:1px solid rgba(255,255,255,.12);background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.035));border-radius:38px;padding:14px;box-shadow:0 28px 90px rgba(0,0,0,.32);backdrop-filter:blur(18px)}',
        '.experienceHero{position:relative;height:min(62vh,620px);min-height:420px;border-radius:30px;overflow:hidden;background:#111}.experienceHero img{width:100%;height:100%;object-fit:cover;display:block;filter:saturate(1.04) contrast(1.02);transform:scale(1.01);transition:opacity .24s ease,transform .7s ease}.experienceHero:hover img{transform:scale(1.045)}.experienceHero:after{content:"";position:absolute;inset:0;background:linear-gradient(0deg,rgba(0,0,0,.82),rgba(0,0,0,.12) 46%,transparent 72%)}',
        '.experienceCaption{position:absolute;z-index:2;left:0;right:0;bottom:0;padding:clamp(22px,3vw,34px);display:grid;gap:10px}.experienceCaption small{color:var(--gold2);font-weight:950;letter-spacing:2px;text-transform:uppercase}.experienceCaption h3{font-size:clamp(30px,4vw,58px)}.experienceCaption p{margin:0;color:rgba(255,255,255,.72);line-height:1.55;max-width:650px}',
        '.experienceThumbs{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:12px}.experienceThumb{height:140px;border:0;border-radius:22px;overflow:hidden;padding:0;background:#111;cursor:pointer;position:relative;box-shadow:0 18px 45px rgba(0,0,0,.22)}.experienceThumb img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .45s ease,filter .25s ease;filter:saturate(.9) brightness(.88)}.experienceThumb:hover img,.experienceThumb.active img{transform:scale(1.08);filter:saturate(1.08) brightness(1)}.experienceThumb.active:after{content:"";position:absolute;inset:0;border:2px solid var(--gold2);border-radius:22px}',
        '.experienceMeta{display:flex;flex-wrap:wrap;gap:10px;margin-top:14px}.experienceMeta span{border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.06);border-radius:999px;padding:10px 13px;color:rgba(255,255,255,.72);font-weight:900;font-size:12px;letter-spacing:.6px}',
        '@media(max-width:980px){.experienceShell{grid-template-columns:1fr}.experienceIntro{position:relative;top:auto}.experienceHero{height:520px}}@media(max-width:620px){.experienceExplorer{padding-inline:18px}.experienceHero{min-height:360px;height:430px}.experienceThumbs{grid-template-columns:repeat(2,1fr)}.experienceThumb{height:118px}}'
      ].join('\n');
      document.head.appendChild(css);
    }

    var galleries = [
      { key: 'bodas', title: 'Bodas', tag: 'Wedding Story', text: 'Preparación, ceremonia, retratos de pareja, familia, fiesta y detalles con una lectura elegante y emocional.', meta: ['Ceremonia', 'Pareja', 'Fiesta', 'Detalles'], images: ['wedding','bride','rings','wedding-party'] },
      { key: 'quince', title: 'Quinceaños', tag: 'Quince Story', text: 'Entrada, vestido, retratos, vals, familia y momentos principales organizados para una entrega premium.', meta: ['Retratos', 'Vals', 'Familia', 'Decoración'], images: ['quince','vals','dress','quince-party'] },
      { key: 'sesiones', title: 'Sesiones', tag: 'Portrait Session', text: 'Retratos personales, editoriales, urbanos o de marca con dirección de pose, luz y composición.', meta: ['Retrato', 'Urbano', 'Marca', 'Editorial'], images: ['portrait','studio','model','brand'] },
      { key: 'naturaleza', title: 'Naturaleza', tag: 'Galápagos Nature', text: 'Fauna, paisaje, aventura y vida silvestre con estilo documental, limpio y cinematográfico.', meta: ['Fauna', 'Paisaje', 'Aventura', 'Fine art'], images: ['travel','wildlife','sea-lion','galapagos'] }
    ];
    var selected = 0;
    var photo = 0;
    var seaLion = 'https://blogger.googleusercontent.com/img/a/AVvXsEijmDWn4oCDM4prrw9f1pezhlyJJVqI4Mpe2xmRwzxMfWypqpEilpAhg54z_ZXUfbZXto-QPVC02H-SUQFT5T0WULTbHma6hODuKZVRJnBG2royWc0m-c1QqXpzSQ3nxQ43-RTYrdnn4Wb3RlROi0QoOKLOXb7c69wPYkvbMhaLEYFQTECs7stnJRBr7WI';
    function image(seed, index) {
      if (seed === 'sea-lion') return seaLion;
      return 'https://picsum.photos/seed/bystiven-' + seed + '-' + index + '/1400/1700';
    }

    var section = document.createElement('section');
    section.id = 'experiencias';
    section.className = 'experienceExplorer';
    section.innerHTML = '<div class="experienceShell"><div class="experienceIntro"><p class="eyebrow">Galerías por experiencia</p><h2>Explora el portafolio según lo que quieres contratar.</h2><p>Aquí se separan las fotos por tipo de trabajo: bodas, quinceaños, sesiones y naturaleza. Así el cliente entiende rápido dónde mirar y qué estilo esperar.</p><div class="experienceTabs"></div></div><div class="experiencePanel"><div class="experienceHero"></div><div class="experienceThumbs"></div><div class="experienceMeta"></div></div></div>';
    anchor.parentNode.insertBefore(section, anchor.nextSibling);

    var tabs = section.querySelector('.experienceTabs');
    var hero = section.querySelector('.experienceHero');
    var thumbs = section.querySelector('.experienceThumbs');
    var meta = section.querySelector('.experienceMeta');

    function draw() {
      var item = galleries[selected];
      tabs.innerHTML = galleries.map(function (g, i) { return '<button class="experienceTab ' + (i === selected ? 'active' : '') + '" data-gallery="' + i + '"><strong>' + g.title + '</strong><span>' + g.tag + '</span></button>'; }).join('');
      hero.innerHTML = '<img src="' + image(item.images[photo], photo) + '" alt="' + item.title + '"><div class="experienceCaption"><small>' + item.tag + '</small><h3>' + item.title + '</h3><p>' + item.text + '</p></div>';
      thumbs.innerHTML = item.images.map(function (seed, i) { return '<button class="experienceThumb ' + (i === photo ? 'active' : '') + '" data-photo="' + i + '" aria-label="Ver foto ' + (i + 1) + ' de ' + item.title + '"><img src="' + image(seed, i) + '" alt="' + item.title + ' ' + (i + 1) + '"></button>'; }).join('');
      meta.innerHTML = item.meta.map(function (m) { return '<span>' + m + '</span>'; }).join('');
    }

    section.addEventListener('click', function (event) {
      var tab = event.target.closest('[data-gallery]');
      var thumb = event.target.closest('[data-photo]');
      if (tab) { selected = Number(tab.getAttribute('data-gallery')); photo = 0; draw(); }
      if (thumb) { photo = Number(thumb.getAttribute('data-photo')); draw(); }
    });

    draw();
  }

  addHeroLayoutFix();
  addExperienceExplorer();

  function init() {
    var track = document.querySelector('.mockRibbonTrack');
    if (!track) {
      window.setTimeout(init, 250);
      return;
    }
    if (track.getAttribute('data-drag-ready') === 'true') return;
    track.setAttribute('data-drag-ready', 'true');

    var duration = 46;
    var progress = 0;
    var lastTime = performance.now();
    var down = false;
    var startX = 0;
    var startProgress = 0;
    var wheelVelocity = 0;

    function loopWidth() { return Math.max(1, track.scrollWidth / 2); }
    function wrap(value) { value = value % 1; return value < 0 ? value + 1 : value; }
    function apply() { track.style.transform = 'translate3d(' + (-progress * loopWidth()) + 'px,0,0)'; }
    function onDown(event) { down = true; wheelVelocity = 0; startX = event.clientX; startProgress = progress; track.classList.add('dragging'); }
    function onMove(event) { if (!down) return; event.preventDefault(); progress = wrap(startProgress - ((event.clientX - startX) / loopWidth()) * 0.85); apply(); }
    function onUp() { if (!down) return; down = false; track.classList.remove('dragging'); }

    track.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    track.addEventListener('wheel', function (event) {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY) || event.deltaX === 0) return;
      event.preventDefault();
      wheelVelocity += (event.deltaX / loopWidth()) * 0.12;
      if (wheelVelocity > 0.006) wheelVelocity = 0.006;
      if (wheelVelocity < -0.006) wheelVelocity = -0.006;
    }, { passive: false });

    function tick(now) {
      var dt = Math.min(48, now - lastTime) / 1000;
      lastTime = now;
      if (!down && !document.hidden) {
        if (Math.abs(wheelVelocity) > 0.00001) { progress = wrap(progress + wheelVelocity); wheelVelocity *= 0.82; }
        else { progress = wrap(progress + dt / duration); }
        apply();
      }
      window.requestAnimationFrame(tick);
    }
    apply();
    window.requestAnimationFrame(tick);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { addExperienceExplorer(); init(); });
  else init();
})();
