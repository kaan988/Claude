# Produktionsstand Folge 1 (Stand 30.10.2026)

Übergabe-Notiz, damit eine neue Sitzung ohne Neugenerierung weitermachen kann.

## Testlauf Szenen 1–6 (fertig)

- Fertiges Video mit Untertiteln: https://d2ol7oe51mr4n9.cloudfront.net/user_3LG3QXIQE4FmWT2MJcDCK9LTDHj/ef316cf2-4f6f-48f5-a18e-e97d4b72e126.mp4
- Ohne Untertitel (für CapCut): https://d2ol7oe51mr4n9.cloudfront.net/user_3LG3QXIQE4FmWT2MJcDCK9LTDHj/4f3317ec-ce8c-466a-9b56-77c0d3adafe8.mp4
- Länge 44 s (geplant ~32 s), 1080×1920, 30 fps, ohne Musik/SFX
- Verbrauch: 115,3 Higgsfield-Credits (644,5 → 529,19)

## Higgsfield-Elements (wiederverwendbar)

| Figur | Element-ID | Hero-Bild (Job) |
|---|---|---|
| Napoleon | `de092895-3e06-4c6f-b73b-b9e35dc3dc88` | `f04241d7-6f62-46f6-b139-56a85e64bba3` |
| NapoleonKind | `0591d7f2-0328-4f33-969a-c6f2f4e80168` | `2b441701-4543-4f2a-86e1-4c1bbc3ea62f` |
| Blaubeere | `509090d4-1ff5-47d0-b84b-8c21b822d396` | `2db35fcf-58f7-4999-9043-4c87c742fc3b` |
| Zar | `e2d530d3-84f5-49fc-9c43-f85b466afe1e` | `fc9790c5-e914-4fb5-a03a-bde202a58bfa` |
| Franz | `3d09ac5b-2286-4b38-9469-fc91fdf21abd` | `d030f2c4-7418-4a32-8e75-075a63027c82` |

Character Sheets (Jobs): Napoleon `70e37635-5094-499f-833b-f9ae23290aa9` · Blaubeere `2fa6a802-c7e0-4f6b-8ddf-7a7622f4519e` · Franz `664fd70c-d133-4f14-9f2b-2d807663704f` · Zar `e81bcb8c-b951-44ae-9263-38f4a85d7d78`

Noch nicht angelegt: Wellington, Blücher, General Winter.

## Gewählte Startbilder und Clips

| Szene | Startbild (Job) | Clip Kling 3.0 Pro (Job) |
|---|---|---|
| S01 Hook | `14ece346-1b7d-40d7-9760-fe37c99df1c4` | `a1784a3f-2d0f-4876-bf30-0a7f5309ce37` (5 s) |
| S02 Korsika | `8dfd9367-13e9-4218-aafa-2936089d0c1a` | `530cd2bc-b68b-4f9a-9d3a-7ace3b7ca54f` (6 s) |
| S03 Schneeballschlacht | `02d02dbc-b8dc-44a9-9eaf-01dc1c20cd88` | `8c144d0a-f826-4427-89a5-affa23aaf08d` (7 s) |
| S04 Aufstieg | `e3e1f01d-f1c4-4ae4-837d-d5331fa6db65` | `e62de683-9811-4222-a473-f634809ac18f` (7 s) |
| S05 Krönung | `ad22855d-58ef-4b85-b93a-6861c70bee1b` | `403f5e14-06e1-4998-9cbd-aec4ceaa218f` (7 s) |
| S06 Austerlitz | `67e387d3-24df-4f90-924a-72f702aa37ce` | `f96ae551-5c7b-45d0-8918-66c8f76140a3` (7 s) |

## Stimmen (Eleven v4, Higgsfield-Presets)

| Rolle | Stimme | voice_id | Nachbearbeitung |
|---|---|---|---|
| Erzähler | Max | `6b528d43-c056-4a2f-9d82-1591a7ba13b0` | 1,2× schneller |
| Napoleon | Jasper | `a7b8abe9-47f1-553e-a9df-87945a7e5bc8` | +2 Halbtöne |
| Klein-Napoleon | Pixie | `0178ef57-ada4-43d9-992b-8d9221045bb4` | 1,1×, klingt etwas englisch → tauschen |
| Kadett | Daisy | `032386ec-491b-5bdc-81ac-49e9a6a2c89d` | 1,1× |
| Franz | Gideon | `1ad38ba4-9cc4-4f2f-9fde-b0fefdf67ae5` | 1,1× |

## Erkenntnisse aus dem Test

- Die Stimme spricht langsamer als geplant: Szenen 1–6 dauern 44 s statt ~32 s. Den Sprechertext für die ganze Folge um etwa 25 % kürzen, bevor weitere Videos generiert werden.
- Alle 6 Clips waren beim ersten Versuch brauchbar (geprüftes Startbild → Kling 3.0 Pro, Ton aus).
- Neue Elements sind für Kling erst nach einer Verarbeitungszeit nutzbar („Referenzelement ist nicht bereit“). Bis dahin ohne `@`-Verweis generieren, die Figur kommt aus dem Startbild.
- Higgsfield schlägt bei Videos manchmal ein Preset vor und bricht ab. Mit `declined_preset_id` erneut senden.
- Zar hat in S06 einen Schnurrbart statt Koteletten; in S04 ist die Mitte beim Hochheben stark verwischt.

## fal.ai-Anbindung (offen)

- Netzwerk: `fal.run`, `queue.fal.run`, `mcp.fal.ai`, `api.fal.ai` erreichbar; `v3.fal.media` (Ergebnis-Downloads) noch blockiert.
- Schlüssel: Anfragen an fal kommen ohne Schlüssel an (HTTP 401). Das Network Secret muss `fal.run`, `*.fal.run` und `*.fal.ai` abdecken (Header `Authorization`, Prefix `Key`).
- `claude mcp add … fal https://mcp.fal.ai/mcp-relay` wurde nur in der temporären Umgebung eingetragen und ist in einer neuen Sitzung weg.

## Komplette Folge mit Mischief 1 (fal), Querformat (fertig)

- 16:9: https://d2ol7oe51mr4n9.cloudfront.net/user_3LG3QXIQE4FmWT2MJcDCK9LTDHj/e7ba234c-3707-4887-b0c2-c5dfc6f3a297.mp4
- 9:16 (Video mittig, unscharfer Hintergrund): https://d2ol7oe51mr4n9.cloudfront.net/user_3LG3QXIQE4FmWT2MJcDCK9LTDHj/17d325c5-8787-4e5d-be92-357ce29f14ee.mp4
- Länge 1:41, alle 15 Szenen, gekürzter Sprechertext ab Szene 7, Karten aus Natural-Earth-Daten (Küsten korrekt, keine historischen Grenzen)
- Verbrauch: 76,7 Higgsfield-Credits (529,19 → 452,52) für Bilder und Stimmen, ca. 0,47 $ bei fal für 18 Clips à 5 s
- Neue Elements: Wellington `b8031487-b03c-4ed3-8f51-37e599323ec1`, Bluecher `0afc49e1-303d-43a5-85c3-5dbe5117479c`, GeneralWinter `b494425c-89d8-472b-a0b9-7a866b9a98c7`
- Mischief 1 (`tbc/mischief-1/image-to-video`): nur Parameter `image_url`, `prompt`, `duration` (3 oder 5); Ausgabe immer 1280×720, 16 fps; 0,005 $/s
- Stimmen neu: Blücher = Barrett `d603a8cd-3fe1-55e0-9245-617a2589131e`, Wellington = Harrison `573e5163-59b3-4926-aab1-951ef2985f81`
