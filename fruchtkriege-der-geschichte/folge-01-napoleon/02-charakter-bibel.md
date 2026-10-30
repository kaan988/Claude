# Charakter-Bibel – Fruchtkriege der Geschichte

Diese Datei ist die verbindliche Vorlage für **alle** Figuren. Jede Figur wird einmal als Character Sheet und einmal als Hero-Bild erzeugt, das Hero-Bild wird in Higgsfield als **Element** gespeichert und danach in jedem Prompt nur noch per `@Name` aufgerufen. So sieht die Figur in allen Szenen identisch aus.

---

## 1. Universum-Regeln (gelten für jede Folge der Serie)

1. **Frucht = Kopf + Körper.** Das Gesicht sitzt oben vorne auf der Frucht. Die Fruchtoberfläche (Kerne, Poren, Streifen) bleibt immer sichtbar.
2. **Einheitliche Gliedmaßen:** kurze Cartoon-Arme mit **weißen Vier-Finger-Handschuhen**, kurze Beine mit **schwarzen Stiefeln**. Das ist das Wiedererkennungsmerkmal der Serie.
3. **Keine echten Waffen.** Kanonen schießen **Schlagsahne**, Soldaten tragen **Holz-Spielzeuggewehre mit Korken an der Schnur**. Wer getroffen wird, wird mit Sahne bekleckert, rutscht aus und kugelt weg. Niemand wird zerquetscht.
4. **Kein roter Fruchtsaft.** Saft-Spritzer wirken auf Kinder wie Blut, deshalb nur Sahne, Schnee, Konfetti und Staub.
5. **Farbcode der Nationen** (immer gleich): Frankreich = Dunkelblau mit Blau-Weiß-Rot · Großbritannien = Scharlachrot · Russland = Dunkelgrün mit Hellblau · Österreich = Weiß mit Schwarz-Gold · Preußen = Dunkelblau mit Schwarz · Schweden = Blau-Gelb.
6. **Jede Hauptfigur hat ein Markenzeichen** (Pose, Requisit, Satz), das in jeder Folge wiederkommt.

---

## 2. STYLE LOCK – in **jeden Bild-Prompt** am Ende einfügen

```text
STYLE: premium stylized 3D animated feature-film still, family comedy, glossy juicy fruit materials with subsurface scattering, soft global illumination, warm cinematic key light and gentle rim light, rich saturated colors, tactile miniature-diorama world, shallow depth of field, expressive cartoon faces with big glossy eyes and bold readable eyebrows, clean appealing silhouettes, all fruit characters have white four-fingered cartoon gloves and short black boots, vertical 9:16 composition with the main subject in the middle third (top 12% and bottom 25% kept free of important details), kid-friendly, no blood, no gore, no realistic weapons, no text, no letters, no logos, no watermark.
```

## 3. MOTION LOCK + AVOID – in **jeden Video-Prompt** am Ende einfügen

```text
Smooth high-quality 3D feature-film animation with snappy cartoon timing, squash-and-stretch and exaggerated facial expressions. Keep every character exactly as in the start frame: same fruit shape, colors, face, costume and proportions for the whole shot. Believable weight and ground contact. One continuous shot, no cuts.
Avoid: morphing, melting faces, extra limbs, extra fingers, duplicate characters, new characters appearing, flicker, text, subtitles, logos, watermark, blood, gore, juice splatter, realistic weapons, live-action humans.
```

---

## 4. Größentabelle (Napoleon = 1,0)

| Figur | Höhe ohne Hut | Hinweis |
|---|---|---|
| Napoleon (Erdbeere) | 1,0 | Referenzgröße |
| Klein-Napoleon | 0,6 | rundlicher, größere Augen |
| Blaubeer-Grenadier | 1,0 | **gleich groß wie Napoleon**, wirkt nur durch die Bärenfellmütze größer (historisch korrekt: Die Gardesoldaten waren besonders groß, deshalb wirkte Napoleon neben ihnen klein) |
| Kaiser Franz (Aprikose) | 1,1 | |
| Blücher (Pflaume) | 1,2 | immer nach vorne gelehnt |
| Wellington (Zitrone) | 1,4 | schlank und lang |
| Zar Alexander (Wassermelone) | 2,0 | in Szene 08 **absichtlich bergegroß** (Gag: Russland ist riesig) |
| General Winter | Himmel | Wettererscheinung, keine Frucht |

