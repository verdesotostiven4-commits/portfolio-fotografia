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

  addHeroLayoutFix();

  function init() {
    var track = document.querySelector('.mockRibbonTrack');
    if (!track) {
      window.setTimeout(init, 250);
      return;
    }
    if (track.getAttribute('data-drag-ready') === 'true') return;
    track.setAttribute('data-drag-ready', 'true');

    var duration = 46;
    var progress = 0;
    var lastTime = performance.now();
    var down = false;
    var startX = 0;
    var startProgress = 0;
    var wheelVelocity = 0;

    function loopWidth() {
      return Math.max(1, track.scrollWidth / 2);
    }

    function wrap(value) {
      value = value % 1;
      return value < 0 ? value + 1 : value;
    }

    function apply() {
      track.style.transform = 'translate3d(' + (-progress * loopWidth()) + 'px,0,0)';
    }

    function onDown(event) {
      down = true;
      wheelVelocity = 0;
      startX = event.clientX;
      startProgress = progress;
      track.classList.add('dragging');
    }

    function onMove(event) {
      if (!down) return;
      event.preventDefault();
      progress = wrap(startProgress - ((event.clientX - startX) / loopWidth()) * 0.85);
      apply();
    }

    function onUp() {
      if (!down) return;
      down = false;
      track.classList.remove('dragging');
    }

    track.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);

    track.addEventListener('wheel', function (event) {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY) || event.deltaX === 0) return;
      event.preventDefault();
      wheelVelocity += (event.deltaX / loopWidth()) * 0.12;
      if (wheelVelocity > 0.006) wheelVelocity = 0.006;
      if (wheelVelocity < -0.006) wheelVelocity = -0.006;
    }, { passive: false });

    function tick(now) {
      var dt = Math.min(48, now - lastTime) / 1000;
      lastTime = now;

      if (!down && !document.hidden) {
        if (Math.abs(wheelVelocity) > 0.00001) {
          progress = wrap(progress + wheelVelocity);
          wheelVelocity *= 0.82;
        } else {
          progress = wrap(progress + dt / duration);
        }
        apply();
      }

      window.requestAnimationFrame(tick);
    }

    apply();
    window.requestAnimationFrame(tick);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
