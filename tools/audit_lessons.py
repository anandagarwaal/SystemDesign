"""Structural audit of every lesson against the Math Academy rules in lessons/_AUTHORING-GUIDE.md.

Usage: python3 tools/audit_lessons.py            (exit code 1 if any lesson has problems)
Checks: shared engine included; gated chunks; every non-final chunk has a gate with at least one
intuition question; later chunks start hidden; a comprehensive chunk-final; each question has a
concept id, a valid data-correct, a hint; concept ids are unique course-wide; answer options within a
question are similar in length (a length tell gives the answer away).
"""
import collections, glob, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def audit(path, concepts):
    s = open(path).read()
    issues = []
    if 'reference/mastery.js' not in s:
        issues.append('missing mastery.js')
    chunks = re.findall(r'<section class="chunk" id="([^"]+)"([^>]*)>(.*?)</section>', s, re.S)
    if len(chunks) < 2:
        return issues + [f'only {len(chunks)} chunks']
    if chunks[-1][0] != 'chunk-final':
        issues.append('last chunk is not id="chunk-final"')
    for i, (cid, attrs, body) in enumerate(chunks):
        if i and 'hidden' not in attrs:
            issues.append(f'{cid} not hidden')
        qs = re.findall(r'<div class="q"([^>]*)>(.*?)\n\s*</div>', body, re.S)
        if not qs:
            issues.append(f'{cid} has no gate questions')
            continue
        if cid != 'chunk-final' and not any('intuition' in a for a, _ in qs):
            issues.append(f'{cid} has no intuition question')
        for a, inner in qs:
            cm = re.search(r'data-concept="([^"]+)"', a)
            opts = [re.sub('<[^>]+>', '', o) for o in re.findall(r'<button class="opt">(.*?)</button>', inner, re.S)]
            corr = re.search(r'data-correct="([a-d])"', a)
            name = cm.group(1) if cm else '?'
            if not cm:
                issues.append(f'{cid}: question without data-concept')
            else:
                concepts[name].append(os.path.basename(path))
            if not corr or 'abcd'.index(corr.group(1)) >= len(opts):
                issues.append(f'{name}: bad data-correct')
            if 'class="hint"' not in inner:
                issues.append(f'{name}: no hint')
            lens = [len(o) for o in opts]
            if lens and max(lens) > 1.3 * min(lens):
                issues.append(f'{name}: option length tell {lens}')
    return issues

def main():
    concepts = collections.defaultdict(list)
    bad = 0
    files = sorted(glob.glob(os.path.join(ROOT, 'lessons', '0*.html')))
    for f in files:
        if f.endswith('0000-prereq-diagnostic.html'):
            continue  # ungated by design: a diagnostic tests before it teaches
        issues = audit(f, concepts)
        if issues:
            bad += 1
            print(os.path.basename(f))
            for i in issues:
                print('   -', i)
    dups = {k: v for k, v in concepts.items() if len(set(v)) > 1 or len(v) > 1}
    for k, v in dups.items():
        print(f'duplicate concept id {k}: {v}')
    print(f'{len(files) - 1} gated lessons audited, {bad} with issues, {len(dups)} duplicate ids')
    sys.exit(1 if bad or dups else 0)

if __name__ == '__main__':
    main()