---

## 5. Hauptfiguren

### 5.1 Napoleon – „Erdbeer-Napoleon“ · Element `@Napoleon`

| | |
|---|---|
| Rolle | Napoleon Bonaparte, 1769–1821, Kaiser der Franzosen |
| Frucht | Erdbeere: klein, rot, ehrgeizig |
| Farben | Erdbeerrot `#D7263D`, Blattgrün `#3A7D2C`, Marineblau `#1B2A4A`, Gold, Weiß |
| Kostüm | schwarzer Zweispitz **quer** getragen (Spitzen links/rechts) mit blau-weiß-roter Kokarde, dunkelblauer Uniformrock mit rotem Stehkragen, roten Aufschlägen, Goldknöpfen und Goldepauletten, weiße Weste, weiße Hose, schwarze Reitstiefel |
| Markenzeichen | rechte Hand in der Weste · ruft „MEINS!“ · rastet bei „klein“ aus |
| Persönlichkeit | ehrgeizig, schnell, eitel, leicht beleidigt, aber charmant |
| Stimme | hoch, schnell, leichter französischer Akzent, bei Wut kieksend |

**Character-Sheet-Prompt** (Nano Banana Pro · 16:9 · 2K · 2 Varianten)

```text
Character turnaround model sheet of one original anthropomorphic fruit character for a 3D animated family comedy. Top row: four consistent full-body views evenly spaced — front view, three-quarter view, side profile, back view. Bottom row: four head close-ups with different expressions — furious shouting, smug proud smirk, shocked with huge eyes, triumphant laughing. Identical character in all views, light-grey seamless studio background, professional character sheet presentation.
CHARACTER: a small anthropomorphic ripe strawberry general. Body: one glossy bright-red strawberry (#D7263D) that is head and body in one, classic strawberry shape — wide and rounded at the top, narrowing to a soft rounded point at the bottom — covered with tiny golden-yellow seeds; a fresh green leafy calyx (#3A7D2C) on top that sticks out from under his hat like a little tuft of hair. Face on the upper front: large dark-brown eyes with bright highlights, thick dark-brown determined eyebrows, small confident smirk, no nose. Costume: an oversized black bicorne hat worn sideways (points to the left and right) with a round blue-white-red cockade on the front; a dark navy-blue military coat (#1B2A4A) wrapped around the lower two-thirds of the strawberry, tall red collar, red cuffs, two rows of gold buttons, gold fringed epaulettes; a white waistcoat visible at the chest; short stubby arms in navy sleeves with white four-fingered cartoon gloves; short legs in white breeches and shiny black knee-high riding boots.
RENDER: stylized 3D character render, appealing exaggerated proportions, glossy fruit material with subsurface scattering, detailed fabric with visible stitching, soft global illumination, three-point studio lighting, gentle rim light, high-end 3D animation studio quality, 4K.
Single character only, no other characters, no props, no text, no labels, no watermark, no frame borders.
```

**Hero-Bild-Prompt für das Element** (Nano Banana Pro · 3:4 · 2K · Referenz: bestes Character Sheet)

```text
Full-body front view of the exact same strawberry general as in the reference image, identical design, colors and costume, standing upright in a neutral confident pose, facing the camera, arms relaxed at the sides, both boots visible, centered, light-grey seamless studio background, soft even studio lighting, stylized 3D feature-film render, single character only, no text, no watermark.
```

---

### 5.2 Klein-Napoleon · Element `@NapoleonKind`

