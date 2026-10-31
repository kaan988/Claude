# Rendering on the user's own GPU

A local GPU renders 10–30× faster than cloud software WebGL. A cloud session cannot attach a Windows folder through Remote Control (only macOS/Linux folders), so on Windows the user runs the render themselves with the commands below. Prepare the project first in the cloud: script, voice, timing, page, `audio/mix.m4a` committed and pushed.

## One-time setup (Windows, PowerShell)
```powershell
winget install Python.Python.3.12
winget install Git.Git
winget install Gyan.FFmpeg
# close and reopen PowerShell, then:
python -m pip install playwright numpy pillow
python -m playwright install chromium
```
macOS: `brew install python git ffmpeg`, then the same two pip/playwright lines.

## Render a film
```powershell
git clone <repo-url> "$HOME\claude projekte\videos"
cd "$HOME\claude projekte\videos"
git checkout <branch>
$S = ".claude\skills\doc-explainer-video\scripts"
python $S\render.py hf-5min frames --width 1920 --height 960 --gpu --workers 2
python $S\encode.py --project hf-5min --fps 25 --pattern "frames/f_%04d.jpg"
```
The finished file is `hf-5min\out\film.mp4`. Rerunning the render command only fills in missing or broken frames; it exits with an error naming any frame still missing, and `encode.py` refuses to encode an incomplete sequence. The first line of output names the WebGL renderer: it should name your graphics card, not "SwiftShader". (`--pattern f_%04d` only for projects started before the skill, which used 4-digit frame names; new projects use the default 5 digits.)

Notes:
- `--gpu` uses ANGLE on Direct3D 11 on Windows and Metal on macOS. If the GPU is not picked up (frames render but slowly), update the graphics driver; check `chrome://gpu` in the bundled browser.
- 2 workers is a good start on a laptop; desktops with a strong GPU can use 3–4.
- Excluding the project's `frames\` folder from Windows Defender real-time scanning speeds up writing thousands of JPEGs.
- If output is redirected to a file, set `$env:PYTHONUTF8=1` first (the scripts also switch their own output to UTF-8).
- Paths with spaces ("claude projekte") need quotes, as above.
- If the project uses symlinks for `fonts/` or `vendor/` (git on Windows may check them out as text files), copy those folders instead.

## macOS / Linux via Remote Control
If the user's computer is a Mac or Linux machine, they can add the folder in the Claude desktop app (Settings → Claude Code → Remote Control) or run `claude remote-control` in it; the cloud session can then request the folder and run the same commands there.
