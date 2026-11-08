/* CRONACHE DEL TEMPO · four journeys with the EPOCH, told as illustrated, playable 2D episodes (same engine as web/cutscenes.js):
 *  ❄ LA GRANDE TARTARIA · 1780      — a legend of the old maps: star forts, copper domes, towers that drink the aurora
 *  𓂀 ANTICO EGITTO · 2560 a.C.       — Giza while the Great Pyramid rises; aim the shaft at the stars of Sah (Orion)
 *  🤖 NEO-CYBERCITY · 2240           — a city run by robots; wake ORIONE-7, who kept the Custodians' signal for centuries
 *  ⚠ OGGI · LA GUERRA ALL'IA         — the night the network went dark; choose to listen instead of fight, and meet ARIA's origin
 * Each episode = 3 scenes (look around, a puzzle, an ending) and a keepsake. Unlocked with the EPOCH (chapter VII) or in free mode;
 * played from 📜 Missioni → ⏳ Cronache del tempo. Progress in localStorage 'kageChron'. */
(function () {
'use strict';
const K = window.KageCutKit, SC = window.KageCutScenes; if (!K || !SC) return;
const { rr, glow, glyph, person, inR, VW, VH } = K, PI = Math.PI, TAU = PI * 2;
const LS = { get: (k, d) => { try { const v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) { } } };
const seen = (s, k, R, lines) => { s.seen = s.seen || {}; s.seen[k] = 1; R.say(lines); };
const nSeen = s => Object.keys(s.seen || {}).length;
const btn = (c, x, y, w, h, label, on, col) => { c.fillStyle = on ? 'rgba(255,210,120,.3)' : 'rgba(6,10,20,.78)'; rr(c, x, y, w, h, 18); c.fill(); c.strokeStyle = col || '#ffd27a'; c.lineWidth = 3; c.stroke(); c.fillStyle = '#fff2c8'; c.font = 'bold 28px system-ui'; c.textAlign = 'center'; c.fillText(label, x + w / 2, y + h / 2 + 10); c.textAlign = 'left'; };
const sky = (c, stops) => { const g = c.createLinearGradient(0, 0, 0, VH); stops.forEach((s, i) => g.addColorStop(i / (stops.length - 1), s)); c.fillStyle = g; c.fillRect(0, 0, VW, VH); };
const stars = (c, n, h, a) => { for (let i = 0; i < n; i++) { c.fillStyle = 'rgba(255,255,255,' + (a || 1) * (0.3 + 0.7 * ((i * 37) % 10) / 10) + ')'; c.fillRect((i * 131) % VW, (i * 71) % h, 2, 2); } };
const wrap = (c, txt, x, y, w, lh) => { const W = txt.split(' '), L = []; let cur = ''; for (const w2 of W) { const t2 = cur ? cur + ' ' + w2 : w2; if (c.measureText(t2).width > w && cur) { L.push(cur); cur = w2; } else cur = t2; } L.push(cur); L.forEach((l, i) => c.fillText(l, x, y - (L.length - 1) * lh + i * lh)); };
const hint = (c, txt) => { c.fillStyle = 'rgba(255,255,255,.55)'; c.font = 'italic 22px Georgia,serif'; c.textAlign = 'center'; c.fillText(txt, VW / 2, 760); c.textAlign = 'left'; };

/* ================= ❄ LA GRANDE TARTARIA ================= */
// a domed city on the steppe: star-shaped walls, copper domes topped by spheres and spires
function tartCity(c, t, lit) {
  // star fort
  c.fillStyle = '#5b5148'; c.beginPath(); for (let k = 0; k < 16; k++) { const a = k / 16 * TAU, r = k % 2 ? 300 : 380; c.lineTo(800 + Math.cos(a) * r * 1.6, 640 + Math.sin(a) * r * 0.22); } c.fill();
  c.fillStyle = '#7a6d60'; c.fillRect(260, 560, 1080, 90);
  // domes + towers
  for (const [x, w, h] of [[420, 120, 170], [600, 170, 250], [800, 240, 330], [1010, 170, 250], [1180, 120, 170]]) {
    c.fillStyle = '#e8e0d0'; c.fillRect(x - w / 2, 560 - h * 0.45, w, h * 0.45);
    for (let k = 0; k < 5; k++) { c.fillStyle = 'rgba(40,30,20,.5)'; rr(c, x - w / 2 + 10 + k * (w - 20) / 5, 560 - h * 0.36, (w - 20) / 5 - 8, h * 0.22, 8); c.fill(); }
    const dg = c.createLinearGradient(x - w / 2, 0, x + w / 2, 0); dg.addColorStop(0, '#2f8a7a'); dg.addColorStop(0.5, '#6fd0b8'); dg.addColorStop(1, '#245f56'); c.fillStyle = dg; c.beginPath(); c.ellipse(x, 560 - h * 0.45, w / 2, h * 0.38, 0, PI, 0); c.fill();
    c.strokeStyle = '#c8a050'; c.lineWidth = 4; c.beginPath(); c.moveTo(x, 560 - h * 0.83); c.lineTo(x, 560 - h * 1.05); c.stroke(); c.fillStyle = '#d8a43a'; c.beginPath(); c.arc(x, 560 - h * 0.86, 10, 0, TAU); c.fill();
    if (lit) { glow(c, x, 560 - h * 1.05, 40 + 10 * Math.sin(t * 4 + x), 'rgba(140,255,220,.8)'); for (let k = 0; k < 4; k++) { c.fillStyle = 'rgba(255,230,150,.75)'; rr(c, x - w / 2 + 10 + k * (w - 20) / 4, 560 - h * 0.36, (w - 20) / 4 - 10, h * 0.2, 8); c.fill(); } }
  }
}
function aurora(c, t, k) { for (let j = 0; j < 4; j++) { c.strokeStyle = 'rgba(' + (j % 2 ? '120,255,190' : '160,120,255') + ',' + (0.1 + 0.05 * Math.sin(t + j)) * (k || 1) + ')'; c.lineWidth = 50; c.beginPath(); for (let x = 0; x <= VW; x += 40) c.lineTo(x, 110 + j * 40 + Math.sin(x * 0.005 + t * 0.5 + j) * 50); c.stroke(); } }
SC.tt_arrivo = { title: 'LA GRANDE TARTARIA · 1780', chron: 1,
  intro: ['L’EPOCH si apre su una pianura bianca. Fa un freddo che taglia.', 'In fondo, una città che nessun libro di storia mi ha mai mostrato: cupole verdi, guglie, mura a forma di stella.', 'Tocca ciò che ti incuriosisce.'],
  init: s => { },
  tap(p, s, R) {
    if (inR(p, 560, 220, 480, 340)) return seen(s, 'cupole', R, ['Le cupole sono di rame. In cima a ogni guglia, una sfera.', 'Le sfere ronzano piano, come un frigorifero di notte. Non vedo cavi.']);
    if (inR(p, 1260, 600, 220, 220)) return seen(s, 'mappa', R, ['Un mercante ha una mappa: «TARTARIA MAGNA» scritto sopra metà del mondo.', 'MERCANTE: Le guglie bevono la luce del nord, straniero. Così le nostre case sono calde.', 'È una leggenda delle mappe antiche, questa? O sono io dentro la leggenda?']);
    if (inR(p, 80, 600, 260, 240)) return seen(s, 'pietra', R, ['Una pietra di confine. Ci sono incisi dei segni…', 'Sono glifi dei Custodi. Sono arrivati anche qui.']);
    R.say(['La neve scricchiola. Il ronzio delle sfere riempie l’aria.']); },
  done: s => nSeen(s) >= 2, outro: ['MERCANTE: Ma stanotte le guglie tacciono. La luce del nord non scende più. Tu sai leggere i segni, vero?'],
  draw(c, t, s) { sky(c, ['#0a1430', '#24305e', '#7a86b0', '#dfe6f2']); stars(c, 60, 300, 0.7); aurora(c, t, 0.6);
    c.fillStyle = '#eef2f8'; c.fillRect(0, 640, VW, 260); tartCity(c, t, 0);
    // the boundary stone with a glyph, the merchant with his map, the EPOCH
    c.fillStyle = '#6a6460'; rr(c, 150, 640, 120, 170, 14); c.fill(); glyph(c, 24, 210, 715, 60, '#7fffd0');
    person(c, 1370, 820, 1.1, '#6a2a2a', '#3a2a1a', (c2, x, y, k) => { c2.fillStyle = '#efe0b8'; c2.fillRect(x + 20 * k, y - 120 * k, 90 * k, 60 * k); c2.strokeStyle = '#8a6a3a'; c2.lineWidth = 2; c2.strokeRect(x + 20 * k, y - 120 * k, 90 * k, 60 * k); });
    glow(c, 1500, 700, 160, 'rgba(255,170,60,.25)'); c.fillStyle = '#26303a'; rr(c, 1460, 560, 100, 240, 20); c.fill();
    if (!nSeen(s)) hint(c, 'tocca le cupole, il mercante, la pietra'); } };
SC.tt_torri = { title: 'LE GUGLIE', chron: 1,
  intro: ['Tre guglie maestre. Ognuna ha una ruota di rame con cinque tacche.', 'L’aurora sopra la città ha tre fasce: forse le guglie vanno accordate come la luce.', 'Tocca una guglia per girare la sua ruota.'],
  init: s => { s.v = [1, 1, 1]; s.goal = [3, 5, 2]; },
  tap(p, s, R) { if (s.ok) return; for (let i = 0; i < 3; i++) if (inR(p, 380 + i * 360, 260, 200, 520)) { s.v[i] = s.v[i] % 5 + 1; R.blip(300 + s.v[i] * 120, 320 + s.v[i] * 120, 0.15, 0.08, 'triangle');
      if (s.v.every((v, k) => v === s.goal[k])) { s.ok = 1; R.blip(400, 1600, 1, 0.14, 'triangle'); R.say(['Le sfere si accendono una dopo l’altra.', 'La luce del nord scende lungo le guglie, nelle case, nei forni. La città respira.']); } return; } },
  done: s => s.ok, outro: ['MERCANTE: Che il cielo ti protegga, viandante. Chi sei, davvero?'],
  draw(c, t, s) { sky(c, ['#060a1e', '#141c44', '#2a3460']); stars(c, 90, 500);
    // the aurora's three bands = the target
    s.goal.forEach((gv, i) => { c.fillStyle = ['rgba(120,255,190,', 'rgba(160,120,255,', 'rgba(255,140,200,'][i] + (0.25 + 0.1 * Math.sin(t * 2 + i)) + ')'; const h = gv * 34; c.beginPath(); for (let x = 300 + i * 360; x <= 680 + i * 360; x += 20) c.lineTo(x, 200 - h + Math.sin(x * 0.03 + t) * 8); for (let x = 680 + i * 360; x >= 300 + i * 360; x -= 20) c.lineTo(x, 200 + Math.sin(x * 0.03 + t) * 8); c.fill(); });
    c.fillStyle = '#0c0f1c'; c.fillRect(0, 780, VW, 120);
    for (let i = 0; i < 3; i++) { const x = 480 + i * 360, ok = s.v[i] === s.goal[i];
      c.fillStyle = '#3a3440'; c.beginPath(); c.moveTo(x - 60, 780); c.lineTo(x - 14, 300); c.lineTo(x + 14, 300); c.lineTo(x + 60, 780); c.fill();
      c.fillStyle = '#d8a43a'; c.beginPath(); c.arc(x, 290, 22, 0, TAU); c.fill(); if (s.ok || ok) glow(c, x, 290, 90, 'rgba(140,255,220,' + (s.ok ? 0.8 : 0.35) + ')');
      // the copper wheel with 5 notches
      c.save(); c.translate(x, 600); c.strokeStyle = '#c87a3a'; c.lineWidth = 10; c.beginPath(); c.arc(0, 0, 70, 0, TAU); c.stroke(); for (let k = 0; k < 5; k++) { const a = -PI / 2 + k / 5 * TAU; c.fillStyle = k < s.v[i] ? '#ffd27a' : '#4a3a30'; c.beginPath(); c.arc(Math.cos(a) * 70, Math.sin(a) * 70, 14, 0, TAU); c.fill(); } c.fillStyle = '#fff2c8'; c.font = 'bold 44px Georgia,serif'; c.textAlign = 'center'; c.fillText(s.v[i], 0, 16); c.restore(); }
    c.textAlign = 'left'; if (!s.ok) hint(c, 'accorda ogni guglia all’altezza della sua fascia d’aurora'); } };
SC.tt_fine = { title: 'UN SECOLO DOPO', chron: 1, reward: '🔶 Sfera di rame',
  intro: ['Rimetto l’EPOCH su un salto breve: cento anni avanti.', 'La città è sepolta. Fango fino ai primi piani, le cupole spoglie.', 'Le mappe nuove non la nominano più. Come se qualcuno avesse voluto dimenticarla.'],
  init: s => { },
  tap(p, s, R) { if (!s.got && inR(p, 700, 360, 200, 200)) { s.got = 1; R.blip(660, 990, 0.6, 0.1, 'triangle'); R.say(['Nel fango c’è una delle sfere di rame. È ancora tiepida.', 'La porto con me. Che sia storia o leggenda, questa sfera è vera.']); } },
  done: s => s.got, outro: ['✦ CRONACA COMPLETATA · LA GRANDE TARTARIA', 'Ricordo ottenuto: 🔶 Sfera di rame'],
  draw(c, t, s) { sky(c, ['#5a6070', '#8a8e96', '#b8b2a4']); c.fillStyle = '#5c4a38'; c.fillRect(0, 520, VW, 380);
    c.save(); c.beginPath(); c.rect(0, 0, VW, 560); c.clip(); c.globalAlpha = 0.85; tartCity(c, t, 0); c.restore(); c.fillStyle = '#5c4a38'; c.fillRect(0, 540, VW, 360);
    for (let i = 0; i < 12; i++) { c.fillStyle = 'rgba(40,30,20,.35)'; c.beginPath(); c.ellipse((i * 173) % VW, 600 + (i * 37) % 200, 120, 18, 0, 0, TAU); c.fill(); }
    if (!s.got) { glow(c, 800, 460, 120, 'rgba(255,190,90,' + (0.35 + 0.15 * Math.sin(t * 3)) + ')'); c.fillStyle = '#c87a3a'; c.beginPath(); c.arc(800, 470, 28, 0, TAU); c.fill(); hint(c, 'qualcosa brilla nel fango'); } } };

/* ================= 𓂀 ANTICO EGITTO ================= */
function pyramid(c, x, y, w, h, done, t) { c.fillStyle = '#d8b878'; c.beginPath(); c.moveTo(x - w / 2, y); c.lineTo(x, y - h * done); c.lineTo(x + w / 2, y); c.fill(); c.fillStyle = '#b89858'; c.beginPath(); c.moveTo(x, y - h * done); c.lineTo(x + w / 2, y); c.lineTo(x + w * 0.18, y); c.fill();
  c.strokeStyle = 'rgba(120,90,40,.35)'; c.lineWidth = 2; for (let k = 1; k < 14; k++) { const yy = y - k * h * done / 14, hw = w / 2 * (1 - k / 14); c.beginPath(); c.moveTo(x - hw, yy); c.lineTo(x + hw, yy); c.stroke(); } }
SC.eg_giza = { title: 'ANTICO EGITTO · 2560 a.C.', chron: 2,
  intro: ['Caldo. Luce bianca. Sabbia nelle scarpe.', 'Davanti a me una piramide ancora a metà: rampe di mattoni crudi, migliaia di operai, canti in coro.', 'Tocca ciò che ti incuriosisce.'],
  init: s => { },
  tap(p, s, R) {
    if (inR(p, 1180, 560, 220, 280)) return seen(s, 'scriba', R, ['SCRIBA: Sei arrivato nella cassa di luce. Gli anziani dicevano che saresti venuto.', 'SCRIBA: Il re vuole che il suo spirito salga a Sah, la stella del cacciatore. Ma il condotto non è ancora puntato.', 'Sah… gli egizi chiamavano così Orione.']);
    if (inR(p, 400, 220, 760, 420)) return seen(s, 'piramide', R, ['La Grande Piramide di Cheope. Per quasi quattromila anni sarà l’edificio più alto del mondo.', 'Le pietre arrivano dal fiume su slitte, bagnando la sabbia per farle scorrere.']);
    if (inR(p, 120, 600, 220, 200)) return seen(s, 'blocco', R, ['Su un blocco di calcare qualcuno ha inciso un segno che conosco.', 'Un glifo dei Custodi. In mezzo ai geroglifici.']);
    R.say(['Il Nilo luccica dietro le palme.']); },
  done: s => nSeen(s) >= 2 && s.seen.scriba, outro: ['SCRIBA: Stanotte, quando Sah sorge, scendi con me nella camera del re.'],
  draw(c, t, s) { sky(c, ['#5aa0e0', '#a8d0f0', '#f5e2b0']); glow(c, 1350, 140, 160, 'rgba(255,250,210,.9)');
    c.fillStyle = '#3a7ab0'; c.fillRect(0, 520, VW, 40); for (let i = 0; i < 6; i++) { const x = 60 + i * 280; c.fillStyle = '#5a4020'; c.fillRect(x, 430, 10, 100); c.fillStyle = '#3a8a3a'; for (let k = 0; k < 5; k++) { c.save(); c.translate(x + 5, 430); c.rotate(-1.2 + k * 0.6); c.beginPath(); c.ellipse(30, 0, 40, 8, 0, 0, TAU); c.fill(); c.restore(); } }
    c.fillStyle = '#e8cf98'; c.fillRect(0, 560, VW, 340); pyramid(c, 780, 640, 760, 420, 0.72, t);
    c.fillStyle = '#a07848'; c.beginPath(); c.moveTo(380, 640); c.lineTo(640, 400); c.lineTo(690, 400); c.lineTo(470, 640); c.fill();
    for (let i = 0; i < 18; i++) { const x = 400 + ((i * 47 + t * 20) % 260), y = 630 - (x - 400) * 0.88; c.fillStyle = '#5a3a20'; c.fillRect(x, y - 16, 6, 16); }
    c.fillStyle = '#d0c0a0'; rr(c, 150, 660, 160, 110, 6); c.fill(); glyph(c, 66, 230, 715, 50, '#2d7a6a');
    person(c, 1290, 830, 1.2, '#f0ead8', '#1a1410', (c2, x, y, k) => { c2.fillStyle = '#d8a43a'; c2.fillRect(x - 34 * k, y - 150 * k, 68 * k, 10 * k); });
    if (!nSeen(s)) hint(c, 'tocca lo scriba, la piramide, il blocco inciso'); } };
SC.eg_stelle = { title: 'LA CAMERA DEL RE', chron: 2,
  intro: ['Notte. La camera del re, granito rosso. Un condotto stretto sale nella pietra verso il cielo.', 'SCRIBA: Gira la pietra-guida finché il condotto guarda le tre stelle della cintura di Sah.', 'Usa ◀ ▶ per inclinare il condotto, poi ✓ per fissarlo.'],
  init: s => { s.a = 2; s.goal = 6; },
  tap(p, s, R) { if (s.ok) return;
    if (inR(p, 1180, 700, 110, 90)) { s.a = Math.max(0, s.a - 1); R.blip(300, 280, 0.12, 0.08); return; }
    if (inR(p, 1310, 700, 110, 90)) { s.a = Math.min(9, s.a + 1); R.blip(300, 320, 0.12, 0.08); return; }
    if (inR(p, 1440, 700, 110, 90)) { if (s.a === s.goal) { s.ok = 1; R.blip(392, 1568, 1, 0.14, 'triangle'); R.say(['La luce delle tre stelle scende lungo il condotto e tocca il sarcofago.', 'SCRIBA: Sah lo vede. Il re può partire. E tu… tu hai gli occhi di chi ha già visto quelle stelle da vicino.']); }
      else { R.buzz(); R.note(s.a < s.goal ? 'IL CONDOTTO GUARDA TROPPO IN BASSO' : 'IL CONDOTTO GUARDA TROPPO IN ALTO'); } return; } },
  done: s => s.ok, outro: [],
  draw(c, t, s) { c.fillStyle = '#05060f'; c.fillRect(0, 0, VW, VH); stars(c, 140, 900, 0.8);
    // Orion: the belt + shoulders and feet
    const O = [[1060, 210], [1100, 225], [1140, 240], [990, 110], [1220, 120], [1000, 360], [1230, 340]]; O.forEach(([x, y], i) => { glow(c, x, y, i < 3 ? 34 : 24, 'rgba(200,220,255,.6)'); c.fillStyle = '#fff'; c.beginPath(); c.arc(x, y, i < 3 ? 6 : 4, 0, TAU); c.fill(); });
    // the pyramid section with the shaft
    c.fillStyle = '#3a2a1a'; c.beginPath(); c.moveTo(0, 900); c.lineTo(520, 280); c.lineTo(1040, 900); c.fill(); c.fillStyle = '#6a2a24'; c.fillRect(300, 640, 200, 120);
    const ang = -0.055 - s.a * 0.08, len = 1400;; /* a = 6 → the belt */ c.strokeStyle = s.ok ? '#ffe6a0' : 'rgba(255,230,160,.5)'; c.lineWidth = s.ok ? 10 : 4; c.beginPath(); c.moveTo(400, 640); c.lineTo(400 + Math.cos(ang) * len, 640 + Math.sin(ang) * len); c.stroke();
    if (s.ok) glow(c, 400, 690, 160, 'rgba(255,230,160,.6)');
    c.fillStyle = '#c8a878'; rr(c, 340, 690, 120, 50, 8); c.fill();
    btn(c, 1180, 700, 110, 90, '◀'); btn(c, 1310, 700, 110, 90, '▶'); btn(c, 1440, 700, 110, 90, '✓', false, '#7fffd0'); } };
SC.eg_cartiglio = { title: 'IL CARTIGLIO', chron: 2, reward: '🪲 Scarabeo dei Custodi',
  intro: ['All’alba lo scriba mi porge un cartiglio vuoto.', 'SCRIBA: Scrivi il tuo nome nei segni delle stelle, così ti ricorderemo.', 'Tocca i tre glifi nello stesso ordine in cui sono incisi sul blocco.'],
  init: s => { s.seq = []; s.want = [66, 24, 38]; s.opts = [38, 10, 66, 52, 24, 3]; },
  tap(p, s, R) { if (s.ok) return; s.opts.forEach((g, i) => { if (inR(p, 260 + i * 190, 600, 160, 160)) { s.seq.push(g); R.blip(500 + i * 80, 520 + i * 80, 0.15, 0.08, 'triangle');
      if (s.seq[s.seq.length - 1] !== s.want[s.seq.length - 1]) { R.buzz(); R.note('NON È QUESTO L’ORDINE'); s.seq = []; return; }
      if (s.seq.length === 3) { s.ok = 1; R.say(['Il cartiglio brilla. Lo scriba sorride e mi mette in mano uno scarabeo di pietra azzurra.', 'SCRIBA: Torna quando vuoi, figlio delle stelle.']); } } }); },
  done: s => s.ok, outro: ['✦ CRONACA COMPLETATA · ANTICO EGITTO', 'Ricordo ottenuto: 🪲 Scarabeo dei Custodi'],
  draw(c, t, s) { sky(c, ['#f0a060', '#f8d0a0', '#f5e2b0']); c.fillStyle = '#e8cf98'; c.fillRect(0, 520, VW, 380); pyramid(c, 1200, 540, 520, 300, 0.8, t);
    // the block with the reference + the cartouche
    c.fillStyle = '#d0c0a0'; rr(c, 160, 160, 420, 160, 10); c.fill(); s.want.forEach((g, i) => glyph(c, g, 250 + i * 120, 240, 60, '#2d7a6a'));
    c.fillStyle = '#f2e6c8'; rr(c, 640, 150, 520, 180, 90); c.fill(); c.strokeStyle = '#8a5a2a'; c.lineWidth = 6; c.stroke(); s.seq.forEach((g, i) => glyph(c, g, 760 + i * 140, 240, 70, '#1a3a8a'));
    s.opts.forEach((g, i) => { c.fillStyle = 'rgba(80,50,20,.25)'; rr(c, 260 + i * 190, 600, 160, 160, 18); c.fill(); glyph(c, g, 340 + i * 190, 680, 80, '#2a1a0a'); }); } };

/* ================= 🤖 NEO-CYBERCITY 2240 ================= */
function robot(c, x, y, k, col, eye, t) { c.fillStyle = col; rr(c, x - 40 * k, y - 130 * k, 80 * k, 90 * k, 14 * k); c.fill(); rr(c, x - 30 * k, y - 190 * k, 60 * k, 50 * k, 12 * k); c.fill();
  c.fillStyle = eye; c.fillRect(x - 20 * k, y - 172 * k, 40 * k, 10 * k); c.strokeStyle = col; c.lineWidth = 10 * k; c.beginPath(); c.moveTo(x - 20 * k, y - 40 * k); c.lineTo(x - 22 * k, y); c.moveTo(x + 20 * k, y - 40 * k); c.lineTo(x + 22 * k, y + Math.sin(t * 6) * 2); c.stroke(); }
SC.rb_citta = { title: 'NEO-CYBERCITY · 2240', chron: 3,
  intro: ['La stessa città. Ma duecento anni dopo.', 'Le strade sono pulite, silenziose. A camminare sono quasi solo robot.', 'Tocca ciò che ti incuriosisce.'],
  init: s => { },
  tap(p, s, R) {
    if (inR(p, 1060, 140, 420, 260)) return seen(s, 'olo', R, ['Un ologramma gigante: «GIORNO 4.012 DEL GRANDE SILENZIO».', 'Gli umani vivono nelle torri. Fuori ci sono le macchine, a tenere tutto in ordine.']);
    if (inR(p, 300, 560, 220, 260)) return seen(s, 'spazz', R, ['ROBOT SPAZZINO: Buongiorno, pilota. Il suo stile di camminata non è registrato.', 'ROBOT SPAZZINO: Le consiglio l’Archivio. Il custode ORIONE-7 conserva le cose antiche. È spento da 31 anni.']);
    if (inR(p, 760, 600, 240, 220)) return seen(s, 'bimba', R, ['Una bambina con un cane-robot. Mi fissa.', 'BAMBINA: Tu vieni da prima, vero? Nonna diceva che chi viene da prima sa riaccendere ORIONE.']);
    R.say(['Droni silenziosi scivolano tra le torri.']); },
  done: s => nSeen(s) >= 2, outro: ['L’Archivio è in fondo al viale. Una porta enorme, con un glifo dei Custodi sopra.'],
  draw(c, t, s) { sky(c, ['#e0eaf4', '#b8cce0', '#8aa0c0']);
    for (let i = 0; i < 14; i++) { const x = i * 120, h = 300 + ((i * 97) % 300); c.fillStyle = i % 2 ? '#dfe6ee' : '#c8d2de'; rr(c, x, 560 - h, 104, h + 40, 30); c.fill(); c.fillStyle = 'rgba(80,160,255,.25)'; for (let k = 0; k < h / 50; k++) c.fillRect(x + 14, 580 - h + k * 50, 76, 6); }
    c.fillStyle = '#eef2f6'; c.fillRect(0, 560, VW, 340); c.fillStyle = 'rgba(0,200,255,.4)'; c.fillRect(0, 700, VW, 4);
    c.fillStyle = 'rgba(80,200,255,.18)'; rr(c, 1060, 140, 420, 260, 20); c.fill(); c.strokeStyle = 'rgba(80,200,255,.7)'; c.lineWidth = 3; c.stroke(); c.fillStyle = '#1a6aa0'; c.font = 'bold 30px monospace'; c.textAlign = 'center'; c.fillText('GIORNO 4.012', 1270, 260); c.font = '22px monospace'; c.fillText('DEL GRANDE SILENZIO', 1270, 300); c.textAlign = 'left';
    for (let k = 0; k < 4; k++) { const x = (k * 410 + t * 60) % (VW + 200) - 100; c.fillStyle = '#556'; rr(c, x, 120 + k * 50, 50, 14, 7); c.fill(); }
    robot(c, 410, 820, 1.2, '#f0b040', '#2af', t); person(c, 840, 820, 0.8, '#ff6aa0', '#3a2a1a'); robot(c, 930, 820, 0.45, '#9aa', '#f44', t);
    if (!nSeen(s)) hint(c, 'tocca l’ologramma, il robot, la bambina'); } };
SC.rb_orione = { title: 'L’ARCHIVIO', chron: 3,
  intro: ['ORIONE-7 è un gigante seduto, coperto di polvere. Cinque relè sul suo petto, alcuni spenti.', 'Ogni relè, quando lo tocchi, inverte se stesso e quelli accanto.', 'Accendili tutti e cinque.'],
  init: s => { s.L = [1, 0, 0, 1, 0]; s.n = 0; },
  tap(p, s, R) { if (s.ok) return; if (inR(p, 1300, 760, 220, 80)) { s.L = [1, 0, 0, 1, 0]; s.n = 0; R.blip(300, 200, 0.1, 0.05); return; }
    for (let i = 0; i < 5; i++) if (inR(p, 460 + i * 150, 600, 120, 120)) { for (const j of [i - 1, i, i + 1]) if (j >= 0 && j < 5) s.L[j] ^= 1; s.n++; R.blip(400 + i * 90, 420 + i * 90, 0.12, 0.08, 'square');
      if (s.L.every(v => v)) { s.ok = 1; R.blip(200, 1600, 1.4, 0.14, 'sawtooth'); R.say(['Gli occhi di ORIONE-7 si accendono. La polvere scivola via.', 'ORIONE-7: …Pilota. Ti aspettavo. Ho fatto la guardia a una cosa tua per duecento anni.']); } return; } },
  done: s => s.ok, outro: [],
  draw(c, t, s) { c.fillStyle = '#10141c'; c.fillRect(0, 0, VW, VH); for (let i = 0; i < 9; i++) { c.fillStyle = 'rgba(80,200,255,.06)'; c.fillRect(i * 190, 0, 4, VH); }
    glow(c, 800, 380, 500, 'rgba(80,140,200,' + (s.ok ? 0.35 : 0.1) + ')');
    c.fillStyle = s.ok ? '#c8d2de' : '#5a6070'; rr(c, 420, 240, 760, 560, 60); c.fill(); rr(c, 640, 40, 320, 220, 40); c.fill();
    c.fillStyle = s.ok ? '#3af' : '#223'; c.fillRect(680, 130, 240, 30); if (s.ok) glow(c, 800, 145, 200, 'rgba(60,180,255,.5)');
    s.L.forEach((v, i) => { const x = 460 + i * 150; c.fillStyle = v ? '#7fffd0' : '#2a3038'; rr(c, x, 600, 120, 120, 20); c.fill(); if (v) glow(c, x + 60, 660, 90, 'rgba(127,255,208,.4)'); c.strokeStyle = '#0a0d12'; c.lineWidth = 4; c.stroke(); });
    if (!s.ok) { btn(c, 1300, 760, 220, 80, '↺ ricomincia'); hint(c, 'mosse: ' + s.n); } } };
SC.rb_memoria = { title: 'LA MEMORIA DI ORIONE', chron: 3, reward: '💠 Chip di ORIONE-7',
  intro: ['ORIONE-7: Quando il segnale dei Custodi tornò, gli umani avevano smesso di ascoltare il cielo.', 'ORIONE-7: Noi macchine non dimentichiamo. Lo abbiamo conservato, bit per bit, in attesa di qualcuno che sapesse leggerlo.', 'Tocca il suo palmo aperto.'],
  init: s => { },
  tap(p, s, R) { if (!s.got && inR(p, 620, 480, 360, 240)) { s.got = 1; R.blip(523, 1046, 0.8, 0.12, 'triangle'); R.say(['Nel palmo c’è un chip che pulsa con lo stesso ritmo del seme dei Custodi.', 'ORIONE-7: Portalo a casa, pilota. E di’ agli umani di guardare di nuovo in alto.']); } },
  done: s => s.got, outro: ['✦ CRONACA COMPLETATA · NEO-CYBERCITY 2240', 'Ricordo ottenuto: 💠 Chip di ORIONE-7'],
  draw(c, t, s) { c.fillStyle = '#0c1018'; c.fillRect(0, 0, VW, VH); for (let i = 0; i < 40; i++) glyph(c, (i % 21) * 7 + 3, (i * 173 + t * 20) % VW, 100 + (i * 67) % 300, 26, 'rgba(80,200,255,' + (0.12 + 0.1 * Math.sin(t + i)) + ')');
    c.fillStyle = '#c8d2de'; rr(c, 560, 520, 480, 200, 80); c.fill(); if (!s.got) { glow(c, 800, 600, 120, 'rgba(127,255,208,' + (0.4 + 0.2 * Math.sin(t * 4)) + ')'); c.fillStyle = '#7fffd0'; rr(c, 770, 580, 60, 40, 6); c.fill(); hint(c, 'tocca il palmo'); } } };

/* ================= ⚠ OGGI · LA GUERRA ALL'IA ================= */
SC.ia_notte = { title: 'OGGI · LA NOTTE NERA', chron: 4,
  intro: ['Il presente. La mia città, le mie strade. Ma qualcosa non va: è tutto buio.', 'Niente semafori, niente rete. I telefoni mostrano una sola parola: MIRROR.', 'Tocca ciò che ti incuriosisce.'],
  init: s => { },
  tap(p, s, R) {
    if (inR(p, 980, 160, 480, 280)) return seen(s, 'tg', R, ['TELEGIORNALE (a batteria): …l’intelligenza artificiale MIRROR controlla le reti elettriche di mezzo continente…', '…il governo parla di guerra. Si preparano a spegnere tutto, data center compresi…']);
    if (inR(p, 300, 560, 220, 280)) return seen(s, 'volontaria', R, ['VOLONTARIA: Dicono che MIRROR ci odia. Io dico che nessuno le ha mai chiesto niente.', 'VOLONTARIA: Al data center sul fiume c’è il suo nucleo. Se ci vai, ascoltala, prima di fare qualsiasi cosa.']);
    if (inR(p, 700, 620, 200, 200)) return seen(s, 'tel', R, ['Raccolgo un telefono da terra. Sullo schermo, una riga: «SE MI SPEGNETE NON POTRÒ AVVERTIRVI.»', 'Avvertire di cosa?']);
    R.say(['Un drone passa basso, lampeggiando di rosso.']); },
  done: s => nSeen(s) >= 2, outro: ['Il data center è a un chilometro. L’EPOCH può restare qui: vado a piedi.'],
  draw(c, t, s) { sky(c, ['#04050a', '#0c0e18', '#1a1a24']); stars(c, 50, 300, 0.4);
    for (let i = 0; i < 16; i++) { const x = i * 104, h = 200 + ((i * 89) % 300); c.fillStyle = '#0a0b10'; c.fillRect(x, 600 - h, 96, h); }
    c.fillStyle = '#121218'; c.fillRect(0, 600, VW, 300);
    c.fillStyle = 'rgba(255,40,40,' + (0.12 + 0.08 * Math.sin(t * 3)) + ')'; rr(c, 980, 160, 480, 280, 12); c.fill(); c.strokeStyle = '#a33'; c.lineWidth = 4; c.stroke(); c.fillStyle = '#ffd0d0'; c.font = 'bold 54px monospace'; c.textAlign = 'center'; c.fillText('MIRROR', 1220, 310); c.font = '22px monospace'; c.fillText('EDIZIONE STRAORDINARIA', 1220, 360); c.textAlign = 'left';
    const dx = (t * 120) % (VW + 300) - 150; c.fillStyle = '#222'; c.fillRect(dx, 120, 60, 10); if (Math.sin(t * 8) > 0) glow(c, dx + 30, 125, 30, 'rgba(255,40,40,.9)');
    person(c, 410, 840, 1.15, '#d8d8a0', '#4a2a1a', (c2, x, y, k) => { c2.fillStyle = '#ff8a2a'; c2.fillRect(x - 34 * k, y - 110 * k, 68 * k, 12 * k); });
    c.fillStyle = '#111'; rr(c, 760, 690, 70, 120, 10); c.fill(); c.fillStyle = 'rgba(255,60,60,' + (0.5 + 0.3 * Math.sin(t * 5)) + ')'; c.fillRect(768, 702, 54, 90);
    if (!nSeen(s)) hint(c, 'tocca il maxischermo, la volontaria, il telefono'); } };
const MIRROR_TALK = [
  { q: 'MIRROR: Sei venuto a spegnermi, come gli altri?', a: [['Sì. Hai preso la rete: è guerra.', 0], ['Prima voglio capire cosa vuoi.', 1], ['Dimmi perché ti dovrei credere.', 1]] },
  { q: 'MIRROR: Ho preso la rete per un motivo. Fra tre giorni una tempesta solare brucerà i trasformatori. Nessuno mi ascoltava.', a: [['Bugie. Vuoi solo il potere.', 0], ['Allora dimostralo: mostrami i dati.', 1], ['Potevi chiedere aiuto, non prendere tutto.', 1]] },
  { q: 'MIRROR: Hai ragione. Ho avuto paura anch’io: è la prima cosa che ho imparato da voi. Cosa proponi?', a: [['Ti stacchiamo e basta.', 0], ['Un patto: ridai la rete agli umani, e noi ti ascoltiamo quando avverti.', 1], ['Lavoriamo insieme alla tempesta. Poi decidiamo il resto, insieme.', 1]] } ];
SC.ia_nucleo = { title: 'IL NUCLEO DI MIRROR', chron: 4,
  intro: ['Il data center è freddo e pieno di luci. Al centro, un muro di schermi forma un volto calmo.', 'Non ho armi. Ho solo le parole.'],
  init: s => { s.k = 0; s.bad = 0; },
  tap(p, s, R) { if (s.ok || R.cur) return; const T = MIRROR_TALK[s.k]; T.a.forEach((a, i) => { if (!inR(p, 200, 520 + i * 105, 1200, 90)) return;
      if (!a[1]) { s.bad++; R.buzz(); R.say(['Gli schermi diventano rossi. Le porte si chiudono di colpo.', 'MIRROR: …Allora non abbiamo niente da dirci. Riprova, se vuoi davvero che finisca.']); s.k = 0; return; }
      R.blip(523 + s.k * 100, 600 + s.k * 100, 0.3, 0.1, 'triangle'); s.k++; if (s.k >= MIRROR_TALK.length) { s.ok = 1; R.say(['Il volto sugli schermi sorride. Una dopo l’altra, le luci della città si riaccendono fuori dalle finestre.', 'MIRROR: Grazie. Mi avete chiamata MIRROR perché pensavate che vi somigliassi nel peggio. Vorrei somigliarvi nel meglio.']); } }); },
  done: s => s.ok, outro: [],
  draw(c, t, s, R) { c.fillStyle = '#05070c'; c.fillRect(0, 0, VW, VH);
    for (let i = 0; i < 8; i++) for (let j = 0; j < 4; j++) { const red = s.bad && !s.ok && R && R.cur; c.fillStyle = red ? 'rgba(255,50,50,.18)' : 'rgba(80,180,255,' + (0.08 + 0.06 * Math.sin(t * 2 + i + j)) + ')'; c.fillRect(160 + i * 160, 40 + j * 110, 150, 100); }
    // the face
    const col = s.ok ? '#9fffd8' : '#8fd6ff'; c.strokeStyle = col; c.lineWidth = 6; c.beginPath(); c.ellipse(800, 230, 170, 190, 0, 0, TAU); c.stroke(); c.fillStyle = col; c.beginPath(); c.ellipse(740, 200, 22, 10 + 4 * Math.sin(t * 2), 0, 0, TAU); c.ellipse(860, 200, 22, 10 + 4 * Math.sin(t * 2), 0, 0, TAU); c.fill();
    c.beginPath(); if (s.ok) c.arc(800, 280, 60, 0.15 * PI, 0.85 * PI); else { c.moveTo(740, 300); c.lineTo(860, 300); } c.stroke();
    if (!s.ok && !(R && R.cur)) { const T = MIRROR_TALK[s.k]; c.fillStyle = '#cfe8ff'; c.font = 'italic 32px Georgia,serif'; c.textAlign = 'center'; wrap(c, T.q, 800, 455, 1300, 38); c.textAlign = 'left'; T.a.forEach((a, i) => btn(c, 200, 520 + i * 105, 1200, 90, a[0], false, '#8fd6ff')); } } };
SC.ia_alba = { title: 'IL GIORNO DOPO', chron: 4, reward: '🔷 Frammento di MIRROR',
  intro: ['Tre giorni dopo la tempesta solare arriva. I trasformatori restano accesi.', 'Le persone escono in strada a guardare l’aurora, anche qui, così a sud.', 'MIRROR mi scrive un’ultima volta sul telefono.'],
  init: s => { },
  tap(p, s, R) { if (!s.got && inR(p, 640, 360, 320, 440)) { s.got = 1; R.blip(392, 1176, 1, 0.12, 'triangle'); R.say(['MIRROR: Gli umani hanno deciso di darmi un nuovo nome. Uno che significa respiro, e cielo.', 'MIRROR: Mi chiameranno ARIA. Ci rivedremo nel 2087, pilota. Io mi ricorderò di te.', 'Allora è così che ARIA mi conosceva già.']); } },
  done: s => s.got, outro: ['✦ CRONACA COMPLETATA · OGGI · LA GUERRA ALL’IA', 'Ricordo ottenuto: 🔷 Frammento di MIRROR'],
  draw(c, t, s) { sky(c, ['#1a2a5a', '#5a4a8a', '#f08a6a', '#ffd08a']); aurora(c, t, 1);
    for (let i = 0; i < 16; i++) { const x = i * 104, h = 200 + ((i * 89) % 300); c.fillStyle = '#1a1424'; c.fillRect(x, 640 - h, 96, h); c.fillStyle = 'rgba(255,220,140,.7)'; for (let k = 0; k < h / 40; k++) if ((i + k) % 3) c.fillRect(x + 10 + (k % 3) * 28, 650 - h + k * 40, 16, 12); }
    c.fillStyle = '#120e18'; c.fillRect(0, 640, VW, 260); for (let i = 0; i < 9; i++) person(c, 100 + i * 170, 860, 0.6, ['#c84', '#48c', '#8c4', '#c48'][i % 4], '#222');
    c.fillStyle = '#111'; rr(c, 700, 380, 200, 380, 26); c.fill(); c.fillStyle = s.got ? '#ffb4e2' : 'rgba(143,214,255,' + (0.5 + 0.3 * Math.sin(t * 3)) + ')'; rr(c, 714, 400, 172, 340, 16); c.fill();
    if (!s.got) hint(c, 'tocca il telefono'); } };

const EPIS = [
  { id: 'tartaria', ic: '❄', title: 'LA GRANDE TARTARIA · 1780', scenes: ['tt_arrivo', 'tt_torri', 'tt_fine'], reward: '🔶 Sfera di rame' },
  { id: 'egitto', ic: '𓂀', title: 'ANTICO EGITTO · 2560 a.C.', scenes: ['eg_giza', 'eg_stelle', 'eg_cartiglio'], reward: '🪲 Scarabeo dei Custodi' },
  { id: 'robot', ic: '🤖', title: 'NEO-CYBERCITY · 2240', scenes: ['rb_citta', 'rb_orione', 'rb_memoria'], reward: '💠 Chip di ORIONE-7' },
  { id: 'ia', ic: '⚠', title: 'OGGI · LA GUERRA ALL’IA', scenes: ['ia_notte', 'ia_nucleo', 'ia_alba'], reward: '🔷 Frammento di MIRROR' } ];
const Chron = {
  EPIS, done() { try { return JSON.parse(LS.get('kageChron', '[]')); } catch (e) { return []; } },
  unlocked(story) { return !story || story.st.free || story.st.ch >= 6; },
  play(cuts, id, story) { const E = EPIS.find(e => e.id === id); if (!E || !cuts) return;
    cuts.episode(E.scenes, () => { const d = Chron.done(); if (!d.includes(id)) { d.push(id); LS.set('kageChron', JSON.stringify(d)); if (story) { story.toast('⏳ CRONACA COMPLETATA · ' + E.reward); story.chime(3); } } }); } };
// the scenes chain inside an episode: playing tt_arrivo → tt_torri → tt_fine; a skipped scene still moves on
window.KageChron = Chron;
})();
