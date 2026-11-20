// Saika — portfolio behaviour: aurora sky, star chart, gameplay loops, playable builds.
(function () {
  var mm = function (q) { return window.matchMedia && window.matchMedia(q).matches; };
  var reduce = mm('(prefers-reduced-motion: reduce)');
  var saveData = navigator.connection && navigator.connection.saveData;
  var fine = mm('(hover: hover) and (pointer: fine)');
  var NS = 'http://www.w3.org/2000/svg';
  function el(t, a, p) { var e = document.createElementNS(NS, t); for (var k in a) e.setAttribute(k, a[k]); if (p) p.appendChild(e); return e; }
  var seed = 7; function rnd() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
  function quiet(p) { if (p && p.catch) p.catch(function () {}); }

  // ---- scattered stars inside SVG art ----
  document.querySelectorAll('g[data-stars]').forEach(function (g) {
    var n = +g.getAttribute('data-stars'), w = +g.getAttribute('data-w'), h = +g.getAttribute('data-h');
    seed = +g.getAttribute('data-seed') || 19;
    for (var i = 0; i < n; i++) el('circle', { cx: rnd() * w, cy: rnd() * h, r: rnd() * 1.2 + .2, 'fill-opacity': (rnd() * .6 + .15).toFixed(2) }, g);
  });

  // ---- star chart (index) ----
  var chart = document.getElementById('chart'), data = document.getElementById('chart-data');
  if (chart && data) {
    var P = JSON.parse(data.textContent), ticks = document.getElementById('ticks');
    el('circle', { cx: 300, cy: 300, r: 280, class: 'ring' }, ticks);
    for (var d = 0; d < 360; d += 2) {
      var big = d % 30 === 0, mid = d % 10 === 0, a = d * Math.PI / 180, r2 = big ? 266 : mid ? 272 : 276;
      el('line', { x1: 300 + 280 * Math.cos(a), y1: 300 + 280 * Math.sin(a), x2: 300 + r2 * Math.cos(a), y2: 300 + r2 * Math.sin(a), class: 'tick', 'stroke-opacity': big ? .9 : mid ? .6 : .3 }, ticks);
      if (big) { var t = el('text', { x: 300 + 254 * Math.cos(a), y: 300 + 254 * Math.sin(a) + 3, 'text-anchor': 'middle', fill: '#565D69', 'font-size': 9, 'font-family': 'Figtree,sans-serif' }, ticks); t.textContent = ('00' + d).slice(-3); }
    }
    var dust = document.getElementById('dust'); seed = 7;
    for (var i = 0; i < 140; i++) { var aa = rnd() * Math.PI * 2, rr = Math.sqrt(rnd()) * 270; el('circle', { cx: 300 + rr * Math.cos(aa), cy: 300 + rr * Math.sin(aa), r: rnd() * .9 + .2, fill: '#fff', 'fill-opacity': (rnd() * .5 + .1).toFixed(2) }, dust); }
    var E = [[0,1],[1,2],[2,3],[0,3],[3,4],[4,5],[5,6],[6,7],[7,1],[0,6]];
    var lines = document.getElementById('lines'), stars = document.getElementById('stars'), L = [];
    E.forEach(function (e) { if (!P[e[0]] || !P[e[1]]) return; var a = P[e[0]], b = P[e[1]]; L.push({ e: e, el: el('line', { x1: a.x, y1: a.y, x2: b.x, y2: b.y, class: 'cline' }, lines) }); });
    var ro = document.getElementById('readout'), rest = ro ? ro.textContent : '';
    P.forEach(function (p, i) {
      var link = el('a', { href: p.href, class: 'star', 'aria-label': p.name }, stars);
      el('circle', { class: 'halo', cx: p.x, cy: p.y, r: p.big ? 46 : 28 }, link);
      el('circle', { class: 'core', cx: p.x, cy: p.y, r: p.big ? 5 : 3 }, link);
      if (p.big) { var x = p.x, y = p.y; el('path', { d: 'M' + x + ' ' + (y - 16) + 'L' + (x + 2.4) + ' ' + (y - 2.4) + 'L' + (x + 16) + ' ' + y + 'L' + (x + 2.4) + ' ' + (y + 2.4) + 'L' + x + ' ' + (y + 16) + 'L' + (x - 2.4) + ' ' + (y + 2.4) + 'L' + (x - 16) + ' ' + y + 'L' + (x - 2.4) + ' ' + (y - 2.4) + 'Z', fill: '#fff' }, link); }
      var dx = p.a === 'start' ? 14 : -14, dy = p.big ? -22 : 4;
      el('text', { x: p.x + dx, y: p.y + dy, 'text-anchor': p.a }, link).textContent = p.name;
      el('text', { x: p.x + dx, y: p.y + dy + 13, 'text-anchor': p.a, class: 'n' }, link).textContent = p.n + (p.big ? ' · flagship' : '');
      function on() {
        L.forEach(function (l) { l.el.classList.toggle('on', l.e[0] === i || l.e[1] === i); });
        if (ro) ro.textContent = 'Object ' + p.n + ' · ' + p.name + ' · bearing ' + Math.round((Math.atan2(p.y - 300, p.x - 300) * 180 / Math.PI + 360) % 360) + '°';
      }
      function off() { L.forEach(function (l) { l.el.classList.remove('on'); }); if (ro) ro.textContent = rest; }
      link.addEventListener('mouseenter', on); link.addEventListener('focus', on);
      link.addEventListener('mouseleave', off); link.addEventListener('blur', off);
    });
  }

  // ---- hover loops on cards (desktop) ----
  if (fine && !reduce && !saveData) {
    document.querySelectorAll('[data-reel]').forEach(function (c) {
      var v = c.querySelector('video'); if (!v) return;
      function play() { if (!v.getAttribute('src')) v.src = c.getAttribute('data-reel'); quiet(v.play()); c.classList.add('playing'); }
      function stop() { v.pause(); c.classList.remove('playing'); }
      c.addEventListener('mouseenter', play); c.addEventListener('focus', play);
      c.addEventListener('mouseleave', stop); c.addEventListener('blur', stop);
    });
  }

  // ---- header loops on project pages ----
  document.querySelectorAll('video[data-loop]').forEach(function (v) {
    if (reduce || saveData) { v.removeAttribute('autoplay'); v.pause(); return; }
    v.muted = true; quiet(v.play());
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) quiet(v.play()); else v.pause(); });
    }).observe(v);
  });

  // ---- one-shot logo animations: play when first seen, then hold the last frame ----
  document.querySelectorAll('video[data-once]').forEach(function (v) {
    var still = function () { v.poster = v.getAttribute('data-poster'); };   // the final frame
    if (reduce || saveData) { v.preload = 'none'; still(); return; }
    v.muted = true;
    function go() { try { v.currentTime = 0; } catch (e) {} var q = v.play(); if (q && q.catch) q.catch(still); }
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { go(); io.disconnect(); } }); }, { threshold: .35 });
      io.observe(v);
    } else go();
    var host = v.closest('a'); if (host && fine) host.addEventListener('mouseenter', function () { if (v.ended) go(); });
  });

  // ---- playable builds load only when asked (tens of MB each) ----
  document.querySelectorAll('.stage[data-src]').forEach(function (s) {
    var b = s.querySelector('button'), scr = s.querySelector('.screen'); if (!b || !scr) return;
    b.addEventListener('click', function () {
      var f = document.createElement('iframe');
      f.src = s.getAttribute('data-src'); f.title = s.getAttribute('data-title') || 'Game';
      f.setAttribute('allow', 'fullscreen; autoplay; gamepad'); f.setAttribute('allowfullscreen', '');
      scr.innerHTML = ''; scr.appendChild(f); s.classList.add('live'); f.focus();
    });
  });

  // ---- aurora sky ----
  var cv = document.getElementById('sky'); if (!cv || !cv.getContext) return;
  var cx = cv.getContext('2d'), off = document.createElement('canvas'), ox = off.getContext('2d');
  var W, H, dpr = Math.min(window.devicePixelRatio || 1, 1.5), st = [];
  var strength = +(cv.getAttribute('data-strength') || 1);
  function size() {
    W = cv.width = innerWidth * dpr; H = cv.height = innerHeight * dpr;
    off.width = Math.max(48, Math.round(innerWidth / 10)); off.height = Math.max(40, Math.round(innerHeight / 10));
    st = []; seed = 3; for (var i = 0; i < 160; i++) st.push([rnd() * W, rnd() * H, rnd() * 1.1 + .2, rnd() * 6.28]);
  }
  size(); addEventListener('resize', size);
  var bands = [
    { c: [95,227,168], y: .16, amp: .06, f: 1.3, sp: .00011, a: .20, h: .30 },
    { c: [63,199,217], y: .26, amp: .05, f: 1.9, sp: -.00008, a: .13, h: .24 },
    { c: [124,108,240], y: .10, amp: .04, f: 2.4, sp: .00006, a: .08, h: .20 }];
  var visible = true; document.addEventListener('visibilitychange', function () { visible = !document.hidden; if (visible && !reduce) requestAnimationFrame(draw); });
  function draw(t) {
    t = t || 0; cx.clearRect(0, 0, W, H);
    var fade = Math.max(0, 1 - scrollY / (innerHeight * 1.4)) * strength;
    for (var i = 0; i < st.length; i++) { var p = st[i], tw = .5 + .5 * Math.sin(t * .0012 + p[3]); cx.fillStyle = 'rgba(255,255,255,' + ((.15 + .45 * tw) * (.5 + .5 * Math.min(1, fade + .3))).toFixed(3) + ')'; cx.fillRect(p[0], p[1], p[2] * dpr, p[2] * dpr); }
    if (fade > 0) {
      var ow = off.width, oh = off.height; ox.clearRect(0, 0, ow, oh); ox.globalCompositeOperation = 'lighter';
      bands.forEach(function (b) {
        for (var x = 0; x < ow; x++) {
          var u = x / ow, y = (b.y + b.amp * Math.sin(u * Math.PI * 2 * b.f + t * b.sp * 6) + .02 * Math.sin(u * 17 + t * .0007)) * oh;
          var hgt = b.h * oh * (.6 + .4 * Math.sin(u * 9 + t * .0005)), al = b.a * (.55 + .45 * Math.sin(u * 5.3 - t * .0004));
          var g = ox.createLinearGradient(0, y - hgt, 0, y + hgt * .25);
          g.addColorStop(0, 'rgba(' + b.c + ',0)'); g.addColorStop(.75, 'rgba(' + b.c + ',' + al + ')'); g.addColorStop(1, 'rgba(' + b.c + ',0)');
          ox.fillStyle = g; ox.fillRect(x, y - hgt, 1.5, hgt * 1.25);
        }
      });
      cx.globalAlpha = Math.min(1, fade); cx.globalCompositeOperation = 'lighter'; cx.imageSmoothingEnabled = true; cx.imageSmoothingQuality = 'high';
      cx.drawImage(off, 0, 0, W, H); cx.globalAlpha = 1; cx.globalCompositeOperation = 'source-over';
    }
    if (!reduce && visible) requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
})();
