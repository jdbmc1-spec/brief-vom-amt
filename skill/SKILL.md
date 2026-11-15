---
name: brief-vom-amt
description: Erstellt deutschsprachige TikTok-Erklärvideos der Serie „Der Brief vom Amt“ (ein Brief pro Video, Amtsdeutsch übersetzt, 30–45 s) – Drehbuch, Cartoon-Brief, optional ElevenLabs-Stimme und fertiges 9:16-MP4 per HyperFrames. Verwenden, wenn der Nutzer einen neuen Brief/eine neue Folge, ein Skript oder ein Re-Render dieser Serie will.
---

# Der Brief vom Amt (TikTok, Deutsch, HyperFrames)

Abgeleitet aus dem Skill `glowup-serie`. Serienregeln, Format und Quellenpflicht stehen in `CLAUDE.md` im Repo-Wurzelordner; die Brief-Bausteine in `references/folge-format.md` (Abschnitt „Brief-Bausteine“). Die folgenden Abschnitte zur Technik (Stimme, Build, Render) gelten unverändert; Glow-Up-spezifisches (Tage, Abstimmung A/B, Glow-Up-Balken, Kai) wird hier nicht genutzt – stattdessen Kopfzeile `hud`, kein Balken, Schluss mit Kommentar-Aufruf.

## Ursprüngliche Technik-Anleitung (glowup-serie)

### Glow-Up-Serie (Vorlage)

