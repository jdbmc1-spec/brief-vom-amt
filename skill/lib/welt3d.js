// Low-Poly-3D-Welt für „Der Brief vom Amt“ (Stil: Ich-Perspektive, warmes Licht, ruhige Kamerafahrten).
// Läuft im Browser (HyperFrames). Alles wird aus der Zeit t berechnet → jedes Bild ist reproduzierbar.
// Erwartet window.FOLGE (vom Build erzeugt) und die globalen THREE + gsap.
(function () {
  const F = window.FOLGE;
  const D = F.dauer;
  const C = (h) => new THREE.Color(h);
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, k) => a + (b - a) * k;
  const ease = { linear: (k) => k, sine: (k) => 0.5 - Math.cos(Math.PI * k) / 2, out: (k) => 1 - Math.pow(1 - k, 3), in: (k) => k * k * k };
  const smooth = (t, t0, d) => ease.sine(clamp((t - t0) / d));

  // ---------- Renderer ----------
  const canvas = document.getElementById('welt-canvas');
  const r = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
  r.setPixelRatio(1);
  r.setSize(1080, 1920, false);
  r.shadowMap.enabled = true;
  r.shadowMap.type = THREE.PCFSoftShadowMap;
  r.toneMapping = THREE.ACESFilmicToneMapping;
  r.toneMappingExposure = 1.05;
  r.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog('#e3ddd3', 6, 16);
  const cam = new THREE.PerspectiveCamera(48, 1080 / 1920, 0.02, 60);

  const mat = (farbe, o = {}) => new THREE.MeshStandardMaterial({ color: farbe, flatShading: true, roughness: 0.85, metalness: 0, ...o });
  function box(w, h, d, farbe, x, y, z, o = {}) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), typeof farbe === 'string' ? mat(farbe, o) : farbe);
    m.position.set(x, y, z);
    m.castShadow = o.schatten !== false; m.receiveShadow = true;
    scene.add(m);
    return m;
  }

  // ---------- Licht ----------
  const hemi = new THREE.HemisphereLight('#f4f1ea', '#5d554c', 0.9);
  scene.add(hemi);
  const sonne = new THREE.DirectionalLight('#ffe6c4', 2.4);
  sonne.position.set(-2.5, 4.5, -4);
  sonne.target.position.set(0, 0.7, -0.4);
  sonne.castShadow = true;
  sonne.shadow.mapSize.set(1024, 1024);
  Object.assign(sonne.shadow.camera, { left: -4, right: 4, top: 4, bottom: -4, near: 0.5, far: 15 });
  sonne.shadow.bias = -0.0008;
  scene.add(sonne, sonne.target);
  const lampe = new THREE.PointLight('#ffb867', 0, 6, 1.6);
  lampe.position.set(0.2, 1.75, -0.4);
  lampe.castShadow = true;
  scene.add(lampe);
  const tuerLicht = new THREE.PointLight('#ff3b30', 0, 4, 2);
  tuerLicht.position.set(1.9, 1.4, -2.1);
  scene.add(tuerLicht);

  // ---------- Raum (Wohnküche) ----------
  const W = F.welt || {};
  box(8, 0.1, 8, '#a98a6c', 0, -0.05, 0, { schatten: false });              // Holzboden
  for (let i = -3; i <= 3; i++) box(0.02, 0.002, 8, '#9a7b5e', i * 0.9 + 0.45, 0.001, 0, { schatten: false });
  box(8, 3, 0.1, W.wand || '#e8e2d8', 0, 1.5, -2.6, { schatten: false });    // Rückwand
  box(0.1, 3, 8, W.wand2 || '#dcd5ca', -3, 1.5, 0, { schatten: false });      // linke Wand
  box(0.1, 3, 8, W.wand2 || '#dcd5ca', 3.2, 1.5, 0, { schatten: false });     // rechte Wand
  box(8, 0.12, 0.06, '#d8c8b0', 0, 0.06, -2.54, { schatten: false });        // Fußleiste
  // Fenster links hinten (leuchtet je nach Tageszeit)
  const fensterGlas = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 1.3), new THREE.MeshBasicMaterial({ color: '#fff3d6' }));
  fensterGlas.position.set(-1.1, 1.65, -2.54); scene.add(fensterGlas);
  box(1.42, 0.07, 0.08, '#fbf7ef', -1.1, 2.33, -2.52); box(1.42, 0.07, 0.08, '#fbf7ef', -1.1, 0.97, -2.52);
  box(0.07, 1.42, 0.08, '#fbf7ef', -1.77, 1.65, -2.52); box(0.07, 1.42, 0.08, '#fbf7ef', -0.43, 1.65, -2.52);
  box(0.05, 1.3, 0.06, '#fbf7ef', -1.1, 1.65, -2.51); box(1.3, 0.05, 0.06, '#fbf7ef', -1.1, 1.65, -2.51);
  box(1.6, 0.05, 0.25, '#fbf7ef', -1.1, 0.93, -2.43);                         // Fensterbank
  // Pflanze auf der Fensterbank
  box(0.18, 0.18, 0.18, '#c96f4a', -0.65, 1.05, -2.42);
  for (let i = 0; i < 6; i++) {
    const b = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.38, 4), mat(i % 2 ? '#4f8a4b' : '#6aa35a'));
    b.position.set(-0.65 + Math.cos(i) * 0.05, 1.3, -2.42 + Math.sin(i) * 0.05); b.rotation.set(Math.sin(i * 2) * 0.5, i, Math.cos(i * 3) * 0.5);
    b.castShadow = true; scene.add(b);
  }
  // Tür rechts hinten mit Milchglas
  box(1.0, 2.1, 0.08, '#f4ede2', 1.9, 1.05, -2.5);
  box(1.12, 0.06, 0.1, '#d8ccb8', 1.9, 2.13, -2.49); box(0.06, 2.12, 0.1, '#d8ccb8', 1.37, 1.06, -2.49); box(0.06, 2.12, 0.1, '#d8ccb8', 2.43, 1.06, -2.49);
  const milchglas = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.75), new THREE.MeshBasicMaterial({ color: '#e9eef2' }));
  milchglas.position.set(1.9, 1.45, -2.45); scene.add(milchglas);
  const klinke = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 4), mat('#c9b26a', { metalness: 0.6, roughness: 0.4 }));
  klinke.position.set(1.55, 1.0, -2.43); scene.add(klinke);
  // Schatten einer Person hinter dem Milchglas (erscheint nur bei "klopfen")
  const silhouette = new THREE.Group();
  const sMat = new THREE.MeshBasicMaterial({ color: '#2b2f3a', transparent: true, opacity: 0 });
  const kopf = new THREE.Mesh(new THREE.CircleGeometry(0.085, 16), sMat); kopf.position.set(0, 0.2, 0);
  const sh = new THREE.Shape(); sh.moveTo(-0.22, -0.38); sh.lineTo(-0.2, -0.02); sh.quadraticCurveTo(-0.19, 0.08, -0.06, 0.1); sh.lineTo(0.06, 0.1); sh.quadraticCurveTo(0.19, 0.08, 0.2, -0.02); sh.lineTo(0.22, -0.38); sh.lineTo(-0.22, -0.38);
  const rumpf = new THREE.Mesh(new THREE.ShapeGeometry(sh), sMat); rumpf.position.set(0, 0, 0);
  silhouette.add(kopf, rumpf); silhouette.position.set(1.9, 1.45, -2.448); scene.add(silhouette);
  // Hängelampe über dem Tisch
  const kabel = box(0.01, 0.95, 0.01, '#333', 0.2, 2.5, -0.4, { schatten: false });
  const schirm = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.2, 8, 1, true), mat('#2f3b36', { side: THREE.DoubleSide }));
  schirm.position.set(0.2, 1.95, -0.4); scene.add(schirm);
  const birne = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 6), new THREE.MeshBasicMaterial({ color: '#7a6a55' }));
  birne.position.set(0.2, 1.86, -0.4); scene.add(birne);
  // Küchenzeile rechts
  box(0.65, 0.9, 2.2, '#dfe6e3', 2.85, 0.45, 0.2); box(0.7, 0.05, 2.25, '#8c7b6a', 2.85, 0.92, 0.2);
  box(0.4, 0.7, 2.2, '#dfe6e3', 3.0, 2.0, 0.2);
  // Tisch + Stühle
  const tischY = 0.75;
  box(1.6, 0.06, 1.0, '#6f5a4a', 0, tischY - 0.03, -0.4);
  for (const [x, z] of [[-0.72, -0.82], [0.72, -0.82], [-0.72, 0.02], [0.72, 0.02]]) box(0.06, tischY - 0.06, 0.06, '#7d5435', x, (tischY - 0.06) / 2, z);
  box(0.5, 0.05, 0.5, '#7d5435', 0, 0.45, 0.45); box(0.5, 0.6, 0.05, '#7d5435', 0, 0.78, 0.7);
  box(0.5, 0.05, 0.5, '#7d5435', -1.1, 0.45, -0.4); box(0.05, 0.6, 0.5, '#7d5435', -1.36, 0.78, -0.4);
  // Tasse + Stift + Handy
  const tasse = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.04, 0.1, 10), mat('#e8eef0'));
  tasse.position.set(0.48, tischY + 0.05, -0.62); tasse.castShadow = true; scene.add(tasse);
  const kaffee = new THREE.Mesh(new THREE.CircleGeometry(0.038, 10), mat('#4a2e1d')); kaffee.rotation.x = -Math.PI / 2; kaffee.position.set(0.48, tischY + 0.096, -0.62); scene.add(kaffee);
  const stift = box(0.012, 0.012, 0.16, '#2a4fbf', -0.36, tischY + 0.007, -0.3); stift.rotation.y = 0.6;
  const handy = box(0.08, 0.009, 0.16, '#1d1f24', 0.5, tischY + 0.005, -0.2); handy.rotation.y = -0.3;

  // ---------- Briefe (Canvas-Texturen) ----------
  const BREIT = 1024, HOCH = 1448;
  function zeichneBrief(ctx, b, marks) {
    ctx.fillStyle = b.papier || '#fbf8f1'; ctx.fillRect(0, 0, BREIT, HOCH);
    ctx.fillStyle = '#1f2330';
    const L = 86;
    // Kopf: Absender + Logo (einfaches erfundenes Zeichen)
    ctx.fillStyle = b.logoFarbe || '#2f6f5e';
    ctx.beginPath(); ctx.arc(L + 34, 120, 34, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = '700 40px Inter'; ctx.textAlign = 'center'; ctx.fillText(b.logoText || 'M', L + 34, 134); ctx.textAlign = 'left';
    ctx.fillStyle = '#1f2330'; ctx.font = '700 44px Inter'; ctx.fillText(b.absender, L + 90, 118);
    ctx.font = '500 24px "JetBrains Mono"'; ctx.fillStyle = '#6b6f7a'; ctx.fillText(b.absenderZeile || '', L + 92, 154);
    ctx.fillRect(L, 196, BREIT - 2 * L, 3);
    // Anschrift + Datum
    ctx.fillStyle = '#c9c4ba';
    [300, 250, 330].forEach((w, i) => ctx.fillRect(L, 250 + i * 34, w, 14));
    ctx.fillStyle = '#6b6f7a'; ctx.font = '500 24px "JetBrains Mono"'; ctx.textAlign = 'right'; ctx.fillText(b.datum || '', BREIT - L, 262); ctx.textAlign = 'left';
    // Betreff
    ctx.fillStyle = '#1f2330'; ctx.font = '700 46px Inter'; ctx.fillText(b.betreff || '', L, 450);
    // Zeilen mit Textmarker
    let y = 540;
    (b.zeilen || []).forEach((z, i) => {
      const m = marks[i] || 0;
      const fs = z.gross ? 46 : 36;
      if (z.linie) { ctx.fillStyle = '#1f2330'; ctx.fillRect(L, y - fs - 10, BREIT - 2 * L, 3); }
      if (m > 0) {
        ctx.fillStyle = z.farbe === 'rot' ? 'rgba(255,90,80,.55)' : 'rgba(255,214,10,.62)';
        ctx.fillRect(L - 10, y - fs + 2, (BREIT - 2 * L + 20) * m, fs + 14);
      }
      ctx.fillStyle = '#1f2330'; ctx.font = `${z.fett ? 700 : 500} ${fs}px Inter`;
      ctx.fillText(z.text, L, y);
      if (z.betrag) { ctx.textAlign = 'right'; ctx.fillText(z.betrag, BREIT - L, y); ctx.textAlign = 'left'; }
      y += z.abstand || fs + 30;
    });
    // Platzhalter-Text
    ctx.fillStyle = '#d6d1c7';
    for (let k = 0; k < (b.fueller ?? 4); k++) ctx.fillRect(L, y + 10 + k * 40, [820, 760, 800, 520][k % 4], 14);
    // Unterschrift
    ctx.strokeStyle = '#3b4a8a'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(L, HOCH - 170);
    for (let k = 0; k < 8; k++) ctx.quadraticCurveTo(L + 30 + k * 40, HOCH - 210 + (k % 2) * 60, L + 50 + k * 40, HOCH - 170);
    ctx.stroke();
    // Stempel
    if (b.stempel) {
      const s = b.stempel;
      ctx.save(); ctx.translate(s.x ?? 640, s.y ?? 330); ctx.rotate(((s.rot ?? -12) * Math.PI) / 180);
      ctx.strokeStyle = ctx.fillStyle = s.farbe || 'rgba(214,32,40,.88)';
      ctx.font = `700 ${s.groesse || 96}px Inter`; ctx.textAlign = 'center';
      const w = ctx.measureText(s.text).width + 60, h = (s.groesse || 96) + 40;
      ctx.lineWidth = 10; ctx.strokeRect(-w / 2, -h / 2 - (s.groesse || 96) * 0.36, w, h);
      ctx.lineWidth = 3; ctx.strokeRect(-w / 2 + 14, -h / 2 + 14 - (s.groesse || 96) * 0.36, w - 28, h - 28);
      ctx.fillText(s.text, 0, 0); ctx.restore();
    }
  }
  const briefe = {};
  for (const [name, b] of Object.entries(F.briefe || {})) {
    const cv = document.createElement('canvas'); cv.width = BREIT; cv.height = HOCH;
    const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
    const papier = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.95 });
    const m = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.003, 0.594), [mat('#f3efe6'), mat('#f3efe6'), papier, mat('#f3efe6'), mat('#f3efe6'), mat('#f3efe6')]);
    m.castShadow = true; m.receiveShadow = true;
    const p = b.pos || [0, 0, -0.4];
    m.position.set(p[0], tischY + 0.004 + (b.lage || 0) * 0.004, p[2]); m.rotation.y = b.rotY || 0;
    scene.add(m);
    briefe[name] = { b, cv, ctx: cv.getContext('2d'), tex, m, schluessel: '' };
  }
  // Umschläge: gelber Brief (Gericht) + Stapel weißer Briefe
  function umschlagMesh(farbe) {
    const g = new THREE.Group();
    const k = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.012, 0.23), mat(farbe, { roughness: 0.9 }));
    k.castShadow = true; k.receiveShadow = true; g.add(k);
    const fenster = new THREE.Mesh(new THREE.PlaneGeometry(0.14, 0.05), new THREE.MeshStandardMaterial({ color: '#f7f4ec' }));
    fenster.rotation.x = -Math.PI / 2; fenster.position.set(-0.06, 0.0065, 0.03); g.add(fenster);
    const klappe = new THREE.Mesh(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-0.17, 0.007, -0.115), new THREE.Vector3(0.17, 0.007, -0.115), new THREE.Vector3(0, 0.007, 0.0)]), mat(farbe === '#f5c518' ? '#dcaa0c' : '#e2ddd2', { side: THREE.DoubleSide }));
    g.add(klappe);
    scene.add(g);
    return g;
  }
  const gelb = umschlagMesh('#f5c518');
  gelb.visible = false;
  const stapel = [];
  for (let i = 0; i < 9; i++) {
    const u = umschlagMesh(i % 3 === 2 ? '#e9e4d8' : '#f6f3ec');
    u.visible = false;
    u.userData.ziel = [-0.55 + ((i * 37) % 5) * 0.05 + (i % 2) * 0.02, tischY + 0.008 + i * 0.013, -0.62 + ((i * 53) % 7) * 0.025];
    u.userData.rot = ((i * 47) % 30 - 15) / 30;
    stapel.push(u);
  }

  // ---------- Ereignisse ----------
  const E = F.ereignisse;
  const ev = (typ) => E.filter((e) => e.typ === typ);
  // Tageszeit: 0 = Tag, 1 = Nacht; „tage“-Ereignisse lassen Tage im Zeitraffer vergehen
  function tageszeit(t) {
    let nacht = F.nachtStart || 0;
    for (const e of ev('tage')) {
      if (t >= e.t && t < e.t + e.dauer) {
        const tage = (e.bis - e.von) * ((t - e.t) / e.dauer);
        nacht = 0.5 - 0.5 * Math.cos(tage * Math.PI * 2);
      }
    }
    for (const e of ev('nacht')) if (t >= e.t) nacht = lerp(nacht, e.wert, smooth(t, e.t, e.dauer || 1));
    return nacht;
  }
  function kamera(t) {
    const sz = F.szenen.find((s) => t >= s.start && t < s.ende) || F.szenen[F.szenen.length - 1];
    const k = sz.kamera;
    const p = clamp((t - sz.start) / Math.max(0.01, sz.ende - sz.start));
    const e = ease[k.ease || 'sine'](p);
    const v = (a, b) => [lerp(a[0], b[0], e), lerp(a[1], b[1], e), lerp(a[2], b[2], e)];
    const bis = k.bis || {};
    const pos = v(k.pos, bis.pos || k.pos), ziel = v(k.ziel, bis.ziel || k.ziel);
    // Wackeln (Klopfen, Schock)
    for (const w of ev('wackeln').concat(ev('klopfen'))) {
      const d = t - w.t;
      if (d >= 0 && d < 0.6) { const a = (1 - d / 0.6) * (w.staerke || 0.012); pos[0] += Math.sin(d * 70) * a; pos[1] += Math.cos(d * 55) * a; }
    }
    // leichtes Atmen der Handkamera
    pos[1] += Math.sin(t * 1.3) * 0.004; pos[0] += Math.sin(t * 0.9) * 0.003;
    cam.position.set(...pos); cam.lookAt(...ziel);
    cam.fov = lerp(k.fov || 48, bis.fov || k.fov || 48, e); cam.updateProjectionMatrix();
  }

  // ---------- HTML-Ebene (HUD, Untertitel, Titel) ----------
  const $ = (id) => document.getElementById(id);
  const zahlDE = (v, nk = 0) => v.toLocaleString('de-DE', { minimumFractionDigits: nk, maximumFractionDigits: nk });
  function hud(t) {
    // Messwert-Block links (Label klein, Wert groß in Mono, Zeile darunter)
    const hs = ev('hud').filter((e) => t >= e.t);
    const h = hs[hs.length - 1];
    const box = $('hud-wert');
    if (h && !h.aus) {
      box.style.opacity = 1;
      $('hud-label').textContent = h.label || '';
      let wert = h.wert || '';
      const tg = ev('tage').find((e) => t >= e.t && t < e.t + e.dauer + 0.8 && e.t >= h.t - 0.01);
      if (tg) wert = `Tag ${Math.min(tg.bis, Math.floor(lerp(tg.von, tg.bis, clamp((t - tg.t) / tg.dauer))))}`;
      $('hud-zahl').textContent = wert;
      $('hud-zahl').style.color = h.farbe || '#ffffff';
      $('hud-unter').textContent = h.unter || '';
      const neu = clamp((t - h.t) / 0.25);
      box.style.transform = `translateY(${(1 - neu) * 14}px)`;
    } else box.style.opacity = 0;
    // Countdown oben (rot, groß): „WIDERSPRUCH MÖGLICH NOCH“ 14 → 0
    const cd = ev('countdown').filter((e) => t >= e.t && (e.weg == null || t < e.weg)).pop();
    const cdb = $('countdown');
    if (cd) {
      cdb.style.opacity = 1;
      const k = clamp((t - cd.t) / cd.dauer);
      const v = lerp(cd.von, cd.bis, k);
      $('cd-label').textContent = cd.label;
      $('cd-zahl').textContent = cd.format === 'uhr'
        ? (() => { const s = Math.max(0, v * 86400); const tg = Math.floor(s / 86400), hh = Math.floor((s % 86400) / 3600), mm = Math.floor((s % 3600) / 60), ss = Math.floor(s % 60); return `${tg} T ${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`; })()
        : `${Math.ceil(v - 1e-6)}`;
      $('cd-einheit').textContent = cd.einheit || '';
      cdb.classList.toggle('null', k >= 1);
    } else cdb.style.opacity = 0;
    // Hook-Titel
    for (const ti of ev('titel')) {
      const el = $(ti.id);
      const sichtbar = t >= ti.t && (ti.weg == null || t < ti.weg);
      el.style.opacity = sichtbar ? (ti.t === 0 ? 1 : clamp((t - ti.t) / 0.3)) * (ti.weg != null ? clamp((ti.weg - t) / 0.3) : 1) : 0;
    }
    // Liste (Schritte) unten links
    for (const li of ev('liste')) {
      const el = $(li.id);
      const sichtbar = t >= li.t && (li.weg == null || t < li.weg);
      el.style.opacity = sichtbar ? clamp((t - li.t) / 0.3) * (li.weg != null ? clamp((li.weg - t) / 0.3) : 1) : 0;
      li.punkte.forEach((p, i) => {
        const z = $(`${li.id}-p${i}`);
        const an = t >= p.t;
        z.style.opacity = an ? clamp((t - p.t) / 0.25) : 0;
        const naechster = li.punkte[i + 1];
        z.classList.toggle('aktiv', an && (!naechster || t < naechster.t));
      });
    }
    // Untertitel: ein Satzstück, kursive Serifenschrift
    for (const c of F.untertitel) {
      const el = $(c.id);
      el.style.opacity = t >= c.t0 && t < c.t1 ? clamp((t - c.t0) / 0.12) : 0;
    }
    // Abspann
    const ende = ev('ende')[0];
    if (ende) $('ende').style.opacity = t >= ende.t ? clamp((t - ende.t) / 0.5) : 0;
    $('vfs').style.transform = `scaleX(${t / D})`;
  }

  // ---------- Bild für Zeitpunkt t ----------
  function bild(t) {
    // Briefe: Markierungen
    for (const [name, br] of Object.entries(briefe)) {
      const marks = (br.b.zeilen || []).map((z, i) => {
        const m = ev('mark').find((e) => e.brief === name && e.zeile === i);
        return z.markiert ? 1 : m ? ease.out(clamp((t - m.t) / 0.5)) : 0;
      });
      const key = marks.map((m) => m.toFixed(2)).join();
      if (key !== br.schluessel) { zeichneBrief(br.ctx, br.b, marks); br.tex.needsUpdate = true; br.schluessel = key; }
      // erscheinen (rutscht aus dem Umschlag)
      const z = ev('zeige').find((e) => e.objekt === name);
      if (z) {
        const k = ease.out(clamp((t - z.t) / 0.8));
        br.m.visible = t >= z.t;
        const p = br.b.pos;
        br.m.position.set(p[0] + (1 - k) * 0.05, tischY + 0.032 + (1 - k) * 0.03, p[2] - (1 - k) * 0.25);
      }
    }
    // gelber Umschlag fällt auf den Tisch
    const zg = ev('zeige').find((e) => e.objekt === 'umschlag');
    if (zg) {
      gelb.visible = t >= zg.t;
      const k = clamp((t - zg.t) / 0.55);
      const fall = k < 1 ? ease.in(k) : 1;
      const p = zg.pos || [0.05, 0, -0.35];
      const auf = 0.5 + Math.sin(Math.min(1, (t - zg.t - 0.55) / 0.25) * Math.PI) * 0.01 * (t > zg.t + 0.55 ? 1 : 0);
      gelb.position.set(p[0], lerp(tischY + 1.2, tischY + 0.016 + (zg.lage || 0) * 0.004, fall) + (auf - 0.5), p[2]);
      gelb.rotation.set(lerp(0.9, 0, fall), lerp(1.4, zg.rotY ?? 0.15, fall), lerp(0.5, 0, fall));
    }
    // Stapel wächst im Zeitraffer
    const st = ev('stapel')[0];
    stapel.forEach((u, i) => {
      if (!st) return;
      const ti = st.t + (st.dauer / stapel.length) * i;
      u.visible = t >= ti && i < (st.anzahl || 9);
      const k = ease.out(clamp((t - ti) / 0.3));
      const z = u.userData.ziel;
      u.position.set(z[0], z[1] + (1 - k) * 0.4, z[2]); u.rotation.y = u.userData.rot + (1 - k) * 0.8;
    });
    // Klopfen: Schatten hinter der Tür, rotes Licht
    const kl = ev('klopfen')[0];
    const sk = kl ? clamp((t - kl.t + 0.4) / 0.6) : 0;
    sMat.opacity = sk * 0.55;
    silhouette.position.x = 1.9 + Math.sin(t * 0.8) * 0.01;
    // Licht + Tageszeit
    const n = tageszeit(t);
    sonne.intensity = lerp(2.6, 0.05, n);
    sonne.color.copy(C('#ffe6c4').lerp(C('#8fa6ff'), n));
    hemi.intensity = lerp(0.9, 0.18, n);
    hemi.color.copy(C('#f4f1ea').lerp(C('#4a5a8a'), n));
    lampe.intensity = lerp(0, 3.2, clamp(n * 1.4));
    birne.material.color.copy(C('#7a6a55').lerp(C('#fff1c9'), clamp(n * 1.4)));
    fensterGlas.material.color.copy(C('#fff3d6').lerp(C('#1c2550'), n));
    scene.fog.color.copy(C('#e3ddd3').lerp(C('#1b1e2c'), n));
    scene.background = scene.fog.color;
    const alarm = ev('alarm').filter((e) => t >= e.t).pop();
    tuerLicht.intensity = alarm ? (0.6 + 0.6 * Math.sin((t - alarm.t) * 6)) * 2.2 : 0;
    milchglas.material.color.copy(C('#e9eef2').lerp(C('#3a4766'), n * 0.8));
    kamera(t);
    r.render(scene, cam);
    hud(t);
  }

  const tl = gsap.timeline({ paused: true });
  const z = { t: 0 };
  tl.to(z, { t: D, duration: D, ease: 'none', onUpdate: () => bild(tl.time()) }, 0);
  window.__timelines = window.__timelines || {};
  window.__timelines.main = tl;
  const start = () => { for (const br of Object.values(briefe)) br.schluessel = ''; tl.seek(0); bild(0); };
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(start); else start();
  start();
})();
