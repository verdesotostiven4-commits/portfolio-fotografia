(function(){
  function addStyle(){
    if(document.getElementById('portfolio-polish-style')) return;
    var style=document.createElement('style');
    style.id='portfolio-polish-style';
    style.textContent=[
      '.heroAvailability{margin-top:14px;display:inline-flex;gap:9px;align-items:center;border:1px solid rgba(255,255,255,.13);background:rgba(0,0,0,.22);color:rgba(255,255,255,.82);border-radius:999px;padding:9px 13px;font-size:12px;font-weight:900;letter-spacing:.8px;text-transform:uppercase;backdrop-filter:blur(10px)}.heroAvailability b{color:var(--gold2)}',
      'html body main #experiencias.portfolioIndex{background:#f6f1e8!important;color:#15110c!important;padding-top:clamp(70px,8vw,118px)!important}',
      'html body main #experiencias.portfolioIndex:before{background:linear-gradient(180deg,#f6f1e8 0%,#fffaf0 48%,#f2eadf 100%)!important}',
      'html body main #experiencias .portfolioIndexHead{max-width:1500px!important;grid-template-columns:minmax(280px,.88fr) minmax(280px,.62fr)!important;margin-bottom:28px!important}.portfolioIndexHead .eyebrow{color:#b88424!important}.portfolioIndexHead h2{color:#15110c!important;font-size:clamp(36px,4.8vw,76px)!important}.portfolioIndexHead p:last-child{color:#5e554c!important}',
      'html body main #experiencias .portfolioFilters{max-width:1500px!important;margin-bottom:22px!important}.portfolioFilter{background:#fff!important;color:#1d1711!important;border-color:rgba(0,0,0,.09)!important;box-shadow:0 12px 30px rgba(0,0,0,.06)!important}.portfolioFilter span{color:#8a7d70!important}.portfolioFilter.active{background:#12100d!important;color:#fff!important;border-color:#12100d!important}.portfolioFilter.active span{color:#ffe7a3!important}',
      'html body main #experiencias .portfolioFeature{max-width:1500px!important;min-height:0!important;height:auto!important;border-radius:0!important;border:0!important;box-shadow:none!important;background:transparent!important;overflow:visible!important;margin-bottom:18px!important}.portfolioFeature>img,.portfolioFeature:after{display:none!important}.featureCopy{min-height:0!important;max-width:840px!important;padding:0!important;color:#15110c!important}.featureCopy small{color:#b88424!important}.featureCopy h3{font-size:clamp(34px,4.3vw,64px)!important}.featureCopy p{color:#5e554c!important}.featureTags span{background:#fff!important;color:#3d3328!important;border-color:rgba(0,0,0,.09)!important}',
      'html body main #experiencias .portfolioMasonry{max-width:1500px!important;columns:auto!important;display:grid!important;grid-template-columns:repeat(12,1fr)!important;grid-auto-rows:110px!important;gap:22px!important;margin-top:30px!important}.portfolioShot{margin:0!important;border-radius:0!important;box-shadow:none!important;background:#ddd!important;grid-column:span 3;grid-row:span 3}.portfolioShot:nth-child(1){grid-column:span 5;grid-row:span 4}.portfolioShot:nth-child(2){grid-column:span 3;grid-row:span 4}.portfolioShot:nth-child(3){grid-column:span 4;grid-row:span 4}.portfolioShot:nth-child(4){grid-column:span 4;grid-row:span 3}.portfolioShot:nth-child(5){grid-column:span 5;grid-row:span 3}.portfolioShot:nth-child(6){grid-column:span 3;grid-row:span 4}.portfolioShot.isWide{grid-column:span 5}.portfolioShot.isTall{grid-column:span 3;grid-row:span 4}.portfolioShot.isSquare{grid-column:span 3;grid-row:span 3}.portfolioShot img{height:100%!important;min-height:0!important;width:100%!important;object-fit:cover!important;filter:saturate(1.02) contrast(1.02) brightness(.98)!important;transition:transform .7s ease,filter .35s ease!important}.portfolioShot:hover img{transform:scale(1.035)!important;filter:saturate(1.08) contrast(1.03) brightness(1)!important}.portfolioShot:after,.portfolioShot span{display:none!important}',
      '.reviewPreview{position:relative;background:#090807;color:#fff;padding:clamp(70px,8vw,112px) clamp(18px,6vw,86px);overflow:hidden}.reviewPreview:before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 18% 0%,rgba(216,162,58,.12),transparent 32%);pointer-events:none}.reviewShell{position:relative;max-width:1420px;margin:auto;display:grid;grid-template-columns:minmax(280px,.78fr) minmax(360px,1.22fr);gap:clamp(28px,5vw,70px);align-items:start}.reviewShell h2{font-size:clamp(36px,5vw,78px)}.reviewShell p{color:rgba(255,255,255,.68);line-height:1.7}.reviewStats{display:flex;gap:10px;flex-wrap:wrap;margin-top:20px}.reviewStats span{border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.07);border-radius:999px;padding:10px 13px;font-weight:900}.reviewGrid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}.reviewCard{border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.07);border-radius:28px;padding:22px}.reviewCard strong{display:block}.reviewCard small{color:var(--gold2);font-weight:900}.reviewCard p{margin-bottom:0;font-size:15px}.reviewFormMock{margin-top:14px;border:1px dashed rgba(255,255,255,.18);border-radius:26px;padding:18px;color:rgba(255,255,255,.66);font-size:14px}',
      '@media(max-width:980px){html body main #experiencias .portfolioIndexHead,.reviewShell{grid-template-columns:1fr!important}html body main #experiencias .portfolioMasonry{grid-template-columns:repeat(6,1fr)!important;gap:14px!important}.portfolioShot,.portfolioShot:nth-child(n){grid-column:span 3!important;grid-row:span 3!important}.portfolioShot.isWide{grid-column:span 6!important}.reviewGrid{grid-template-columns:1fr}}@media(max-width:640px){html body main #experiencias .portfolioMasonry{grid-template-columns:repeat(2,1fr)!important;grid-auto-rows:150px!important}.portfolioShot,.portfolioShot:nth-child(n),.portfolioShot.isWide,.portfolioShot.isTall,.portfolioShot.isSquare{grid-column:span 1!important;grid-row:span 1!important}.heroAvailability{font-size:10px;line-height:1.3;border-radius:18px}}'
    ].join('\n');
    document.head.appendChild(style);
  }
  function addLocation(){
    var actions=document.querySelector('.homeHeroContent .heroActions');
    if(!actions||document.querySelector('.heroAvailability')) return;
    var el=document.createElement('div');
    el.className='heroAvailability';
    el.innerHTML='<b>Galápagos · Ecuador</b><span>Actualmente en Riobamba</span><span>Disponible para viajes</span>';
    actions.insertAdjacentElement('afterend',el);
  }
  function adaptImages(){
    document.querySelectorAll('#experiencias .portfolioShot img').forEach(function(image){
      var card=image.closest('.portfolioShot');
      function mark(){
        if(!image.naturalWidth||!image.naturalHeight||!card) return;
        var ratio=image.naturalWidth/image.naturalHeight;
        card.classList.toggle('isWide',ratio>1.35);
        card.classList.toggle('isTall',ratio<.78);
        card.classList.toggle('isSquare',ratio>=.78&&ratio<=1.35);
      }
      if(image.complete) mark(); else image.addEventListener('load',mark,{once:true});
    });
  }
  function addReviews(){
    if(document.querySelector('.reviewPreview')) return;
    var after=document.getElementById('experiencias');
    if(!after||!after.parentNode) return;
    var section=document.createElement('section');
    section.className='reviewPreview';
    section.innerHTML='<div class="reviewShell"><div><p class="eyebrow">Confianza</p><h2>Reseñas y actividad del portafolio.</h2><p>Esta sección queda lista para conectar comentarios reales, conteo de visitas y reseñas verificadas con Supabase.</p><div class="reviewStats"><span>Vistas: listo para conectar</span><span>Comentarios reales</span><span>Reseñas verificadas</span></div><div class="reviewFormMock">Formulario pendiente de conexión: nombre, ciudad, comentario y calificación.</div></div><div class="reviewGrid"><article class="reviewCard"><strong>María José</strong><small>Riobamba</small><p>Me gustó mucho el trato y la paciencia para las fotos. Todo se sintió natural.</p></article><article class="reviewCard"><strong>Daniela P.</strong><small>Galápagos</small><p>Las fotos quedaron muy lindas, sobre todo los detalles y los momentos espontáneos.</p></article><article class="reviewCard"><strong>Kevin Andrade</strong><small>Quito</small><p>Buena edición, entrega ordenada y la galería fue fácil de revisar.</p></article><article class="reviewCard"><strong>Camila</strong><small>Cuenca</small><p>Nos ayudó con poses y el resultado se vio elegante, no forzado.</p></article></div></div>';
    after.insertAdjacentElement('afterend',section);
  }
  function boot(){addStyle();addLocation();addReviews();adaptImages();setTimeout(adaptImages,800);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
  window.addEventListener('load',boot);
})();
