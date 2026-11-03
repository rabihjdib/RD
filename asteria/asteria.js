(function () {
  'use strict';
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var CFG = window.ASTERIA || {};
  var LG = CFG.lang || document.documentElement.lang || 'en';

  /* Header: transparent over the hero, solid after scrolling */
  var hdr = $('#hdr'), hero = $('.hero');
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (hdr) hdr.classList.toggle('scrolled', y > 40);
    var st = $('#sticky');
    if (st && hero) {
      var past = y > hero.offsetHeight * 0.7;
      var lead = $('#lead'), r = lead ? lead.getBoundingClientRect() : null;
      var atLead = r && r.top < window.innerHeight && r.bottom > 0;
      st.classList.toggle('show', past && !atLead);
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* Language menu */
  $$('.lang').forEach(function (l) {
    var b = $('.lang-btn', l);
    b.addEventListener('click', function (e) { e.stopPropagation(); var o = l.classList.toggle('open'); b.setAttribute('aria-expanded', o); });
  });
  document.addEventListener('click', function () { $$('.lang.open').forEach(function (l) { l.classList.remove('open'); }); });

  /* Mobile menu */
  var mnav = $('#mnav');
  function menu(open) { if (!mnav) return; mnav.classList.toggle('open', open); document.body.style.overflow = open ? 'hidden' : ''; }
  $$('.hdr .burger').forEach(function (b) { b.addEventListener('click', function () { menu(true); }); });
  if (mnav) { $('.mclose', mnav).addEventListener('click', function () { menu(false); }); $$('a', mnav).forEach(function (a) { a.addEventListener('click', function () { menu(false); }); }); }

  /* Residences slider: one residence per screen, swipe or arrows */
  $$('.slider').forEach(function (sl) {
    var track = $('.track', sl), slides = $$('.slide', sl), tabs = $$('.ftab'), ci = $('.ci', sl);
    var prev = $('.prev', sl), next = $('.next', sl), cur = 0;
    function go(i) { i = Math.max(0, Math.min(slides.length - 1, i)); var t = slides[i], rtl = getComputedStyle(track).direction === 'rtl';
      var x = rtl ? -(slides[0].offsetLeft + slides[0].offsetWidth - t.offsetLeft - t.offsetWidth) : t.offsetLeft - slides[0].offsetLeft;
      track.scrollTo({ left: x, behavior: 'smooth' }); }
    function mark(i) {
      cur = i; ci.textContent = (i < 9 ? '0' : '') + (i + 1);
      prev.disabled = i === 0; next.disabled = i === slides.length - 1;
      var f = slides[i].getAttribute('data-floor');
      tabs.forEach(function (t, k) { t.setAttribute('aria-selected', String(k) === f ? 'true' : 'false'); });
      var act = tabs[+f]; if (act && act.parentNode.scrollWidth > act.parentNode.clientWidth) act.parentNode.scrollTo({ left: act.offsetLeft - 16, behavior: 'smooth' });
    }
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) mark(+e.target.getAttribute('data-i')); }); }, { root: track, threshold: 0.6 });
      slides.forEach(function (s) { io.observe(s); });
    }
    prev.addEventListener('click', function () { go(cur - 1); });
    next.addEventListener('click', function () { go(cur + 1); });
    tabs.forEach(function (t) { t.addEventListener('click', function () { go(+t.getAttribute('data-go')); }); });
    track.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') go(cur + 1); if (e.key === 'ArrowLeft') go(cur - 1); });
    mark(0);
  });

  /* 3D view lightbox: fit to screen, pinch / wheel / buttons to zoom, drag to pan */
  var lb = $('#lb');
  if (lb) {
    var stage = $('.lb-stage', lb), img = $('img', stage), pct = $('.pct', lb);
    var sc = 1, tx = 0, ty = 0, base = { w: 0, h: 0 }, pts = {}, pinch = null, drag = null, lastTap = 0;
    function apply() {
      img.style.transform = 'translate(' + (tx - base.w * sc / 2) + 'px,' + (ty - base.h * sc / 2) + 'px) scale(' + sc + ')';
      pct.textContent = Math.round(sc * 100) + '%';
    }
    function clamp() {
      sc = Math.max(1, Math.min(5, sc));
      var mx = Math.max(0, (base.w * sc - stage.clientWidth) / 2), my = Math.max(0, (base.h * sc - stage.clientHeight) / 2);
      tx = Math.max(-mx, Math.min(mx, tx)); ty = Math.max(-my, Math.min(my, ty));
    }
    function fit() { img.style.transform = 'none'; img.style.width = ''; img.style.height = ''; var r = img.getBoundingClientRect(); base = { w: r.width, h: r.height }; img.style.width = base.w + 'px'; img.style.height = base.h + 'px'; sc = 1; tx = ty = 0; apply(); }
    function zoomAt(f, cx, cy) {
      var ox = cx - stage.clientWidth / 2, oy = cy - stage.clientHeight / 2, ns = Math.max(1, Math.min(5, sc * f)), k = ns / sc;
      tx = ox - (ox - tx) * k; ty = oy - (oy - ty) * k; sc = ns; clamp(); apply();
    }
    function open(src, cap) {
      $('.lb-cap', lb).textContent = cap || '';
      lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden';
      img.onload = fit; img.src = src; if (img.complete) fit();
    }
    function close() { lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; }
    $$('[data-zoom]').forEach(function (b) { b.addEventListener('click', function () { open(b.getAttribute('data-zoom'), b.getAttribute('data-cap')); }); });
    $('.lb-close', lb).addEventListener('click', close);
    $('.lb-in', lb).addEventListener('click', function () { zoomAt(1.5, stage.clientWidth / 2, stage.clientHeight / 2); });
    $('.lb-out', lb).addEventListener('click', function () { zoomAt(1 / 1.5, stage.clientWidth / 2, stage.clientHeight / 2); });
    $('.lb-reset', lb).addEventListener('click', function () { sc = 1; tx = ty = 0; apply(); });
    document.addEventListener('keydown', function (e) { if (!lb.classList.contains('open')) return; if (e.key === 'Escape') close(); if (e.key === '+' || e.key === '=') $('.lb-in', lb).click(); if (e.key === '-') $('.lb-out', lb).click(); });
    window.addEventListener('resize', function () { if (lb.classList.contains('open')) fit(); });
    stage.addEventListener('wheel', function (e) { e.preventDefault(); var r = stage.getBoundingClientRect(); zoomAt(e.deltaY < 0 ? 1.15 : 1 / 1.15, e.clientX - r.left, e.clientY - r.top); }, { passive: false });
    stage.addEventListener('pointerdown', function (e) {
      stage.setPointerCapture(e.pointerId); pts[e.pointerId] = { x: e.clientX, y: e.clientY };
      var ids = Object.keys(pts);
      if (ids.length === 2) { var a = pts[ids[0]], b = pts[ids[1]]; pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), s: sc }; drag = null; }
      else { drag = { x: e.clientX - tx, y: e.clientY - ty };
        var now = Date.now(); if (now - lastTap < 300) { var r = stage.getBoundingClientRect(); if (sc > 1.05) { sc = 1; tx = ty = 0; apply(); } else zoomAt(2.5, e.clientX - r.left, e.clientY - r.top); } lastTap = now; }
    });
    stage.addEventListener('pointermove', function (e) {
      if (!pts[e.pointerId]) return; pts[e.pointerId] = { x: e.clientX, y: e.clientY };
      var ids = Object.keys(pts);
      if (pinch && ids.length === 2) { var a = pts[ids[0]], b = pts[ids[1]], d = Math.hypot(a.x - b.x, a.y - b.y), r = stage.getBoundingClientRect();
        zoomAt((pinch.s * d / pinch.d) / sc, (a.x + b.x) / 2 - r.left, (a.y + b.y) / 2 - r.top); }
      else if (drag && sc > 1) { tx = e.clientX - drag.x; ty = e.clientY - drag.y; clamp(); apply(); }
    });
    function up(e) { delete pts[e.pointerId]; if (Object.keys(pts).length < 2) pinch = null; if (!Object.keys(pts).length) drag = null; }
    stage.addEventListener('pointerup', up); stage.addEventListener('pointercancel', up);
    stage.addEventListener('click', function (e) { if (e.target === stage && sc === 1) close(); });
  }

  /* Country code picker */
  var CC = 'CY357,LB961,AE971,SA966,QA974,KW965,BH973,OM968,JO962,EG20,IQ964,SY963,IL972,PS970,TR90,GR30,GB44,IE353,DE49,AT43,CH41,FR33,BE32,NL31,LU352,IT39,ES34,PT351,PL48,CZ420,SK421,HU36,RO40,BG359,RS381,HR385,SI386,BA387,ME382,MK389,AL355,UA380,RU7,BY375,MD373,LT370,LV371,EE372,FI358,SE46,NO47,DK45,IS354,AM374,GE995,AZ994,KZ7,UZ998,US1,CA1,MX52,BR55,AR54,CL56,CO57,PE51,VE58,ZA27,NG234,KE254,GH233,MA212,DZ213,TN216,LY218,SD249,ET251,IR98,PK92,IN91,BD880,LK94,NP977,CN86,HK852,TW886,JP81,KR82,SG65,MY60,TH66,VN84,PH63,ID62,AU61,NZ64,MT356,MC377,AD376,LI423,SM378,CY357';
  var PRIORITY = ['CY', 'LB', 'AE', 'SA', 'QA', 'KW', 'GB', 'DE', 'PL', 'RU', 'GR'];
  var TZ = { 'Asia/Beirut': 'LB', 'Asia/Dubai': 'AE', 'Asia/Riyadh': 'SA', 'Asia/Qatar': 'QA', 'Asia/Kuwait': 'KW', 'Asia/Bahrain': 'BH', 'Asia/Muscat': 'OM', 'Asia/Amman': 'JO', 'Africa/Cairo': 'EG', 'Asia/Baghdad': 'IQ', 'Asia/Nicosia': 'CY', 'Asia/Famagusta': 'CY', 'Europe/Nicosia': 'CY', 'Europe/London': 'GB', 'Europe/Berlin': 'DE', 'Europe/Vienna': 'AT', 'Europe/Zurich': 'CH', 'Europe/Warsaw': 'PL', 'Europe/Moscow': 'RU', 'Europe/Athens': 'GR', 'Europe/Paris': 'FR', 'Europe/Kiev': 'UA', 'Europe/Kyiv': 'UA', 'Asia/Yerevan': 'AM', 'Europe/Istanbul': 'TR', 'Africa/Johannesburg': 'ZA' };
  var LANGDEF = { ar: 'LB', de: 'DE', pl: 'PL', ru: 'RU', en: 'GB' };
  var dn = null, dnEn = null;
  try { dn = new Intl.DisplayNames([LG], { type: 'region' }); dnEn = new Intl.DisplayNames(['en'], { type: 'region' }); } catch (e) {}
  function name(c, d) { try { return (d || dn) ? (d || dn).of(c) : c; } catch (e) { return c; } }
  function flag(c) { return String.fromCodePoint.apply(null, c.split('').map(function (x) { return 127397 + x.charCodeAt(0); })); }
  var seen = {}, list = CC.split(',').map(function (x) { return { c: x.slice(0, 2), d: x.slice(2) }; }).filter(function (o) { if (seen[o.c]) return false; seen[o.c] = 1; return true; });
  list.forEach(function (o) { o.n = name(o.c); });
  var top = PRIORITY.map(function (c) { return list.filter(function (o) { return o.c === c; })[0]; });
  var rest = list.filter(function (o) { return PRIORITY.indexOf(o.c) < 0; }).sort(function (a, b) { return a.n.localeCompare(b.n, LG); });
  var guess = null; try { guess = TZ[Intl.DateTimeFormat().resolvedOptions().timeZone]; } catch (e) {}
  guess = guess || LANGDEF[LG] || 'CY';

  $$('.lead-form').forEach(function (f) {
    var sel = $('select[name=cc]', f), ccv = $('.ccv', f);
    if (sel) {
      var opt = function (o) { return '<option value="' + o.c + '|' + o.d + '">' + flag(o.c) + ' ' + o.n + ' +' + o.d + '</option>'; };
      sel.innerHTML = top.map(opt).join('') + '<option disabled>──────────</option>' + rest.map(opt).join('');
      var upd = function () { var v = sel.value.split('|'); ccv.textContent = flag(v[0]) + ' +' + v[1]; };
      var g = list.filter(function (o) { return o.c === guess; })[0]; if (g) sel.value = g.c + '|' + g.d;
      sel.addEventListener('change', upd); upd();
    }
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var err = $('.formerr', f), num = $('[name="phone-num"]', f).value.replace(/[^\d]/g, '').replace(/^0+/, '');
      var nm = $('[name="your-name"]', f).value.trim(), em = $('[name="your-email"]', f).value.trim();
      if (!nm || num.length < 6 || !/^\S+@\S+\.\S+$/.test(em)) { err.textContent = CFG.err; err.hidden = false; return; }
      err.hidden = true;
      var v = sel ? sel.value.split('|') : ['', ''];
      $('[name=country]', f).value = v[0] ? name(v[0], dnEn) : '';
      var btn = $('button[type=submit]', f); btn.disabled = true; btn.style.opacity = '0.6';
      var fd = new FormData(f);
      fd.delete('cc'); fd.delete('phone-num');
      fd.set('your-phone', '+' + v[1] + ' ' + num);
      fd.set('consent', '1');
      fd.append('lang', f.getAttribute('data-lang'));
      fd.append('page', f.getAttribute('data-page') + ' · ' + location.pathname);
      fd.append('_wpcf7', CFG.formId); fd.append('_wpcf7_version', '6.2.4.1'); fd.append('_wpcf7_locale', 'en');
      fd.append('_wpcf7_unit_tag', 'wpcf7-f' + CFG.formId + '-o1'); fd.append('_wpcf7_container_post', '0');
      fetch(CFG.api, { method: 'POST', body: fd })
        .then(function (r) { return r.json(); })
        .then(function (j) {
          if (j && j.status === 'mail_sent') {
            f.hidden = true; var d = f.parentNode.querySelector('.lead-done'); if (d) d.classList.add('on');
            var w = f.parentNode.querySelector('.waline'); if (w) w.hidden = true;
            try { if (window.fbq) fbq('track', 'Lead'); if (window.gtag) gtag('event', 'generate_lead'); } catch (x) {}
          } else { err.textContent = (j && j.message) || CFG.err; err.hidden = false; }
        })
        .catch(function () { err.textContent = CFG.err; err.hidden = false; })
        .then(function () { btn.disabled = false; btn.style.opacity = '1'; });
    });
  });

  /* "Get price & floor plan" on a residence */
  $$('.ask').forEach(function (b) {
    b.addEventListener('click', function () {
      var u = b.getAttribute('data-unit');
      $$('.lead-form').forEach(function (f) { $('input[name=unit]', f).value = u; var pl = $('.pickline', f); pl.hidden = false; $('.pickval', pl).textContent = u; });
      var lead = $('#lead'); if (lead) lead.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* Film: load YouTube only on click */
  $$('.film-play').forEach(function (b) {
    b.addEventListener('click', function () {
      var w = b.parentNode, f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + b.getAttribute('data-yt') + '?autoplay=1&rel=0&modestbranding=1&playsinline=1';
      f.title = 'ASTERIA Residence film'; f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen'; f.allowFullscreen = true;
      f.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:0'; w.innerHTML = ''; w.appendChild(f);
      try { if (window.fbq) fbq('trackCustom', 'FilmPlay'); if (window.gtag) gtag('event', 'video_start', { video_title: 'ASTERIA film' }); } catch (e) {}
    });
  });

  /* Gentle reveal on scroll */
  var els = $$('.reveal');
  if ('IntersectionObserver' in window) {
    var ro = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('on'); ro.unobserve(en.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { ro.observe(el); });
  } else els.forEach(function (el) { el.classList.add('on'); });
})();
