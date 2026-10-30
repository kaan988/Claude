# Higgsfield-Produktion: Modelle, Einstellungen, Kosten, Schnitt

Die Credit-Preise unten stammen aus einer Kostenabfrage über die Higgsfield-API vom **30.10.2026**. Sie können sich ändern und vom Tarif abhängen. Vor dem Generieren zeigt Higgsfield den aktuellen Preis an.

---

## 1. Modellwahl

| Aufgabe | Modell in Higgsfield | Einstellungen | Kosten | Warum |
|---|---|---|---|---|
| Character Sheets | **Nano Banana Pro** | 16:9 · 2K · 2 Varianten | 2 Credits/Bild | sehr gute Konsistenz mit mehreren Referenzbildern, kann Text, wenn gewollt |
| Hero-Bilder → Elements | **Nano Banana Pro** | 3:4 · 2K · Sheet als Referenz | 2 Credits/Bild | sauberes Einzelbild als Identitätsquelle |
| Startbilder/Endbilder | **Nano Banana Pro** + `@Elements` | **9:16 · 2K** · 2 Varianten | 2 Credits/Bild | Figuren kommen aus den Elements; Fehler korrigiert man hier billig |
| **Animation (Standard)** | **Kling 3.0** | Mode **Pro** · 9:16 · Dauer laut Szene · **Sound Off** · Startbild (+ Endbild) | **1,75 Credits/s** (Std: 1,5/s) | günstigstes Modell mit sehr guter Cartoon-Bewegung; Start- **und** Endbild erzwingen Reveals und Reißschwenks |
| Animation (Fallback bei Identitätsverlust) | **Seedance 2.0** | Mode **Fast** · 720p · 9:16 · Audio aus · Startbild + `@Elements` | 2,5 Credits/s | stärkste Referenz-Treue bei mehreren Figuren (S06, S11) |
| Nur falls nötig: Premium-Shot | Seedance 2.0 Std 1080p | wie oben | 12 Credits/s | lohnt sich für diese Folge nicht |
| Erzähler + Figurenstimmen | **Eleven v4** (Higgsfield Audio) | Dialog-Modus, bis zu 10 Stimmen pro Durchgang | ca. 1 Credit pro 200–250 Zeichen | gutes Deutsch, eine Stimme pro Figur festlegbar |
| Freistellen (Sticker für die Karte) | **Remove Background** | – | gering | Napoleon-Sticker, Hut, Fähnchen |

**Bewusst nicht verwendet:** Veo 3.1 und Cinema Studio Video 3.0 (teuer und auf Realismus ausgelegt, kein Vorteil für Cartoon-Früchte), native Audio-Generierung in Kling/Seedance (deutsche Dialoge sind unzuverlässig und kosten extra Credits; Ton kommt sauber aus Eleven v4 und dem Schnitt).

---

## 2. Produktionsreihenfolge (Schritt für Schritt)

### Schritt 1 · Figuren (ca. 64 Credits)
1. In Higgsfield **Image → Nano Banana Pro** öffnen.
2. Für jede der 8 Figuren den Character-Sheet-Prompt aus `02-charakter-bibel.md` einfügen · 16:9 · 2K · 2 Varianten. Die bessere behalten.
3. Mit dem Sheet als Referenzbild den Hero-Prompt ausführen · 3:4 · 2K.
4. **Elements → Neues Element → Character** → Hero-Bild hochladen → Name exakt: `Napoleon`, `NapoleonKind`, `Blaubeere`, `Wellington`, `Zar`, `Franz`, `Bluecher`, `GeneralWinter`.
5. **Lineup-Prompt** (Bibel, Abschnitt 7) ausführen. Stimmen Größen und Farben? Erst dann weitermachen.

