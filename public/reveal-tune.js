(function(){
  function addStyle(){
    if(document.getElementById('reveal-tune-style'))return;
    var s=document.createElement('style');
    s.id='reveal-tune-style';
    s.textContent=[
      '.fineArtStage{overflow:hidden!important}',
      '.fineArtStage.tunedWait img{opacity:1!important;translate:0 var(--fine-y,86px)!important;-webkit-clip-path:inset(var(--fine-cut,78%) 0 0 0)!important;clip-path:inset(var(--fine-cut,78%) 0 0 0)!important;-webkit-mask-image:none!important;mask-image:none!important;transition:filter .35s ease!important;will-change:translate,clip-path!important}',
      '.fineArtStage.tunedWait.tunedReveal img{opacity:1!important;translate:0 0!important;-webkit-clip-path:inset(0 0 0 0)!important;clip-path:inset(0 0 0 0)!important;-webkit-mask-image:none!important;mask-image:none!important}',
      '.aboutPhoto.tunedWait{opacity:0!important;translate:-105px 0!important;transition:opacity .95s ease,translate 1.15s cubic-bezier(.16,1,.3,1)!important}',
      '.aboutPhoto.tunedWait.tunedReveal{opacity:1!important;translate:0 0!important}'
    ].join('\n');
    document.head.appendChild(s);
  }
  function clamp(n,min,max){return Math.max(min,Math.min(max,n));}
  function easeInOut(t){return t<.5 ? 2*t*t : 1-Math.pow(-2*t+2,2)/2;}
  function setupFineArt(){
    var stage=document.querySelector('.fineArtStage');
    if(!stage)return false;
    stage.classList.remove('is-revealed','tunedReveal');
    stage.classList.add('tunedWait');
    function update(){
      var rect=stage.getBoundingClientRect();
      var vh=window.innerHeight||document.documentElement.clientHeight;
      var start=vh*1.06;
      var end=vh*0.30;
      var p=clamp((start-rect.top)/(start-end),0,1);
      var e=easeInOut(p);
      var cut=78-(78*e);
      var y=86-(86*e);
      stage.style.setProperty('--fine-cut',cut.toFixed(2)+'%');
      stage.style.setProperty('--fine-y',y.toFixed(1)+'px');
      if(p>.992)stage.classList.add('tunedReveal');
      else stage.classList.remove('tunedReveal');
    }
    var ticking=false;
    function onScroll(){
      if(ticking)return;
      ticking=true;
      requestAnimationFrame(function(){ticking=false;update();});
    }
    window.addEventListener('scroll',onScroll,{passive:true});
    window.addEventListener('resize',onScroll);
    update();
    return true;
  }
  function setupPortrait(){
    var el=document.querySelector('.aboutPhoto');
    if(!el)return false;
    el.classList.remove('is-revealed');
    el.classList.add('tunedWait');
    var obs=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('tunedReveal');
          obs.unobserve(entry.target);
        }
      });
    },{threshold:.44,rootMargin:'0px 0px -18% 0px'});
    obs.observe(el);
    return true;
  }
  function boot(){
    addStyle();
    var fine=setupFineArt();
    var portrait=setupPortrait();
    if(!fine||!portrait)setTimeout(boot,500);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
  window.addEventListener('load',function(){setTimeout(boot,250)});
})();
