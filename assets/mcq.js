/* mcq.js - mobile-first multiple choice for csc2050-lessons.
   Mobbin-inspired: segmented progress (Quizlet/Ahead), lettered full-width
   options (Noom), inline per-option feedback (Udemy), dashed-green "this was
   right" outline after a miss (Quizlet). Styled by assets/csc.css.

   Per lesson, define the questions BEFORE this script loads:
     window.QUIZ = {
       race1: {
         tag: "3.1 Race conditions",             // small eyebrow above the question
         q: "Question text (HTML ok)",
         code: "optional code shown under the question",
         opts: [ { t: "option text (HTML ok)", why: "why this option is right/wrong" }, ... ],
         a: 1                                    // 0-based index of the correct option
       }, ...
     };
   Place each question in the reading flow with <div class="mcq" data-q="race1"></div>.
   Answers persist per lesson in localStorage; the results card offers a reset. */
(function () {
  'use strict';
  var QUIZ = window.QUIZ || {};
  var PAGE = location.pathname.split('/').pop() || 'index';
  var KEY = 'csc2050:' + PAGE + ':';
  var LETTERS = 'ABCDEF';
  var cards = [];

  function store(id, v) { try { localStorage.setItem(KEY + id, String(v)); } catch (e) {} }
  function load(id) { try { var v = localStorage.getItem(KEY + id); return v === null ? null : +v; } catch (e) { return null; } }

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  function build(el, n, total) {
    var id = el.getAttribute('data-q');
    var d = QUIZ[id];
    if (!d) { el.textContent = 'Missing question: ' + id; return null; }
    el.id = 'q-' + id;
    var html =
      '<div class="mcq-head"><span class="mcq-tag">' + (d.tag || 'Checkpoint') + '</span>' +
      '<span class="mcq-count">' + n + ' / ' + total + '</span></div>' +
      '<p class="mcq-q">' + d.q + '</p>' +
      (d.code ? '<pre class="mcq-code"><code>' + esc(d.code) + '</code></pre>' : '') +
      '<div class="mcq-opts" role="radiogroup">';
    d.opts.forEach(function (o, i) {
      html += '<button class="mcq-opt" type="button" role="radio" aria-checked="false" data-i="' + i + '">' +
        '<span class="mcq-letter">' + LETTERS[i] + '</span><span class="mcq-text">' + o.t + '</span>' +
        '<span class="mcq-mark" aria-hidden="true"></span></button>';
    });
    html += '</div><div class="mcq-fb" aria-live="polite"></div>';
    el.innerHTML = html;
    var card = { id: id, el: el, d: d, picked: null };
    el.querySelectorAll('.mcq-opt').forEach(function (b) {
      b.addEventListener('click', function () { answer(card, +b.getAttribute('data-i'), true); });
    });
    return card;
  }

  function answer(card, i, fresh) {
    if (card.picked !== null) return;
    card.picked = i;
    var d = card.d, ok = i === d.a;
    var opts = card.el.querySelectorAll('.mcq-opt');
    opts.forEach(function (b, j) {
      b.disabled = true;
      if (j === i) { b.classList.add(ok ? 'is-right' : 'is-wrong'); b.setAttribute('aria-checked', 'true'); }
      else if (j === d.a) b.classList.add('is-answer');
      else b.classList.add('is-dim');
    });
    var fb = '<div class="mcq-verdict ' + (ok ? 'ok' : 'no') + '">' + (ok ? 'Correct' : 'Not quite') + '</div>' +
      '<p>' + d.opts[i].why + '</p>';
    if (!ok) fb += '<p class="mcq-right"><span>Answer ' + LETTERS[d.a] + '</span> ' + d.opts[d.a].why + '</p>';
    var fbEl = card.el.querySelector('.mcq-fb');
    fbEl.innerHTML = fb;
    fbEl.classList.add('show');
    card.el.classList.add(ok ? 'done-ok' : 'done-no');
    if (fresh) {
      store(card.id, i);
      if (!ok && navigator.vibrate) navigator.vibrate(18);
    }
    update();
  }

  /* ---------- sticky segmented progress bar ---------- */
  var bar, segs, scoreEl;
  function buildBar() {
    bar = document.createElement('div');
    bar.className = 'qbar';
    var s = '<div class="qbar-segs">';
    cards.forEach(function (c, i) { s += '<a class="qbar-seg" href="#q-' + c.id + '" aria-label="Question ' + (i + 1) + '"></a>'; });
    s += '</div><span class="qbar-score">0/' + cards.length + '</span>';
    bar.innerHTML = s;
    document.body.insertBefore(bar, document.body.firstChild);
    segs = bar.querySelectorAll('.qbar-seg');
    scoreEl = bar.querySelector('.qbar-score');
  }

  function update() {
    if (!segs) return;
    var right = 0, done = 0;
    cards.forEach(function (c, i) {
      segs[i].className = 'qbar-seg' + (c.picked === null ? '' : (c.picked === c.d.a ? ' ok' : ' no'));
      if (c.picked !== null) { done++; if (c.picked === c.d.a) right++; }
    });
    scoreEl.textContent = right + '/' + cards.length;
    var res = document.getElementById('results');
    if (!res) return;
    if (done < cards.length) {
      res.innerHTML = '<p class="res-wait">' + (cards.length - done) + ' checkpoint' +
        (cards.length - done === 1 ? '' : 's') + ' left. Your score shows up here when you finish.</p>';
      return;
    }
    var missed = cards.filter(function (c) { return c.picked !== c.d.a; });
    var pct = Math.round(100 * right / cards.length);
    var h = '<div class="res-score"><span>' + right + '</span>/' + cards.length + '</div>' +
      '<p class="res-line">' + (pct >= 90 ? 'Locked in. You are ready for the quiz.' :
        pct >= 70 ? 'Solid. Re-read the sections you missed below.' :
        'Re-read the missed sections, then reset and run it again.') + '</p>';
    if (missed.length) {
      h += '<div class="res-missed"><span class="res-label">Review these</span>';
      missed.forEach(function (c) { h += '<a href="#q-' + c.id + '">' + (c.d.tag || c.id) + '</a>'; });
      h += '</div>';
    }
    h += '<button class="res-reset" type="button">Reset this lesson</button>';
    res.innerHTML = h;
    res.querySelector('.res-reset').addEventListener('click', function () {
      cards.forEach(function (c) { try { localStorage.removeItem(KEY + c.id); } catch (e) {} });
      location.reload();
    });
  }

  function init() {
    var els = document.querySelectorAll('.mcq[data-q]');
    els.forEach(function (el, i) { var c = build(el, i + 1, els.length); if (c) cards.push(c); });
    if (!cards.length) return;
    buildBar();
    cards.forEach(function (c) { var v = load(c.id); if (v !== null && v < c.d.opts.length) answer(c, v, false); });
    update();
  }
  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