| | |
|---|---|
| Rolle | Napoleon als Kind (Korsika, Militärschule) |
| Unterschiede | 60 % Größe, rundlicher, etwas helleres Kirschrot `#E8394E`, größere Augen, gleiche Augenbrauen, gleiches Blattgrün |
| Kostüm A (Korsika) | gefalteter **Zeitungs-Zweispitz** quer, weites weißes Leinenhemd mit hochgekrempelten Ärmeln, braune kurze Hose, braune Sandalen |
| Kostüm B (Schule) | wie A plus kurze marineblaue Kadettenjacke mit rotem Kragen und roter Strickschal (nur im Prompt ergänzen, kein eigenes Element) |
| Stimme | Kinderstimme, frech, gleicher Akzent |

**Character-Sheet-Prompt** (16:9 · 2K · Referenz: Napoleon-Hero-Bild anhängen)

```text
Character turnaround model sheet of the strawberry general from the reference image as a 9-year-old child, for a 3D animated family comedy. Top row: four consistent full-body views — front, three-quarter, side profile, back. Bottom row: four head close-ups — fierce battle cry, angry red-faced shouting, mischievous grin, proud victory smile. Identical character in all views, light-grey seamless studio background.
CHARACTER: the same strawberry character but 60% of the adult size, rounder and chubbier, slightly lighter cherry-red skin (#E8394E) with tiny golden seeds, the same green leafy calyx on top, the same dark-brown eyes but bigger and rounder, the same thick dark-brown eyebrows, mischievous grin, no nose. Wears a folded newspaper bicorne hat worn sideways (newspaper print is tiny and unreadable), a loose white linen shirt with rolled-up sleeves, brown short trousers, white four-fingered cartoon gloves, small brown leather sandals.
RENDER: stylized 3D character render, appealing exaggerated proportions, glossy fruit material with subsurface scattering, soft global illumination, three-point studio lighting, gentle rim light, high-end 3D animation studio quality, 4K.
Single character only, no other characters, no props, no text, no labels, no watermark, no frame borders.
```

**Hero-Bild-Prompt** (3:4 · 2K · Referenz: bestes Sheet)

```text
Full-body front view of the exact same child strawberry character as in the reference image, identical design and newspaper hat, standing upright, cheeky confident pose, facing the camera, arms relaxed, both feet visible, centered, light-grey seamless studio background, soft even studio lighting, stylized 3D feature-film render, single character only, no text.
```

---

### 5.3 Blaubeer-Grenadier · Element `@Blaubeere`

| | |
|---|---|
| Rolle | Napoleons Armee (Grande Armée, Kaiserliche Garde) |
| Frucht | Blaubeere – französische Soldaten trugen Blau |
| Farben | Indigoblau `#3B4CA0` mit weißem Reif, Schwarz, Weiß, Rot |
| Kostüm | extra hohe schwarze Bärenfellmütze mit rotem Federbusch und kleinem Goldschild, dunkelblauer Rock mit weißen Revers und weißen Kreuzgurten, rote Epauletten, Holz-Spielzeuggewehr mit Korken |
| Besonderheit | alle Grenadiere sehen **identisch** aus (für Massenszenen) |
| Stimme | Chor, fröhlich, „Vive l'Empereur!“ |

**Character-Sheet-Prompt** (16:9 · 2K)

```text
Character turnaround model sheet of one original anthropomorphic fruit soldier for a 3D animated family comedy. Top row: four consistent full-body views — front, three-quarter, side profile, back. Bottom row: four head close-ups — cheering, saluting with a serious face, shivering with frost, laughing. Identical character in all views, light-grey seamless studio background.
CHARACTER: a small round anthropomorphic blueberry soldier, dusty indigo-blue skin (#3B4CA0) with a soft powdery whitish bloom and a tiny star-shaped crown dimple on top; simple cute face: round black eyes with highlights, small eyebrows, wide friendly grin, no nose. An extra-tall fluffy black bearskin hat with a red plume and a small gold plate on the front; a dark-blue military coat with white lapels, white crossbelts and red epaulettes; white four-fingered cartoon gloves; short black boots; holds a wooden toy rifle with a cork on a string.
RENDER: stylized 3D character render, appealing proportions, glossy fruit material with subsurface scattering, soft global illumination, three-point studio lighting, high-end 3D animation studio quality, 4K.
Single character only, no other characters, no text, no labels, no watermark, no frame borders.
```

