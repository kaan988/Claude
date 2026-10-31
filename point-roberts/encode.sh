#!/bin/sh
# H.264 CRF 19 + AAC, 30 fps
cd "$(dirname "$0")"
ffmpeg -y -loglevel error -framerate 30 -i frames/f_%04d.jpg -i audio/mix.wav -c:v libx264 -preset slow -crf 19 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest -movflags +faststart out/point_roberts.mp4
