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
    var speed = 46;
    var lastTime = performance.now();
    var wheelTarget = track.scrollLeft;
    var wheelActiveUntil = 0;

    function maxScroll() {
      return Math.max(0, track.scrollWidth - track.clientWidth);
    }

    function clamp(value) {
      var max = maxScroll();
      if (value < 0) return 0;
      if (value > max) return max;
      return value;
    }

    function onDown(event) {
      down = true;
      startX = event.clientX;
      startScroll = track.scrollLeft;
      wheelActiveUntil = 0;
      track.classList.add('dragging');
    }

    function onMove(event) {
      if (!down) return;
      event.preventDefault();
      track.scrollLeft = clamp(startScroll - (event.clientX - startX));
      wheelTarget = track.scrollLeft;
    }

    function onUp() {
      if (!down) return;
      down = false;
      track.classList.remove('dragging');
      wheelTarget = track.scrollLeft;
    }

    track.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);

    track.addEventListener('wheel', function (event) {
      var horizontal = Math.abs(event.deltaX) > Math.abs(event.deltaY);
      if (!horizontal) return;
      event.preventDefault();
      wheelTarget = clamp(wheelTarget + event.deltaX);
      wheelActiveUntil = performance.now() + 90;
    }, { passive: false });

    function tick(now) {
      var dt = Math.min(48, now - lastTime) / 1000;
      lastTime = now;
      var max = maxScroll();

      if (!down && !document.hidden && max > 0) {
        if (now < wheelActiveUntil || Math.abs(wheelTarget - track.scrollLeft) > 0.5) {
          track.scrollLeft += (wheelTarget - track.scrollLeft) * 0.28;
        } else if (track.scrollLeft >= max - 2) {
          track.scrollLeft = 0;
          wheelTarget = 0;
        } else {
          track.scrollLeft += speed * dt;
          wheelTarget = track.scrollLeft;
        }
      }

      window.requestAnimationFrame(tick);
    }

    window.requestAnimationFrame(tick);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
