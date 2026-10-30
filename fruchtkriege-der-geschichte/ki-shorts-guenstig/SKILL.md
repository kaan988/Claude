---
name: ki-shorts-guenstig
description: Plant hochwertige KI-Animations-Shorts (YouTube Shorts, TikTok) so günstig wie möglich mit Higgsfield (Nano Banana Pro, Kling 3.0, Eleven v4, Video-Upscale) und fal Mischief 1. Liefert Kosten in Euro vor jeder Generierung, Szenenplan, englische Bild- und Video-Prompts mit allen Einstellungen und Schnittschritte. Verwenden bei Fragen zu Mischief 1, Higgsfield, Kling, Credits sparen, Hochformat-Videos oder „Was wäre, wenn …“-Shorts.
---

# KI-Shorts günstig und hochwertig produzieren

Erfahrungswerte aus echten Testläufen, Stand Oktober 2026. Preise und Modelle können sich ändern.

## Regeln
- Antworte auf Deutsch. Prompts für Bild- und Videomodelle immer auf Englisch.
- Gib konkrete Produktionsanweisungen (Prompts, Einstellungen, Reihenfolge, Kosten), keine allgemeinen Tipps.
- Nenne vor jeder Generierung die Kosten in Credits, Dollar und Euro und eine Obergrenze.
- Trenne Getestetes von Vermutungen. Erfinde keine Parameter oder Preise.
- Frage nie nach API-Schlüsseln.

## Preise
Tarif: 59 € pro 1.000 Higgsfield-Credits, also 1 Credit = 5,9 Cent. 1 $ ≈ 0,93 €.

| Werkzeug | Preis | ≈ pro 5 s |
|---|---|---|
| Nano Banana Pro, Bild 2K | 2 Credits pro Bild | – |
| Kling 3.0 Pro | 1,75 Credits/s | 52 Cent |
| Kling 3.0 Standard | 1,5 Credits/s | 44 Cent |
| Kling 3.0 Motion Control (Std) | 10 Credits pro 5 s | 59 Cent |
| Seedance 2.0 Fast 720p | 12,5 Credits pro 5 s | 74 Cent |
| Video-Upscale Bytedance (Preset aigc) | 1 Credit pro 5 s | 6 Cent |
| Mischief 1, 480p (fal) | 0,005 $/s | 2,3 Cent |
| Mischief 1, 720p (fal, Standard) | 0,01 $/s | 4,7 Cent |

## Mischief 1 (fal: tbc/mischief-1/image-to-video)
Bild-zu-Video, nur Querformat, immer 16 fps, vermutlich auf Basis von Wan 2.2. Parameter:
- `image_url`: Startbild.
- `prompt`: lang und strukturiert (Vorlage unten).
- `resolution`: `480p` (832×480) für Proben, `720p` (1280×720, Standard) für Endfassungen.
- `duration`: nur `3` (49 Bilder) oder `5` (81 Bilder).
- `seed`: immer setzen. Gleicher Seed mit gleichen Einstellungen ergibt dasselbe Video.
- `prompt_processing`: `original` nutzen. Der Standard `enhanced` schreibt den Prompt um und erfindet bei kurzen Prompts Dinge dazu.
- `image_transform`: `center_crop` (Standard) oder `resize` (staucht das Bild auf 16:9).
- Ein Seitenverhältnis lässt sich nicht einstellen.

Testergebnisse:
- 480p-Probe und 720p mit gleichem Seed: grober Ablauf gleich, Details anders.
- 720p ist rund 2,3-mal schärfer. 480p bleibt auch hochgerechnet weich, Endfassungen also immer in 720p.
- Lange, strukturierte Prompts bringen rund 65 % mehr der gewünschten Bewegung als kurze.
- Hochformat-Trick funktioniert: 9:16-Startbild mit `resize` schicken, das gestauchte Ergebnis nach dem Upscale auf 1080×1920 zurückstrecken.
- Bild um 90° drehen funktioniert nicht, die Figuren kippen um.
- Kling Motion Control mit Mischief-Clip als Vorlage überträgt nur Körperbewegung, keine Effekte wie Dampf oder Wasser. Ohne sich bewegenden Menschen scheitert es.

Gut: Dampf, Rauch, Glühen, Feuer, Wasser, Licht, Mimik, kleine Gesten, ruhige Kamerafahrten, eine Figur pro Bild.
Schwach: schnelle Kämpfe, Hände, viele Figuren, feine Details über 5 s, Lippensynchronität, Text im Bild.

## Prompt-Vorlage für Mischief
[Style]. [Camera: "Static locked-off camera, no camera movement" oder "Fixed camera with a slow gentle push-in"]. [Szene und Figur in einem Satz mit Kleidung und Farben]. [Eine Hauptaktion in 2–3 Schritten, in Reihenfolge]. Keep [Figur, Kleidung, Requisiten, Hintergrund] stable in shape, color and position. [Endzustand: "He ends …"].

