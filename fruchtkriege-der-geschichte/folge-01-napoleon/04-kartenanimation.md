# Kartenanimation – Folge 1: Napoleon

## Warum die Karte nicht mit KI generiert wird

KI-Bild- und Videomodelle zeichnen Küsten, Grenzen und Ländernamen frei nach Gefühl. Bei einer Lernserie fällt jede falsche Grenze sofort auf, in den Kommentaren und bei Lehrkräften. Deshalb:

- **Basiskarte und Grenzen:** echte Geodaten, als Ebenen selbst gezeichnet
- **Animation:** im Schnittprogramm (CapCut Desktop kostenlos, alternativ After Effects oder DaVinci Resolve)
- **KI nur für Deko:** Pergament-Textur, Napoleon-Sticker, Fähnchen (Prompts in `03-szenen-und-prompts.md` → Zusatz-Assets)
- **Niemals** die fertige Karte durch Kling oder Seedance schicken, sonst „schmelzen“ die Grenzen.

---

## 1. Basiskarte bauen (einmalig, für alle Folgen wiederverwendbar)

1. **Natural Earth** (gemeinfrei, keine Lizenzpflicht) → „Physical Vectors“ → `ne_50m_land` und `ne_50m_lakes` herunterladen (ZIP).
2. **mapshaper.org** öffnen (kostenlos im Browser), beide ZIPs hineinziehen, dann in der Konsole:

```text
-clip bbox=-12,33,46,63
-proj +proj=laea +lat_0=50 +lon_0=15
-o format=svg
```

   Das ergibt Europa von Portugal bis Moskau in einer flächentreuen Projektion, die „wie im Schulatlas“ aussieht.
3. SVG in **Figma**, **Inkscape** (beide kostenlos) oder Affinity öffnen. Arbeitsfläche **1080 × 1920 px**, Karte auf volle Breite skalieren und so platzieren, dass sie etwa im Bereich **y = 400–1250 px** liegt (der obere Rand bleibt frei für den Jahreszähler, der untere für Untertitel und Legende).
4. Land in Pergament-Beige `#E9DFC7`, Meer in `#9FC3D9`, dazu die Pergament-Textur aus Higgsfield mit Ebenenmodus *Multiplizieren* drüberlegen.
5. Für den Zoom-out zu St. Helena eine **zweite Karte** mit dem Ausschnitt `-clip bbox=-30,-25,50,63` exportieren (Europa + Afrika + Südatlantik). Wenn die Projektion zickt: `-proj` weglassen. Für einen Zoom von einer Sekunde reicht eine Plattkarte.

**Grenzen zeichnen:** Eine historische Referenzkarte mit 50 % Deckkraft unter die Basiskarte legen und die Gebiete mit dem Zeichenstift nachziehen. Gute Referenzen: Putzger Historischer Weltatlas, dtv-Atlas Weltgeschichte, die Europa-Karten 1812/1815 auf Wikimedia Commons. Wer eine Wikimedia-Karte direkt übernimmt oder exakt abpaust, muss deren Lizenz beachten (meist CC BY-SA → Urheber in der Videobeschreibung nennen).

---

## 2. Farb- und Legendensystem (für die ganze Serie gleich)

| Ebene | Füllung | Kontur | Legendentext |
|---|---|---|---|
| Frankreich / Französisches Kaiserreich (direkt regiert) | Dunkelblau `#1F3A93` | Weiß 2 px | „Französisches Kaiserreich“ |
| Abhängige Staaten (von Napoleon oder seiner Familie kontrolliert) | Hellblau `#7FA7E8` | Dunkelblau 2 px | „Von Napoleon abhängig“ |
| Verbündete (meist gezwungen) | Weiß mit blauen Diagonalstreifen `#B9CCF2` | Dunkelblau gestrichelt | „Verbündete (gezwungen)“ |
| Umkämpft (Spanien, Katalonien) | jeweilige Farbe + rote Kreuzschraffur 30 % | – | „umkämpft“ |
| Andere Staaten | Beige-Grau `#D9D4C7` | Grau 1 px | – |
| Gegner-Hervorhebung (Großbritannien) | Beige-Grau | **Rot `#C0392B` 4 px, pulsierend** | „Nie erobert“ |