### Schritt 2 · Startbilder (ca. 90 Credits)
1. Für jede Szene den Keyframe-Prompt aus `03-szenen-und-prompts.md` in **Nano Banana Pro** einfügen. Beim Tippen von `@` die passenden Elements auswählen · **9:16 · 2K · 2 Varianten**.
2. Bei Szenen mit Endbild (08, 10, 13B) das fertige Startbild als zusätzliche Referenz an den Endbild-Prompt hängen, damit Ort und Licht gleich bleiben.
3. Jedes Bild mit der QA-Checkliste aus der Bibel prüfen (Hutrichtung, Kokarde, Handschuhe, Größen, kein Text).
4. Kleine Fehler mit einem Folge-Prompt im selben Bild korrigieren lassen, z. B. `same image, but the bicorne is worn sideways and the cockade is blue-white-red`. Das ist günstiger als komplett neu zu würfeln.

### Schritt 3 · Animatik (0 Credits, spart am meisten Geld)
1. Sprachaufnahme erzeugen (Schritt 5 vorziehen).
2. In CapCut alle **Startbilder als Standbilder** auf die Sprachaufnahme legen, mit den Längen aus der Szenenübersicht.
3. Einmal komplett ansehen: Stimmt das Timing? Ist jeder Gag verständlich? Reicht die Szenendauer für den Sprechertext? **Erst jetzt** Videos generieren.

### Schritt 4 · Videos (ca. 240 Credits)
1. **Video → Kling 3.0** · Mode **Pro** · Aspect **9:16** · Sound **Off** · Dauer laut Tabelle unten.
2. Startbild hochladen (bei 08, 10, 13B auch das Endbild), Video-Prompt einfügen. Die `@`-Namen im Video-Prompt nutzt Kling 3.0 nur zusammen mit einem Startbild, und das ist hier immer dabei.
3. **Ein Clip, eine Prüfung:** Ist ein Clip zu 80 % gut, nimm ihn und kaschiere den Rest im Schnitt (Trimmen, Zoom, Freeze). Nicht für Perfektion neu würfeln.
4. Ist ein Clip schlecht, nicht einfach neu würfeln, sondern die Ursache beheben: weniger Aktionen in den Prompt, Endbild ergänzen, auf Seedance 2.0 Fast wechseln.

| Clip | Dauer generieren | Start-/Endbild | Credits (1×, Pro) |
|---|---|---|---|
| S01 | 5 s | S | 8,75 |
| S02 | 5 s | S | 8,75 |
| S03 | 6 s | S | 10,5 |
| S04 | 5 s | S | 8,75 |
| S05 | 6 s | S | 10,5 |
| S06 | 6 s | S | 10,5 |
| S08 | 6 s | S + E | 10,5 |
| S09 | 5 s | S | 8,75 |
| S10 | 7 s | S + E | 12,25 |
| S11 | 6 s | S | 10,5 |
| S12 | 5 s | S | 8,75 |
| S13A | 5 s | S | 8,75 |
| S13B | 5 s | S + E | 8,75 |
| S14B | 4 s | S | 7,0 |
| S15 | 7 s | S | 12,25 |
| **Summe** | **83 s** | | **≈ 145 Credits pro Durchgang** |

Erfahrungswert: Mit geprüften Startbildern braucht man im Schnitt **1,5–1,7 Versuche** pro Clip → **ca. 220–250 Credits**.

### Schritt 5 · Stimmen (ca. 15 Credits)
1. **Audio → Eleven v4**. In der Stimmenliste 3 männliche Kandidaten für den Erzähler anhören und mit dem Hook-Satz testen. Wichtig: saubere deutsche Aussprache, Energie, kein Akzent.
2. Erzähler: **eine Datei pro Szene** aus dem TTS-Block in `01-drehbuch.md` (Zahlen sind dort ausgeschrieben). Stabilität eher niedrig (ca. 0,35–0,45) für mehr Ausdruck, Ähnlichkeit ca. 0,75.
3. Figuren: im **Dialog-Modus** alle Figurenzeilen in einem Durchgang erzeugen, pro Figur eine feste Stimme. Die Stimmenzuordnung notieren und in jeder Folge gleich lassen, denn die Stimme ist Teil der Figur.
4. Napoleon im Schnitt um +2 bis +3 Halbtöne anheben. Blücher etwas Rauheit (Overdrive leicht), Wellington leicht Hall.

