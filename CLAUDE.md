# Der Brief vom Amt – Hinweise für Claude

TikTok-Serie (Deutsch): **ein Brief pro Video**, 30–45 s, Amtsdeutsch übersetzt für junge Erwachsene (erste Wohnung, erster Job, erste Steuer). Jedes Video steht für sich, keine Fortsetzungen.

**Pflichtlektüre:** Skill `tiktok-lernen` (`.claude/skills/tiktok-lernen/`) – Hook-Check (10 Punkte) und **Bild-1-Check (9 Punkte)** vor jedem Render im Chat abhaken. Vor jedem Upload:
`python3 -I .claude/skills/tiktok-lernen/scripts/bild1-check.py serie/renders/brief-XX.mp4 --aus <ordner>` und das Bild ansehen.
Technik: Skill in `skill/` (`SKILL.md`, `references/folge-format.md` – dort die Brief-Bausteine `brief`, `uebersetzung`, `umschlag`, `schritte`, `alarmrand`, Hintergrund `flaeche-<farbe>`, Kopfzeile `hud`).

## Stil (seit 15.11.2026): 3D statt Cartoon
Der Nutzer mag den Cartoon-Stil nicht. **Standard ist der 3D-Stil** nach dem Vorbild der „What if?“-Videos von @man_ia_c (Low-Poly-3D, Ich-Perspektive, warmes Licht, kursive Serif-Untertitel, Mono-Messwerte, roter Countdown): `node skill/scripts/build-3d.mjs serie/folge-XX-3d --stumm`, Referenz `skill/references/folge-format-3d.md`. Beispiel: `serie/folge-01-3d/folge.json`. Der Cartoon-Generator (`build.mjs`) bleibt nur als Alternative.

## Format
- **Bild 1:** Brief mit rotem Stempel (MAHNUNG, FRIST …), Figur in Panik, roter `alarmrand`, alles mit `"sofort": true` (kein Einblenden). Größter Text = Problem.
- **Satz 1 mit Zahl** („Mahnung über 89 Euro? …“). Bei ~5–10 s offene Frage („Den Fehler zeig ich dir am Ende“).
- Ablauf: Problem → „Was steht da wirklich?“ (Zeilen markieren, `uebersetzung` Amtsdeutsch → Klartext) → 3 Schritte „Was du jetzt tust“ → Auflösung → Schluss „Welcher Brief als Nächstes? Kommentier ihn!“ + „Speichern, bevor du's brauchst“.
- Untertitel bei y ≈ 1180–1300 (sichere Zone), Kopfzeile bei y 250.

## Inhaltliche Regeln (Recht & Geld)
- **Jede Zahl, Frist, Regel vor dem Rendern mit aktueller Quelle prüfen** (offizielle Seiten, Verbraucherzentrale, Bundesbank, Justiz). Quellen in `folge.json` → `quellen` und in der TikTok-Beschreibung. Nie aus dem Gedächtnis.
- Nur allgemeine Info. In jede Beschreibung: „Keine Rechtsberatung … im Zweifel Verbraucherzentrale“.
- Keine echten Logos, Wappen, Bundesadler, Behörden, Firmen oder Personen. Absender erfunden („Musterstrom GmbH“, „Amtsgericht Musterstadt“), Brief erkennbar als Cartoon.

## Ablauf je Brief
1. Quellen prüfen → `serie/brief-XX/folge.json` (Ordnername bisher `folge-01`).
2. `node skill/scripts/build.mjs serie/folge-XX --entwurf --stumm`, `hyperframes lint`, `snapshot` ansehen.
3. **Immer zuerst stumm rendern und zeigen.** Ton (ElevenLabs, kostet Guthaben) nur auf ausdrückliche Ansage. Key in der Cloud über `request_credential` für `api.elevenlabs.io` (Header `xi-api-key`), Stimme mit `stimmen-suche.mjs` gemeinsam wählen und in `serie/serie.json` eintragen.
4. Zu jeder MP4 eine `.txt` (Titel mit Zahl, Beschreibung mit Quellen + „Keine Rechtsberatung“, Hashtags, KI-Hinweis sobald Stimme drin) daneben und vollständig im Chat.

