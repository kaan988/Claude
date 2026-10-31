"""Map faster-whisper word times onto the script's own words.

Usage:
  python align_words.py [audio/words_script.json] [audio/words_whisper.json] [audio/words.json]

Whisper writes "1,200" for "twelve hundred", splits or merges names ("OpenAI"), drops punctuation; the
film needs the script's words. Both sides are flattened to lowercase a-z0-9 characters and matched with
difflib; a script word is timed from the whisper words sharing its characters when >= 60 % of its
characters match, otherwise it is interpolated by letter count between matched neighbours.
Writes words.json {duration, words:[{w,t0,t1,src}]} and words.js next to it (window.PR_WORDS, plus
window.PR_LINES when lines.json sits in the same folder) for loading from film.html via <script>.
"""
import argparse, json, re, difflib
from pathlib import Path

import sys
for _s in (sys.stdout, sys.stderr):   # Windows pipes default to cp1252; IPA and transcript text need UTF-8
    if hasattr(_s, 'reconfigure'): _s.reconfigure(encoding='utf-8', errors='replace')
ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
ap.add_argument('script_words', nargs='?', type=Path, default=Path('audio/words_script.json'))
ap.add_argument('whisper_words', nargs='?', type=Path, default=Path('audio/words_whisper.json'))
ap.add_argument('out', nargs='?', type=Path, default=Path('audio/words.json'))
A = ap.parse_args()

rd = lambda p: json.loads(p.read_text(encoding='utf-8'))
S = rd(A.script_words)['words']; Wh = rd(A.whisper_words); ww = Wh['words']
Sd = rd(A.script_words).get('duration')
if Sd and abs(Sd - Wh['duration']) > .05:   # re-voiced without re-running Whisper
    raise SystemExit(f"{A.script_words} ({Sd:.2f} s) and {A.whisper_words} ({Wh['duration']:.2f} s) come from different voice.wav files: rerun whisper_words.py")
norm = lambda s: re.sub(r'[^a-z0-9]', '', s.lower())
def chars(words):
    s, owner = '', []
    for i, w in enumerate(words): n = norm(w['w']); s += n; owner += [i]*len(n)
    return s, owner
sa, oa = chars(S); sb, ob = chars(ww)
hit, nmatch = {}, {}                       # script word -> whisper word indices / count of matched chars
for a, b, n in difflib.SequenceMatcher(None, sa, sb, autojunk=False).get_matching_blocks():
    for k in range(n):
        hit.setdefault(oa[a+k], set()).add(ob[b+k]); nmatch[oa[a+k]] = nmatch.get(oa[a+k], 0) + 1
out = []
for i, w in enumerate(S):
    h = hit.get(i)
    if h and nmatch[i] >= .6*len(norm(w['w'])):          # need most of the word matched to trust it
        out.append({'w': w['w'], 't0': min(ww[j]['t0'] for j in h), 't1': max(ww[j]['t1'] for j in h), 'src': 'whisper'})
    else: out.append({'w': w['w'], 't0': None, 't1': None, 'src': 'interp'})
# interpolate unmatched runs (spelled-out numbers, merged tokens) between matched neighbours, by letter count
i = 0
while i < len(out):
    if out[i]['t0'] is None:
        j = i
        while j < len(out) and out[j]['t0'] is None: j += 1
        a = out[i-1]['t1'] if i > 0 else 0; b = out[j]['t0'] if j < len(out) else Wh['duration']
        L = [len(norm(o['w'])) + 1 for o in out[i:j]]; T = sum(L); t = a
        for o, l in zip(out[i:j], L): d = (b-a)*l/T; o['t0'], o['t1'] = round(t, 3), round(t+d*.9, 3); t += d
        i = j
    else: i += 1
res = {'duration': Wh['duration'], 'words': out, 'source': 'faster-whisper, aligned to script'}
A.out.parent.mkdir(parents=True, exist_ok=True)
A.out.write_text(json.dumps(res, indent=0, ensure_ascii=False), encoding='utf-8')
js = 'window.PR_WORDS=' + json.dumps(res, indent=0, ensure_ascii=False) + ';\n'
lines = A.out.parent / 'lines.json'
if lines.exists(): js += '\nwindow.PR_LINES=' + lines.read_text(encoding='utf-8').strip() + ';\n'
(A.out.parent / 'words.js').write_text(js, encoding='utf-8')
n = sum(o['src'] == 'whisper' for o in out)
print(f'{n}/{len(out)} words timed by whisper, rest interpolated:', [o['w'] for o in out if o['src'] != 'whisper'])
print('->', A.out, '+ words.js' + (' (with PR_LINES)' if lines.exists() else ''))
