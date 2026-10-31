# Map faster-whisper word times onto the script's own words (Whisper writes "1,200" for "twelve hundred", splits "OpenAI", etc.)
import json, re, sys, difflib
script_words, whisper_json, out_json = sys.argv[1], sys.argv[2], sys.argv[3]
S = json.load(open(script_words))['words']; Wh = json.load(open(whisper_json))
ww = Wh['words']; norm = lambda s: re.sub(r'[^a-z0-9]', '', s.lower())
def chars(words):
    s, owner = '', []
    for i, w in enumerate(words): n = norm(w['w']); s += n; owner += [i]*len(n)
    return s, owner
sa, oa = chars(S); sb, ob = chars(ww)
sm = difflib.SequenceMatcher(None, sa, sb, autojunk=False)
hit = {}                                   # script word -> list of whisper word indices sharing matched chars
for a, b, n in sm.get_matching_blocks():
    for k in range(n): hit.setdefault(oa[a+k], set()).add(ob[b+k])
out = []
for i, w in enumerate(S):
    h = hit.get(i)
    # need most of the word matched to trust it
    if h and sum(1 for k in range(len(sa)) if oa[k] == i and k in {a+j for a, b, n in sm.get_matching_blocks() for j in range(n)}) >= .6*len(norm(w['w'])):
        out.append({'w': w['w'], 't0': min(ww[j]['t0'] for j in h), 't1': max(ww[j]['t1'] for j in h), 'src': 'whisper'})
    else: out.append({'w': w['w'], 't0': None, 't1': None, 'src': 'interp'})
# interpolate unmatched runs (numbers, merged tokens) between their matched neighbours, by letter count
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
json.dump({'duration': Wh['duration'], 'words': out, 'source': 'faster-whisper small.en int8, aligned to script'}, open(out_json, 'w'), indent=0)
n = sum(o['src'] == 'whisper' for o in out); print(f'{n}/{len(out)} words timed by whisper, rest interpolated:', [o['w'] for o in out if o['src'] != 'whisper'])
