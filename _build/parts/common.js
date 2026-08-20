/* ==========================================================================
   공용 스크립트 — 프레임워크 없이 표준 DOM API 만 쓴다.
   원본은 React + Supabase 였지만, 강의실이 폐쇄망이라 네트워크를 쓰지 않는다.
   진도는 localStorage 한 곳에만 남긴다.
   ========================================================================== */
(function () {
  'use strict';

  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var STORE = 'nonghyupsaryo_progress';   // 원본과 같은 접두사

  /* --- 진도: 읽기/쓰기 ------------------------------------------------- */
  function readProgress() {
    try { return JSON.parse(localStorage.getItem(STORE) || '{}'); }
    catch (e) { return {}; }              // 값이 깨졌으면 빈 것으로 시작한다
  }
  function writeProgress(p) {
    try { localStorage.setItem(STORE, JSON.stringify(p)); } catch (e) {}
  }
  function isDone(key) { return !!readProgress()[key]; }
  function setDone(key, on) {
    var p = readProgress();
    if (on) p[key] = new Date().toISOString(); else delete p[key];
    writeProgress(p);
  }

  /* --- 1) 사이드바 서랍 ------------------------------------------------- */
  function initSidebar() {
    var btn = $('.hd__burger'), sb = $('.sb');
    if (!btn || !sb) return;

    var scrim = document.createElement('div');
    scrim.className = 'sb__scrim';
    document.body.appendChild(scrim);

    function setOpen(open) {
      sb.classList.toggle('open', open);
      scrim.classList.toggle('on', open);
      btn.setAttribute('aria-expanded', String(open));
      // 서랍이 열린 동안 뒤 본문이 스크롤되지 않게 잠근다
      document.body.style.overflow = open && window.innerWidth <= 1024 ? 'hidden' : '';
    }
    btn.addEventListener('click', function () {
      setOpen(!sb.classList.contains('open'));
    });
    scrim.addEventListener('click', function () { setOpen(false); });
    sb.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && sb.classList.contains('open')) { setOpen(false); btn.focus(); }
    });
    window.matchMedia('(min-width: 1025px)').addEventListener('change', function (m) {
      if (m.matches) setOpen(false);
    });

    // 열려 있는 메뉴 항목이 보이도록 사이드바를 스크롤해 둔다
    var on = $('.sb a.sb__item.on');
    if (on) {
      var t = on.offsetTop - sb.clientHeight / 2;
      if (t > 0) sb.scrollTop = t;
    }
  }

  /* --- 2) 프롬프트 복사 ------------------------------------------------- */
  function initCopy() {
    $$('.copy-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var pre = $('pre', btn.closest('.b-prompt__box'));
        if (!pre) return;
        var text = pre.textContent;

        function ok() {
          var old = btn.textContent;
          btn.textContent = '복사됨';
          btn.classList.add('done');
          setTimeout(function () { btn.textContent = old; btn.classList.remove('done'); }, 1600);
        }
        // file:// 에서는 clipboard API 가 막히는 브라우저가 있어 대비책을 둔다
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(text).then(ok, fallback);
        } else fallback();

        function fallback() {
          var ta = document.createElement('textarea');
          ta.value = text;
          ta.style.cssText = 'position:fixed;top:-1000px';
          document.body.appendChild(ta);
          ta.select();
          try { document.execCommand('copy'); ok(); } catch (e) { btn.textContent = '복사 실패'; }
          document.body.removeChild(ta);
        }
      });
    });
  }

  /* --- 3) 진도 체크 버튼 ------------------------------------------------ */
  function initDone() {
    $$('[data-done]').forEach(function (btn) {
      var key = btn.dataset.done;
      function paint() {
        var on = isDone(key);
        btn.classList.toggle('on', on);
        btn.setAttribute('aria-pressed', String(on));
        btn.textContent = on ? '✓ 학습 완료' : '학습 완료로 표시';
      }
      btn.addEventListener('click', function () { setDone(key, !isDone(key)); paint(); });
      paint();
    });
  }

  /* --- 4) 사이드바·목록에 완료 표시 ------------------------------------- */
  function paintDoneMarks() {
    var p = readProgress();
    $$('[data-done-mark]').forEach(function (el) {
      if (p[el.dataset.doneMark]) el.classList.add('is-done');
    });
  }

  /* --- 5) 본문 목차 스크롤 추적 ----------------------------------------- */
  function initSpy() {
    var links = $$('.sb__sub a[href^="#"]');
    if (!links.length || !('IntersectionObserver' in window)) return;
    var map = {};
    links.forEach(function (a) {
      var el = document.getElementById(a.getAttribute('href').slice(1));
      if (el) map[el.id] = a;
    });
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) { a.style.color = ''; a.style.fontWeight = ''; });
        var a = map[e.target.id];
        if (a) { a.style.color = 'var(--b700)'; a.style.fontWeight = '800'; }
      });
    }, { rootMargin: '-25% 0px -65% 0px' });
    Object.keys(map).forEach(function (id) { io.observe(document.getElementById(id)); });
  }

  function boot() {
    initSidebar(); initCopy(); initDone(); paintDoneMarks(); initSpy();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  // 페이지별 스크립트가 쓸 수 있게 최소한만 내보낸다
  window.NH = { $: $, $$: $$, readProgress: readProgress, setDone: setDone, isDone: isDone, STORE: STORE };
})();
