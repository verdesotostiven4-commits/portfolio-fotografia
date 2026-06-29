(function(){
  function addStyle(){
    if(document.getElementById('reveal-tune-style'))return;
    var s=document.createElement('style');
    s.id='reveal-tune-style';
    s.textContent=[
      '.fineArtStage{overflow:visible!important}',
      '.fineArtStage.tunedWait img{opacity:var(--fine-opacity,.98)!important;translate:0 var(--fine-y,240px)!important;-webkit-clip-path:none!important;clip-path:none!important;-webkit-mask-image:linear-gradient(to bottom,transparent 0%,transparent calc(100% - var(--fine-reveal,28%)),rgba(0,0,0,.18) calc(100% - var(--fine-reveal,28%) + 8%),black calc(100% - var(--fine-reveal,28%) + 32%),black 100%)!important;mask-image:linear-gradient(to bottom,transparent 0%,transparent calc(100% - var(--fine-reveal,28%)),rgba(0,0,0,.18) calc(100% - var(--fine-reveal,28%) + 8%),black calc(100% - var(--fine-reveal,28%) + 32%),black 100%)!important;transition:filter .35s ease!important;will-change:translate,opacity,mask-image!important}',
      '.fineArtStage.tunedWait.tunedReveal img{opacity:1!important;translate:0 0!important;-webkit-mask-image:linear-gradient(to bottom,black 0%,black 100%)!important;mask-image:linear-gradient(to bottom,black 0%,black 100%)!important}',
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
    function update(){
      var rect=stage.getBoundingClientRect();
      var vh=window.innerHeight||document.documentElement.clientHeight;
      var start=vh*0.96;
      var end=vh*0.24;
      var p=clamp((start-rect.top)/(start-end),0,1);
      var eased=p<.5 ? 2*p*p : 1-Math.pow(-2*p+2,2)/2;
      var y=240-(240*eased);
      var reveal=24+(76*eased);
      var opacity=.96+(.04*eased);
      stage.style.setProperty('--fine-y',y.toFixed(1)+'px');
      stage.style.setProperty('--fine-reveal',reveal.toFixed(1)+'%');
      stage.style.setProperty('--fine-opacity',opacity.toFixed(3));
      if(p>.985)stage.classList.add('tunedReveal');
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
