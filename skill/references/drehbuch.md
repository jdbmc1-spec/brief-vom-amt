# Drehbuch-Regeln (deutsch)

## Länge & Tempo
- Etwa 45 Sekunden (43–49 s sind alle in Ordnung, nur nicht deutlich länger), ca. 120–135 Wörter Sprechertext.
- Kurze Hauptsätze, Präsens, keine Schachtelsätze. Jeder Satz = ein Bild.
- Erzähler (3. Person), locker, leicht spöttisch, aber nie gemein. Er feiert kleine Erfolge mit.

## Pflicht-Struktur einer Folge
1. **Hook (0–3 s)**: Name + Countdown + Problem in einem Satz.
   - „Kevin hat noch 29 Tage, bis Karla ihn zum ersten Mal sieht.“
   - „Noch 28 Tage. Und Emre hat ein Problem.“
2. **Folge 1 – Ausgangslage**: Fake-Foto („Sie kennt nur dieses Foto“) vs. Realität, dann der Entschluss („Ab heute wird alles anders.“) und der erste peinliche Versuch.
   **Ab Folge 2 – Rückblick**: „Letzte Folge habt ihr entschieden: …“ + Prozentzahl des Gewinners (Element `umfrage`).
3. **Umsetzung mit Comedy (Hauptteil)**: Er setzt die Entscheidung um und scheitert erst – konkret und bildhaft:
   Zahlen (60 kg → 0 cm bewegt, nach 200 m keine Luft, 1,2 km in 40 Minuten), Nebenfiguren (Oma überholt ihn, Hund bellt, Trainer greift ein), Ausreden.
   Danach ein **kleiner echter Fortschritt** → Glow-Up-Balken steigt (+1 bis +3 %).
4. **Mid-CTA (ca. Sekunde 25–35)**: „Folg, damit du siehst, ob er es schafft.“ (Element `folgen`).
5. **Twist / Rückschlag** (meist per Handy-Chat mit der Partnerin):
   - Sie kommt früher („Ich hab eine Überraschung … ich komme eine Woche früher!“ → Tage springen).
   - Er lügt („Alles gut, Schatz“ – Label LÜGE).
   - Sie will ein aktuelles Foto / Videocall.
   - Geld ist alle, Waage zeigt mehr statt weniger, Ex taucht auf, Mama kocht wieder Fettiges.
6. **Abstimmung (letzte 8–12 s)**: „Was soll {Name} tun? A: … Oder B: … Schreib A oder B in die Kommentare!“
   - Beide Optionen müssen spannend sein und unterschiedliche Folgen versprechen (ehrlich vs. Schummeln, Sport vs. Ernährung, mutig vs. bequem).
   - Optionstexte max. ~22 Zeichen pro Zeile, 2 Zeilen.

## Was erfolgreiche Folgen ausmacht (Analyse Kevin & Karla Folge 1, 59 s, 8,5k Likes, 1,1k Shares)
- **14–16 Szenen**: alle 1,5–4 s ein neues Bild (das Vorbild läuft länger, unser Ziel sind rund 45 s). Lieber eine Szene mehr als eine lange Einstellung.
- **Fallhöhe aufbauen**: Der Tiefpunkt kommt **direkt vor der Abstimmung** – erst Chaos-Alltag, dann Lüge, dann öffentliche Blamage, dann Einsicht.
- **Detailaufnahmen ohne Figur** für Gags: `kuehlschrank`, `zahnbuerste`, `dusche` + `notiz` („Zuletzt benutzt: vor 4 Monaten“). Das erzählt das Elend schneller als jeder Satz.
- **Hook mit Gerät**: `sperrbildschirm` mit Nachricht der Partnerin („Wir sehen uns in 30 Tagen“) + `karte` der Partnerin mit `herzen`.
- **Figur in Aktion statt stehend**: im Gaming-Stuhl (`stuhl` + `schreibtisch`), läuft mit Handy (`pose: "handy"`, `gehen`, `wandern`), wird blamiert (Nebenfiguren lachen).
- **Emotionaler Schluss-Dreiklang**: (1) `stimmung: "traurig"` + „seufz …“, (2) Großaufnahme `panik` + „!!!“ + `wackeln`, (3) Großaufnahme `weinen` + „Er braucht *dich*“ → Abstimmung.
- **Abstimmungs-Optionen lösen die gezeigten Probleme** (faul → joggen, Chaos/Geld → ausmisten/verkaufen).