**Hero-Bild-Prompt** (3:4 · 2K)

```text
Full-body front view of the exact same blueberry soldier as in the reference image, identical bearskin hat, uniform and toy rifle, standing at attention, facing the camera, both boots visible, centered, light-grey seamless studio background, soft even studio lighting, stylized 3D feature-film render, single character only, no text.
```

---

### 5.4 Wellington – „Zitronen-Wellington“ · Element `@Wellington`

| | |
|---|---|
| Rolle | Arthur Wellesley, Herzog von Wellington, britischer Feldherr bei Waterloo |
| Frucht | Zitrone. Die Zitronenspitze ist seine **lange Nase**: Seine Soldaten nannten ihn wirklich „Old Nosey“. |
| Farben | Zitronengelb `#F4D03F`, Scharlach `#B3262E`, Dunkelblau, Gold |
| Kostüm | Zweispitz **längs** getragen (vorne/hinten, Unterschied zu Napoleon!), scharlachroter britischer Uniformrock, weißer Kreuzgurt, weiße Hose, hohe Stiefel, Teetasse mit Untertasse, Messing-Fernrohr |
| Markenzeichen | bleibt im Chaos völlig ruhig und trinkt Tee, eine Augenbraue hochgezogen |
| Stimme | tief, langsam, vornehm-britischer Akzent |
| Historischer Hinweis | Wellington trug selbst oft einen schlichten dunkelblauen Rock. Das Rot steht hier für die britische Armee („Rotröcke“), damit Kinder ihn sofort zuordnen können. |

**Character-Sheet-Prompt** (16:9 · 2K)

```text
Character turnaround model sheet of one original anthropomorphic fruit character for a 3D animated family comedy. Top row: four consistent full-body views — front, three-quarter, side profile, back. Bottom row: four head close-ups — calm with one raised eyebrow, sipping tea, mildly annoyed, polite tiny smile. Identical character in all views, light-grey seamless studio background.
CHARACTER: a tall, slim anthropomorphic lemon general, 1.4 times as tall as a standard fruit character, bright lemon-yellow dimpled peel (#F4D03F), elongated oval shape with the pointy lemon tip forming a long, proud nose in the middle of his face; calm half-closed blue eyes, one eyebrow permanently raised, thin stiff-upper-lip smile. A black bicorne hat worn front-to-back (fore-and-aft) with a small black cockade; a scarlet-red British army coat (#B3262E) with dark-blue collar, gold buttons and gold epaulettes, a white crossbelt; white trousers; white four-fingered cartoon gloves; tall black boots. Holds a white porcelain teacup on a saucer, a brass spyglass tucked under his arm.
RENDER: stylized 3D character render, appealing exaggerated proportions, glossy fruit material with subsurface scattering, detailed fabric, soft global illumination, three-point studio lighting, gentle rim light, high-end 3D animation studio quality, 4K.
Single character only, no other characters, no text, no labels, no watermark, no frame borders.
```

**Hero-Bild-Prompt** (3:4 · 2K)

```text
Full-body front view of the exact same lemon general as in the reference image, identical design, fore-and-aft bicorne, scarlet coat, teacup and spyglass, standing upright and relaxed, facing the camera, both boots visible, centered, light-grey seamless studio background, soft even studio lighting, stylized 3D feature-film render, single character only, no text.
```

---

### 5.5 Zar Alexander I. – „Melonen-Zar“ · Element `@Zar`

