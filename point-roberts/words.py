# faster-whisper small.en int8 CPU; transcribe chunks cut at every pause, offset word times
import numpy as np, soundfile as sf, json, os
from faster_whisper import WhisperModel
import sys
MODEL = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'dl/models/whisper-small.en')
m = WhisperModel(MODEL, device='cpu', compute_type='int8')
SRC, DST = (sys.argv[1], sys.argv[2]) if len(sys.argv) > 2 else ('audio/voice.wav', 'audio/words.json')
x, sr = sf.read(SRC)
env = np.convolve(np.abs(x), np.ones(240)/240, 'same'); loud = env > 0.004
# chunk boundaries at mid-points of silences >= 0.15 s
cuts, i, n = [0], 0, len(x)
while i < n:
    if not loud[i]:
        j = i
        while j < n and not loud[j]: j += 1
        if (j-i)/sr >= 0.15 and i > 0 and j < n: cuts.append((i+j)//2)
        i = j
    else: i += 1
cuts.append(n)
words = []
for a, b in zip(cuts, cuts[1:]):
    if b-a < sr*0.2: continue
    seg = x[a:b].astype(np.float32)
    if sr != 16000:
        import scipy.signal as ss; seg = ss.resample_poly(seg, 2, 3).astype(np.float32)
    s, _ = m.transcribe(seg, language='en', word_timestamps=True, beam_size=5, condition_on_previous_text=False)
    for sg in s:
        for w in sg.words:
            words.append({'w': w.word.strip(), 't0': round(a/sr+w.start, 3), 't1': round(a/sr+w.end, 3)})
json.dump({'duration': n/sr, 'words': words}, open(DST, 'w'), indent=0)
print(' '.join(w['w'] for w in words)); print(len(words), 'words', n/sr)
