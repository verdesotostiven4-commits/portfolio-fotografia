(function(){
  function addStyle(){
    if(document.getElementById('reveal-tune-style'))return;
    var s=document.createElement('style');
    s.id='reveal-tune-style';
    s.textContent=[
      '#trabajo.tunedIntro .eyebrow{opacity:var(--intro-label-op,.18)!important;translate:0 var(--intro-label-y,-70px)!important;transition:none!important;will-change:translate,opacity!important}',
      '#trabajo.tunedIntro h2{opacity:var(--intro-title-op,.22)!important;translate:var(--intro-title-x,-190px) 0!important;transition:none!important;will-change:translate,opacity!important}',
      '#trabajo.tunedIntro .lead{opacity:var(--intro-lead-op,.22)!important;translate:var(--intro-lead-x,160px) 0!important;transition:none!important;will-change:translate,opacity!important}',
      '#trabajo.tunedIntro.tunedIntroFinal .eyebrow,#trabajo.tunedIntro.tunedIntroFinal h2,#trabajo.tunedIntro.tunedIntroFinal .lead{opacity:1!important;translate:0 0!important}',
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
  function setupIntro(){
    var section=document.querySelector('#trabajo.introGrid');
    if(!section)return false;
    section.classList.remove('tunedIntroFinal');
    section.classList.add('tunedIntro');
    function update(){
      var rect=section.getBoundingClientRect();
      var vh=window.innerHeight||document.documentElement.clientHeight;
      var start=vh*0.98;
      var end=vh*0.34;
      var raw=clamp((start-rect.top)/(start-end),0,1);
      var p=smooth(raw);
      section.style.setProperty('--intro-label-y',(-76+(76*p)).toFixed(1)+'px');
      section.style.setProperty('--intro-title-x',(-210+(210*p)).toFixed(1)+'px');
      section.style.setProperty('--intro-lead-x',(170-(170*p)).toFixed(1)+'px');
      section.style.setProperty('--intro-label-op',(.18+(.82*p)).toFixed(3));
      section.style.setProperty('--intro-title-op',(.18+(.82*p)).toFixed(3));
      section.style.setProperty('--intro-lead-op',(.18+(.82*p)).toFixed(3));
      if(raw>.992)section.classList.add('tunedIntroFinal');
      else section.classList.remove('tunedIntroFinal');
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
    var intro=setupIntro();
    var fine=setupFineArt();
    var portrait=setupPortrait();
    if(!intro||!fine||!portrait)setTimeout(boot,500);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
  window.addEventListener('load',function(){setTimeout(boot,250)});
})();
