(function(){
  function addStyle(){
    if(document.getElementById('reveal-tune-style'))return;
    var s=document.createElement('style');
    s.id='reveal-tune-style';
    s.textContent=[
      '.fineArtStage{overflow:visible!important}',
      '.fineArtStage.tunedWait img{opacity:1!important;translate:0 var(--fine-y,170px)!important;-webkit-clip-path:none!important;clip-path:none!important;-webkit-mask-image:linear-gradient(to bottom,transparent 0%,transparent calc(100% - var(--fine-reveal,18%)),rgba(0,0,0,.12) calc(100% - var(--fine-reveal,18%) + 3%),rgba(0,0,0,.72) calc(100% - var(--fine-reveal,18%) + 7%),black calc(100% - var(--fine-reveal,18%) + 12%),black 100%)!important;mask-image:linear-gradient(to bottom,transparent 0%,transparent calc(100% - var(--fine-reveal,18%)),rgba(0,0,0,.12) calc(100% - var(--fine-reveal,18%) + 3%),rgba(0,0,0,.72) calc(100% - var(--fine-reveal,18%) + 7%),black calc(100% - var(--fine-reveal,18%) + 12%),black 100%)!important;transition:filter .35s ease!important;will-change:translate,mask-image!important}',
      '.fineArtStage.tunedWait.tunedFinal img{translate:0 0!important;-webkit-mask-image:linear-gradient(to bottom,black 0%,black 100%)!important;mask-image:linear-gradient(to bottom,black 0%,black 100%)!important}',
      '.aboutPhoto.tunedWait{opacity:0!important;translate:-105px 0!important;transition:opacity .95s ease,translate 1.15s cubic-bezier(.16,1,.3,1)!important}',
      '.aboutPhoto.tunedWait.tunedReveal{opacity:1!important;translate:0 0!important}'
    ].join('\n');
    document.head.appendChild(s);
  }
  function clamp(n,min,max){return Math.max(min,Math.min(max,n));}
  function smooth(t){return t*t*(3-2*t);}
  function setupFineArt(){
    var stage=document.querySelector('.fineArtStage');
    if(!stage)return false;
    stage.classList.remove('is-revealed','tunedReveal','tunedFinal');
    stage.classList.add('tunedWait');
    function update(){
      var rect=stage.getBoundingClientRect();
      var vh=window.innerHeight||document.documentElement.clientHeight;
      var start=vh*0.96;
      var end=vh*0.14;
      var raw=clamp((start-rect.top)/(start-end),0,1);
      var p=smooth(raw);
      var reveal=16+(84*p);
      var y=180-(180*p);
      stage.style.setProperty('--fine-reveal',reveal.toFixed(2)+'%');
      stage.style.setProperty('--fine-y',y.toFixed(1)+'px');
      if(raw>.992){
        stage.classList.add('tunedFinal');
      }else{
        stage.classList.remove('tunedFinal');
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
