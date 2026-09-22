// Shared spaced-repetition + lesson-check engine for System Design lessons.
// One file, reused by every lesson via <script src="../reference/mastery.js"></script>
// and by reference/review.html.
// Storage keys:
//   sd-mastery-v1  -> { [conceptId]: { ef, interval, due, reps, lapses, last } }
//   sd-progress-v1 -> [ "lessons/NNNN-x.html", ... ]  (lessons completed; shared with index.html)
(function(global){
  var KEY = 'sd-mastery-v1';
  var PROGRESS_KEY = 'sd-progress-v1';
  var DAY = 86400000;

  function loadAll(){
    try { return JSON.parse(localStorage.getItem(KEY) || '{}'); }
    catch(e){ return {}; }
  }
  function saveAll(state){
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch(e){}
  }

  // SM-2-lite: grade is 0 (wrong / needed a retry) or 1 (correct first try).
  // A correct answer before the concept is due doesn't stretch the interval —
  // rereading a lesson the same day shouldn't count as spaced retrieval.
  // A miss always counts, whenever it happens.
  function review(conceptId, grade){
    var state = loadAll();
    var c = state[conceptId] || { ef: 2.5, interval: 0, reps: 0, lapses: 0, due: 0 };
    var now = Date.now();
    if (grade === 0){
      c.lapses += 1;
      c.reps = 0;
      c.interval = 1; // see it again tomorrow
      c.ef = Math.max(1.3, c.ef - 0.2);
      c.due = now + DAY;
    } else if (c.reps === 0 || now >= c.due){
      c.reps += 1;
      if (c.reps === 1) c.interval = 1;
      else if (c.reps === 2) c.interval = 3;
      else c.interval = Math.round(c.interval * c.ef);
      c.ef = Math.min(2.8, c.ef + 0.05);
      c.due = now + c.interval * DAY;
    }
    c.last = now;
    state[conceptId] = c;
    saveAll(state);
    return c;
  }

  // Concepts due for review right now (due <= now), sorted most-overdue first.
  function due(){
    var state = loadAll();
    var now = Date.now();
    return Object.keys(state)
      .filter(function(id){ return state[id].due <= now; })
      .sort(function(a,b){ return state[a].due - state[b].due; });
  }

  // Concepts missed at least once and not yet re-learned to a 3-day interval.
  function weak(){
    var state = loadAll();
    return Object.keys(state)
      .filter(function(id){ return state[id].lapses > 0 && state[id].interval < 3; })
      .sort(function(a,b){ return state[b].lapses - state[a].lapses; });
  }

  function status(conceptId){
    var state = loadAll();
    return state[conceptId] || null;
  }

  function loadProgress(){
    try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '[]'); }
    catch(e){ return []; }
  }
  function markLessonDone(key){
    var done = loadProgress();
    if (done.indexOf(key) === -1){
      done.push(key);
      try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(done)); } catch(e){}
    }
  }

  // The learner's own-words answers to intuition questions, kept so the
  // review report can show the teacher *how* they were thinking on a miss.
  var ANSWERS_KEY = 'sd-answers-v1';
  function saveAnswer(conceptId, text, correct, self){
    try {
      var all = JSON.parse(localStorage.getItem(ANSWERS_KEY) || '{}');
      all[conceptId] = { text: text.slice(0, 600), correct: !!correct, self: self || null, when: Date.now() };
      var ids = Object.keys(all).sort(function(a, b){ return all[b].when - all[a].when; });
      ids.slice(300).forEach(function(id){ delete all[id]; }); // keep the most recent 300
      localStorage.setItem(ANSWERS_KEY, JSON.stringify(all));
    } catch(e){}
  }
  function loadAnswers(){
    try { return JSON.parse(localStorage.getItem(ANSWERS_KEY) || '{}'); } catch(e){ return {}; }
  }

  function shuffleInPlace(a){
    for (var i = a.length - 1; i > 0; i--){ var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }

  // Intuition questions: write the answer in your own words before the options
  // appear. Generating the idea first is the point; it also makes surface cues
  // in the options (length, wording) useless as a shortcut.
  var MIN_WORDS = 6;
  function commitFirst(container, beforeEl, opts, onReveal){
    opts.forEach(function(o){ o.style.display = 'none'; });
    var box = document.createElement('div');
    box.className = 'sd-commit';
    box.innerHTML = '<textarea rows="3" placeholder="In your own words: why? Picture the mechanism. (Options appear after you commit.)"></textarea>' +
      '<button type="button" class="sd-commit-btn" disabled>Commit my answer → show options</button>' +
      '<span class="sd-commit-note">Write at least a full sentence. Recall first, then check.</span>';
    container.insertBefore(box, beforeEl);
    var ta = box.querySelector('textarea'), btn = box.querySelector('button');
    ta.addEventListener('input', function(){
      btn.disabled = ta.value.trim().split(/\s+/).filter(Boolean).length < MIN_WORDS;
    });
    btn.addEventListener('click', function(){
      ta.readOnly = true; btn.remove();
      box.querySelector('.sd-commit-note').textContent = 'Your answer. Now pick the option that matches your reasoning, and compare.';
      opts.forEach(function(o){ o.style.display = ''; });
      onReveal(ta.value.trim());
    });
  }

  // ---- Self-grading the written answer -------------------------------
  // The multiple choice only proves you can recognize the right idea. The
  // written answer is where you find out whether you could produce it, so it
  // gets graded against the model answer, and the grade — not the click —
  // decides when the concept comes back.
  function rubricPoints(modelAnswerHtml, fbHtml){
    var pts = [];
    var model = (modelAnswerHtml || '').trim();
    if (model) pts.push(model);
    var fb = (fbHtml || '').replace(/<[^>]+>/g, function(t){ return t; }).trim();
    // Split the feedback into its clauses: each one is a point the answer should make.
    fb.split(/(?:\.\s+|;\s+|\s+—\s+)/).forEach(function(part){
      part = part.trim().replace(/[.;]$/, '');
      if (part.length > 25 && pts.length < 3) pts.push(part);
    });
    return pts;
  }

  var GRADES = [
    { key: 'hit', label: 'Hit — I said the mechanism', note: 'Counts as correct only if you also picked the right option first try.' },
    { key: 'partial', label: 'Partial — right idea, missed a point', note: 'Comes back tomorrow.' },
    { key: 'miss', label: 'Miss — I could not produce it', note: 'Comes back tomorrow.' }
  ];

  function selfGrade(container, beforeEl, written, modelAnswerHtml, fbHtml, onGrade){
    var pts = rubricPoints(modelAnswerHtml, fbHtml);
    var box = document.createElement('div');
    box.className = 'sd-grade';
    box.innerHTML = '<p class="sd-grade-h">Grade your own answer</p>' +
      '<p class="sd-grade-sub">You wrote:</p><blockquote class="sd-grade-mine"></blockquote>' +
      '<p class="sd-grade-sub">A full answer says:</p><ul class="sd-grade-rubric">' +
      pts.map(function(p){ return '<li>' + p + '</li>'; }).join('') + '</ul>' +
      '<div class="sd-grade-btns">' + GRADES.map(function(g){
        return '<button type="button" class="sd-grade-btn" data-g="' + g.key + '">' + g.label + '</button>';
      }).join('') + '</div>' +
      '<span class="sd-commit-note">Be strict: recognizing the answer is not the same as having produced it.</span>';
    container.insertBefore(box, beforeEl || null);
    box.querySelector('.sd-grade-mine').textContent = written;
    Array.prototype.forEach.call(box.querySelectorAll('.sd-grade-btn'), function(b){
      b.addEventListener('click', function(){
        var g = b.dataset.g;
        Array.prototype.forEach.call(box.querySelectorAll('.sd-grade-btn'), function(o){
          o.disabled = true; o.classList.toggle('picked', o === b);
        });
        var note = GRADES.filter(function(x){ return x.key === g; })[0].note;
        box.querySelector('.sd-commit-note').textContent = note;
        onGrade(g);
      });
    });
    return box;
  }

  function injectStyle(){
    if (document.getElementById('sd-mastery-style')) return;
    var st = document.createElement('style');
    st.id = 'sd-mastery-style';
    st.textContent = '.sd-commit{margin:.4rem 0 .6rem}' +
      '.sd-commit textarea{width:100%;box-sizing:border-box;font:inherit;font-family:-apple-system,BlinkMacSystemFont,sans-serif;font-size:.9rem;' +
      'padding:.55rem .7rem;border:1px solid #e3ddd0;border-radius:6px;background:#fffefb;resize:vertical}' +
      '.sd-commit textarea[readonly]{background:#f3ece1;color:#1a1a1a}' +
      '.sd-commit-btn{margin-top:.4rem;font-family:-apple-system,sans-serif;font-size:.82rem;font-weight:600;padding:.4rem .8rem;border-radius:6px;' +
      'border:1px solid #1f4d3f;background:#1f4d3f;color:#fff;cursor:pointer}' +
      '.sd-commit-btn:disabled{opacity:.45;cursor:default}' +
      '.sd-commit-note{display:block;font-family:-apple-system,sans-serif;font-size:.75rem;color:#6b6356;margin-top:.3rem}' +
      '.sd-grade{margin:.8rem 0 .2rem;padding:.8rem 1rem;border:1px solid #e3ddd0;border-left:3px solid #1f4d3f;border-radius:6px;background:#fffefb;' +
      'font-family:-apple-system,BlinkMacSystemFont,sans-serif}' +
      '.sd-grade-h{margin:0 0 .5rem;font-size:.72rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#1f4d3f}' +
      '.sd-grade-sub{margin:.5rem 0 .2rem;font-size:.78rem;color:#6b6356}' +
      '.sd-grade-mine{margin:0;padding:.4rem .7rem;border-left:2px solid #e3ddd0;font-size:.88rem;color:#1a1a1a;font-style:italic}' +
      '.sd-grade-rubric{margin:.2rem 0 .6rem;padding-left:1.1rem;font-size:.88rem}' +
      '.sd-grade-rubric li{margin:.2rem 0}' +
      '.sd-grade-btns{display:flex;flex-wrap:wrap;gap:.4rem;margin:.5rem 0 .2rem}' +
      '.sd-grade-btn{font:inherit;font-size:.82rem;padding:.4rem .7rem;border:1px solid #e3ddd0;border-radius:6px;background:#fbf9f4;cursor:pointer}' +
      '.sd-grade-btn:hover{border-color:#7a2e1d}' +
      '.sd-grade-btn:disabled{opacity:.45;cursor:default}' +
      '.sd-grade-btn.picked{background:#e7f0ec;border-color:#1f4d3f;color:#1f4d3f;font-weight:600;opacity:1}';
    document.head.appendChild(st);
  }

  global.SDMastery = { review: review, due: due, weak: weak, status: status, loadAll: loadAll,
                       loadProgress: loadProgress, markLessonDone: markLessonDone,
                       saveAnswer: saveAnswer, loadAnswers: loadAnswers,
                       commitFirst: commitFirst, selfGrade: selfGrade, injectStyle: injectStyle,
                       shuffle: shuffleInPlace };

  // ---- Lesson checks ---------------------------------------------------
  // Every <section class="chunk"> is visible from the start: the lesson is
  // there to be read. The .gate after each chunk is retrieval practice, not a
  // lock — answering feeds the spaced-review schedule, and skipping one only
  // costs you the practice. Wrong answers still show a hint and stay open, so
  // a question you do attempt is one you have to actually get right.
  function lessonKey(){
    var m = location.pathname.match(/lessons\/[^\/]+\.html$/);
    return m ? m[0] : null;
  }

  function wireChunks(){
    var chunks = Array.prototype.slice.call(document.querySelectorAll('.chunk'));
    if (!chunks.length) return;
    injectStyle();
    var key = lessonKey();

    // Nothing is hidden; strip any leftover [hidden] from older lesson markup.
    chunks.forEach(function(chunk){ chunk.removeAttribute('hidden'); });

    var allQuestions = Array.prototype.slice.call(document.querySelectorAll('.gate .q'));
    var solved = new Set();
    function noteSolved(q){
      solved.add(q);
      if (solved.size === allQuestions.length){
        if (key) markLessonDone(key);
        showComplete();
        document.dispatchEvent(new CustomEvent('sd:lesson-complete'));
      }
    }

    chunks.forEach(function(chunk){
      var gate = chunk.querySelector('.gate');
      if (!gate) return;
      var questions = Array.prototype.slice.call(gate.querySelectorAll('.q'));

      questions.forEach(function(q){
        var correct = q.dataset.correct;
        var opts = Array.prototype.slice.call(q.querySelectorAll('.opt'));
        var fb = q.querySelector('.fb');
        var hint = q.querySelector('.hint');
        var conceptId = q.dataset.concept || (chunk.id + '-q' + questions.indexOf(q));
        var written = null;

        // Remember each option's authored letter, then shuffle the display
        // order so a reread can't be passed by remembering "it was b".
        opts.forEach(function(opt, i){ opt.dataset.letter = ['a','b','c','d'][i]; });
        shuffleInPlace(opts.slice()).forEach(function(opt){ q.insertBefore(opt, fb || null); });
        opts = Array.prototype.slice.call(q.querySelectorAll('.opt'));

        if (q.dataset.type === 'intuition'){
          commitFirst(q, opts[0], opts, function(text){ written = text; });
        }

        opts.forEach(function(opt){
          opt.addEventListener('click', function(){
            var letter = opt.dataset.letter;
            if (letter === correct){
              opts.forEach(function(o){ o.disabled = true; o.classList.remove('wrong'); });
              opt.classList.add('correct');
              if (fb) fb.classList.add('show');
              if (hint) hint.classList.remove('show');
              var firstTry = !q.dataset.missed;
              if (written !== null){
                // Written answer: the self-grade decides, not the click.
                selfGrade(q, fb, written, opt.innerHTML, fb ? fb.innerHTML : '', function(g){
                  SDMastery.saveAnswer(conceptId, written, firstTry, g);
                  SDMastery.review(conceptId, (g === 'hit' && firstTry) ? 1 : 0);
                  noteSolved(q);
                });
              } else {
                SDMastery.review(conceptId, firstTry ? 1 : 0);
                noteSolved(q);
              }
            } else {
              opt.classList.add('wrong');
              q.dataset.missed = '1';
              if (hint) hint.classList.add('show');
              // stays enabled: learner must pick again, no skipping the check.
            }
          });
        });
      });
    });
  }

  function showComplete(){
    if (document.getElementById('sd-complete')) return;
    var last = document.querySelector('.chunk:last-of-type') || document.querySelectorAll('.chunk')[document.querySelectorAll('.chunk').length - 1];
    var box = document.createElement('div');
    box.id = 'sd-complete';
    box.className = 'staff';
    box.innerHTML = '<span class="tag">Lesson complete</span>' +
      'Every question you answered here is now on your spaced-review schedule. ' +
      'Misses come back tomorrow; solid answers come back in 1, 3, then ~7+ days. ' +
      'Start your next session with <a href="../reference/review.html">today’s review</a> before any new lesson, ' +
      'and when you finish a whole section, take its <a href="../reference/review.html#exam">cumulative section exam</a>.';
    last.parentNode.insertBefore(box, last.nextSibling);
  }

  document.addEventListener('DOMContentLoaded', wireChunks);
})(window);
