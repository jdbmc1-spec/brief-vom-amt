# folge.json – 3D-Stil (`build-3d.mjs`)

Stil wie die „What if?“-Videos: Low-Poly-3D in Ich-Perspektive, warmes Licht, ruhige Kamerafahrten, wenig Text.
Kursive Serif-Untertitel (EB Garamond), Messwerte und Countdown in Mono (JetBrains Mono). Kein Cartoon, keine Outlines.

```bash
node skill/scripts/build-3d.mjs serie/folge-XX --stumm      # Vorschau ohne Ton
node skill/scripts/build-3d.mjs serie/folge-XX              # mit voice.mp3 + alignment.json (stimme.mjs wie gehabt)
cd serie/folge-XX/projekt && npx --yes hyperframes@0.8.223 snapshot --at 0,5,10 --no-end -o <ordner>
npx --yes hyperframes@0.8.223 render -o ../../renders/brief-XX-3d-stumm.mp4
```
Braucht WebGL (Chrome/Headless-Shell mit Software-GPU reicht). three.js 0.160 kommt vom CDN, Schriften liegen in `skill/fonts/` (OFL).
Ein Render von 50 s dauert in der Cloud etwa 8–10 min.

## Welt
Feste Wohnküche (Meter, y = oben): Tisch mittig bei (0, 0.75, −0.4), Platte 1,6 × 1,0 m. Fenster links hinten (−1.1, 1.65, −2.55), Tür mit Milchglas rechts hinten (1.9, 1.05, −2.5), Hängelampe über dem Tisch, Küchenzeile rechts, Tasse, Stift, Handy.
Briefe sind A4 (0,42 × 0,594 m) und liegen flach auf dem Tisch; die Kopfzeile zeigt nach hinten (−z), d. h. von vorne (+z) lesbar.

## Kopf
```json
{ "titel": "…", "stil": "3d", "marke": "Der Brief vom Amt · #1", "untertitelY": 1250, "nachtStart": 0,
  "briefe": { "<name>": { … } }, "quellen": [ … ], "szenen": [ … ] }
```

### Brief
```json
"mahnung": { "pos": [0.02, 0, -0.4], "rotY": 0.06, "lage": 0,
  "absender": "Musterstrom GmbH", "absenderZeile": "Funkenweg 7 · 12345 Musterstadt", "logoText": "M", "logoFarbe": "#2f6f5e",
  "datum": "03.11.2026", "betreff": "Mahnung – Rechnung Nr. 4711",
  "zeilen": [ { "text": "…", "betrag": "84,00 €", "fett": true, "gross": true, "linie": true, "farbe": "rot", "markiert": false } ],
  "fueller": 3, "stempel": { "text": "MAHNUNG", "x": 700, "y": 330, "rot": -10, "groesse": 92 } }
```
Ein Brief ohne `zeige`-Ereignis liegt von Anfang an da; mit `zeige` rutscht er bei seinem Anker heraus (über dem gelben Umschlag).

## Szene
```json
{ "text": "Sprechertext mit *Schlüsselwort*", "untertitel": true, "untertitelY": 1250,
  "kamera": { "pos": [x,y,z], "ziel": [x,y,z], "bis": { "pos": [...], "ziel": [...], "fov": 48 }, "fov": 48, "ease": "sine|out|in|linear" },
  "ereignisse": [ … ] }
```
Ohne `kamera` bleibt die Kamera, wo die letzte Szene endete. Die Kamera fährt über die Szene von `pos/ziel` nach `bis`; leichtes Handkamera-Atmen ist immer an.
Bewährte Einstellungen: Hook von schräg oben `pos [0.02,1.42,0.22] → ziel [0.02,0.6,-0.72]` (Brief unten, Titel oben über der Wand); Zeilen-Nahaufnahme `pos [0.04,1.0,-0.22] → ziel [0.03,0.75,-0.45]`; Raum `pos [1.5,1.6,1.3] → ziel [-0.3,0.9,-0.9]`; Tür `pos [0.6,1.55,0.2] → ziel [1.85,1.35,-2.45]`.

## Ereignisse (`bei` = Wort-Anker oder Sekunden ab Szenenstart; `weg` = Anker, `"ende"` oder `{ "szene": 13 }`)
| `typ` | Felder | Wirkung |
|---|---|---|
| `titel` | `text` (`*x*` farbig, `\n`), `y`, `weg` | großer Serif-Titel (Hook-Frage), bei `bei: 0` ab Frame 1 sichtbar |
| `hud` | `label`, `wert`, `unter`, `farbe` · `aus: true` blendet aus | Messwert-Kasten links (y 600): „OFFEN / 89,00 € / STATUS: MAHNUNG“ |
| `mark` | `brief`, `zeile` (Index) | Textmarker zieht über die Zeile (gelb, `farbe: "rot"` in der Zeile = rot) |
| `zeige` | `objekt`: `umschlag` (+ `pos`, `rotY`, `lage`) oder Briefname | gelber Umschlag fällt auf den Tisch / Brief rutscht heraus |
| `stapel` | `anzahl` (≤ 9), `dauer` | weiße Briefe stapeln sich im Zeitraffer |
| `tage` | `von`, `bis`, `dauer` | Zeitraffer: Tag/Nacht wechselt, HUD zählt „Tag 1 … Tag 30“ (vorher ein `hud` setzen) |
| `nacht` | `wert` (0 Tag … 1 Nacht), `dauer` | Licht dauerhaft wechseln (Lampe geht an) |
| `countdown` | `label`, `von`, `bis`, `einheit`, `dauer`, `format: "uhr"` (Tage → „13 T 23:59:59“) | großer roter Countdown oben, bei 0 rot hinterlegt |
| `liste` | `titel`, `punkte: [{text, bei}]`, `y`, `weg` | Schritte links, aktueller Punkt mit Akzentstrich |
| `klopfen` | `staerke` | Schatten einer Person hinter dem Milchglas + Wackeln |
| `alarm` | – | rotes pulsierendes Licht an der Tür |
| `wackeln` | `staerke` (0.006 leicht … 0.02 stark) | Kamera-Wackler |
| `ende` | `titel`, `zeilen` | dunkler Abspann mit Frage + Aufrufen (Untertitel der Szene mit `"untertitel": false` aus) |

Neue Requisiten: in `lib/welt3d.js` im selben Low-Poly-Stil ergänzen (`box(...)`, `flatShading`, gedeckte Farben) und hier dokumentieren.
