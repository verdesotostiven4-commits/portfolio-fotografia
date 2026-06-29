(function () {
  function init() {
    var track = document.querySelector('.mockRibbonTrack');
    if (!track || track.getAttribute('data-drag-ready') === 'true') return;
    track.setAttribute('data-drag-ready', 'true');

    var down = false;
    var startX = 0;
    var startScroll = 0;
    var touchedAt = 0;

    function markTouched() {
      touchedAt = Date.now();
    }

    function onDown(event) {
      down = true;
      startX = event.clientX;
      startScroll = track.scrollLeft;
      track.classList.add('dragging');
      markTouched();
    }

    function onMove(event) {
      if (!down) return;
      event.preventDefault();
      track.scrollLeft = startScroll - (event.clientX - startX);
    }

    function onUp() {
      down = false;
      track.classList.remove('dragging');
      markTouched();
    }

    track.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);

    track.addEventListener('touchstart', function () {
      markTouched();
    }, { passive: true });

    track.addEventListener('wheel', function (event) {
      if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
        event.preventDefault();
        track.scrollLeft += event.deltaY;
        markTouched();
      }
    }, { passive: false });

    window.setInterval(function () {
      if (down || document.hidden || Date.now() - touchedAt < 1800) return;
      var max = track.scrollWidth - track.clientWidth;
      if (max <= 0) return;
      if (track.scrollLeft >= max - 2) track.scrollLeft = 0;
      else track.scrollLeft += 1;
    }, 28);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