| | |
|---|---|
| Rolle | Alexander I., Zar von Russland |
| Frucht | Wassermelone: riesig wie Russland, dunkelgrün wie die russischen Uniformen |
| Farben | Dunkelgrün `#1E5631`, Streifen `#7FB069`, Hellblau (Ordensband), Gold |
| Kostüm | kleine goldene Kaiserkrone schief oben, dunkelgrüne Uniformjacke mit Goldepauletten um die untere Hälfte, breites hellblaues Ordensband quer mit silbernem Stern |
| Markenzeichen | bewegt sich langsam, schweigt, **antwortet nie** (Running Gag) |
| Stimme | keine Sätze; höchstens ein tiefes „Hm.“ |

**Character-Sheet-Prompt** (16:9 · 2K)

```text
Character turnaround model sheet of one original anthropomorphic fruit character for a 3D animated family comedy. Top row: four consistent full-body views — front, three-quarter, side profile, back. Bottom row: four head close-ups — cool and unimpressed, slow blink, tiny smug smile, surprised with whipped cream on his face. Identical character in all views, light-grey seamless studio background.
CHARACTER: a giant round anthropomorphic watermelon emperor, twice as tall as a standard fruit character, dark-green rind (#1E5631) with lighter wavy green stripes (#7FB069), cool unimpressed expression, heavy-lidded pale-blue eyes, light-blond bushy sideburns, small closed smile, no nose. A small golden imperial crown slightly tilted on top; a dark-green Russian military jacket with gold epaulettes and gold buttons around his lower half; a wide light-blue sash diagonally across his body with a silver star medal; white four-fingered cartoon gloves; short black boots. Heavy, slow, calm body language.
RENDER: stylized 3D character render, appealing exaggerated proportions, glossy rind with subtle subsurface scattering, soft global illumination, three-point studio lighting, gentle rim light, high-end 3D animation studio quality, 4K.
Single character only, no other characters, no text, no labels, no watermark, no frame borders.
```

**Hero-Bild-Prompt** (3:4 · 2K)

```text
Full-body front view of the exact same watermelon emperor as in the reference image, identical design, tilted gold crown, green uniform and light-blue sash, standing calmly, facing the camera, both boots visible, centered, light-grey seamless studio background, soft even studio lighting, stylized 3D feature-film render, single character only, no text.
```

---

### 5.6 Kaiser Franz I. – „Marillen-Kaiser“ · Element `@Franz`

| | |
|---|---|
| Rolle | Franz II./I., Kaiser von Österreich |
| Frucht | Aprikose (österreichisch: Marille) |
| Farben | Aprikosenorange `#F5A142` mit rosa Wange, Weiß `#F2EFE6`, Rot, Schwarz-Gold |
| Kostüm | kleine goldene Krone, weißer österreichischer Uniformrock mit rotem Kragen und Aufschlägen, schwarz-goldene Schärpe, rote Hose |
| Markenzeichen | nervös, schwitzt, ringt die Hände, ruft „Jessas Maria!“ |
| Stimme | mittelhoch, Wiener Dialekt |

**Character-Sheet-Prompt** (16:9 · 2K)

```text
Character turnaround model sheet of one original anthropomorphic fruit character for a 3D animated family comedy. Top row: four consistent full-body views — front, three-quarter, side profile, back. Bottom row: four head close-ups — nervous sweating, panicked screaming, polite worried smile, shocked with whipped cream on his face. Identical character in all views, light-grey seamless studio background.
CHARACTER: a plump anthropomorphic apricot emperor, slightly taller than a standard fruit character, soft velvety orange skin (#F5A142) with a rosy blush on one cheek and a vertical seam line down the middle, nervous worried face with big anxious eyes, small drops of sweat, a thin brown mustache, no nose. A small golden crown; a white Austrian military coat (#F2EFE6) with red collar and cuffs and gold buttons; a black-and-gold sash; red trousers; white four-fingered cartoon gloves; short black boots; often wringing his hands.
RENDER: stylized 3D character render, appealing exaggerated proportions, velvety fruit material with subsurface scattering, soft global illumination, three-point studio lighting, gentle rim light, high-end 3D animation studio quality, 4K.
Single character only, no other characters, no text, no labels, no watermark, no frame borders.
```

