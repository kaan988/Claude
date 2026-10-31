# Kokoro am_michael @1.18, one wav per line, joined, pauses >0.28s shrunk to 0.2s
import numpy as np, soundfile as sf, json, re
from kokoro_onnx import Kokoro
k = Kokoro('dl/models/kokoro-v1.0.onnx', 'dl/models/voices-v1.0.bin')
LINES = [
 "From this town, kids cross a border four times just to get to school.",
 "This is Point Roberts, Washington, hanging off Canada's Tsawwassen peninsula.",
 "Drive out, and it's forty kilometres through Canada.",
 "Blame one line: the forty-ninth parallel.",
 "In eighteen forty-six the Oregon Treaty made it the border. This tip fell just south.",
 "So from fourth grade, kids ride forty minutes to school in Blaine.",
 "No hospital, one grocery store, but forty times more Canadians keep mailboxes here than people live here.",
 "Then, March twenty twenty: the border closed to non-essential travel.",
 "The town lost eighty percent of its business, until the road reopened in August twenty twenty-one.",
 "It's been called America's best gated community.",
]
FIX = {"tsˈɔːwɑːsən": "təwˈɑːsən"}   # Tsawwassen -> /təˈwɑːsən/ (Wikipedia)
out, sr, spans = [], 24000, []
for i, line in enumerate(LINES):
    ph = k.tokenizer.phonemize(line, 'en-us')
    for a, b in FIX.items(): ph = ph.replace(a, b)
    a, sr = k.create(ph, voice='am_michael', speed=1.18, lang='en-us', is_phonemes=True)
    sf.write(f'audio/line{i+1:02d}.wav', a, sr)
    print(i+1, round(len(a)/sr, 2), ph)
    o = sum(len(q) for q in out); spans.append((o, o+len(a)))
    out.append(a); out.append(np.zeros(int(0.25*sr), np.float32))
x = np.concatenate(out)
# shrink every pause > 0.28 s to 0.2 s
env = np.convolve(np.abs(x), np.ones(240)/240, 'same'); loud = env > 0.004
res, i, n = [], 0, len(x)
mapping = np.zeros(len(x)+1, np.int64)
while i < n:
    if not loud[i]:
        j = i
        while j < n and not loud[j]: j += 1
        seg = x[i:j]
        if (j-i)/sr > 0.28 and i > 0 and j < n: seg = np.concatenate([seg[:int(0.1*sr)], seg[-int(0.1*sr):]])
        elif i == 0: seg = seg[-int(0.05*sr):]
        elif j == n: seg = seg[:int(0.1*sr)]
        o = sum(len(q) for q in res); mapping[i:j] = o + np.minimum(np.arange(j-i), len(seg)-1) if (j-i)==len(seg) else o + (np.arange(j-i)*len(seg)//(j-i)); res.append(seg); i = j
    else:
        j = i
        while j < n and loud[j]: j += 1
        o = sum(len(q) for q in res); mapping[i:j] = o + np.arange(j-i); res.append(x[i:j]); i = j
v = np.concatenate(res)
sf.write('audio/voice.wav', v, sr)
print('total', round(len(v)/sr, 2), 's')

# provisional word times (dev only; replaced by faster-whisper): spread each line's words by letter count
import re as _re
words = []
for line, (a0, a1) in zip(LINES, spans):
    a0 = mapping[a0]/sr + 0.05; a1 = mapping[min(a1, len(x)-1)]/sr - 0.12
    ws = line.split(); wt = [len(_re.sub(r'[^\w]', '', w)) + 1.5 + (3 if _re.search(r'[,.:]$', w) else 0) for w in ws]
    T = sum(wt); t = a0
    for w, k in zip(ws, wt):
        d = (a1-a0)*k/T; words.append({'w': w, 't0': round(t, 3), 't1': round(t + d*0.8, 3)}); t += d
json.dump({'duration': len(v)/sr, 'words': words, 'provisional': True}, open('audio/words.json', 'w'), indent=0)