### Schritt 6 · Karte (0 Credits außer Freistellen)
Komplett nach `04-kartenanimation.md`.

### Schritt 7 · Schnitt in CapCut Desktop (kostenlos)
Siehe Abschnitt 4.

---

## 3. Budget

| Posten | Menge | Credits |
|---|---|---|
| Character Sheets | 8 Figuren × 2 | 32 |
| Hero-Bilder | 8 × 2 | 32 |
| Lineup, Logo, Cover, Pergament, Fähnchen | 5 × 2 | 10 |
| Start-/Endbilder | 18 Bilder × ~2,5 Versuche | 90 |
| Videos Kling 3.0 Pro | 83 s × ~1,6 Durchgänge | 235 |
| Stimmen Eleven v4 | Erzähler + Figuren, 3 Takes | 15 |
| Freistellen, Reserve | | 20 |
| **Gesamt** | | **≈ 430 Credits** |

**Ab Folge 2 wird es billiger:** Die Elements von Napoleon, Blaubeere, Zar, Franz, Blücher und Wellington existieren schon. Folge 2 kostet dann eher **330–360 Credits**.

**Noch günstiger (≈ 390 Credits):** alle Videos zuerst mit Kling 3.0 **Std** (1,5 Credits/s) testen und nur die Szenen mit sichtbaren Qualitätsproblemen in Pro neu generieren.

---

## 4. Schnitt in CapCut (Projekt 1080 × 1920, 30 fps)

**Spurenaufbau von unten nach oben:**
1. Video-Clips + Karten-Animationen
2. Erzähler (Hauptspur, an ihr wird alles ausgerichtet)
3. Figurenstimmen
4. Soundeffekte
5. Musik
6. Untertitel
7. Text-Badges (Jahreszahlen, Fakten)
8. Titel-Sting, Endkarte

**Arbeitsweise:**
1. **Erst den Ton legen**, dann die Bilder darauf schneiden. Clips trimmen, damit jede Aktion genau auf dem Satz liegt.
2. **Alle 1–2 Sekunden Bewegung:** auf jede Pointe einen Punch-in (Skalierung 100 % → 112 % in 4 Frames) setzen, auf jeden Vine-Boom einen kurzen Kamera-Wackler.
3. **Freeze-Frame in S01** bei 0:03,4: Standbild 1,2 s, Sättigung −100, leichter Zoom 100 → 105 %.
4. **Übergänge** wie in `03-szenen-und-prompts.md` angegeben. Die meisten entstehen schon im Clip (Welle, Schneeball, Hut). Im Schnitt nur ein harter Schnitt + Whoosh.
5. **Untertitel:** `untertitel-de.srt` importieren (oder Auto-Untertitel Deutsch und mit der SRT abgleichen). Stil: fette runde Schrift, 70–80 px, weiß mit 8 px schwarzer Kontur, wortweise Hervorhebung in Gelb `#FFD23F`. Figurenzeilen in der Fruchtfarbe (Napoleon Rot, Wellington Gelb, Blücher Violett, Franz Orange).
6. **Sicherheitszonen:** Untertitel bei **y ≈ 1150–1400 px**, nichts Wichtiges im unteren Fünftel (YouTube-Bedienelemente) und nicht im rechten Rand (≈ 120 px, Like-Buttons). Jahres-Badges oben mittig, ab y ≈ 220 px.
7. **Jahres-Badge** als eigene Vorlage bauen (dunkelblaues abgerundetes Rechteck, weiße Schrift, kleines Emoji davor, Pop-in-Animation) und für jede Szene wiederverwenden.
8. **Musik:** −18 dB unter Sprache (Ducking), in S09 komplett aus (Stille ist dort der Witz), bei „PFLAUMEN?!“ abrupt stoppen.
9. **Lautheit:** Endmischung auf ca. −14 LUFS, Sprache klar über allem.
10. **Loop:** Letzter Frame → 0,2 s Schwarz. Der Short startet direkt wieder mit „MEINS!“, das erhöht die Wiederholungsrate.
11. **Export:** 1080 × 1920, 30 fps, hohe Bitrate (CapCut: „Höher“), H.264, MP4.

