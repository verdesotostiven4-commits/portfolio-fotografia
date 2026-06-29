(function(){
  function addStyle(){
    if(document.getElementById('reveal-tune-style'))return;
    var s=document.createElement('style');
    s.id='reveal-tune-style';
    s.textContent=[
      '.fineArtStage.tunedWait img{opacity:var(--fine-opacity,.18)!important;translate:0 var(--fine-y,-150px)!important;transition:filter .35s ease!important;will-change:translate,opacity!important}',
      '.fineArtStage.tunedWait.tunedReveal img{opacity:1!important;translate:0 0!important}',
      '.aboutPhoto.tunedWait{opacity:0!important;translate:-105px 0!important;transition:opacity .95s ease,translate 1.15s cubic-bezier(.16,1,.3,1)!important}',
      '.aboutPhoto.tunedWait.tunedReveal{opacity:1!important;translate:0 0!important}'
    ].join('\n');
    document.head.appendChild(s);
  }
  function clamp(n,min,max){return Math.max(min,Math.min(max,n));}
  function setupFineArt(){
    var stage=document.querySelector('.fineArtStage');
    if(!stage)return false;
    stage.classList.remove('is-revealed','tunedReveal');
    stage.classList.add('tunedWait');
    var done=false;
    function update(){
      if(done)return;
      var rect=stage.getBoundingClientRect();
      var vh=window.innerHeight||document.documentElement.clientHeight;
      var start=vh*0.98;
      var end=vh*0.26;
      var p=clamp((start-rect.top)/(start-end),0,1);
      var eased=1-Math.pow(1-p,3);
      var y=-150+(150*eased);
      var opacity=.16+(.84*eased);
      stage.style.setProperty('--fine-y',y.toFixed(1)+'px');
      stage.style.setProperty('--fine-opacity',opacity.toFixed(3));
      if(p>=.995){
        done=true;
        stage.classList.add('tunedReveal');
        stage.style.removeProperty('--fine-y');
        stage.style.removeProperty('--fine-opacity');
        window.removeEventListener('scroll',onScroll);
        window.removeEventListener('resize',onScroll);
      }
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
