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
    var touchedAt = 0;
    var speed = 0.9;

    function touch() {
      touchedAt = Date.now();
    }

    function onDown(event) {
      down = true;
      startX = event.clientX;
      startScroll = track.scrollLeft;
      track.classList.add('dragging');
      touch();
    }

    function onMove(event) {
      if (!down) return;
      event.preventDefault();
      track.scrollLeft = startScroll - (event.clientX - startX);
    }

    function onUp() {
      if (!down) return;
      down = false;
      track.classList.remove('dragging');
      touch();
    }

    track.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);

    track.addEventListener('touchstart', touch, { passive: true });
    track.addEventListener('touchmove', touch, { passive: true });

    track.addEventListener('wheel', function (event) {
      var amount = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      if (!amount) return;
      event.preventDefault();
      track.scrollLeft += amount;
      touch();
    }, { passive: false });

    window.setInterval(function () {
      if (down || document.hidden) return;
      if (Date.now() - touchedAt < 1300) return;

      var max = track.scrollWidth - track.clientWidth;
      if (max <= 0) return;

      if (track.scrollLeft >= max - 2) {
        track.scrollLeft = 0;
      } else {
        track.scrollLeft += speed;
      }
    }, 20);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
