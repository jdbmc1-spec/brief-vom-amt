#!/usr/bin/env node
// Baut aus folge.json (Stil "3d") ein HyperFrames-Projekt mit Low-Poly-3D-Welt (three.js) in Ich-Perspektive.
// Aufruf: node build-3d.mjs <folgen-ordner> [--entwurf] [--stumm]
// Doku: references/folge-format-3d.md
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { esc, n } from '../lib/util.mjs';
import { zerlege, wortZeiten, norm, ladeFolge } from '../lib/text.mjs';

const HF_VERSION = '0.8.223';
const THREE_URL = 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js';
const SKILL = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const ordner = path.resolve(process.argv[2] || '.');
const entwurf = process.argv.includes('--entwurf');
const stumm = process.argv.includes('--stumm');
const folge = ladeFolge(ordner);
const projekt = path.join(ordner, 'projekt');
fs.mkdirSync(path.join(projekt, 'assets', 'fonts'), { recursive: true });

// ---------- Zeiten ----------
const zer = zerlege(folge);
const alignPfad = path.join(ordner, 'alignment.json');
const voicePfad = path.join(ordner, 'voice.mp3');
const hatStimme = !entwurf && !stumm && fs.existsSync(alignPfad) && fs.existsSync(voicePfad);
const alignment = hatStimme ? JSON.parse(fs.readFileSync(alignPfad, 'utf8')).alignment : null;
const { dauer: sprechDauer } = wortZeiten(zer, alignment);
const W = zer.woerter;
const GESAMT = n(Math.max(sprechDauer, W.length ? W[W.length - 1].end : 0) + (folge.nachlauf ?? 1.8));
const szenen = folge.szenen.map((s, i) => ({ ...s, i, w0: zer.ersteWort[i], w1: i + 1 < folge.szenen.length ? zer.ersteWort[i + 1] : W.length }));
szenen.forEach((s, i) => { s.start = i === 0 ? 0 : n(Math.max(0, (W[s.w0]?.start ?? 0) - 0.06)); });
szenen.forEach((s, i) => { s.ende = i + 1 < szenen.length ? szenen[i + 1].start : GESAMT; });

function zeitIn(s) {
  return (anker) => {
    if (anker == null) return s.start;
    if (typeof anker === 'number') return s.start + anker;
    if (anker === 'ende') return s.ende;
    if (typeof anker === 'object' && anker.szene) return szenen[anker.szene - 1].start + (anker.plus || 0);
    const teile = String(anker).split(/\s+/).map(norm).filter(Boolean);
    for (let k = s.w0; k < s.w1; k++) if (teile.every((t, j) => W[k + j] && norm(W[k + j].text).startsWith(t))) return W[k].start;
    throw new Error(`Szene ${s.i + 1}: Anker "${anker}" kommt im Text nicht vor: "${s.text}"`);
  };
}
const stern = (txt) => esc(txt).replace(/\*([^*]+)\*/g, '<em>$1</em>').replace(/\n/g, '<br>');

// ---------- Ereignisse + HTML-Ebenen ----------
const ereignisse = [];
let ebenen = '';
let letzteKamera = null;
const szenenDaten = szenen.map((s) => {
  const zeit = zeitIn(s);
  (s.ereignisse || []).forEach((e, k) => {
    const id = `e${s.i + 1}-${k + 1}`;
    const x = { ...e, id, t: n(zeit(e.bei)) };
    if (e.weg != null) x.weg = n(zeit(e.weg));
    if (e.typ === 'titel') ebenen += `<div class="titel" id="${id}" style="top:${e.y ?? 330}px">${stern(e.text)}</div>`;
    if (e.typ === 'liste') {
      x.punkte = e.punkte.map((p) => ({ ...p, t: n(zeit(p.bei)) }));
      ebenen += `<div class="liste" id="${id}" style="top:${e.y ?? 980}px"><div class="l-titel">${esc(e.titel || '')}</div>${x.punkte.map((p, i) => `<div class="l-p" id="${id}-p${i}"><span>${String(i + 1).padStart(2, '0')}</span>${stern(p.text)}</div>`).join('')}</div>`;
    }
    if (e.typ === 'ende') ebenen += `<div class="ende" id="ende"><div class="ende-in"><div class="e-frage">${stern(e.titel)}</div>${(e.zeilen || []).map((z) => `<div class="e-zeile">${stern(z)}</div>`).join('')}</div></div>`;
    ereignisse.push(x);
  });
  const kamera = s.kamera || (letzteKamera && { pos: (letzteKamera.bis || letzteKamera).pos, ziel: (letzteKamera.bis || letzteKamera).ziel, fov: (letzteKamera.bis || letzteKamera).fov ?? letzteKamera.fov });
  if (!kamera) throw new Error('Szene 1 braucht eine "kamera"');
  letzteKamera = kamera;
  return { start: s.start, ende: s.ende, kamera };
});
if (!ereignisse.some((e) => e.typ === 'ende')) ebenen += '<div id="ende"></div>';

