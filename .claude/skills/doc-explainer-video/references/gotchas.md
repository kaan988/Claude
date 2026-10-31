# Gotchas (each one happened)

| Symptom | Cause | Fix |
|---|---|---|
| An ending started 3.5 s early; the key moment never showed | Word key `/^it'?s$/` matched "its" in "of its business" | Key exact words; count occurrences inside the line (`T(line, "it's")`) |
| Finished files were ~3 dB too loud (−11 LUFS) | Loudness measured on mono, shipped as stereo (two identical channels) | Measure the stereo array that ships; verify the MP4 with `ebur128` |
| Every frame black while stills looked fine | A page function shared a name with something the renderer injected (or two globals named `W`) | Unique names (`filmDrawFrame`), no duplicate top-level identifiers |
| Half-written JPEGs after a background job was killed | Frames written in place | Write `.tmp` then `os.replace`; validate JPEG end marker on resume |
| Pull-out passed through an empty navy frame | Pan interpolated linearly while zoom changed exponentially | Pan proportional to view width (see style-map.md) |
| Wide 3D shots almost black | Exponential fog at 70 m distance | Fog and key light scale with camera distance |
| Subject hidden behind heads | Desk placed inside the crowd | Hide crowd instances around the subject |
| Whisper heard "dare set", "one row", "Thomas Wolfe" | Kokoro flaps or clips consonants | Substitute phonemes; compare transcript to script every time |
| Land mask missed forest and towns | Literal R>B rule | Measure relative to the sea's own R−B level |
| Land painted over the sea in d3 | Antarctica / inverted rings with clipExtent | Drop rings with `geoArea > 2π` |
| Fast zooms ghosted | 8 blur samples | Raise samples with zoom speed (up to 40) |
| Hall turned uniformly red and unreadable | Infection colour and red light too strong | Tint ≤ 0.5, red light ≤ 12, spread over ~9 s |
| User could not download the 66 MB MP4 on a phone | Large file | Publish a preview page with an embedded ~11 MB web encode and a "Play with sound" button |
| "No sound" reported | Device silent switch / muted player | Explain: phone silent switch, media volume, muted speaker icon; the page button sets `muted=false` |
| Misread scope ("expand to 5 minutes") | Standalone film vs part of a longer one | Ask before scripting |
| Eight subagent web fetches failed | Host not allowed | Probe hosts first; ask the user to allow all needed hosts in one go |
| Page stays blank on some Windows PCs | Windows registry maps `.js` to `text/plain`; module scripts refuse to run | render.py pins MIME types on its http handler |
| `UnicodeEncodeError` when output is piped on Windows | Console code page cp1252 vs IPA/transcript characters | Scripts reconfigure stdout/stderr to UTF-8 |
| `PermissionError` renaming fresh frames on Windows | Defender/Explorer briefly holds new files | Retry `os.replace` with short back-off |
| A crashed render worker looked successful | `max()` of exit codes hid a negative (signal) code | First non-zero code wins; verify every frame exists before declaring done |
| Gaps in frames silently shortened the film | ffmpeg stops at the first missing number, `-shortest` trims audio | encode.py checks the full sequence first |
| Re-voiced but kept old Whisper times | Two inputs from different wavs | align_words.py compares durations and stops |
| A 4:46 film in an 11 MB page looked like mush | One file under the 16 MB page limit | Four ≤ 14 MB fMP4 segments as supporting files, played through Media Source |
| Publishing refused `stream.m3u8` | Artifact pages serve only standard web types | Drop the playlist; segments named `.mp4`, joined in the page |
