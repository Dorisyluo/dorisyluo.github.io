// Saika — portfolio behaviour
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var saveData = navigator.connection && navigator.connection.saveData;
  var fine = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // Header loops on project pages: play only when allowed, pause when off-screen.
  document.querySelectorAll('video[data-loop]').forEach(function (v) {
    if (reduce || saveData) { v.removeAttribute('autoplay'); v.pause(); return; }
    v.muted = true;
    var p = v.play(); if (p && p.catch) p.catch(function () {});
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { var q = v.play(); if (q && q.catch) q.catch(function () {}); } else v.pause(); });
      }).observe(v);
    }
  });

  // Index: hovering a project row projects its gameplay behind the page (desktop only).
  var proj = document.querySelector('.projector');
  if (proj && fine && !reduce && !saveData) {
    var vid = proj.querySelector('video'), current = null, hideT = null;
    function show(src) {
      clearTimeout(hideT);
      if (current !== src) { current = src; vid.src = src; }
      var q = vid.play(); if (q && q.catch) q.catch(function () {});
      proj.classList.add('on'); document.body.classList.add('projecting');
    }
    function hide() {
      hideT = setTimeout(function () { proj.classList.remove('on'); document.body.classList.remove('projecting'); vid.pause(); }, 120);
    }
    document.querySelectorAll('[data-reel]').forEach(function (el) {
      el.addEventListener('mouseenter', function () { show(el.getAttribute('data-reel')); });
      el.addEventListener('focus', function () { show(el.getAttribute('data-reel')); });
      el.addEventListener('mouseleave', hide);
      el.addEventListener('blur', hide);
    });
  }

  // Playable builds load only when asked: each is tens of megabytes.
  document.querySelectorAll('.stage[data-src]').forEach(function (s) {
    var b = s.querySelector('button');
    if (!b) return;
    b.addEventListener('click', function () {
      var f = document.createElement('iframe');
      f.src = s.getAttribute('data-src');
      f.title = s.getAttribute('data-title') || 'Game';
      f.setAttribute('allow', 'fullscreen; autoplay; gamepad');
      f.setAttribute('allowfullscreen', '');
      s.innerHTML = ''; s.appendChild(f);
      f.focus();
    });
  });
})();