Kanal: **Kais GlowUp** (TikTok: https://www.tiktok.com/@kaisglowup). Profilbild: Vorher/Nachher-Motiv mit Banner „KAIS GLOW-UP“ (`%USERPROFILE%\GlowUp\_kanal\PROFILBILD-FINAL.png`, Generator `profilbild-kai.mjs` im selben Ordner). In TikTok-Beschreibungen den Kanalnamen und `#kaisglowup` verwenden.

Alle Videos sind **immer auf Deutsch** (Sprecher, Untertitel, Bildtexte, Abstimmung). Alles wird per Code gebaut:
`folge.json` → `scripts/stimme.mjs` (ElevenLabs) → `scripts/build.mjs` (HyperFrames-Projekt) → `hyperframes render` (MP4).

Skill-Ordner: `~/.claude/skills/glowup-serie/` (im Folgenden `$SKILL`).

## Vor dem Start lesen
- `references/stil-guide.md` – wie die Referenzvideos aussehen und aufgebaut sind (Pflicht beim ersten Mal pro Sitzung).
- `references/drehbuch.md` – wie man die deutschen Texte schreibt (Hook, Twist, Abstimmung, Tonfall).
- `references/folge-format.md` – vollständige Referenz für `folge.json`: Hintergründe, Figur, Ausdrücke, alle Element-Typen.
- `references/folge-6-7-anderer-pc.md` – was in Folge 6 und 7 passiert ist (zweiter PC), Stand danach und welche Bausteine dort neu waren.
- `references/sound-design.md` – welche Sounds/Musik die Referenzen nutzen und wie sie automatisch vergeben werden.
- `vorlagen/beispiel-folge-1-stark.json` – **Maßstab für neue Folgen**: 63 s, 15 Szenen, Hook mit Sperrbildschirm, Detailaufnahmen, Blamage, emotionaler Tiefpunkt, Abstimmung.
- `vorlagen/beispiel-folge.json` – kurzes Minimal-Beispiel.

## Ablage
Serien liegen unter einem **kurzen Pfad** (Windows-Pfadlänge!): `%USERPROFILE%\GlowUp\<serie>\`
```
GlowUp\kai\serie.json          ← Figur, Name, Partnerin, Stimme (gilt für alle Folgen)
GlowUp\kai\folge-01\folge.json ← Szenen dieser Folge
GlowUp\kai\folge-01\voice.mp3 + alignment.json   (von stimme.mjs)
GlowUp\kai\folge-01\musik.mp3  (optional, Hintergrundmusik, wird leise gemischt)
GlowUp\kai\folge-01\sfx\*.mp3  (optional, Soundeffekte für "ton")
GlowUp\kai\folge-01\projekt\   (generiertes HyperFrames-Projekt – nie von Hand bearbeiten, immer neu bauen)
GlowUp\kai\renders\folge-01.mp4
```
`serie.json` enthält die Felder, die über alle Folgen gleich bleiben (`name`, `partnerin`, `figur`, `stimme`). `folge.json` überschreibt/ergänzt sie (`folge`, `tage`, `glowup`, `szenen`). Bei Fortsetzungen: Tage-Zähler und Glow-Up-% aus der letzten Folge übernehmen und fortschreiben, Abstimmungsergebnis der letzten Folge im Rückblick zeigen (`umfrage`). Die Prozente der Abstimmung liefert der Nutzer (echte Kommentare) – nicht erfinden, sondern fragen.

## Erzählerstimme auswählen (einmal pro Serie)
Referenz-Erzähler der Vorbild-Videos (gemessen): männlich, Tonhöhe ~126 Hz (mittlere Männerstimme), sehr melodisch (~14 Halbtöne Spannweite), schnell (~6 Silben/s, deutlich über normalem Sprechtempo), kurze Sätze mit vielen kleinen Pausen – energischer Storytelling-/Social-Media-Ton.
```powershell
node "$env:USERPROFILE\.claude\skills\glowup-serie\scripts\stimmen-suche.mjs" --anzahl 8
```
Sucht deutsche männliche Stimmen in der ElevenLabs-Bibliothek, lädt die kostenlosen Hörproben nach `%USERPROFILE%\GlowUp\_stimmen\`, misst sie und sortiert nach Ähnlichkeit (Liste + `kandidaten.json`). Dem Nutzer die Top-Kandidaten mit Pfaden nennen – **er hört und wählt selbst**, die Messung ist nur eine Vorauswahl. Danach:
```powershell
node "$env:USERPROFILE\.claude\skills\glowup-serie\scripts\stimmen-suche.mjs" --hinzufuegen <public_owner_id> <voice_id> "<serie-ordner>"
```
Das übernimmt die Stimme in „Meine Stimmen“ und trägt die neue `voiceId` in `serie.json` ein. Niemals die Stimme eines echten Creators aus den Referenzvideos klonen.

## Ablauf einer neuen Folge
1. **Briefing klären** (nur fragen, was fehlt): Serie/Figur, Folgennummer, verbleibende Tage, Ergebnis der letzten Abstimmung (Optionen + Prozente), gewünschter Twist. Bei einer neuen Serie: Name, Aussehen (Haare, Bart, Flagge, Gewicht, Headset), Name der Partnerin.
2. **Drehbuch schreiben** nach `references/drehbuch.md` (rund 45 s, 43–49 s sind in Ordnung, ca. 120–135 Wörter). Dem Nutzer den Sprechertext Szene für Szene kurz zeigen, wenn er das Skript sehen will – sonst direkt weiter.
3. **`folge.json` schreiben** nach `references/folge-format.md`. Jede Szene = ein Sinnabschnitt des Sprechertexts + Bild. Anker (`bei`) sind Wörter aus genau diesem Szenentext.
4. **Entwurf bauen und ansehen** (ohne Stimme, geschätzte Zeiten):
   ```powershell
   $env:Path = [Environment]::GetEnvironmentVariable('Path','Machine') + ';' + [Environment]::GetEnvironmentVariable('Path','User')
   node "$env:USERPROFILE\.claude\skills\glowup-serie\scripts\build.mjs" <folgen-ordner> --entwurf
   cd <folgen-ordner>\projekt
   npx --yes hyperframes@0.8.223 lint
   npx --yes hyperframes@0.8.223 snapshot --at <Mitte jeder Szene, kommagetrennt> --no-end -o "$env:USERPROFILE\hfsnap\<slug>"
   ```
   Dann `contact-sheet-*.jpg` mit dem Read-Tool ansehen und gegen den Stil-Guide prüfen: Überlappungen, abgeschnittene Texte, Figur verdeckt, Untertitel lesbar. Fehler in `folge.json` korrigieren (x/y/rahmen/kopfOben/untertitelY) und erneut bauen.
   Die `lint`-Warnungen `nested_structure_needs_subcomposition`, `timeline_track_too_dense` und `composition_file_too_large` sind bei diesem Generator normal und ändern nichts am Video; nur **Fehler** müssen behoben werden.
5. **Stimme erzeugen** (kostet ElevenLabs-Guthaben, nur wenn der Text final ist; bei unverändertem Text wird nichts neu erzeugt):
   ```powershell
   node "$env:USERPROFILE\.claude\skills\glowup-serie\scripts\stimme.mjs" <folgen-ordner>
   ```
   Braucht `ELEVENLABS_API_KEY` als Umgebungsvariable und eine Voice-ID in `serie.json` → `stimme.voiceId`. Fehlt der Key: den Nutzer bitten, ihn selbst zu setzen (`setx ELEVENLABS_API_KEY "..."`, danach Claude/Terminal neu starten). Den Key **nie** selbst in Dateien schreiben oder im Chat wiederholen.
   Danach fehlende **Soundeffekte + Musik** erzeugen (nur was noch nicht in `%USERPROFILE%\GlowUp\_sounds\` liegt; wird für alle Folgen wiederverwendet):
   ```powershell
   node "$env:USERPROFILE\.claude\skills\glowup-serie\scripts\sfx.mjs" --fuer <folgen-ordner>
   ```
   Sounds werden beim Build automatisch an die Bild-Ereignisse gelegt (siehe `references/sound-design.md`). Die Build-Ausgabe zeigt „Sounds: x/y“ – fehlt etwas, nennt sie den Befehl.
6. **Final bauen, prüfen, rendern**:
   ```powershell
   node "$env:USERPROFILE\.claude\skills\glowup-serie\scripts\build.mjs" <folgen-ordner>
   cd <folgen-ordner>\projekt
   npx --yes hyperframes@0.8.223 lint
   npx --yes hyperframes@0.8.223 render -o "<serie>\renders\folge-XX.mp4"
   ```
   Render läuft lokal (~2–3 min pro Minute Video). Danach mit ffmpeg einige Frames aus der MP4 ziehen und kontrollieren, z. B.
   `ffmpeg -v error -y -i <mp4> -vf "fps=1/4,scale=360:-1,tile=5x3" -frames:v 1 check.jpg` und ansehen.
7. **TikTok-Text – bei JEDER Folge Pflicht**: neben die MP4 eine gleichnamige `.txt` schreiben (`renders\folge-XX.txt`) und den Inhalt zusätzlich im Chat zeigen (zum Kopieren). Format:
   ```
   TITEL
   <Neugier-Titel, max. ~70 Zeichen, mit Emoji> | Folge <N>

   BESCHREIBUNG
   <1–2 Sätze Story-Teaser mit Cliffhanger, Emojis, ohne das Ende zu verraten>

   Ihr entscheidet jeden Tag über seinen Glow-Up! 🗳️
   👉 A: <Option A>
   👉 B: <Option B>

   Schreib A oder B in die Kommentare – die meisten Stimmen gewinnen ⏳
   Oder eure eigene Idee: Der Top-Kommentar mit 500 Likes gewinnt! ❤️

   #kaisglowup #duentscheidest #glowup #storytime #comic

   HINWEIS
   Beim Hochladen „KI-generierte Inhalte“ aktivieren (Erzählerstimme ist KI).
   ```
   Ab Folge 2 im Teaser das Ergebnis der letzten Abstimmung aufgreifen („Ihr habt entschieden: …“).
8. **Übergabe**: Pfad zur MP4 und zur `.txt` nennen, Dauer. Optional `npx hyperframes preview` erwähnen, falls der Nutzer selbst nachjustieren will.

## Regeln
- Sprache überall Deutsch, Umlaute korrekt (ä ö ü ß). Zahlen im Sprechertext als Ziffern sind ok („200 Metern“) – ElevenLabs spricht sie richtig. Ausnahme: die gebeugte Eins immer ausschreiben („eine Million“, nie „1 Million“, sonst spricht die Stimme „eins Million“).
- Keine echten Personen, Marken oder Logos nachbauen; Figuren sind eigene Cartoon-Figuren. Verpixeltes „Fake-Foto“ immer über das Element `fakefoto` (generiert), nie ein echtes Foto.
- Wort-Anker müssen im Text der gleichen Szene vorkommen, sonst bricht der Build mit einer klaren Meldung ab → Anker anpassen.
- Pro Szene höchstens 2–3 Overlay-Elemente gleichzeitig, sonst wird es unruhig.
- Nichts am generierten `projekt/index.html` von Hand ändern – Änderungen gehören in `folge.json` oder in die Bibliothek (`lib/`).
- Wenn ein gewünschtes Motiv fehlt (neuer Hintergrund, Requisit, Nebenfigur): in `lib/hintergrund.mjs` / `lib/elemente.mjs` / `lib/figur.mjs` im selben SVG-Stil ergänzen (dicke Kontur `#2a1f3d`, flache Farben), dann in `references/folge-format.md` dokumentieren.
- Node.js/FFmpeg werden per winget installiert; in einer neuen Shell zuerst den PATH wie oben auffrischen.
