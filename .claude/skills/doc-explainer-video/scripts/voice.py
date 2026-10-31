"""Narration from a markdown script with Kokoro (kokoro-onnx), plus line and provisional word timings.

Usage:
  python voice.py script.md [--out audio] [--models dl/models] [--voice am_michael] [--speed 1.05]
                  [--fixes fixes.json] [--pause 0.35] [--chapter-pause 0.9] [--lead 0.6]
                  [--gap-after-line 5=2.2 ...]
  python voice.py --check "Tsawwassen,dataset" [--fixes fixes.json] [--models dl/models]

Script format: "## <n> · title" chapter headings, numbered narration lines "1. text" / "17b. text";
everything from "## Shot list" on is ignored, other lines (notes, title cards) are skipped.
fixes.json: {"say": {"METR": "meter"}, "phonemes": {"dˈeɪɾəsˌɛt": "dˈeɪtəsˌɛt"}}
  say      = text replacements before phonemizing (spoken form; also what words_script.json holds)
  phonemes = replacements in the phoneme string (use --check to see what Kokoro produces)
Writes <out>/voice.wav (24 kHz mono), lines.json {duration, lines:[{chapter,label,text,t0,t1}]},
words_script.json {duration, words:[{w,t0,t1}]} (times provisional until align_words.py).
"""
import argparse, json, re
from pathlib import Path
import numpy as np, soundfile as sf

import sys
for _s in (sys.stdout, sys.stderr):   # Windows pipes default to cp1252; IPA and transcript text need UTF-8
    if hasattr(_s, 'reconfigure'): _s.reconfigure(encoding='utf-8', errors='replace')
ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
ap.add_argument('script', nargs='?', type=Path)
ap.add_argument('--out', type=Path, default=Path('audio'))
ap.add_argument('--models', type=Path, default=Path('dl/models'), help='dir with kokoro-v1.0.onnx and voices-v1.0.bin')
ap.add_argument('--voice', default='am_michael')
ap.add_argument('--speed', type=float, default=1.05)
ap.add_argument('--lang', default='en-us')
ap.add_argument('--fixes', type=Path)
ap.add_argument('--pause', type=float, default=0.35, help='pause between lines of one chapter (s)')
ap.add_argument('--chapter-pause', type=float, default=0.9, help='pause at a chapter turn (s)')
ap.add_argument('--lead', type=float, default=0.6, help='silence before the first line (s)')
ap.add_argument('--gap-after-line', action='append', default=[], metavar='N=SEC',
                help='pause after script line N (e.g. 5=2.2 for a title card); repeatable')
ap.add_argument('--check', help='comma-separated terms: print their phonemes and exit')
A = ap.parse_args()

fx = json.loads(A.fixes.read_text(encoding='utf-8')) if A.fixes else {}
SAY, FIX = fx.get('say', {}), fx.get('phonemes', {})

from kokoro_onnx import Kokoro
k = Kokoro(str(A.models / 'kokoro-v1.0.onnx'), str(A.models / 'voices-v1.0.bin'))

def spoken(text):
    for a, b in SAY.items(): text = text.replace(a, b)
    return text
def phon(text):
    ph = k.tokenizer.phonemize(text, A.lang)
    for a, b in FIX.items(): ph = ph.replace(a, b)
    return ph

if A.check:                                       # find respellings: raw phonemes vs after fixes
    for t in (s.strip() for s in A.check.split(',') if s.strip()):
        raw = k.tokenizer.phonemize(spoken(t), A.lang); fixed = phon(spoken(t))
        print(f'{t!r:28} {raw}' + (f'   -> {fixed}' if fixed != raw else ''))
    raise SystemExit
if not A.script: ap.error('script file required (or --check)')

# parse: chapter number from "## <n>", narration lines "<n>[b]. text", stop at "## Shot list"
md = re.split(r'^##\s*Shot list', A.script.read_text(encoding='utf-8'), flags=re.M | re.I)[0]
LINES, chap = [], 0
for l in md.splitlines():
    if l.startswith('## '):
        m = re.match(r'##\s*(\d+)', l); chap = int(m.group(1)) if m else chap + 1
    m = re.match(r'^(\d+[a-z]?)\.\s+(.*\S)', l)
    if m: LINES.append((chap, m.group(1), m.group(2)))
if not LINES: raise SystemExit('no numbered lines found in ' + str(A.script))
GAP = {}
for g in A.gap_after_line:
    n, s = g.split('='); GAP[n.strip()] = float(s)

A.out.mkdir(parents=True, exist_ok=True)
sr = 24000; parts = [np.zeros(int(A.lead*sr), np.float32)]; meta = []; o = len(parts[0])
for i, (c, lab, line) in enumerate(LINES):
    text = spoken(line)
    a, sr = k.create(phon(text), voice=A.voice, speed=A.speed, lang=A.lang, is_phonemes=True)
    # trim edge silence (keep 20 ms before onset, 40 ms after the tail)
    e = np.convolve(np.abs(a), np.ones(240)/240, 'same'); idx = np.where(e > .004)[0]
    if len(idx): a = a[max(0, idx[0]-480):idx[-1]+960]
    nxt = LINES[i+1][0] if i+1 < len(LINES) else None
    pause = 0 if nxt is None else GAP.get(lab, A.chapter_pause if nxt != c else A.pause)
    meta.append({'chapter': c, 'label': lab, 'text': text, 't0': o/sr, 't1': (o+len(a))/sr})
    parts += [a.astype(np.float32), np.zeros(int(pause*sr), np.float32)]; o += len(a) + int(pause*sr)
    print(f'{lab:>4} ch{c} {len(a)/sr:5.2f}s  {text[:70]}')
v = np.concatenate(parts); dur = len(v)/sr
sf.write(str(A.out / 'voice.wav'), v, sr)
(A.out / 'lines.json').write_text(json.dumps({'duration': dur, 'lines': meta}, indent=0, ensure_ascii=False), encoding='utf-8')
# script words (spoken form) for alignment; provisional times spread inside each line by letter count
words = []
for L in meta:
    ws = L['text'].split(); wt = [len(re.sub(r'[^\w]', '', w)) + 1.5 for w in ws]; T = sum(wt); t = L['t0']
    for w, kk in zip(ws, wt):
        d = (L['t1']-L['t0'])*kk/T; words.append({'w': w, 't0': round(t, 3), 't1': round(t+d*.85, 3)}); t += d
(A.out / 'words_script.json').write_text(json.dumps({'duration': dur, 'words': words, 'provisional': True}, indent=0, ensure_ascii=False), encoding='utf-8')
print(len(LINES), 'lines,', len(words), 'words, total', round(dur, 1), 's ->', A.out)