// ---------- Untertitel (Satzstücke, kursiv) ----------
const untertitel = [];
let caps = '';
let akt = [];
const chunks = [];
const flush = () => { if (akt.length) chunks.push(akt); akt = []; };
W.forEach((w) => {
  if (akt.length && (akt[0].szene !== w.szene || [...akt, w].reduce((a, x) => a + x.text.length + 1, 0) > (folge.untertitelZeichen ?? 34))) flush();
  akt.push(w);
  if (/[.!?…:;]$/.test(w.text) || (/,$/.test(w.text) && akt.length > 3)) flush();
});
flush();
chunks.forEach((c, ci) => {
  const sz = szenen[c[0].szene];
  if (sz.untertitel === false) return;
  const id = `cap${ci}`;
  const t0 = c[0].start;
  const naechste = chunks[ci + 1] ? chunks[ci + 1][0].start : GESAMT;
  const t1 = Math.min(naechste, c[c.length - 1].end + 0.6);
  caps += `<div class="cap" id="${id}" style="top:${sz.untertitelY ?? folge.untertitelY ?? 1250}px"><span>${c.map((w) => (w.key ? `<em>${esc(w.text)}</em>` : esc(w.text))).join(' ')}</span></div>`;
  untertitel.push({ id, t0: n(t0), t1: n(t1) });
});

// ---------- Schriften + Audio ----------
const FONTS = [
  ['Garamond', 'eb-garamond-latin-400-italic.woff2', 400, 'italic'],
  ['Garamond', 'eb-garamond-latin-500-normal.woff2', 500, 'normal'],
  ['Garamond', 'eb-garamond-latin-600-italic.woff2', 600, 'italic'],
  ['JetBrains Mono', 'jetbrains-mono-latin-500-normal.woff2', 500, 'normal'],
  ['JetBrains Mono', 'jetbrains-mono-latin-700-normal.woff2', 700, 'normal'],
  ['Inter', 'inter-latin-700-normal.woff2', 700, 'normal'],
];
let fontCss = '';
for (const [fam, datei, gew, stil] of FONTS) {
  fs.copyFileSync(path.join(SKILL, 'fonts', datei), path.join(projekt, 'assets', 'fonts', datei));
  fontCss += `@font-face{font-family:"${fam}";src:url("assets/fonts/${datei}") format("woff2");font-weight:${gew};font-style:${stil};}\n`;
}
const audio = [];
if (hatStimme) {
  fs.copyFileSync(voicePfad, path.join(projekt, 'assets', 'voice.mp3'));
  const d = Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', voicePfad], { encoding: 'utf8' }).trim());
  audio.push(`<audio id="voice" src="assets/voice.mp3" data-start="0" data-duration="${n(Math.min(d, GESAMT))}" data-track-index="8" data-volume="1"></audio>`);
}
const musik = ['musik.mp3', 'musik.wav'].map((d) => path.join(ordner, d)).find((p) => fs.existsSync(p));
if (musik && !stumm) {
  const ziel = path.join(projekt, 'assets', 'musik.mp3');
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-stream_loop', '-1', '-i', musik, '-t', String(GESAMT), '-af', `afade=t=out:st=${Math.max(0, GESAMT - 1)}:d=1`, ziel]);
  audio.push(`<audio id="musik" src="assets/musik.mp3" data-start="0" data-duration="${GESAMT}" data-track-index="6" data-volume="${folge.musikLautstaerke ?? 0.12}"></audio>`);
}

