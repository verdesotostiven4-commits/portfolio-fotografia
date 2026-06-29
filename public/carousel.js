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
    var speed = 0.9;

    function onDown(event) {
      down = true;
      startX = event.clientX;
      startScroll = track.scrollLeft;
      track.classList.add('dragging');
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
    }

    track.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);

    window.setInterval(function () {
      if (down || document.hidden) return;
      var max = track.scrollWidth - track.clientWidth;
      if (max <= 0) return;
      if (track.scrollLeft >= max - 2) track.scrollLeft = 0;
      else track.scrollLeft += speed;
    }, 20);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
