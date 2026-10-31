#!/bin/bash
# Re-render both films with Whisper word timings, then mix and encode
set -e
render() {   # $1 = project dir, $2 = output mp4 name, $3 = fps
  cd /home/user/Claude/$1 && rm -f frames/f_* out/meta.json
  python3 render.py range 1 "0:1" > out/w0.log 2>&1       # writes out/meta.json
  N=$(python3 -c "import json;print(json.load(open('out/meta.json'))['frames'])"); A=$((N/3)); B=$((2*N/3))
  python3 render.py range 1 "0:$A" > out/w1.log 2>&1 & python3 render.py range 2 "$A:$B" > out/w2.log 2>&1 & python3 render.py range 3 "$B:$N" > out/w3.log 2>&1 & wait
  [ $(ls frames/f_* | wc -l) -ge $N ] || { echo "$1: missing frames"; exit 1; }
  python3 mix.py
  ffmpeg -y -loglevel error -framerate $3 -i frames/f_%04d.jpg -i audio/mix.wav -c:v libx264 -preset slow -crf 19 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest -movflags +faststart out/$2
  echo "$1 done: $N frames"
}
[ "$1" = "pr" ] || render hf-incident hf_incident.mp4 25
render point-roberts point_roberts.mp4 30
