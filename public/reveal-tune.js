(function(){
  function addStyle(){
    if(document.getElementById('reveal-tune-style'))return;
    var s=document.createElement('style');
    s.id='reveal-tune-style';
    s.textContent=[
      '.fineArtStage.tunedWait img{opacity:0!important;translate:0 -135px!important;transition:opacity 1.35s ease,translate 1.75s cubic-bezier(.16,1,.3,1)!important}',
      '.fineArtStage.tunedWait.tunedReveal img{opacity:1!important;translate:0 0!important}',
      '.aboutPhoto.tunedWait{opacity:0!important;translate:-105px 0!important;transition:opacity .95s ease,translate 1.15s cubic-bezier(.16,1,.3,1)!important}',
      '.aboutPhoto.tunedWait.tunedReveal{opacity:1!important;translate:0 0!important}'
    ].join('\n');
    document.head.appendChild(s);
  }
  function observeLater(selector,options){
    var el=document.querySelector(selector);
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
    },options);
    obs.observe(el);
    return true;
  }
  function boot(){
    addStyle();
    var fine=observeLater('.fineArtStage',{threshold:.62,rootMargin:'0px 0px -34% 0px'});
    var portrait=observeLater('.aboutPhoto',{threshold:.44,rootMargin:'0px 0px -18% 0px'});
    if(!fine||!portrait)setTimeout(boot,500);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
  window.addEventListener('load',function(){setTimeout(boot,250)});
})();
