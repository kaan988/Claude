# Kokoro am_michael @1.05, lines parsed from the approved script; pauses 0.35 s in a chapter, 0.9 s at chapter turns, 2.2 s title gap
import numpy as np, soundfile as sf, json, re
from kokoro_onnx import Kokoro
k = Kokoro('dl/models/kokoro-v1.0.onnx', 'dl/models/voices-v1.0.bin')
md = open('../hf-incident/script_5min.md').read().split('## Shot list')[0]
LINES, chap = [], 0
for l in md.split('\n'):
    if l.startswith('## '): chap = int(re.match(r'## (\d+)', l).group(1))
    m = re.match(r'^(\d+b?)\. (.*)', l)
    if m: LINES.append((chap, m.group(2)))
SAY = {'METR': 'meter'}                                          # spoken spellings
FIX = {'dˈeɪɾəsˌɛt': 'dˈeɪtəsˌɛt', 'suːpˈiːnəd': 'səpˈiːnd'}       # crisp t in 'dataset'; subpoenaed
sr = 24000; parts = [np.zeros(int(.6*sr), np.float32)]; meta = []
for i, (c, line) in enumerate(LINES):
    spoken = line
    for a, b in SAY.items(): spoken = spoken.replace(a, b)
    ph = k.tokenizer.phonemize(spoken, 'en-us')
    for a, b in FIX.items(): ph = ph.replace(a, b)
    a, sr = k.create(ph, voice='am_michael', speed=1.05, lang='en-us', is_phonemes=True)
    e = np.convolve(np.abs(a), np.ones(240)/240, 'same'); idx = np.where(e > .004)[0]; a = a[max(0, idx[0]-480):idx[-1]+960]
    nxt = LINES[i+1][0] if i+1 < len(LINES) else None
    pause = 0 if nxt is None else (2.2 if c == 1 and nxt == 3 else .9 if nxt != c else .35)
    o = sum(len(p) for p in parts); meta.append({'chapter': c, 'text': spoken, 't0': o/sr, 't1': (o+len(a))/sr})
    parts += [a, np.zeros(int(pause*sr), np.float32)]
v = np.concatenate(parts); sf.write('audio/voice.wav', v, sr)
json.dump({'duration': len(v)/sr, 'lines': meta}, open('audio/lines.json', 'w'), indent=0)
# script words (spoken form) for alignment; provisional times spread inside each line
words = []
for L in meta:
    ws = L['text'].split(); wt = [len(re.sub(r'[^\w]', '', w)) + 1.5 for w in ws]; T = sum(wt); t = L['t0']
    for w, kk in zip(ws, wt): d = (L['t1']-L['t0'])*kk/T; words.append({'w': w, 't0': round(t, 3), 't1': round(t+d*.85, 3)}); t += d
json.dump({'duration': len(v)/sr, 'words': words}, open('audio/words_script.json', 'w'), indent=0)
print(len(LINES), 'lines,', len(words), 'words, total', round(len(v)/sr, 1), 's')