## Die ersten 15 Sekunden (Analyse Kevin & Karla Folge 4)
Vorbild-Ablauf: Figur weit im Bild → in unter 1 s Sprung aufs Gesicht mit Fliegen (Sekunde 0–3) → Partnerin als Karte mit Kalender „DATE IN X TAGEN“ (bis 4,5) → zurück im Zimmer: „TAG X“-Schild und gestrichelte rote Kreise um Kopf und Bauch, dazu direkte Ansprache „ihr könnt das ändern“ (bis 9) → Umfrage mit laufenden Balken, Figur schaut hell von unten ins Bild und reagiert mit Schock und „!!“ auf die Pointe (ab 9).
- Das Ziel der Serie steht schon im ersten Satz: Countdown + Date + Name.
- Der Zuschauer wird direkt angesprochen, bevor die Handlung startet („ihr“).
- Die Figur ist während der Umfrage hell und reagiert. Nicht abdunkeln.
- Dafür im Baukasten: `kamera: "hook"`, `optionen: { "fliegen": "viele" }`, `kreis`, `zahl` mit `stil: "kalender"` + `unten`, `stempel` für „TAG X“.

## So bleibt eine Folge bei rund 45 Sekunden
- Etwa 125 Wörter bzw. 650 Zeichen Sprechertext, Einstieg und Rückblick zusammen höchstens 11 s, Abstimmung höchstens 8 s.
- Zuerst die Sätze kürzen, die das Bild schon erzählt. Gags, die Text brauchen, fliegen eher raus als reine Bild-Gags.
- Das gesprochene „Folg, damit …“ in der Mitte entfällt: der „+ FOLGEN“-Knopf steht in der Abstimmung.
- `"nachlauf": 1.2` im Folgen-Kopf spart zusätzlich Zeit.
- Die Build-Ausgabe zeigt nur eine Schätzung. Kurze Sätze mit vielen Zahlen liefen bei Folge 2 rund 2,5 s länger als geschätzt. Die echte Länge steht erst nach `stimme.mjs` fest und muss vor dem Render geprüft werden.
- `"stimme": { "tempo": 1.15 }` (Standard 1.1) kürzt spürbar und klang in der Messung noch im Bereich der Referenzen (6,4 Silben/s). Reste der Zeit mit `"nachlauf"` der Abstimmung geben, damit man die Optionen lesen kann.

## Geld-Serien: Geld muss hart verdient sein (Serie „Mo – 1 Million“)
Analyse @30tagebis1million: In den stärksten Folgen gibt es fast nichts (Folge 1: 0 €, Folge 2: 47 € nach einem ganzen Banküberfall). Die Figur darf sich nicht einfach reich verkaufen.
- **Folge 1 endet praktisch bei null.** Höchstens ein paar Euro, keine Hunderter, kein Konfetti.
- **Kontrast-Pointe statt Erfolg:** Großer Plan → lächerlicher Betrag („ALLES MUSS RAUS!“ → 3 Euro).
- **Jeder Gewinn hat sofort einen Haken:** Wer gewinnt, verliert gleich wieder einen Teil (Rechnung, Strafe, Pfusch).
- **Tempo:** in den ersten Folgen zweistellig bis niedrig dreistellig, Tausender frühestens ab etwa Folge 5 und nie als Geschenk.
- **Jede Folge endet mit dem Abstand zum Ziel:** „Fehlen noch 999.984,60 €“, damit der Betrag klein wirkt.
- **Kein echter Abkürzungs-Sieg:** Auch wenn die Abstimmung Kalles Deal wählt, kommt kein echtes Geld (geplant: Falschgeld, Schulden steigen).
- Die **Rechnung im Bild muss stimmen**: Stand + Plus = neuer Stand, Ziel − Stand = „fehlen noch“.
- Von fremden Kanälen Prinzipien übernehmen, keine Szenen, Beträge oder Figuren.

## Was starke Mitmach-Serien besser machen (Analyse 2026-11-06: @millionoderknast, @kevin.und.karla, @30tagebis1million)
- **Zweite Anzeige mit Gegenspieler-Wert:** Geld allein reicht nicht. Beispiel „VERDACHT 0 %“ neben dem Geld, bei 100 % droht eine Razzia. Jede Option zeigt ihre Wirkung direkt auf der Karte („12 €/Std · legal · 🚨 −5 %“ gegen „100 € bar/Tag · 🚨 +25 %“).
- **Gewissensfragen statt zwei Geschäftsideen:** Gefundene Geldbörse zurückgeben oder behalten, sauber oder schwarz, Team oder bester Freund. Darüber hat jeder eine Meinung.
- **Rolle der Zuschauer in den ersten 4 Sekunden:** „Dieser Typ wird Millionär. Oder er landet im Knast. Und *du* entscheidest.“
- **Ziel greifbar rechnen:** „999.000 € ÷ 100 Tage = 9.990 € pro Tag.“
- **Nachvollziehbarer Antrieb:** Neid in der Abi-Gruppe („Marvin: Neues Baby 😎“ mit Autofoto) statt nur Not.
- **Länge ist kein Problem, wenn alle 2–4 s etwas passiert:** Die stärksten Folgen dauern 70–90 s. Kürzen hilft nur, wenn dadurch die Dichte steigt.
- **Ende führt zurück zum Anfang** (Schleife) und zeigt eine Endkarte mit Handle und „Folge 2: Ihr entscheidet“.
- **Täglich posten** und den Stand in der Profilbeschreibung jeden Tag aktualisieren.

