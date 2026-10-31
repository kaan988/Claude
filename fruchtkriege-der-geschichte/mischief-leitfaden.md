# Mischief 1 optimal nutzen – Leitfaden (Testreihe vom 30.10.2026)

Mischief 1 (`tbc/mischief-1/image-to-video` bei fal) ist ein schnelles, günstiges Bild-zu-Video-Modell. Die Dateinamen der Ergebnisse beginnen mit `wan22`, vermutlich basiert es auf Wan 2.2. Alles hier stammt aus eigenen Testläufen mit den Startbildern der Napoleon- und Kaffee-Videos.

## 1. Alle Einstellungen (laut offizieller Schnittstellen-Beschreibung)

| Parameter | Werte | Empfehlung |
|---|---|---|
| `image_url` | Startbild (JPEG/PNG) | immer ein geprüftes, scharfes Startbild |
| `prompt` | Text | **lang und genau**, siehe Vorlage unten |
| `resolution` | `480p` (832×480, 0,005 $/s) · `720p` (1280×720, 0,01 $/s, Standard) | 480p für Entwürfe, **720p fürs Endergebnis** |
| `duration` | `3` (49 Bilder) · `5` (81 Bilder), immer 16 fps | Entwurf und Endfassung gleich lang; längere Szenen aus mehreren Clips (letztes Bild als neues Startbild) |
| `seed` | Zahl | immer setzen, dann sind Ergebnisse wiederholbar |
| `prompt_processing` | `enhanced` (Standard, schreibt den Prompt um) · `original` (wörtlich) | **`original`**: Prompt kommt wörtlich an, Ergebnis mit gleichem Seed wiederholbar |
| `image_transform` | `center_crop` (Standard) · `resize` (staucht/streckt) | `resize` für den Hochformat-Trick |

Andere Parameter (z. B. `aspect_ratio`) lehnt die Schnittstelle ab.

## 2. Ergebnisse der Testreihe

| Test | Ergebnis |
|---|---|
| Gleicher Seed zweimal | praktisch identisches Video, also wiederholbar |
| 480p-Entwurf → 720p mit gleichem Seed | gleicher grober Ablauf, Details anders (z. B. ein Luftsprung nur in 480p) |
| `enhanced` vs. `original` bei langem Prompt | kaum Unterschied; bei kurzen Prompts erfindet `enhanced` Dinge (Kerzen im ersten Test) |
| Langer vs. kurzer Prompt | lang: rund 65 % mehr der gewünschten Bewegung, Endzustand wird erreicht |
| Schärfe 720p vs. 480p | 720p rund 2,3-mal schärfer; 480p bleibt auch nach KI-Upscale weich |
| **Hochformat per `resize`** (9:16-Bild wird gestaucht, Video danach zurückgestreckt) | **funktioniert**: Proportionen und Bewegung stimmen, volles Bild ohne Ränder |
| Hochformat per `resize` mit **runden Objekten** (Kugel, Planet, Sonne) | **scheitert**: Mischief macht sie im gestauchten Bild wieder rund, nach dem Zurückstrecken werden sie zum hohen Ei. Ein Prompt-Hinweis hilft nicht. Ausweg: 9:16-Bild mittig in ein 16:9-Bild mit unscharfen Rändern setzen, normal animieren, nach dem Upscale den 9:16-Ausschnitt herausschneiden (etwas weicher, aber formtreu) |
| Hochformat per 90°-Drehung | **untauglich**: Figuren kippen um, weil das Modell die Schwerkraft verwechselt |
| Bytedance Video Upscale (Higgsfield, 1080p, 30 fps, Preset `aigc`) | 1 Credit pro 5 s, echte Zwischenbilder (81 → 150 Bilder), sauberere Kanten |
| Kostenlose Zwischenbilder per ffmpeg (16 → 32 fps) | funktioniert bei ruhiger Bewegung ohne sichtbare Geisterbilder |
| Kling Motion Control mit Mischief-Clip als Vorlage | überträgt nur Körperbewegung, keine Effekte (Dampf, Wasser); ohne Menschen fehlgeschlagen |

Demo (zwei Hochformat-Clips aus der Kette unten, 1080×1920, 30 fps): https://d2ol7oe51mr4n9.cloudfront.net/user_3LG3QXIQE4FmWT2MJcDCK9LTDHj/787badd2-4a6b-49c4-974a-c74644cdae1d.mp4

