(function () {
  function init() {
    var track = document.querySelector('.mockRibbonTrack');
    if (!track) {
      window.setTimeout(init, 250);
      return;
    }
    if (track.getAttribute('data-drag-ready') === 'true') return;
    track.setAttribute('data-drag-ready', 'true');

    var down = false;
    var startX = 0;
    var startScroll = 0;
    var autoSpeed = 46;
    var lastTime = performance.now();
    var wheelVelocity = 0;
    var wheelUntil = 0;

    function maxScroll() {
      return Math.max(0, track.scrollWidth - track.clientWidth);
    }

    function limit(value) {
      var max = maxScroll();
      if (value < 0) return 0;
      if (value > max) return max;
      return value;
    }

    function onDown(event) {
      down = true;
      wheelVelocity = 0;
      startX = event.clientX;
      startScroll = track.scrollLeft;
      track.classList.add('dragging');
    }

    function onMove(event) {
      if (!down) return;
      event.preventDefault();
      track.scrollLeft = limit(startScroll - (event.clientX - startX));
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
      wheelVelocity += event.deltaX * 0.22;
      if (wheelVelocity > 34) wheelVelocity = 34;
      if (wheelVelocity < -34) wheelVelocity = -34;
      wheelUntil = performance.now() + 180;
    }, { passive: false });

    function tick(now) {
      var dt = Math.min(48, now - lastTime) / 1000;
      lastTime = now;
      var max = maxScroll();

      if (!down && !document.hidden && max > 0) {
        if (Math.abs(wheelVelocity) > 0.05 || now < wheelUntil) {
          track.scrollLeft = limit(track.scrollLeft + wheelVelocity);
          wheelVelocity *= 0.86;
        } else if (track.scrollLeft >= max - 2) {
          track.scrollLeft = 0;
        } else {
          track.scrollLeft += autoSpeed * dt;
        }
      }

      window.requestAnimationFrame(tick);
    }

    window.requestAnimationFrame(tick);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
