(function(){
  var style=document.createElement('style');
  style.textContent='#trabajo.lightReady .eyebrow{opacity:0;transform:translate3d(0,-38px,0);transition:.7s cubic-bezier(.16,1,.3,1)}#trabajo.lightReady h2{opacity:0;transform:translate3d(-80px,0,0);transition:.8s cubic-bezier(.16,1,.3,1)}#trabajo.lightReady .lead{opacity:0;transform:translate3d(64px,0,0);transition:.8s cubic-bezier(.16,1,.3,1)}#trabajo.lightReady.in .eyebrow,#trabajo.lightReady.in h2,#trabajo.lightReady.in .lead{opacity:1;transform:translate3d(0,0,0)}.fineArtStage.lightFine img{opacity:1!important;transform:translate3d(0,var(--fy,190px),0)!important;clip-path:inset(var(--fc,84%) 0 0 0)!important;-webkit-clip-path:inset(var(--fc,84%) 0 0 0)!important;-webkit-mask-image:none!important;mask-image:none!important;will-change:transform,clip-path}.fineArtStage.lightFine.done img{transform:translate3d(0,0,0)!important;clip-path:inset(0 0 0 0)!important;-webkit-clip-path:inset(0 0 0 0)!important}.aboutPhoto.lightAbout{opacity:0!important;transform:translate3d(-76px,0,0)!important;transition:.85s cubic-bezier(.16,1,.3,1)!important}.aboutPhoto.lightAbout.in{opacity:1!important;transform:translate3d(0,0,0)!important}@media (prefers-reduced-motion:reduce){#trabajo.lightReady *,.fineArtStage.lightFine img,.aboutPhoto.lightAbout{transition:none!important;transform:none!important;opacity:1!important;clip-path:none!important}}';
  document.head.appendChild(style);
  function clamp(v){return Math.max(0,Math.min(1,v))}
  function ease(t){return t*t*(3-2*t)}
  function boot(){
    var intro=document.querySelector('#trabajo.introGrid');
    var fine=document.querySelector('.fineArtStage');
    var about=document.querySelector('.aboutPhoto');
    if(!intro||!fine||!about){setTimeout(boot,300);return}
    intro.classList.remove('tunedIntro','tunedIntroFinal');
    fine.classList.remove('tunedWait','tunedFinal','is-revealed');
    about.classList.remove('tunedWait','tunedReveal','is-revealed');
    intro.classList.add('lightReady');
    fine.classList.add('lightFine');
    about.classList.add('lightAbout');
    var introObs=new IntersectionObserver(function(es){es.forEach(function(e){intro.classList.toggle('in',e.isIntersecting||e.boundingClientRect.top<0)})},{threshold:.18,rootMargin:'0px 0px -10% 0px'});
    introObs.observe(intro);
    var aboutObs=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){about.classList.add('in');aboutObs.disconnect()}})},{threshold:.3,rootMargin:'0px 0px -10% 0px'});
    aboutObs.observe(about);
    function update(){
      var r=fine.getBoundingClientRect(), h=innerHeight||document.documentElement.clientHeight;
      var p=ease(clamp((h*.96-r.top)/(h*.96-h*.16)));
      fine.style.setProperty('--fc',(84-84*p).toFixed(2)+'%');
      fine.style.setProperty('--fy',(190-190*p).toFixed(1)+'px');
      fine.classList.toggle('done',p>.995);
    }
    var ticking=false;
    function on(){if(!ticking){ticking=true;requestAnimationFrame(function(){ticking=false;update()})}}
    addEventListener('scroll',on,{passive:true});addEventListener('resize',on);update();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
