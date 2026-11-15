#!/usr/bin/env python3
"""Bild-1-Check: zeigt, wie das erste Bild eines Videos im TikTok-Feed wirkt.

Aufruf: python3 -I bild1-check.py <video.mp4> [weitere.mp4 ...] [--aus <ordner>]

Je Video entsteht <ordner>/<name>_bild1.png mit vier Bildern nebeneinander:
  1. Bild 1 mit den Zonen, die TikTok verdeckt (rot: oben Kanalzeile, rechts Buttons, unten Name/Beschreibung)
  2. Bild bei 0,5 s
  3. Bild bei 1 s
  4. Bild 1 als Mini-Ansicht (wie beim schnellen Wischen)
Bei mehreren Videos zusätzlich <ordner>/bild1-vergleich.png (alle Zeilen untereinander).
Im Terminal: Helligkeit (0-255), Farbsättigung, Kontrast, Rotanteil und Bewegung in 0-1 s und 1-3 s.

Richtwerte (13.11.2026): Scrollywood Kreuzfahrt Sättigung 51 %, Rot 17 %, Bewegung 6,6;
Scrollywood Brand (55K) 35 % / 5 % / 1,1; eigene Hook-Bilder damals 18-40 % / 0-10 %.
Bewegung allein entscheidet nicht, das Problem im Bild schon (siehe SKILL.md, Bild-1-Check).
Braucht nur ffmpeg. Läuft auf eigenen Renders vor dem Upload.
"""
import colorsys
import os
import subprocess
import sys

args = sys.argv[1:]
aus = "bild1-check"
if "--aus" in args:
    i = args.index("--aus")
    aus = args[i + 1]
    del args[i:i + 2]
if not args:
    sys.exit(__doc__)
os.makedirs(aus, exist_ok=True)

FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
W, H = 90, 160  # Messauflösung


def ff(*a):
    subprocess.run(["ffmpeg", "-v", "error", "-y", *a], check=True)


def frames(f, ss, t):
    p = subprocess.run(["ffmpeg", "-v", "error", "-ss", str(ss), "-i", f, "-t", str(t), "-vf", f"scale={W}:{H},fps=30",
                        "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True)
    b, n = p.stdout, W * H * 3
    return [b[i:i + n] for i in range(0, len(b) - n + 1, n)]


def werte(fr):
    px = [(fr[i], fr[i + 1], fr[i + 2]) for i in range(0, len(fr), 3)]
    ys = [0.299 * r + 0.587 * g + 0.114 * b for r, g, b in px]
    m = sum(ys) / len(ys)
    sd = (sum((y - m) ** 2 for y in ys) / len(ys)) ** 0.5
    sat = sum(colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)[1] for r, g, b in px) / len(px) * 100
    rot = sum(1 for r, g, b in px if r > 150 and r > g * 1.6 and r > b * 1.6) / len(px) * 100
    return m, sat, sd, rot


def bewegung(frs):
    d = [sum(abs(a - b) for a, b in zip(x, y)) / len(x) for x, y in zip(frs, frs[1:])]
    return sum(d) / max(1, len(d))


zeilen = []
print(f"{'Video':28} {'Helligkeit':>10} {'Sättigung':>10} {'Kontrast':>9} {'Rotanteil':>10} {'Bew. 0-1 s':>11} {'Bew. 1-3 s':>11}")
for f in args:
    name = os.path.splitext(os.path.basename(f))[0]
    a, c = frames(f, 0, 1), frames(f, 1, 2)
    if not a:
        print(f"{name}: kein Bild lesbar")
        continue
    m, sat, sd, rot = werte(a[0])
    print(f"{name[:28]:28} {m:10.0f} {sat:9.0f}% {sd:9.0f} {rot:9.1f}% {bewegung(a):11.1f} {bewegung(c):11.1f}")
    tmp = os.path.join(aus, f".{name}")
    os.makedirs(tmp, exist_ok=True)
    zonen = ("scale=1080:1920,"
             "drawbox=x=0:y=0:w=1080:h=150:color=red@0.35:t=fill,"
             "drawbox=x=0:y=1480:w=1080:h=440:color=red@0.35:t=fill,"
             "drawbox=x=940:y=760:w=140:h=720:color=red@0.35:t=fill,"
             "drawbox=x=90:y=260:w=900:h=1400:color=yellow@0.9:t=4,"
             f"scale=360:640,drawtext=fontfile={FONT}:text='{name[:30]}':x=6:y=614:fontsize=18:fontcolor=white:box=1:boxcolor=black@0.7")
    ff("-i", f, "-frames:v", "1", "-vf", zonen, f"{tmp}/a.png")
    ff("-ss", "0.5", "-i", f, "-frames:v", "1", "-vf", "scale=360:640", f"{tmp}/b.png")
    ff("-ss", "1", "-i", f, "-frames:v", "1", "-vf", "scale=360:640", f"{tmp}/c.png")
    ff("-i", f, "-frames:v", "1", "-vf", "scale=68:120,scale=360:640:flags=neighbor", f"{tmp}/d.png")
    ziel = os.path.join(aus, f"{name}_bild1.png")
    ff("-i", f"{tmp}/a.png", "-i", f"{tmp}/b.png", "-i", f"{tmp}/c.png", "-i", f"{tmp}/d.png", "-filter_complex", "hstack=inputs=4", ziel)
    for x in "abcd":
        os.remove(f"{tmp}/{x}.png")
    os.rmdir(tmp)
    zeilen.append(ziel)

if len(zeilen) > 1:
    ein = []
    for z in zeilen:
        ein += ["-i", z]
    ff(*ein, "-filter_complex", f"vstack=inputs={len(zeilen)}", os.path.join(aus, "bild1-vergleich.png"))
print("\nBilder:", ", ".join(zeilen) + (f", {aus}/bild1-vergleich.png" if len(zeilen) > 1 else ""))
print("Gelber Rahmen = sicherer Bereich 900 × 1.400. Rot = verdeckt. Dann die 9 Punkte im Bild-1-Check abhaken.")