**Musik & Sounds legal:** Nur Musik aus der CapCut-Kommerziell-Bibliothek, der YouTube Audio Library oder lizenzfreie Quellen verwenden. Die „Ouvertüre 1812“ (Tschaikowski) und die Marseillaise sind als Kompositionen gemeinfrei, **Aufnahmen aber oft nicht**, deshalb eine gemeinfreie oder lizenzfreie Einspielung nutzen. **Nicht** „Waterloo“ von ABBA verwenden, auch wenn es sich anbietet: Das löst eine Urheberrechtsmeldung aus.

---

## 5. Upload-Paket

**Titel (eine Variante wählen):**
- `Diese Erdbeere eroberte halb Europa 🍓⚔️`
- `Napoleon als Erdbeere – in 90 Sekunden erklärt 🍓`
- `Wie Napoleon ALLES verlor (als Früchte) 🍓🍉`

**Beschreibung:**
```text
Napoleon Bonaparte als Erdbeere: Wie Frankreich halb Europa eroberte – und alles wieder verlor. 🍓⚔️🍉
Folge 1 von „Fruchtkriege der Geschichte“.

Was stimmt? Alle Jahreszahlen und Ereignisse sind echt. Die Früchte, die Sahnekanonen und die Sprüche sind natürlich ausgedacht 😉

1769 Geburt auf Korsika · 1804 Kaiser · 1805 Austerlitz · 1812 Russlandfeldzug · 1813 Völkerschlacht bei Leipzig · 1814 Elba · 1815 Waterloo · 1821 Tod auf St. Helena

Quellen: u. a. Deutsches Historisches Museum (LeMO), Fondation Napoléon, Encyclopaedia Britannica.

#Geschichte #Napoleon #FruchtkriegeDerGeschichte #LernenMitSpaß #Shorts
```

**Angepinnter Kommentar:** `Welche Frucht soll in Folge 2 kämpfen? 🍌 Cäsar? 🥥 die Wikinger? 🍍 Kolumbus? Schreib's hier rein! 👇`

**Wichtig – „Speziell für Kinder“:** Wenn der Kanal oder das Video **gezielt Kinder unter 13** anspricht, muss es auf YouTube als „Speziell für Kinder“ markiert werden (gesetzliche Pflicht). Dann sind **Kommentare deaktiviert**, und der Kommentar-Aufruf am Ende läuft ins Leere. Ersetze in diesem Fall die Endkarte durch `Folge 2 kommt bald – abonnieren! 🍓`. Positionierst du den Kanal für Jugendliche und Familien, gilt das nicht. Die Entscheidung musst du ehrlich nach den YouTube-Kriterien treffen.

**KI-Kennzeichnung:** Eindeutig unrealistische Cartoon-Animation muss auf YouTube nicht als „veränderte oder synthetische Inhalte“ gekennzeichnet werden. TikTok verlangt das KI-Label bei KI-generierten Inhalten. Dort den Schalter „KI-generierte Inhalte“ setzen.

---

## 6. Abnahme-Checkliste vor dem Upload

- [ ] Erste 0,5 s: Bewegung + Schrei, kein ruhiges Bild
- [ ] Alle Figuren in allen Szenen gleich (Hutrichtung, Farben, Handschuhe, Größen)
- [ ] Jede Jahreszahl im Bild = Jahreszahl im Ton = Faktencheck
- [ ] Karte: Hamburg und Rom 1812 dunkelblau, Großbritannien nie blau
- [ ] Kein Blut, kein roter Saft, niemand liegt reglos am Boden
- [ ] Untertitel fehlerfrei und in der Sicherheitszone
- [ ] Länge ≤ 90 s, Loop-Übergang sauber
- [ ] Musik und Sounds lizenziert
- [ ] Einstellung „Speziell für Kinder“ bewusst gewählt, Endkarte passend dazu