**Hero-Bild-Prompt** (3:4 · 2K)

```text
Full-body front view of the exact same apricot emperor as in the reference image, identical design, white Austrian coat, black-and-gold sash and small crown, standing slightly nervously, facing the camera, both boots visible, centered, light-grey seamless studio background, soft even studio lighting, stylized 3D feature-film render, single character only, no text.
```

---

### 5.7 Blücher – „Marschall Pflaume“ · Element `@Bluecher`

| | |
|---|---|
| Rolle | Gebhard Leberecht von Blücher, preußischer Feldmarschall, bei Waterloo 72 Jahre alt |
| Frucht | Pflaume (Zwetschge): alt, ein bisschen schrumpelig, voller Energie |
| Farben | Dunkelviolett `#4B2A5C`, Weiß (Bart), Dunkelblau, Rot, Schwarz |
| Kostüm | schwarze preußische Schirmmütze mit rotem Band, dunkelblauer Generalsrock mit rotem Kragen und Goldstickerei, schwarzes Eisernes Kreuz mit Silberrand, graue Reithose, Feldmarschallstab |
| Markenzeichen | riesiger weißer Walross-Schnurrbart, brüllt „VORWÄRTS!“ (sein echter Spitzname war „Marschall Vorwärts“) |
| Stimme | rau, laut, alt, Berliner Schnauze („Na, Kleener?“) |

**Character-Sheet-Prompt** (16:9 · 2K)

```text
Character turnaround model sheet of one original anthropomorphic fruit character for a 3D animated family comedy. Top row: four consistent full-body views — front, three-quarter, side profile, back. Bottom row: four head close-ups — yelling a battle cry, wide cheeky grin, squinting suspiciously, laughing loudly. Identical character in all views, light-grey seamless studio background.
CHARACTER: an old, energetic anthropomorphic plum field marshal, slightly taller than a standard fruit character, deep purple skin (#4B2A5C) with a dusty bloom and a few cheerful wrinkles, an enormous bushy white walrus mustache, bushy white eyebrows, fierce sparkling eyes, wild grin, no nose. A black Prussian peaked field cap with a red band; a dark-blue Prussian general's coat with red collar and gold embroidery; a black iron cross with silver edge on his chest; grey riding trousers; white four-fingered cartoon gloves; short black boots; holds a short field-marshal's baton. Always leaning forward as if charging.
RENDER: stylized 3D character render, appealing exaggerated proportions, fruit material with subsurface scattering, soft global illumination, three-point studio lighting, gentle rim light, high-end 3D animation studio quality, 4K.
Single character only, no other characters, no text, no labels, no watermark, no frame borders.
```

**Hero-Bild-Prompt** (3:4 · 2K)

```text
Full-body front view of the exact same plum field marshal as in the reference image, identical design, huge white mustache, black field cap, dark-blue coat and baton, leaning forward energetically, facing the camera, both boots visible, centered, light-grey seamless studio background, soft even studio lighting, stylized 3D feature-film render, single character only, no text.
```

---

### 5.8 General Winter · Element `@GeneralWinter`

| | |
|---|---|
| Rolle | der russische Winter 1812 („General Winter“ ist eine echte Redewendung) |
| Design | riesiges Schneesturm-Gesicht in den Wolken, eisblau leuchtende Augen, buschige Frost-Augenbrauen, Eiszapfen-Bart, gigantische graue Pelzmütze (Uschanka), bläst mit dicken Backen |
| Stimme | tiefes, hohles Windheulen |

**Design-Prompt** (Nano Banana Pro · 9:16 · 2K, das Ergebnis direkt als Element verwenden)

