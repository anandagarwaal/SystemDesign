"""Convert an old single-quiz lesson into the gated-chunk (Math Academy) format.

Usage: python3 tools/convert_lesson.py lessons/NNNN-x.html specs/NNNN.py

The spec module defines:
  GATES  = [[q, q, ...], ...]   one list per content chunk (in order)
  SPLITS = [...]                optional: h2-text prefixes where concept-lesson chunks start
  FINAL  = {"meta": [(concept, hint, is_intuition), ...] for the old quiz's questions,
            "extra": [q, ...]}  extra final questions
  q = (kind 'r'|'i', correct 'a'-'d', concept_id, stem, [opts], feedback, hint)
Case studies (with div.phase markers) are split on phases; phase-7 + wrap-up share a chunk.
"""
import re, sys, runpy, html

GATE_CSS = """
  /* ---- Gated chunks ---- */
  .chunk{margin:2.6rem 0; padding-top:.2rem;}
  .chunk[hidden]{display:none;}
  .chunk-label{font-family:-apple-system,sans-serif; font-size:.7rem; font-weight:700; letter-spacing:.12em;
    text-transform:uppercase; color:var(--muted); margin:0 0 .3rem;}
  .gate{background:#fff; border:1px solid var(--rule); border-radius:8px; padding:1.2rem 1.4rem; margin:1.2rem 0 0;}
  .gate .gate-lbl{font-family:-apple-system,sans-serif; font-size:.7rem; font-weight:700; letter-spacing:.12em;
    text-transform:uppercase; color:var(--accent); margin:0 0 .6rem; display:block;}
  .q[data-type="intuition"] .stem::before{content:"Why / intuition — "; color:var(--staff); font-weight:700;}
  .opt:disabled{cursor:default;}
  .hint{font-size:.85rem; margin:.5rem 0 0; display:none; color:var(--accent); font-style:italic;}
  .hint.show{display:block;}
  .locked-note{font-size:.85rem; color:var(--muted); font-style:italic; margin:1.5rem 0;}
"""

def q_html(q, ind="      "):
    kind, correct, concept, stem, opts, fb, hint = q
    t = ' data-type="intuition"' if kind == 'i' else ''
    out = [f'{ind}<div class="q"{t} data-correct="{correct}" data-concept="{concept}">',
           f'{ind}  <p class="stem">{stem}</p>']
    out += [f'{ind}  <button class="opt">{o}</button>' for o in opts]
    out += [f'{ind}  <p class="fb">{fb}</p>', f'{ind}  <p class="hint">{hint}</p>', f'{ind}</div>']
    return "\n".join(out)

def gate_html(qs, label="Check before continuing"):
    return ('    <div class="gate">\n      <span class="gate-lbl">' + label + '</span>\n'
            + "\n".join(q_html(q) for q in qs) + '\n    </div>')

def main(path, spec_path):
    s = open(path).read()
    spec = runpy.run_path(spec_path)
    assert 'class="chunk"' not in s, "already converted"
    # 1. CSS
    s = s.replace('</style>', GATE_CSS + '</style>', 1)
    # 2. isolate body region: after mission (and agenda), up to the quiz heading
    qh = re.search(r'\s*<h2>Check yourself[^<]*</h2>', s)
    qdiv_start = s.index('<div class="quiz"', qh.start())
    ask = s.index('<div class="ask">', qdiv_start)
    quiz_block = s[qdiv_start:ask]
    after_mission = s.index('</div>', s.index('<div class="mission">')) + len('</div>')
    if '<div class="agenda">' in s:
        ag = s.index('<div class="agenda">')
        # agenda has nested divs? it doesn't; find its close
        after_mission = s.index('</div>', ag) + len('</div>')
    body = s[after_mission:qh.start()]
    # 3. split
    if 'class="phase"' in body:
        parts = re.split(r'(?=\n[ \t]*<div class="phase" id="phase-)', body)
        pre, phases = parts[0], parts[1:]
        # merge phase-wrap into phase-7
        merged = []
        for p in phases:
            if 'id="phase-wrap"' in p and merged: merged[-1] += p
            else: merged.append(p)
        merged[0] = pre + merged[0]
        pieces = merged
    else:
        pat = '|'.join(re.escape(x) for x in spec['SPLITS'])
        parts = re.split(r'(?=\n[ \t]*<h2>(?:%s))' % pat, body)
        pieces = parts[1:]; pieces[0] = parts[0] + pieces[0]
    gates = spec['GATES']
    assert len(pieces) == len(gates), f"{len(pieces)} pieces vs {len(gates)} gates"
    n = len(pieces) + 1
    out = []
    for i, (p, g) in enumerate(zip(pieces, gates)):
        hid = '' if i == 0 else ' hidden'
        out.append(f'\n\n  <section class="chunk" id="chunk-{i+1}"{hid}>\n    <p class="chunk-label">{i+1} of {n}</p>'
                   + p.rstrip() + '\n' + gate_html(g) + '\n  </section>')
    # 4. final chunk from old quiz + extras
    olds = re.findall(r'<div class="q" data-correct="([a-d])">(.*?)\n\s*</div>', quiz_block, re.S)
    meta = spec['FINAL']['meta']; assert len(olds) == len(meta), (len(olds), len(meta))
    finals = []
    for (corr, inner), (concept, hint, intu) in zip(olds, meta):
        stem = re.search(r'<p class="stem">(?:\d+\.\s*)?(.*?)</p>', inner, re.S).group(1)
        opts = re.findall(r'<button class="opt">(.*?)</button>', inner, re.S)
        fb = re.search(r'<p class="fb">(.*?)</p>', inner, re.S).group(1)
        finals.append(('i' if intu else 'r', corr, concept, stem, opts, fb, hint))
    finals += spec['FINAL'].get('extra', [])
    out.append('\n\n  <section class="chunk" id="chunk-final" hidden>\n    <p class="chunk-label">Final check</p>\n'
               '    <h2>Everything from this lesson</h2>\n    <p style="font-size:.9rem; color:var(--muted);">Answer from memory. '
               'These questions seed your spaced-review schedule — they come back on future session starts per the forgetting curve.</p>\n'
               + gate_html(finals, "Comprehensive check") + '\n  </section>\n\n  ')
    s = s[:after_mission] + ''.join(out) + s[ask:]
    # 5. replace inline quiz script with shared engine
    s = re.sub(r'<script>\s*document\.querySelectorAll\(\'\.q\'\).*?</script>', '<script src="../reference/mastery.js"></script>', s, flags=re.S)
    assert 'reference/mastery.js' in s
    open(path, 'w').write(s)
    print(f"converted {path}: {n} chunks, {sum(map(len,gates))+len(finals)} questions")

if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