Schrift für Labels und Legende: dieselbe fette, abgerundete Schrift wie in den Untertiteln (z. B. *Montserrat ExtraBold* oder *Baloo 2*), weiß mit 6 px schwarzer Kontur.

---

## 3. Historische Kartenzustände – was in welche Ebene gehört

Die Spalte „Malhilfe“ beschreibt die Gebiete mit **heutigen** Ländern und Regionen, damit man sie auf der modernen Basiskarte sicher findet.

### ZUSTAND A · 1802 (Napoleon ist Erster Konsul)

| Ebene | Historisch | Malhilfe (heute) |
|---|---|---|
| **Frankreich** | Frankreich mit Avignon, Savoyen, Nizza, Genf, Mülhausen; Belgien und Lüttich (seit 1795); gesamtes linkes Rheinufer (seit 1797/1801); Piemont (1802); Elba (1802); Korsika | ganz Frankreich · Belgien · Luxemburg · Deutschland **links des Rheins** (Pfalz, Saarland, Mainz, Trier, Koblenz, Köln, Aachen) · Kanton Genf · Piemont und Aostatal · Elba |
| **Abhängig** | Batavische Republik · Helvetische Republik · Italienische Republik (Napoleon ist Präsident) · Ligurische Republik · Königreich Etrurien | Niederlande · Schweiz (ohne Genf) · Lombardei, Emilia-Romagna, westliches Venetien bis zur Etsch · Ligurien · Toskana |
| **Verbündet** | Spanien | Spanien |

### ZUSTAND B · 1807 (nach dem Frieden von Tilsit) – nur kurz einblenden

| Ebene | Historisch | Malhilfe (heute) |
|---|---|---|
| **Kaiserreich** | wie 1802 + Ligurien (1805) | wie A + Ligurien |
| **Abhängig** | Königreich Holland · Königreich Italien (mit Venetien, Istrien, Dalmatien) · Königreich Neapel (Joseph Bonaparte) · Rheinbund mit dem neuen Königreich Westfalen · Herzogtum Warschau · Schweiz · Etrurien | Niederlande · Norditalien komplett + Küste Sloweniens/Kroatiens · Süditalien **ohne Sizilien** · Deutschland zwischen Rhein und Elbe/Oder ohne Preußen und Österreich · Zentralpolen · Schweiz · Toskana |
| **Verbündet** | **Russland** (seit Tilsit!) · Dänemark-Norwegen · Spanien | Russland · Dänemark, Norwegen, Schleswig-Holstein · Spanien |
| Hinweis | Preußen ist auf etwa die Hälfte geschrumpft | Preußen nur noch östlich der Elbe, ohne Zentralpolen |

### ZUSTAND C · 1812 (Höhepunkt) – Hauptbild von Szene 07