// ---------- Ausgabe ----------
const daten = { dauer: GESAMT, szenen: szenenDaten, ereignisse, untertitel, briefe: folge.briefe || {}, welt: folge.welt || {}, nachtStart: folge.nachtStart || 0 };
const css = fs.readFileSync(path.join(SKILL, 'lib', 'stil-3d.css'), 'utf8');
const js = fs.readFileSync(path.join(SKILL, 'lib', 'welt3d.js'), 'utf8');
const marke = folge.marke ? `<div class="marke">${esc(folge.marke)}</div>` : '';
const html = `<!doctype html>
<html lang="de" data-resolution="portrait">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=1080, height=1920" />
<title>${esc(folge.titel || 'Folge')}</title>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
<script src="${THREE_URL}"></script>
<style>
${fontCss}${css}
</style>
</head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-duration="${GESAMT}" data-width="1080" data-height="1920" data-fps="30">
<div id="welt" class="clip" data-start="0" data-duration="${GESAMT}" data-track-index="1"><canvas id="welt-canvas" width="1080" height="1920"></canvas><div class="vignette"></div></div>
<div id="hud" class="clip" data-start="0" data-duration="${GESAMT}" data-track-index="2" data-track-kind="graphics">
<div class="rotrand" id="rotrand"></div><div class="vfs" id="vfs"></div>${marke}
<div class="countdown" id="countdown"><div id="cd-label"></div><div class="cd-zeile"><span id="cd-zahl"></span><span id="cd-einheit"></span></div></div>
<div class="hud-wert" id="hud-wert"><div id="hud-label"></div><div id="hud-zahl"></div><div id="hud-unter"></div></div>
${ebenen}
<div class="font-laden"><span style="font-family:Garamond;font-style:italic">a</span><span style="font-family:Garamond;font-weight:500">a</span><span style="font-family:Garamond;font-weight:600;font-style:italic">a</span><span style="font-family:'JetBrains Mono'">a</span><span style="font-family:'JetBrains Mono';font-weight:700">a</span><span style="font-family:Inter;font-weight:700">a</span></div>
</div>
<div id="untertitel" class="clip" data-start="0" data-duration="${GESAMT}" data-track-index="4" data-track-kind="captions">${caps}</div>
${audio.join('\n')}
</div>
<script>
window.FOLGE = ${JSON.stringify(daten)};
${js}
</script>
</body>
</html>
`;
fs.writeFileSync(path.join(projekt, 'index.html'), html);
const slug = path.basename(ordner).toLowerCase().replace(/[^a-z0-9-]+/g, '-');
fs.writeFileSync(path.join(projekt, 'package.json'), JSON.stringify({ name: slug, private: true, type: 'module', scripts: { dev: `npx --yes hyperframes@${HF_VERSION} preview`, render: `npx --yes hyperframes@${HF_VERSION} render` } }, null, 2));
fs.writeFileSync(path.join(projekt, 'hyperframes.json'), JSON.stringify({ $schema: 'https://hyperframes.heygen.com/schema/hyperframes.json', paths: { blocks: 'compositions', components: 'compositions/components', assets: 'assets' }, media: { autoProxy: true } }, null, 2));
if (!fs.existsSync(path.join(projekt, 'meta.json'))) fs.writeFileSync(path.join(projekt, 'meta.json'), JSON.stringify({ id: slug, name: folge.titel || slug }, null, 2));
console.log(`✔ 3D-Projekt gebaut: ${projekt}`);
console.log(`  Dauer ${GESAMT}s · ${szenen.length} Szenen · ${untertitel.length} Untertitel · Stimme: ${hatStimme ? 'ja' : 'nein'}`);
console.log('  Szenen-Start:', szenen.map((s) => `${s.i + 1}@${s.start}s`).join('  '));
