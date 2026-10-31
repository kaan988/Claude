"""Mix voice + ducked music bed + one SFX per event, normalized to -14 LUFS on the stereo file that ships.

Usage:
  python mix.py [--project .] [--voice-over 16] [--min-phrase 10] [--lufs -14] [--duck 7] [--sfx-gain 0.5] [--no-bed] [--ffmpeg ffmpeg]

Reads (relative to --project):
  audio/voice.wav       narration, any rate (resampled to 48 kHz), mono or stereo
  audio/words.json      {"words": [{"w", "t0", "t1"}, ...]} (or a bare list)
  out/meta.json         {"duration", "events": [{"t", "sfx", "gain"}]}  (from window.filmReady)
  audio/sfx_<name>.wav  and audio/music_bed.wav from sfx.py
Writes audio/mix.wav (48 kHz stereo float) and audio/mix.m4a (AAC 192k, commit this one so a GPU
machine can render and encode without re-synthesizing audio).
Loudness is measured on the stereo signal: a dual-mono file reads ~3 LU louder than its mono source,
so measuring mono once shipped -11 LUFS files.
"""
import argparse, json, subprocess, warnings
from math import gcd
from pathlib import Path
import numpy as np, soundfile as sf, scipy.signal as ss, pyloudnorm as pyln

SR = 48000
import sys
for _s in (sys.stdout, sys.stderr):   # Windows pipes default to cp1252; IPA and transcript text need UTF-8
    if hasattr(_s, 'reconfigure'): _s.reconfigure(encoding='utf-8', errors='replace')
ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
ap.add_argument('--project', type=Path, default=Path('.'))
ap.add_argument('--voice-over', type=float, default=16, help='voice RMS over music RMS across spoken parts (dB)')
ap.add_argument('--min-phrase', type=float, default=10, help='every phrase keeps voice at least this many dB over music')
ap.add_argument('--lufs', type=float, default=-14)
ap.add_argument('--duck', type=float, default=7, help='extra bed reduction under words (dB)')
ap.add_argument('--sfx-gain', type=float, default=.5, help='global SFX level, multiplied by each event gain')
ap.add_argument('--ceiling', type=float, default=.89, help='soft-limiter ceiling (linear, .89 ~ -1 dBFS)')
ap.add_argument('--no-bed', action='store_true')
ap.add_argument('--ffmpeg', default='ffmpeg')
A = ap.parse_args()
P = A.project; rd = lambda p: json.loads((P/p).read_text(encoding='utf-8'))
def mono(x): return x.mean(1) if x.ndim > 1 else x
def to48(x, sr): g = gcd(SR, sr); return x if sr == SR else ss.resample_poly(x, SR//g, sr//g)
def rms(x): return np.sqrt(np.mean(x**2)+1e-12)

meta = rd('out/meta.json'); words = rd('audio/words.json'); words = words['words'] if isinstance(words, dict) else words
v, vsr = sf.read(P/'audio/voice.wav'); v = to48(mono(v), vsr)
dur = meta.get('duration') or len(v)/SR
N = int(dur*SR) + SR//2                                   # half a second of tail; encode uses -shortest
voice = np.zeros(N); voice[:min(N, len(v))] = v[:N]
music = np.zeros(N)
if not A.no_bed:
    m, msr = sf.read(P/'audio/music_bed.wav'); m = to48(mono(m), msr); music[:min(N, len(m))] = m[:N]
    if len(m) < int(dur*SR): print(f'warning: bed is {len(m)/SR:.1f} s, film is {dur:.1f} s (run sfx.py with --meta)')

# duck: smoothed gate that follows the words (attack 40 ms, release 250 ms)
target = np.zeros(N)
for w in words: target[int(max(0, w['t0']-.05)*SR):int((w['t1']+.05)*SR)] = 1
g = np.zeros(N); a, r, s, B = 1-np.exp(-1/(.04*SR)), 1-np.exp(-1/(.25*SR)), 0., 32
for i in range(0, N, B):
    tg = target[i]; s += min(1, (a if tg > s else r)*B)*(tg-s); g[i:i+B] = s
music *= 10**(-A.duck*g/20)
# set the bed so voice sits --voice-over dB above music over the spoken parts
sp = target > 0
if not A.no_bed and sp.any() and rms(music[sp]) > 1e-6: music *= rms(voice[sp])/rms(music[sp])*10**(-A.voice_over/20)

sfx = np.zeros(N); missing = set()
for e in meta.get('events', []):
    f = P/f"audio/sfx_{e['sfx']}.wav"
    if not f.exists(): missing.add(e['sfx']); continue
    x, xsr = sf.read(f); x = to48(mono(x), xsr); p = int(e['t']*SR)
    if p < 0: x = x[-p:]; p = 0
    n = max(0, min(len(x), N-p)); sfx[p:p+n] += x[:n]*e.get('gain', 1)*A.sfx_gain
if missing: print('warning: missing sfx files:', ', '.join(sorted(missing)))
mix = voice + music + sfx

# per-phrase check: voice over music (phrase = words with gaps <= 0.15 s)
phr = []
for w in words:
    if phr and w['t0']-phr[-1][-1]['t1'] <= .15: phr[-1].append(w)
    else: phr.append([w])
if phr and not A.no_bed:
    seg = lambda x, p: x[int(p[0]['t0']*SR):max(int(p[0]['t0']*SR)+1, int(p[-1]['t1']*SR))]
    worst = min(20*np.log10(rms(seg(voice, p))/rms(seg(music, p))) for p in phr)
    if worst < A.min_phrase:                                # lift the floor: lower the whole bed until the worst phrase passes
        music *= 10**((worst - A.min_phrase)/20); mix = voice + music + sfx
        worst = min(20*np.log10(rms(seg(voice, p))/rms(seg(music, p))) for p in phr)
    print(f'phrases {len(phr)}, worst voice-over-music {worst:.1f} dB')
else: print(f'phrases {len(phr)}')

warnings.filterwarnings('ignore')                        # pyloudnorm warns on possible clipping
meter = pyln.Meter(SR); st = lambda m: np.stack([m, m], 1)   # measure what ships: stereo
th = A.ceiling - .19; k = A.ceiling - th
for it in range(12):                                     # normalize, soft-limit peaks (tanh knee), repeat
    mix = mix*10**((A.lufs - meter.integrated_loudness(st(mix)))/20)
    mix = np.where(np.abs(mix) > th, np.sign(mix)*(th + k*np.tanh((np.abs(mix)-th)/k)), mix)
    L = meter.integrated_loudness(st(mix))
    if abs(L - A.lufs) <= .1: break
out = st(mix).astype(np.float32)
print(f'LUFS {L:.2f} (stereo, {it+1} passes), peak dBFS {20*np.log10(np.max(np.abs(mix))):.2f}, {N/SR:.2f} s')
sf.write(P/'audio/mix.wav', out, SR)
subprocess.run([A.ffmpeg, '-y', '-loglevel', 'error', '-i', str(P/'audio/mix.wav'), '-c:a', 'aac', '-b:a', '192k', str(P/'audio/mix.m4a')], check=True)
print('wrote', P/'audio/mix.wav', 'and', P/'audio/mix.m4a')
