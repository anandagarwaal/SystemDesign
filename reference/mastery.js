// Shared spaced-repetition + chunk-gating engine for System Design lessons.
// One file, reused by every lesson via <script src="../reference/mastery.js"></script>.
// Storage key: sd-mastery-v1 -> { [conceptId]: { ef, interval, due, reps, lapses } }
(function(global){
  var KEY = 'sd-mastery-v1';

  function loadAll(){
    try { return JSON.parse(localStorage.getItem(KEY) || '{}'); }
    catch(e){ return {}; }
  }
  function saveAll(state){
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch(e){}
  }

  // SM-2-lite: grade is 0 (wrong / needed a retry) or 1 (correct first try).
  function review(conceptId, grade){
    var state = loadAll();
    var c = state[conceptId] || { ef: 2.5, interval: 0, reps: 0, lapses: 0, due: 0 };
    var now = Date.now();
    if (grade === 0){
      c.lapses += 1;
      c.reps = 0;
      c.interval = 1; // see it again tomorrow
      c.ef = Math.max(1.3, c.ef - 0.2);
    } else {
      c.reps += 1;
      if (c.reps === 1) c.interval = 1;
      else if (c.reps === 2) c.interval = 3;
      else c.interval = Math.round(c.interval * c.ef);
      c.ef = Math.min(2.8, c.ef + 0.05);
    }
    c.due = now + c.interval * 86400000;
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

  function status(conceptId){
    var state = loadAll();
    return state[conceptId] || null;
  }

  global.SDMastery = { review: review, due: due, status: status, loadAll: loadAll };

  // ---- Chunk gating ----------------------------------------------------
  // Wires up <section class="chunk" data-chunk="N" id="chunk-N"> blocks so
  // chunk N+1 stays hidden until every .gate-q inside chunk N is answered
  // correctly. Wrong answers show a hint and re-enable the question; no
  // free pass. Intuition questions (data-type="intuition") are required
  // exactly like recall questions — no shortcutting past them.
  function wireChunks(){
    var chunks = Array.prototype.slice.call(document.querySelectorAll('.chunk'));
    if (!chunks.length) return;

    chunks.forEach(function(chunk, idx){
      var isFirst = idx === 0;
      if (!isFirst) chunk.setAttribute('hidden', '');

      var gate = chunk.querySelector('.gate');
      if (!gate) { return; }
      var questions = Array.prototype.slice.call(gate.querySelectorAll('.q'));
      var solved = new Set();

      questions.forEach(function(q){
        var correct = q.dataset.correct;
        var opts = Array.prototype.slice.call(q.querySelectorAll('.opt'));
        var fb = q.querySelector('.fb');
        var hint = q.querySelector('.hint');
        var conceptId = q.dataset.concept || (chunk.id + '-q' + questions.indexOf(q));

        opts.forEach(function(opt, i){
          opt.addEventListener('click', function(){
            var letter = ['a','b','c','d'][i];
            if (letter === correct){
              opts.forEach(function(o){ o.disabled = true; o.classList.remove('wrong'); });
              opt.classList.add('correct');
              if (fb) fb.classList.add('show');
              if (hint) hint.classList.remove('show');
              var firstTry = !q.dataset.missed;
              SDMastery.review(conceptId, firstTry ? 1 : 0);
              solved.add(q);
              maybeUnlock();
            } else {
              opt.classList.add('wrong');
              q.dataset.missed = '1';
              if (hint) hint.classList.add('show');
              // stays enabled: learner must pick again, no skipping the check.
            }
          });
        });
      });

      function maybeUnlock(){
        if (solved.size !== questions.length) return;
        var next = chunks[idx + 1];
        if (next){
          next.removeAttribute('hidden');
          next.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          document.dispatchEvent(new CustomEvent('sd:lesson-complete'));
        }
      }
    });
  }

  document.addEventListener('DOMContentLoaded', wireChunks);
})(window);