| Ebene | Historisch | Malhilfe (heute) |
|---|---|---|
| **Kaiserreich** (rund 130 Départements) | alles aus A · Niederlande (1810) · Nordwestdeutschland mit Ostfriesland, Oldenburg, Bremen, Hamburg, Lübeck, Osnabrück, Münster (1810/11) · Wallis (1810) · Ligurien · Parma-Piacenza · Toskana (1808) · westlicher Kirchenstaat **mit Rom** (1809) · Illyrische Provinzen (1809) · Katalonien (1812, umkämpft) | Frankreich, Belgien, Luxemburg, **Niederlande** · Deutschland links des Rheins **plus Nordseeküste bis zur Elbe und Lübeck**, südlich bis Münster/Osnabrück · Kantone Genf und Wallis · Piemont, Aostatal, Ligurien, westliche Emilia (Parma, Piacenza), Toskana, Umbrien, Latium mit Rom · Slowenien, Istrien, kroatische Küste mit Dalmatien und Dubrovnik, Kroatien südlich der Save, Osttirol/Villach · Katalonien (schraffiert) |
| **Abhängig** | Königreich Italien · Königreich Neapel (Murat) · Königreich Spanien (Joseph, umkämpft) · Rheinbund (u. a. Bayern, Württemberg, Baden, Sachsen, Westfalen, Berg, Hessen, Mecklenburg) · Herzogtum Warschau · Schweiz · Freie Stadt Danzig | Lombardei, Venetien, Friaul, östliche Emilia-Romagna, Marken, Südtirol/Trentino · Süditalien ohne Sizilien · Spanien ohne Katalonien (schraffiert) · **restliches Deutschland** ohne die französischen Teile, ohne Preußen und ohne Schleswig-Holstein; Bayern umfasst damals auch Nordtirol und Salzburg · Zentralpolen · Schweiz ohne Genf/Wallis · Danzig |
| **Verbündet (gezwungen)** | Kaisertum Österreich · Königreich Preußen · Dänemark-Norwegen | Österreich (ohne Tirol, Salzburg, Illyrien), Tschechien, Ungarn, Slowakei, Südpolen/Galizien, Westukraine, Siebenbürgen · Brandenburg, Pommern, Schlesien, Ost- und Westpreußen · Dänemark, Norwegen, Schleswig-Holstein |
| **Andere** | Großbritannien und Irland (**rot pulsierend**) · Portugal · Sizilien · Sardinien (Insel) · Russland (mit Finnland und Baltikum) · Schweden · Osmanisches Reich | |

**Kontrollpunkte für die Sprechertext-Aussage „von Hamburg bis Rom“:** Hamburg und Rom müssen beide **dunkelblau** sein. Das stimmt für 1811/1812.

### ZUSTAND D · 1815 (nach dem Wiener Kongress und dem Zweiten Pariser Frieden) – Szene 14A

| Ebene | Historisch | Malhilfe (heute) |
|---|---|---|
| **Frankreich** | etwa die Grenzen von 1790 (Avignon, Mülhausen und Montbéliard bleiben französisch; Savoyen und Nizza gehen an Sardinien; Saarlouis und Landau gehen verloren) | heutiges Frankreich **ohne** Savoyen und **ohne** die Grafschaft Nizza |
| **Alles andere** | Beige-Grau. Optionale kleine Labels: „Niederlande (mit Belgien)“, „Deutscher Bund“, „Preußen (jetzt mit Rheinland)“, „Österreich“, „Russland (mit Kongresspolen)“ | |

---

## 4. Ebenen-Dateien (PNG, transparent, 1080 × 1920)

```text
karte_base.png            Land + Meer + Pergament
k1802_frankreich.png      k1802_abhaengig.png      k1802_verbuendet.png
k1807_kaiserreich.png     k1807_abhaengig.png      k1807_verbuendet.png
k1812_kaiserreich.png     k1812_abhaengig.png      k1812_verbuendet.png   k1812_umkaempft.png
k1812_gb_rotkontur.png
k1815_frankreich.png
welt_base.png             (Zoom-out-Karte mit Südatlantik)
sticker_napoleon.png      (Hero-Bild, in Higgsfield mit „Remove Background“ freigestellt)
sticker_faehnchen.png     (Mini-Trikolore auf Zahnstocher, freigestellt)
sticker_hut.png           (Zweispitz, aus Szene 13B-Endbild freigestellt)
```

---

## 5. Szene 07 – Animation „Höhepunkt“ (7,0 s, Timing auf den Sprechertext)