## Schreibstil-Tricks
- **Kontrast-Pointe**: Ankündigung groß → Realität klein. „Ab heute wird alles anders. Nach 200 Metern: keine Luft mehr.“
- **Zahlen** sind Gold: Waage, Kilometer, Tage, Kontostand, Prozent.
- **„eine Million“ immer ausschreiben**, nie „1 Million“: Die Stimme liest die Ziffer sonst als „eins Million“. Gilt für jede gebeugte Eins („eine Stunde“, „einen Euro“). Der Wort-Anker heißt dann ebenfalls `"eine"`, nicht `"1"`. Im Bild (Stempel, Zähler, Banner) bleibt „1 MIO“ oder „1.000.000 €“ in Ordnung.
- **Schlüsselwörter** mit `*Stern*` markieren (werden gelb): Zahlen, Orte, die Pointe. Max. 1 pro Satz.
- Lautmalerei für die Bild-Effekte mitdenken (RUMMS!, HECHEL…, KNARZ, ZACK!) – die stehen nur im Bild, nicht im Sprechertext.
- Kein Englisch-Kauderwelsch außer üblichen Begriffen (Glow-Up, Fitnessstudio ok).
- Zum Schluss immer: „Schreib A oder B in die Kommentare!“ (optional: „Dein Kommentar entscheidet.“)
- **Danach in jeder Folge der Top-Kommentar:** „Oder der *Top-Kommentar* mit 500 Likes gewinnt.“ In der Abstimmungs-Szene dazu `"topKommentar": { "likes": 500, "bei": "Top" }`. Rund 3 Sekunden einplanen.

## Neuausrichtung ab Folge 10 (7. Nov. 2026, nach `analyse-2026-11-07.md`)
Die Reichweite ist ab Folge 6 eingebrochen, als die Handlung sich vom Date entfernte (Goonen, Casino, Dagestan, Ringen). Ab Folge 10 gilt:
1. **Lea und das Date in jeder Folge.** Jede Folge zahlt auf das Treffen ein: sichtbarer Glow-Up an Kai, Geld fürs Date, Kontakt mit Lea. Nebenschauplätze höchstens eine Folge lang.
2. **Jede Folge versteht man ohne Vorwissen.** In den ersten 5 Sekunden: Vorher/Nachher von Kai oder ein Satz zur Ausgangslage („Lea kennt nur ein 5 Jahre altes Foto von ihm“).
3. **Nur noch A oder B**, zwei gleich verlockende Optionen, dazu der Top-Kommentar. Abschluss: „A oder B? Schreib's in die Kommentare!“
4. **Keine Sex-, Drogen- oder Glücksspiel-Witze.** Sie kosten erfahrungsgemäß Reichweite und passen nicht zum jungen Publikum.
5. **Grund zum Folgen in der Geschichte:** ein Follower-Ziel, das Kai etwas bringt (z. B. „Bei 1.000 Followern: neues Outfit fürs Date“), im Bild als Fortschritt.
6. **Ein Moment zum Teilen pro Folge**, z. B. ein Satz an einen Kumpel.
7. Empfehlung an den Nutzer: eine Folge pro Tag, immer zur gleichen Zeit.

## Serienplan Kai
**Hinweis:** Folge 6 und 7 entstanden auf dem zweiten PC, sehen aber ungefähr aus wie Folge 1–5. Neue Folgen baut dieser Skill weiter, Inhalt und Stand siehe `folge-6-7-anderer-pc.md`.
Feste Regeln: immer zuerst stumm rendern, Ton erst nach Freigabe. Spoiler nur zeigen, nie sagen. Das Skurrile ins erste Bild. Keine geschützten Marken oder Figuren. Glücksspiel nicht weiter als Lösung ausbauen. Hashtags genau: #kaisglowup #duentscheidest #glowup #storytime #comic.
Nach Folge 4 (Mama nimmt Leas Videocall an): Das Lügen-Drama nicht weiter ausbauen. Der Schwerpunkt liegt wieder auf **Glow-Up und Geld verdienen**: sichtbare Veränderung an Kai, Fortschritt im Balken, Geld in „Kais Kasse“ (Jobs, Schulden bei Mama zurückzahlen).
Verdientes Geld gibt Kai auch **sichtbar für seinen Glow-Up aus**, z. B. für neue Klamotten oder den Friseur: Kasse sinkt (`kasse` mit Minus), Aussehen ändert sich, Glow-Up steigt. So bleibt das Geld nicht nur eine Zahl.

## Ideen-Pool für Folgen
Fitnessstudio · Joggen · Kochen lernen · Junkfood-Entzug · Friseur/Bart ab · Hautpflege/Pickel · Zimmer aufräumen · Duschen/Wäsche · Klamotten kaufen · Zahnarzt · Minijob für Geld · Social-Media-Entzug · Schlafrhythmus · Abnehmen-Challenge mit Kumpel · Tanzkurs · Fotos für sie machen · Videocall-Panik · Ex taucht auf · Mutter mischt sich ein · Kumpel lädt zum Zocken ein (Versuchung).