Noch nicht getestet: ob 3-s-Clips näher am Startbild bleiben als 5-s-Clips, und ob sich unbewegte Bildteile aus dem scharfen Startbild einsetzen lassen.

## 3. Die optimale Kette

1. **Startbild** in Higgsfield (Nano Banana Pro, 2 Credits), im Endformat (9:16 oder 16:9).
2. **Entwürfe in 480p:** 2–3 Seeds mit `prompt_processing: original`, gleich lang wie die Endfassung (5 s ≈ 2,3 Cent pro Stück). Sie zeigen, ob der Prompt die gewünschte Aktion überhaupt auslöst. Klappt es mit keinem Seed, den Prompt ändern statt weiter zu würfeln.
3. **Endfassung in 720p** mit dem besten Seed (≈ 4,7 Cent). Der grobe Ablauf bleibt, Details können abweichen. Passt es nicht, einen zweiten Seed in 720p rendern.
4. **Hochformat:** 9:16-Startbild mit `image_transform: resize` schicken. Das Ergebnis ist 1280×720 gestaucht und wird später zurückgestreckt.
5. **Upscale** mit Higgsfield „Bytedance Video Upscale“ (1080p, 30 fps, `aigc`), dann bei Hochformat zurückstrecken:
   ```bash
   ffmpeg -i upscaled.mp4 -vf "scale=1080:1920:flags=lanczos,setsar=1" -c:v libx264 -crf 17 vertical.mp4
   ```
6. **Schnitt:** Text, Zähler und Ton im Schnitt; Mischief kann keinen Text.

## 4. Prompt-Vorlage (immer auf Englisch, mit `original`)

```text
[Stil], [Kamera: "Static locked-off camera, no camera movement" oder "fixed camera with a slow gentle push-in"].
[Szene und Figur in einem Satz, mit Kleidung und Farben].
[Aktion in Reihenfolge: zuerst …, dann …].
Keep [Figur, Kleidung, Requisiten, Hintergrund] stable in shape, color and position.
[Endzustand: "He ends …"].
```

Beispiel, das im Test sauber funktioniert hat:

```text
Clean minimalist 3D animation in the style of a simple Blender render. Static locked-off camera, no camera movement. A young man with a red beanie and green t-shirt sits at a cafe window table holding a white paper coffee cup in both hands. He lifts the cup slightly toward his face, purses his lips and blows on the coffee twice. The white steam rising from the cup grows thicker and taller with every breath and drifts up past his face. Keep his face, red beanie, green t-shirt, the cup, the table and the window background stable in shape, color and position. He ends looking at the cup with a slightly worried expression.
```

## 5. Was Mischief gut kann und was nicht

| Gut | Schwach |
|---|---|
| Dampf, Rauch, Glühen, Wasser, Licht | schnelle Kämpfe, Hände, viele Figuren gleichzeitig |
| Mimik und kleine Gesten einer Figur | exakte Details über 5 s (Abzeichen, Muster) |
| Kamerafahrten, ruhige Szenen | Lippensynchronität |
| Effekt-Formate wie „alle 2 Sekunden heißer“ | Text im Bild |

## 6. Kosten pro Sekunde fertiges Video (Tarif 59 €/1.000 Credits, 1 $ ≈ 0,93 €)

| Weg | pro Sekunde | 90-s-Short (nur Video) |
|---|---|---|
| Mischief 720p, gratis hochgerechnet (ffmpeg) | ≈ 0,9 Cent | ≈ 0,85 € |
| Mischief 720p + Bytedance-Upscale | ≈ 2,1 Cent | ≈ 1,90 € |
| wie oben, mit Proben (3 × 480p, im Schnitt 1,5 × 720p) | ≈ 4 Cent | ≈ 3,60 € |
| Kling 3.0 Std (Higgsfield), ohne Fehlversuche | ≈ 8,9 Cent | ≈ 8 € |
| Kling 3.0 Pro (Higgsfield), ohne Fehlversuche | ≈ 10,3 Cent | ≈ 9,30 € |

## 7. Korrektur früherer Kostenangaben

Mischief rendert ohne Angabe in 720p (0,05 $ pro 5-s-Clip). Die früheren Angaben gingen fälschlich von 0,025 $ aus. Tatsächliche fal-Kosten: Napoleon-Folge ≈ 0,90 $, Kaffee-Video ≈ 0,60 $, Motion-Control-Probelauf ≈ 0,30 $, diese Testreihe ≈ 0,45 $.
