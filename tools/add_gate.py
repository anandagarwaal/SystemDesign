"""Append questions to a chunk's gate (creating the gate if the chunk has none).

Usage: python3 tools/add_gate.py spec.py
spec.py defines ADD = {"lessons/NNNN-x.html": {"chunk-7": [q, ...]}}, q as in convert_lesson.py.
"""
import sys, runpy
sys.path.insert(0, __file__.rsplit('/', 1)[0])
from convert_lesson import q_html, gate_html

def main(spec_path):
    for path, chunks in runpy.run_path(spec_path)['ADD'].items():
        s = open(path).read()
        for cid, qs in chunks.items():
            a = s.index(f'id="{cid}"')
            end = s.index('</section>', a)
            body = s[a:end]
            if 'class="gate"' in body:
                # insert before the gate's closing </div> (last </div> in the chunk)
                gclose = a + body.rindex('</div>')
                s = s[:gclose] + "\n".join(q_html(q) for q in qs) + "\n    " + s[gclose:]
            else:
                s = s[:end] + gate_html(qs) + "\n  " + s[end:]
            print(f"{path} {cid}: +{len(qs)} questions")
        open(path, 'w').write(s)

if __name__ == '__main__':
    main(sys.argv[1])
