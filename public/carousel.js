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
    var down = false;
    var startX = 0;
    var startProgress = 0;
    var progress = 0;
    var wheelVelocity = 0;

    function loopWidth() {
      return Math.max(1, track.scrollWidth / 2);
    }

    function wrap(value) {
      value = value % 1;
      return value < 0 ? value + 1 : value;
    }

    function getX() {
      var transform = window.getComputedStyle(track).transform;
      if (!transform || transform === 'none') return 0;
      try {
        return new DOMMatrixReadOnly(transform).m41 || 0;
      } catch (error) {
        return 0;
      }
    }

    function readProgress() {
      return wrap(-getX() / loopWidth());
    }

    function setManual(value) {
      progress = wrap(value);
      track.classList.add('manualRibbon');
      track.style.transform = 'translate3d(' + (-progress * loopWidth()) + 'px,0,0)';
    }

    function resume() {
      progress = wrap(progress);
      track.style.transform = '';
      track.style.animationDelay = (-progress * duration) + 's';
      track.classList.remove('manualRibbon');
      track.classList.remove('dragging');
    }

    function onDown(event) {
      down = true;
      wheelVelocity = 0;
      startX = event.clientX;
      startProgress = readProgress();
      setManual(startProgress);
      track.classList.add('dragging');
    }

    function onMove(event) {
      if (!down) return;
      event.preventDefault();
      setManual(startProgress - (event.clientX - startX) / loopWidth());
    }

    function onUp() {
      if (!down) return;
      down = false;
      resume();
    }

    track.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);

    track.addEventListener('wheel', function (event) {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY) || event.deltaX === 0) return;
      event.preventDefault();
      if (!track.classList.contains('manualRibbon')) setManual(readProgress());
      wheelVelocity += event.deltaX / loopWidth();
      if (wheelVelocity > 0.035) wheelVelocity = 0.035;
      if (wheelVelocity < -0.035) wheelVelocity = -0.035;
    }, { passive: false });

    function tick() {
      if (!down && Math.abs(wheelVelocity) > 0.00004) {
        setManual(progress + wheelVelocity);
        wheelVelocity *= 0.86;
      } else if (!down && track.classList.contains('manualRibbon')) {
        wheelVelocity = 0;
        resume();
      }

      window.requestAnimationFrame(tick);
    }

    window.requestAnimationFrame(tick);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