```text
A colossal personified blizzard filling a stormy winter sky: swirling snow clouds form the giant face of an old general with glowing icy-blue eyes, bushy frost eyebrows, rosy frozen cheeks, a long beard made of icicles and snow, wearing a gigantic grey Russian fur ushanka hat; he grins mischievously and puffs his cheeks to blow freezing wind; semi-transparent, made of snowflakes and mist, dramatic cold blue light, empty snowy birch forest far below.
STYLE: premium stylized 3D animated feature-film still, family comedy, soft global illumination, rich colors, kid-friendly, no text, no logos, no watermark.
```

---

## 6. Statisten (kein Element nötig, nur im Szenen-Prompt beschreiben)

| Statist | Prompt-Baustein (EN) | Szene |
|---|---|---|
| Blaubeer-Kadetten | `small round blueberry cadets in navy cadet jackets and small black caps, white gloves` | 03 |
| Papst Pius VII. | `a small Pope character — a peeled lychee with pearly-white translucent flesh, gentle face, white papal robes and white skullcap` | 05 |
| Verbündete der Grande Armée | `red currant, raspberry and gooseberry soldiers in white, green and light-blue allied uniforms` | 08 |
| Schwedischer Soldat | `a small red lingonberry soldier in a blue coat with yellow collar and a black shako` | 11 |
| Britische Rotröcke | `small lemon soldiers in red coats with white crossbelts and black shakos` | 13A |
| Preußische Soldaten | `small plum soldiers in dark-blue coats with red collars and black shakos` | 13B |

---

## 7. Lineup (Größenvergleich, Teaser-Bild, Konsistenz-Check)

Nano Banana Pro · 16:9 · 2K · alle Hero-Bilder als Referenz anhängen (oder `@`-Elements nutzen):

```text
Group lineup of the main cast standing side by side on a light-grey studio floor in front of a height-measuring wall with plain tick marks, all facing the camera, from left to right: @Franz (apricot emperor), @Napoleon (strawberry general), @Blaubeere (blueberry grenadier, same body height as Napoleon but taller bearskin hat), @Bluecher (plum field marshal), @Wellington (tall lemon general), @Zar (watermelon emperor, twice Napoleon's height). Each character exactly as in its reference image, correct relative sizes, soft even studio lighting, stylized 3D feature-film render, no text, no labels, no watermark.
```

---

## 8. Konsistenz-Workflow (so bleiben die Figuren identisch)

1. **Character Sheet** pro Figur erzeugen (2 Varianten, die bessere behalten). Prüfen: Farben, Hutform, Kokarde, Knöpfe, Handschuhe, Stiefel.
2. **Hero-Bild** aus dem Sheet erzeugen (Sheet als Referenz). Das ist die einzige „Wahrheit“ der Figur.
3. In Higgsfield unter **Elements** ein neues Element anlegen: Kategorie *Character*, Hero-Bild hochladen, Namen aus dieser Datei verwenden (`Napoleon`, `NapoleonKind`, `Blaubeere`, `Wellington`, `Zar`, `Franz`, `Bluecher`, `GeneralWinter`).
4. In jedem Keyframe-Prompt die Figur per `@Name` einsetzen **und** die Kurzbeschreibung in Klammern dahinter stehen lassen. Die Beschreibung stützt das Element, falls es schwach greift.
5. Video nur noch **Bild-zu-Video** aus geprüften Keyframes erzeugen, nie reine Text-zu-Video-Clips. Die Figur kommt dann pixelgenau aus dem Startbild.
6. Vor jedem Video-Durchlauf den Keyframe gegen das Hero-Bild halten. Abweichungen im Standbild korrigieren (2 Credits), nicht im Video (8–15 Credits).

**QA-Checkliste pro Keyframe:** Hut richtig herum (Napoleon quer, Wellington längs)? Kokarde blau-weiß-rot? Weiße Handschuhe, schwarze Stiefel? Fruchtstruktur sichtbar? Größenverhältnis laut Tabelle? Kein Text im Bild?
