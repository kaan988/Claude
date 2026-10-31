#!/bin/bash
# fill in missing frames below END with three workers (frame % 3 split); usage: render_missing.sh END
cd "$(dirname "$0")"
for k in 0 1 2; do python3 render.py missing $((k+1)) "$k/3" "$1" > out/m$k.log 2>&1 & done
wait
echo "done below $1: $(ls frames | grep -c f_) frames on disk"
