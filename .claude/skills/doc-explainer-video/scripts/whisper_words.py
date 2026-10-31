"""Word timestamps for a narration wav with faster-whisper (CPU, int8).

Usage:
  python whisper_words.py [audio/voice.wav] [audio/words_whisper.json] [--model small.en] [--min-pause 0.15]

--model is a faster-whisper model name (downloaded on first use) or a local CTranslate2 model dir.
The wav is cut into chunks at the middle of every silence >= --min-pause and each chunk is transcribed
on its own (no carried-over context, so no drift or hallucinated runs); word times get the chunk offset.
Writes {duration, words:[{w,t0,t1}]} and prints the transcript.
"""
import argparse, json
from math import gcd
from pathlib import Path
import numpy as np, soundfile as sf

import sys
for _s in (sys.stdout, sys.stderr):   # Windows pipes default to cp1252; IPA and transcript text need UTF-8
    if hasattr(_s, 'reconfigure'): _s.reconfigure(encoding='utf-8', errors='replace')
ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
ap.add_argument('wav', nargs='?', type=Path, default=Path('audio/voice.wav'))
ap.add_argument('out', nargs='?', type=Path, default=Path('audio/words_whisper.json'))
ap.add_argument('--model', default='small.en')
ap.add_argument('--min-pause', type=float, default=0.15)
ap.add_argument('--threshold', type=float, default=0.004, help='envelope level counted as silence')
A = ap.parse_args()

from faster_whisper import WhisperModel
m = WhisperModel(A.model, device='cpu', compute_type='int8')
x, sr = sf.read(str(A.wav), dtype='float32')
if x.ndim > 1: x = x.mean(axis=1)
env = np.convolve(np.abs(x), np.ones(240)/240, 'same'); loud = env > A.threshold
# chunk boundaries at mid-points of silences >= min-pause (leading/trailing silence never cut)
cuts, i, n = [0], 0, len(x)
while i < n:
    if not loud[i]:
        j = i
        while j < n and not loud[j]: j += 1
        if (j-i)/sr >= A.min_pause and i > 0 and j < n: cuts.append((i+j)//2)
        i = j
    else:
        while i < n and loud[i]: i += 1
cuts.append(n)
if sr != 16000:
    import scipy.signal as ss
    g = gcd(16000, sr); up, down = 16000//g, sr//g
words = []
for a, b in zip(cuts, cuts[1:]):
    if b-a < sr*0.2: continue
    seg = x[a:b]
    if sr != 16000: seg = ss.resample_poly(seg, up, down).astype(np.float32)   # 24k -> 16k is 2/3
    s, _ = m.transcribe(seg, language='en', word_timestamps=True, beam_size=5, condition_on_previous_text=False)
    # whisper tends to start a chunk's first word at 0 (the cut is mid-silence): clamp to 40 ms before onset
    on = np.argmax(loud[a:b]) / sr - .04
    for sg in s:
        for w in sg.words or []:
            t0 = max(w.start, on) if w.end > on else w.start
            words.append({'w': w.word.strip(), 't0': round(a/sr+t0, 3), 't1': round(a/sr+w.end, 3)})
A.out.parent.mkdir(parents=True, exist_ok=True)
A.out.write_text(json.dumps({'duration': n/sr, 'words': words}, indent=0, ensure_ascii=False), encoding='utf-8')
print(' '.join(w['w'] for w in words)); print(len(words), 'words,', len(cuts)-1, 'chunks,', round(n/sr, 2), 's ->', A.out)