Beispiel: "Clean minimalist 3D animation in the style of a simple Blender render. Static locked-off camera, no camera movement. A young man with a red beanie and green t-shirt sits at a cafe window table holding a white paper coffee cup in both hands. He lifts the cup slightly toward his face, purses his lips and blows on the coffee twice. The white steam rising from the cup grows thicker and taller with every breath and drifts up past his face. Keep his face, red beanie, green t-shirt, the cup, the table and the window background stable in shape, color and position. He ends looking at the cup with a slightly worried expression."

## Ablauf pro Video
1. Szenenliste: je Szene 3 oder 5 s und eine Hauptaktion.
2. Mit Sprecher: zuerst den Ton erzeugen (Eleven v4 in Higgsfield), dann die Szenenlängen an den Ton anpassen. Sprechertext rund 25 % kürzer planen als gedacht.
3. Startbilder mit Nano Banana Pro im Endformat (9:16). Das Startbild bestimmt Aussehen und Details, hier nicht sparen: 2 Varianten machen, die beste nehmen.
4. Proben: 2–3 Seeds in 480p, gleich lang wie die Endfassung, mit `original`. Klappt keine, den Prompt ändern statt weiter zu würfeln. Prompt-Varianten mit festem Seed vergleichen.
5. Endfassung: 720p mit dem besten Seed, bei 9:16 mit `resize`. Passt sie nicht, einen zweiten Seed in 720p rendern.
6. Upscale mit dem Higgsfield Video-Upscale (Bytedance, Preset aigc): 1080p, 30 fps mit echten Zwischenbildern. Danach zurückstrecken: `ffmpeg -i upscaled.mp4 -vf "scale=1080:1920:flags=lanczos,setsar=1" -c:v libx264 -crf 17 vertical.mp4`. Gratis-Alternative: ffmpeg `minterpolate` auf 32 fps, gut bei ruhiger Bewegung.
7. Längere Szenen: das letzte Bild eines Clips als Startbild des nächsten.
8. Schnitt: Text, Zähler, Untertitel, Musik und Karten im Schnittprogramm hinzufügen, nie per KI.

## Wann Kling statt Mischief
- Kling 3.0 (Pro für Hauptszenen) bei mehreren Figuren, schneller Action, Händen, Dialog und wenn Figuren exakt gleich aussehen müssen (Higgsfield Elements als Figurenreferenz). Cliplänge sekundengenau auf den Ton, Clip-Ton aus.
- Vorher Startbild und Prompt mit Mischief-Proben testen. Eine Mischief-Bewegung lässt sich aber nicht 1:1 auf Kling übertragen.
- Neue Higgsfield Elements brauchen Verarbeitungszeit. Bis dahin bestimmt das Startbild die Figur.

## Kosten für 90 s Video (nur Bewegtbild)
- Mischief 720p, gratis hochgerechnet: ≈ 0,85 €
- Mischief 720p + Upscale: ≈ 1,90 €
- dasselbe mit Proben (3 × 480p, im Schnitt 1,5 × 720p): ≈ 3,60 €
- Kling 3.0 Standard: ≈ 8 €; Kling 3.0 Pro: ≈ 9,30 € (ohne Fehlversuche)

Dazu kommen Startbilder (2 Credits pro Bild) und gegebenenfalls Stimmen.

## Formate
„Was wäre, wenn X alle 2 Sekunden Y?“ (z. B. Kaffee wird immer heißer):
- schlichte, saubere 3D-Szenen im Blender-Look, eine Figur, ruhige Kamera
- 9:16; oben großer Zähler in Serifenschrift mit Vergleich, unten eine kursive Textzeile; kein Sprecher, ruhige Klaviermusik
- 10–12 Stufen à 5 s, jede extremer; Vergleichswerte physikalisch korrekt recherchieren; Pointe am Ende
- ideal für Mischief, weil Effekte die Wirkung tragen

Geschichte mit Figuren (z. B. Früchte als Länder):
- Fakten prüfen. Karten nie per KI, sondern aus echten Kartendaten (z. B. Natural Earth) im Schnitt bauen.
- Hauptszenen mit Kling, ruhige Szenen und Effekte mit Mischief.

## Antwortformat für ein neues Video
1. Kurzkonzept und Gesamtkosten mit Obergrenze.
2. Pro Szene: Dauer, Werkzeug, Startbild-Prompt, Video-Prompt, Einstellungen (Auflösung, Dauer, Seed, `image_transform`, `prompt_processing`).
3. Text-Einblendungen oder Sprechertext pro Szene.
4. Schnittschritte.