Cloud (Linux):
```bash
export USERPROFILE=$HOME HYPERFRAMES_BROWSER_PATH=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell CHROME_PATH=$HYPERFRAMES_BROWSER_PATH
node skill/scripts/build.mjs serie/folge-01 --entwurf --stumm
cd serie/folge-01/projekt && npx --yes hyperframes@0.8.223 render -o ../../renders/brief-01-stumm.mp4
```

## Stand (15.11.2026)
- Kanalname: **Der Brief vom Amt**. Brief 1: **Mahnung** (stumm gerendert, 49,4 s mit geschätzten Zeiten; mit Stimme voraussichtlich kürzer). Noch keine Stimme gewählt.
- Themen-Ideen: Rundfunkbeitrag, Steuerbescheid/Steuererklärung, Nebenkostenabrechnung, Mieterhöhung, Handyvertrag kündigen, Anhörungsbogen Blitzer, Krankenkasse, Schufa-Auskunft, Wahlbenachrichtigung. Kommentare liefern die nächsten Themen.

Git: Commits als `jdbmc1-spec` <353731689+jdbmc1-spec@users.noreply.github.com>. Nicht ins kais-glowup-Repo committen.

## Feedback des Nutzers (15.11.2026, abends) – HIER MORGEN WEITERMACHEN
- **3D-Stil statt Cartoon** (Cartoon gefällt ihm nicht). 3D-Fassung Brief 1: `serie/renders/brief-01-3d-stumm.mp4` (50 s, stumm).
- **„Der Anfang ist viel zu langweilig.“** → Als Erstes den Einstieg (0–5 s) von `serie/folge-01-3d` umbauen, Rest erst danach.
  Ideen dafür (noch nicht mit dem Nutzer abgestimmt):
  1. Mit dem Ende anfangen: Es klopft, rotes Licht an der Tür, Countdown „WIDERSPRUCH MÖGLICH NOCH 0 TAGE“ ab Bild 1, Satz 1: „Alles fing mit einer Mahnung über 89 Euro an.“ Dann Rückblende zum Tisch.
  2. Der gelbe Umschlag fällt in Bild 1 auf den Tisch (Wackler), Countdown 14 Tage läuft sofort.
  3. Schnellere Kamera im Hook (Sprung statt ruhiger Fahrt), Bild 1 farbiger (Bild-1-Check: nur 22 % Sättigung, 0,4 % Rot – zu wenig).
- Bild-1-Check 3D-Fassung: Problem sichtbar, aber Farbe/Rot zu schwach.
- Offen: privates GitHub-Repo `brief-vom-amt` (Nutzer legt an), Stimme/Ton erst auf Ansage.

## Feedback 16.11.2026
- „Bis Sekunde 26 hätte jeder weitergewischt.“ Erklärungen (Verzug, Zinsen, Mahngebühr, 3 Schritte) **ans Ende und viel kürzer**.
- Alle 3 Hook-Ideen „ganz okay“ → Test-Anfänge gebaut: `serie/hook-a` (Ende zuerst: Tür, 0 Tage, „30 Tage vorher“), `serie/hook-b` (gelber Brief knallt, Uhr 13 T 23:59:59 läuft), `serie/hook-c` (Schnelldurchlauf in 5 s: Mahnung → Stapel → gelber Brief → Tür). Nutzer wählt.
- Generator neu: Ereignis `rotrand` (pulsierender roter Rand), Countdown `format: "uhr"` kleiner.

## Stand 16.11.2026 (Nachmittag)
- Nutzer hat **Anfang A** gewählt → `serie/folge-01-3d-a` (33,6 s). Erklärungen nur noch kurz am Ende („So passiert dir das nicht“, 4 Punkte).
- **Stimme: Ian** („Deep, Punchy Social Hook“), voiceId `uC1r2TVqMMkHyjSAteKk` in `serie/serie.json`. ElevenLabs-Key liegt als Netzwerk-Secret in der Umgebung „brief-vom-amt“ (`ELEVENLABS_API_KEY=proxy-injected NODE_USE_ENV_PROXY=1` setzen).
- Endfassung mit Ton: `serie/renders/brief-01-3d-a.mp4` + `.txt` (KI-Hinweis aktivieren).
- GitHub: `jdbmc1-spec/brief-vom-amt` (privat), Branch `main`.
- Rendern in der Cloud: `render --workers 4`, dauert ~10 min (WebGL per Software); im Hintergrund starten, kein `timeout` davor.
- Offene Idee: Person hinter dem Milchglas in Bild 1 dunkler/größer (Mini-Ansicht).
