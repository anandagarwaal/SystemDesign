"""Replace the answer options of questions (by data-concept id) across lessons.

Usage: python3 tools/set_options.py fixes.json
fixes.json: {"concept-id": ["opt a", "opt b", ...], ...}; same count and order as today
(so data-correct stays valid). Used to remove option-length tells without touching stems/feedback.
"""
import glob, json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def main(path):
    fixes = json.load(open(path))
    left = dict(fixes)
    for f in sorted(glob.glob(os.path.join(ROOT, 'lessons', '0*.html'))):
        s = open(f).read()
        changed = False
        for cid in list(left):
            m = re.search(r'<div class="q"[^>]*data-concept="%s"[^>]*>(.*?)\n\s*</div>' % re.escape(cid), s, re.S)
            if not m:
                continue
            block = m.group(1)
            olds = re.findall(r'<button class="opt">.*?</button>', block, re.S)
            new = left.pop(cid)
            if len(olds) != len(new):
                sys.exit(f'{cid}: has {len(olds)} options, fix gives {len(new)}')
            it = iter(new)
            block2 = re.sub(r'<button class="opt">.*?</button>', lambda _: '<button class="opt">%s</button>' % next(it), block, flags=re.S)
            s = s[:m.start(1)] + block2 + s[m.end(1):]
            changed = True
        if changed:
            open(f, 'w').write(s)
    if left:
        sys.exit('not found: ' + ', '.join(left))
    print(f'updated {len(fixes)} questions')

if __name__ == '__main__':
    main(sys.argv[1])
