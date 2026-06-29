(function(){
  var newPhoto='https://blogger.googleusercontent.com/img/a/AVvXsEj6J_47LdNE62q5EMe3kdjYQnynq9Kcx3-wy2COeexmSxq0eZU_YvHaJwvk_RKAxAQTDlKU7sqkhxi9ZxSHQ7fgpCkjT8R6pMQYoiNnWGRGJ6rWSBcxYQryOULZz4JcRFBV0M0mHtoRiELstD7XmJShrhiL6VTotKhyBRh412Mw09tgvl6gXMEl3ZSK3n0';
  var oldKey='EjfAJe7673Ulq5xldKwjxm7oiLeW-08F72f0UT7zLpn5Ojgqo';
  function style(){
    if(document.getElementById('final-visual-tweaks-style'))return;
    var s=document.createElement('style');
    s.id='final-visual-tweaks-style';
    s.textContent=[
      'html body main #experiencias{padding-top:clamp(34px,4vw,58px)!important}',
      'html body main #experiencias .portfolioIndexHead{max-width:1420px!important;margin-bottom:14px!important;grid-template-columns:minmax(260px,.62fr) minmax(420px,.82fr)!important;gap:clamp(16px,4vw,42px)!important;align-items:center!important}',
      'html body main #experiencias .portfolioIndexHead h2{font-size:clamp(32px,3.85vw,58px)!important;line-height:.94!important;max-width:660px!important;margin-bottom:0!important}',
      'html body main #experiencias .portfolioIndexHead p:last-child{font-size:15px!important;line-height:1.48!important;max-width:520px!important;margin-top:0!important}',
      'html body main #experiencias .portfolioFilters{max-width:1420px!important;margin-top:8px!important;margin-bottom:12px!important}',
      'html body main #experiencias .portfolioFeature{max-width:1420px!important;min-height:315px!important;height:315px!important;margin-bottom:16px!important}',
      'html body main #experiencias .featureCopy{min-height:315px!important;padding:clamp(20px,3vw,30px)!important;max-width:610px!important}',
      'html body main #experiencias .featureCopy h3{font-size:clamp(36px,4.5vw,64px)!important;margin:8px 0!important}',
      'html body main #experiencias .featureCopy p{font-size:15px!important;line-height:1.46!important;max-width:520px!important}',
      'html body main #experiencias .featureTags{margin-top:14px!important}',
      'html body main #experiencias .featureTags span{padding:8px 11px!important;font-size:11px!important}',
      '.behindCameraFrame{position:relative!important;isolation:isolate!important;overflow:hidden!important;background:#000!important;border-radius:42px!important;box-shadow:0 34px 90px rgba(0,0,0,.48)!important}',
      '.behindCameraFrame:before{content:""!important;position:absolute!important;inset:0!important;z-index:2!important;pointer-events:none!important;background:radial-gradient(ellipse at 50% 43%,rgba(0,0,0,0) 26%,rgba(0,0,0,.22) 52%,rgba(0,0,0,.78) 100%),linear-gradient(90deg,rgba(0,0,0,.62),rgba(0,0,0,0) 28%,rgba(0,0,0,0) 72%,rgba(0,0,0,.62))!important}',
      '.behindCameraFrame:after{content:""!important;position:absolute!important;inset:-2px!important;z-index:3!important;pointer-events:none!important;box-shadow:inset 0 0 80px 34px rgba(0,0,0,.95)!important;border-radius:inherit!important}',
      '.behindCameraFrame img{position:relative!important;z-index:1!important;display:block!important;filter:grayscale(1) contrast(1.08) brightness(.9)!important;background:#000!important}',
      '@media(max-width:900px){html body main #experiencias .portfolioIndexHead{grid-template-columns:1fr!important}html body main #experiencias .portfolioFeature{height:340px!important;min-height:340px!important}html body main #experiencias .featureCopy{min-height:340px!important}}'
    ].join('\n');
    document.head.appendChild(s);
  }
  function photo(){
    document.querySelectorAll('img').forEach(function(im){
      var src=im.getAttribute('src')||'';
      if(src.indexOf(oldKey)>-1 || src===newPhoto || src.indexOf('Ej6J_47LdNE62q5EMe3kdjYQnynq9Kcx3')>-1){
        im.src=newPhoto;
        im.setAttribute('src',newPhoto);
        im.classList.add('behindCameraPhoto');
        var frame=im.parentElement;
        if(frame && frame.tagName.toLowerCase()!=='section') frame.classList.add('behindCameraFrame');
      }
    });
  }
  function boot(){style();photo();setTimeout(photo,500);setTimeout(photo,1200)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
  window.addEventListener('load',boot);
})();
