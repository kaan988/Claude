#!/bin/bash
# render frames [A, B) with three workers; usage: render_part.sh A B
cd "$(dirname "$0")"
A=$1; B=$2; S=$(( (B-A)/3 ))
python3 render.py range 1 "$A:$((A+S))" > out/w1.log 2>&1 &
python3 render.py range 2 "$((A+S)):$((A+2*S))" > out/w2.log 2>&1 &
python3 render.py range 3 "$((A+2*S)):$B" > out/w3.log 2>&1 &
wait
echo "part $A-$B done: $(ls frames/f_* | wc -l) frames on disk"