| Zeit in der Szene | Bild | Ton |
|---|---|---|
| 0,0–0,3 | Schnitt aus dem Himmel (Ende S06): Karte fällt von oben ins Bild, leichter Bounce (Skalierung 115 % → 100 %) | Whoosh |
| 0,0–1,4 | **Wachstum im Zeitraffer:** Zähler oben `1802 → 1805 → 1807 → 1810 → 1812`. Pro Zustand wächst die Kaiserreich-Ebene über eine **Kreismaske ab Paris** (Radius 0 → voll in 0,3 s, weiche Kante 30 %). Fähnchen ploppen auf: Wien 1805, Berlin 1806, Madrid 1808, Wien 1809. Der Napoleon-Sticker auf Paris wächst von 100 % auf 140 % | ERZ beginnt: „1812 …“ · Ticken + „Plopp“ je Fähnchen |
| 1,4–2,8 | Zustand C steht. Labels `Hamburg` (bei „Hamburg“) und `Rom` (bei „Rom“) ploppen mit Pfeil auf | „… reicht Frankreich von Hamburg bis Rom“ |
| 2,8–4,0 | Hellblaue Ebene blinkt zweimal hell auf, Legende „Von Napoleon abhängig“ fährt ein | „– dazu abhängige Staaten …“ |
| 4,0–5,0 | Streifen-Ebene blinkt, Legende „Verbündete (gezwungen)“ fährt ein | „… und Verbündete.“ |
| 5,0–6,5 | Großbritannien: rote Kontur pulsiert dreimal, Label `Nie erobert!` · Sticker schüttelt die Faust (kleines Wackeln) | „Nur England kriegt er nie!“ + Buzzer |
| 6,5–7,0 | Kamerafahrt auf der Karte nach Osten (Position + Zoom 100 % → 180 % auf die Memel) | Whoosh, Übergang zu S08 |

---

## 6. Szene 14A – Animation „Zerfall“ (3,0 s)

| Zeit | Bild | Ton |
|---|---|---|
| 0,0–0,4 | Napoleons Hut (Sticker) fällt von oben auf Waterloo (Belgien) | „Plopp“ |
| 0,4–1,8 | Zähler `1812 → 1813 → 1814 → 1815`. Zuerst verschwinden die Streifen (Verbündete), dann die hellblauen Gebiete, dann **zieht sich das Dunkelblau mit schrumpfender Kreismaske nach Paris zurück** auf Zustand D. Alle Fähnchen kippen nacheinander um. Der Sticker schrumpft von 140 % auf 60 % und bekommt einen Schweißtropfen | „Sein Reich zerfällt.“ · Luft-raus-Geräusch, Domino-Klackern |
| 1,8–2,1 | Text `1815: Frankreich etwa in den Grenzen von 1790` | |
| 2,1–3,0 | Überblendung auf `welt_base.png`, schneller Zoom-out und Schwenk nach Süden in den Atlantik; ein roter Pin landet auf **St. Helena (15,9° S, 5,7° W)**, Label `St. Helena` + gestrichelte Linie zur afrikanischen Küste `fast 2.000 km` | „Napoleon wird nach St. Helena verbannt …“ · Whoosh + Pin-„Ding“ → Match-Cut auf Clip 14B |

---

## 7. Optional: Mini-Karte in Szene 12 (Elba)

Kleines Einblendfenster oben rechts (ca. 300 × 300 px): Ausschnitt Korsika–Toskana, Elba mit Pin und Label `Elba`, Korsika mit Label `Korsika (Napoleons Heimat)`. Zeigt Kindern, dass ihn die Verbannung fast zurück an den Anfang gebracht hat.

---

## 8. Optional: 3D-Tischkarten-Look

Wer die Karte plastisch will: die **fertige flache** 1812-Karte als Referenz in Nano Banana Pro geben:

```text
Turn this exact map into a 3D tabletop diorama map made of aged parchment and painted clay, seen from a slightly tilted top-down angle, keep every coastline, border and color area exactly as in the reference, soft studio light, no text, no labels.
```

Danach **Pflicht-Check:** das Ergebnis mit 50 % Deckkraft über die flache Karte legen. Sobald eine Grenze abweicht, die flache Version nehmen. Die Labels kommen in jedem Fall erst im Schnitt dazu.
