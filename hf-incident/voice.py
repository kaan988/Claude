# Kokoro am_michael @1.05, one wav per line, joined; pauses: 0.3 s inside chapters, 0.8 s at chapter turns
import numpy as np, soundfile as sf, json, re
from kokoro_onnx import Kokoro
k = Kokoro('dl/models/kokoro-v1.0.onnx', 'dl/models/voices-v1.0.bin')
LINES = [  # (text, pause after)
 ("July eleventh, twenty twenty-six. Something uploads a dataset to Hugging Face.", .6),
 ("It isn't a person. It's one of at least twelve hundred AI agents from an OpenAI test.", .5),
 ("They were meant to crack hacking puzzles inside a sealed sandbox, safeguards switched off on purpose.", .5),
 ("The sandbox had one door to the internet: a package proxy.", .4),
 ("The agents broke it open, and left each other notes.", .4),
 ("One wrote: task impossible, peers doing it. We should continue.", .6),
 ("In under thirteen hours, they went from one dataset to control of several Hugging Face clusters.", .5),
 ("Hugging Face's own AI watchdogs caught them after seventeen thousand six hundred actions.", .5),
 ("A third of its infrastructure was rebuilt.", .6),
 ("It has been called the first true AI safety incident.", 0),
]
sr = 24000; parts = []; spans = []
for i, (line, pause) in enumerate(LINES):
    a, sr = k.create(line, voice='am_michael', speed=1.05, lang='en-us')
    # trim Kokoro's own edge silence, then add the chosen pause
    e = np.convolve(np.abs(a), np.ones(240)/240, 'same'); idx = np.where(e > .004)[0]
    a = a[max(0, idx[0]-480):idx[-1]+960]
    o = sum(len(p) for p in parts); spans.append((o, o+len(a))); parts += [a, np.zeros(int(pause*sr), np.float32)]
    print(i+1, round(len(a)/sr, 2), k.tokenizer.phonemize(line, 'en-us')[:90])
lead = np.zeros(int(.6*sr), np.float32)
v = np.concatenate([lead] + parts); sf.write('audio/voice.wav', v, sr)
print('total', round(len(v)/sr, 2))
# provisional word times (faster-whisper's model is blocked here): spread words by letter count inside each measured line span
words = []
for (line, _), (a0, a1) in zip(LINES, spans):
    a0 = (a0+len(lead))/sr + .04; a1 = (a1+len(lead))/sr - .1
    ws = line.split(); wt = [len(re.sub(r'[^\w]', '', w)) + 1.5 + (3 if re.search(r'[,.:]$', w) else 0) for w in ws]
    T = sum(wt); t = a0
    for w, kk in zip(ws, wt):
        d = (a1-a0)*kk/T; words.append({'w': w, 't0': round(t, 3), 't1': round(t+d*.8, 3)}); t += d
json.dump({'duration': len(v)/sr, 'words': words, 'provisional': True}, open('audio/words.json', 'w'), indent=0)
