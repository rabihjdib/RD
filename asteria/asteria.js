(function () {
  var ON = 'min-height: 48px; padding: 0 22px; font: inherit; font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase; cursor: pointer; border: 1px solid #4A4233; background: #4A4233; color: #F4F0E8';
  var OFF = 'min-height: 48px; padding: 0 22px; font: inherit; font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase; cursor: pointer; border: 1px solid #CFC6B6; background: transparent; color: #2A251D';
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  // Floor tabs
  $$('.ftab').forEach(function (t) {
    t.addEventListener('click', function () {
      var f = t.getAttribute('data-floor');
      $$('.ftab').forEach(function (x) { var on = x === t; x.setAttribute('aria-selected', on ? 'true' : 'false'); x.setAttribute('style', on ? ON : OFF); });
      $$('.fpane').forEach(function (p) { p.style.display = p.getAttribute('data-floor') === f ? 'flex' : 'none'; });
    });
  });

  // Interior tabs
  $$('.itab').forEach(function (t) {
    t.addEventListener('click', function () {
      var img = document.getElementById('intimg');
      if (img) { img.src = t.getAttribute('data-src'); img.alt = t.textContent; }
      $$('.itab').forEach(function (x) { var on = x === t; x.setAttribute('aria-pressed', on ? 'true' : 'false'); x.setAttribute('style', on ? ON : OFF); });
    });
  });

  // "Get price & floor plan" on a unit card
  $$('.ask').forEach(function (b) {
    b.addEventListener('click', function () {
      var u = b.getAttribute('data-unit');
      $$('.lead-form').forEach(function (f) {
        f.querySelector('input[name=unit]').value = u;
        var pl = f.querySelector('.pickline'); pl.hidden = false; pl.querySelector('.pickval').textContent = u;
      });
      var lead = document.getElementById('lead');
      if (lead) lead.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Lead forms -> Contact Form 7
  $$('.lead-form').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var err = f.querySelector('.formerr');
      var ok = f.querySelector('[name="your-name"]').value.trim() && f.querySelector('[name="your-phone"]').value.trim() &&
        /\S+@\S+\.\S+/.test(f.querySelector('[name="your-email"]').value) && f.querySelector('[name="consent"]').checked;
      if (!ok) { err.textContent = window.ASTERIA.err; err.hidden = false; return; }
      err.hidden = true;
      var btn = f.querySelector('button[type=submit]'); btn.disabled = true; btn.style.opacity = '0.6';
      var fd = new FormData(f);
      fd.append('lang', f.getAttribute('data-lang'));
      fd.append('page', f.getAttribute('data-page') + ' · ' + location.pathname);
      fd.append('_wpcf7', window.ASTERIA.formId);
      fd.append('_wpcf7_version', '6.2.4.1');
      fd.append('_wpcf7_locale', 'en');
      fd.append('_wpcf7_unit_tag', 'wpcf7-f' + window.ASTERIA.formId + '-o1');
      fd.append('_wpcf7_container_post', '0');
      fetch(window.ASTERIA.api, { method: 'POST', body: fd })
        .then(function (r) { return r.json(); })
        .then(function (j) {
          if (j && j.status === 'mail_sent') {
            f.hidden = true; var done = f.parentNode.querySelector('.lead-done'); if (done) done.hidden = false;
            if (window.fbq) window.fbq('track', 'Lead');
            if (window.gtag) window.gtag('event', 'generate_lead');
          } else { err.textContent = (j && j.message) || window.ASTERIA.err; err.hidden = false; }
        })
        .catch(function () { err.textContent = window.ASTERIA.err; err.hidden = false; })
        .then(function () { btn.disabled = false; btn.style.opacity = '1'; });
    });
  });

  // Gentle reveal on scroll
  var els = $$('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('on'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { io.observe(el); });
  } else { els.forEach(function (el) { el.classList.add('on'); }); }
})();

document.querySelectorAll('.film-play').forEach(function(b){b.addEventListener('click',function(){var w=b.parentNode,f=document.createElement('iframe');f.src='https://www.youtube-nocookie.com/embed/'+b.dataset.yt+'?autoplay=1&rel=0&modestbranding=1&playsinline=1';f.title='ASTERIA Residence film';f.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';f.allowFullscreen=true;f.style.cssText='position:absolute;inset:0;width:100%;height:100%;border:0';w.innerHTML='';w.appendChild(f);try{if(window.fbq)fbq('trackCustom','FilmPlay');if(window.gtag)gtag('event','video_start',{video_title:'ASTERIA film'});}catch(e){}});});
