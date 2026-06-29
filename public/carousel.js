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
    function pic(seed, index, w, h) {
      if (seed === 'sea-lion') return seaLion;
      return 'https://picsum.photos/seed/bystiven-' + seed + '-' + index + '/' + (w || 1200) + '/' + (h || 1500);
    }

    var data = [
      { key:'bodas', title:'Bodas', count:10, tag:'Wedding Story', intro:'Desde la preparación hasta la fiesta: una historia completa, elegante y emocional.', moments:['Todo','Preparación','Ceremonia','Pareja','Detalles','Fiesta'], shots:[
        ['preparacion','Preparación','La historia empieza con detalles, nervios y ambiente.'],['ceremonia','Ceremonia','Momentos clave, entrada, votos y familia.'],['pareja','Pareja','Retratos editoriales con dirección y movimiento.'],['rings','Detalles','Anillos, decoración, mesa y textura visual.'],['wedding-party','Fiesta','Baile, invitados, energía y cierre.'],['bride','Preparación','Vestido, maquillaje y momentos íntimos.'],['church','Ceremonia','Escena amplia y narrativa documental.'],['couple-sunset','Pareja','Sesión cálida para portada de galería.'],['table-event','Detalles','Ambientación y estilo del evento.'],['dance-night','Fiesta','Celebración con luz y movimiento.']
      ]},
      { key:'quince', title:'Quinceaños', count:15, tag:'Quince Story', intro:'Vestido, entrada, retratos, vals, familia y fiesta organizados como una entrega premium.', moments:['Todo','Vestido','Retratos','Entrada','Vals','Familia','Fiesta'], shots:[
        ['quince-dress','Vestido','Vestido, preparación y detalles importantes.'],['quince-portrait','Retratos','Retratos principales con mirada editorial.'],['quince-entry','Entrada','Entrada y reacción del público.'],['vals','Vals','Vals, padre, familia y emoción.'],['quince-family','Familia','Fotos familiares limpias y bien dirigidas.'],['quince-party','Fiesta','Ambiente, luces y celebración.'],['quince-crown','Vestido','Corona, accesorios y elementos simbólicos.'],['quince-window','Retratos','Retrato suave con luz natural.'],['quince-stage','Entrada','Decoración y escenario de entrada.'],['quince-dance','Vals','Movimiento y elegancia en pista.'],['quince-mom','Familia','Momentos con mamá y familiares.'],['quince-friends','Fiesta','Amigas, risas y espontáneos.'],['quince-detail','Vestido','Detalles del vestido y textura.'],['quince-editorial','Retratos','Imagen protagonista para portada.'],['quince-night','Fiesta','Cierre nocturno y energía.']
      ]},
      { key:'sesiones', title:'Sesiones', count:7, tag:'Portrait Session', intro:'Retratos personales, editoriales o de marca con dirección de pose, luz y composición.', moments:['Todo','Editorial','Urbano','Marca','Pareja'], shots:[
        ['portrait-editorial','Editorial','Retrato editorial para imagen personal.'],['urban-session','Urbano','Sesión en calle con estilo moderno.'],['brand-session','Marca','Fotos para redes, perfil y emprendimiento.'],['couple-session','Pareja','Sesión de pareja con dirección natural.'],['studio-light','Editorial','Luz controlada y composición limpia.'],['city-portrait','Urbano','Retrato casual con fondo urbano.'],['product-brand','Marca','Imagen comercial y detalle visual.']
      ]},
      { key:'naturaleza', title:'Naturaleza', count:28, tag:'Galápagos Nature', intro:'Fauna, paisaje, aventura y vida silvestre con mirada documental y estética fine art.', moments:['Todo','Fauna','Paisaje','Aventura','Fine art'], shots:[
        ['sea-lion','Fauna','Vida silvestre con estética fine art.'],['wildlife-bird','Fauna','Aves, movimiento y ambiente natural.'],['galapagos-coast','Paisaje','Costa, roca volcánica y mar.'],['travel-adventure','Aventura','Recorrido, exploración y narrativa.'],['nature-detail','Fine art','Texturas naturales en composición limpia.'],['turtle','Fauna','Encuentros naturales y documentales.'],['island-sunset','Paisaje','Atardecer y atmósfera de isla.'],['boat-trip','Aventura','Viaje, mar y experiencia.'],['black-white-nature','Fine art','Blanco y negro, forma y contraste.'],['iguana','Fauna','Fauna icónica y detalle.'],['cliffs','Paisaje','Escala, cielo y profundidad.'],['trail','Aventura','Ruta, movimiento y exploración.']
      ]}
    ];

    var section = document.createElement('section');
    section.id = 'experiencias';
    section.className = 'experienceExplorer';
    section.innerHTML = '<div class="experienceShell"><div class="experienceIntro"><p class="eyebrow">Mapa del portafolio</p><h2>Curiosea cada tipo de trabajo por momentos.</h2><p>El cliente no solo ve una foto bonita: puede entrar a bodas, quinceaños, sesiones o naturaleza y revisar cómo se desglosa cada historia.</p><div class="experienceCategories"></div></div><div class="experienceBoard"><div class="boardTop"></div><div class="momentFilters"></div><div class="shotGrid"></div></div></div>';
    anchor.parentNode.insertBefore(section, anchor.nextSibling);

    var css = document.createElement('style');
    css.id = 'portfolio-explorer-style';
    css.textContent = [
      '.experienceExplorer{position:relative;overflow:hidden;background:#090807;color:#fff;padding:clamp(70px,8vw,112px) clamp(18px,6vw,86px)}',
      '.experienceExplorer:before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 10% 10%,rgba(216,162,58,.12),transparent 30%),radial-gradient(circle at 88% 0%,rgba(255,255,255,.06),transparent 28%);pointer-events:none}',
      '.experienceShell{position:relative;display:grid;grid-template-columns:minmax(280px,.74fr) minmax(560px,1.26fr);gap:clamp(26px,5vw,70px);align-items:start}',
      '.experienceIntro{position:sticky;top:92px}.experienceIntro .eyebrow{color:var(--gold2)}.experienceIntro h2{font-size:clamp(34px,4.2vw,66px);line-height:.96}.experienceIntro p{color:rgba(255,255,255,.68);font-size:17px;line-height:1.68;max-width:520px}',
      '.experienceCategories{display:grid;gap:12px;margin-top:26px}.experienceCategory{width:100%;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.055);color:#fff;border-radius:26px;padding:18px;text-align:left;cursor:pointer;transition:transform .22s ease,background .22s ease,border-color .22s ease}.experienceCategory:hover{transform:translateX(5px);background:rgba(255,255,255,.085)}.experienceCategory.active{background:linear-gradient(135deg,rgba(216,162,58,.95),rgba(255,231,163,.9));color:#1a1104;border-color:rgba(255,231,163,.7)}.categoryLine{display:flex;justify-content:space-between;gap:14px;align-items:center}.categoryLine strong{font-size:20px}.categoryCount{font-size:12px;font-weight:950;letter-spacing:1.2px;text-transform:uppercase;opacity:.72}.categoryMini{display:flex;flex-wrap:wrap;gap:7px;margin-top:12px}.categoryMini span{font-size:11px;font-weight:900;border-radius:999px;padding:7px 9px;background:rgba(255,255,255,.08);color:rgba(255,255,255,.64)}.experienceCategory.active .categoryMini span{background:rgba(0,0,0,.1);color:rgba(26,17,4,.68)}',
      '.experienceBoard{border:1px solid rgba(255,255,255,.12);border-radius:38px;background:linear-gradient(180deg,rgba(255,255,255,.075),rgba(255,255,255,.035));padding:14px;box-shadow:0 30px 90px rgba(0,0,0,.32);backdrop-filter:blur(18px)}',
      '.boardTop{position:relative;border-radius:30px;overflow:hidden;min-height:360px;background:#111}.boardTop img{width:100%;height:480px;max-height:58vh;object-fit:cover;display:block;filter:saturate(1.04) contrast(1.02);transition:transform .65s ease}.boardTop:hover img{transform:scale(1.035)}.boardTop:after{content:"";position:absolute;inset:0;background:linear-gradient(0deg,rgba(0,0,0,.86),rgba(0,0,0,.20) 52%,transparent 76%)}.boardCaption{position:absolute;z-index:2;left:0;right:0;bottom:0;padding:clamp(22px,3vw,34px)}.boardCaption small{color:var(--gold2);font-weight:950;letter-spacing:2px;text-transform:uppercase}.boardCaption h3{font-size:clamp(30px,4vw,58px);margin-top:8px}.boardCaption p{max-width:720px;margin:10px 0 0;color:rgba(255,255,255,.74);line-height:1.55}.boardStats{position:absolute;top:18px;left:18px;z-index:3;display:flex;gap:9px;flex-wrap:wrap}.boardStats span{border:1px solid rgba(255,255,255,.16);background:rgba(0,0,0,.34);backdrop-filter:blur(12px);border-radius:999px;padding:9px 12px;font-size:12px;font-weight:950;letter-spacing:.9px}',
      '.momentFilters{display:flex;gap:9px;flex-wrap:wrap;margin:14px 0}.momentFilters button{border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.06);color:rgba(255,255,255,.78);border-radius:999px;padding:10px 13px;font-weight:950;cursor:pointer}.momentFilters button.active{background:var(--gold);color:#1d1202;border-color:var(--gold)}',
      '.shotGrid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.shotTile{position:relative;border:0;border-radius:22px;overflow:hidden;background:#111;padding:0;height:165px;cursor:pointer;text-align:left;box-shadow:0 16px 42px rgba(0,0,0,.24)}.shotTile:nth-child(5n+1){height:220px}.shotTile img{width:100%;height:100%;object-fit:cover;display:block;filter:saturate(.92) brightness(.9);transition:transform .45s ease,filter .25s ease}.shotTile:hover img,.shotTile.active img{transform:scale(1.08);filter:saturate(1.06) brightness(1)}.shotTile.active:after{content:"";position:absolute;inset:0;border:2px solid var(--gold2);border-radius:22px}.shotLabel{position:absolute;left:10px;right:10px;bottom:10px;z-index:2;color:#fff;background:linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,.72));padding-top:36px;font-size:12px;font-weight:950;text-shadow:0 2px 8px rgba(0,0,0,.6)}',
      '@media(max-width:980px){.experienceShell{grid-template-columns:1fr}.experienceIntro{position:relative;top:auto}.boardTop img{height:430px}.shotGrid{grid-template-columns:repeat(3,1fr)}}@media(max-width:620px){.experienceExplorer{padding-inline:18px}.boardTop img{height:360px}.shotGrid{grid-template-columns:repeat(2,1fr)}.shotTile,.shotTile:nth-child(5n+1){height:135px}}'
    ].join('\n');
    document.head.appendChild(css);

    var active = 0;
    var filter = 'Todo';
    var selected = 0;
    var categories = section.querySelector('.experienceCategories');
    var top = section.querySelector('.boardTop');
    var filters = section.querySelector('.momentFilters');
    var grid = section.querySelector('.shotGrid');

    function shotList() {
      var shots = data[active].shots;
      return filter === 'Todo' ? shots : shots.filter(function (s) { return s[1] === filter; });
    }

    function render() {
      var cat = data[active];
      var shots = shotList();
      if (selected >= shots.length) selected = 0;
      var shot = shots[selected] || cat.shots[0];
      categories.innerHTML = data.map(function (c, i) {
        return '<button class="experienceCategory ' + (i === active ? 'active' : '') + '" data-cat="' + i + '"><div class="categoryLine"><strong>' + c.title + '</strong><span class="categoryCount">' + c.count + ' fotos</span></div><div class="categoryMini">' + c.moments.slice(1,5).map(function (m) { return '<span>' + m + '</span>'; }).join('') + '</div></button>';
      }).join('');
      top.innerHTML = '<img src="' + pic(shot[0], selected, 1400, 1700) + '" alt="' + cat.title + '"><div class="boardStats"><span>' + cat.count + ' fotos aprox.</span><span>' + cat.tag + '</span><span>' + filter + '</span></div><div class="boardCaption"><small>' + shot[1] + '</small><h3>' + cat.title + '</h3><p>' + shot[2] + ' ' + cat.intro + '</p></div>';
      filters.innerHTML = cat.moments.map(function (m) { return '<button class="' + (m === filter ? 'active' : '') + '" data-filter="' + m + '">' + m + '</button>'; }).join('');
      grid.innerHTML = shots.map(function (s, i) { return '<button class="shotTile ' + (i === selected ? 'active' : '') + '" data-shot="' + i + '"><img src="' + pic(s[0], i, 900, 1200) + '" alt="' + s[1] + '"><span class="shotLabel">' + String(i + 1).padStart(2, '0') + ' · ' + s[1] + '</span></button>'; }).join('');
    }

    section.addEventListener('click', function (event) {
      var cat = event.target.closest('[data-cat]');
      var chip = event.target.closest('[data-filter]');
      var shot = event.target.closest('[data-shot]');
      if (cat) { active = Number(cat.getAttribute('data-cat')); filter = 'Todo'; selected = 0; render(); }
      if (chip) { filter = chip.getAttribute('data-filter'); selected = 0; render(); }
      if (shot) { selected = Number(shot.getAttribute('data-shot')); render(); top.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
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
