(function () {
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
