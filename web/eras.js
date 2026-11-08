/* KAGE EPOCH · EXPLORABLE ERAS. Step into the EPOCH in the garage, pick an era, and walk around in 3D:
 *   ❄ LA GRANDE TARTARIA · 1780   — snow steppe, a star fort, white palaces with copper domes, the master spires, the aurora
 *   𓂀 ANTICO EGITTO · 2560 a.C.    — the Nile, palms, a temple, the Great Pyramid half built with its ramp, workers hauling a block
 *   🤖 NEO-CYBERCITY · 2240        — white towers, light lanes, robots and drones, ORIONE-7 asleep in the plaza
 *   ⚠ OGGI · LA NOTTE NERA         — today, blackout: a dark street, abandoned cars, a red screen, MIRROR's data center
 * The era reuses the past-world renderer (g.world = 'meadow', g.era = id): its own ground (ground_meadow.frag uEra), palette,
 * buildings, people, collisions. Talk to people (AZIONE), find the landmarks, and the puzzles open as illustrated scenes
 * (web/chronicles.js). Back home: AZIONE inside the EPOCH. Progress in localStorage 'kageEras'; done eras also tick the Chronicles. */
(function () {
'use strict';
const NR = window.NeonRun, KF = window.KageFleet; if (!NR || !KF) return;
const { S, wrapD } = NR, PI = Math.PI, TAU = PI * 2, wrapP = v => ((v % S) + S) % S;
const LS = { get: (k, d) => { try { const v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) { } } };
const mat = (c, e, slot, mode) => ({ c, e: e || 0, slot: slot || 0, mode: mode || 0, a: [0, 0, 0] });
const O = { x: 30, z: 27 };   // the EPOCH: every era is laid out around it (the player steps out facing −x)
const W = (lx, lz) => [wrapP(O.x + lx), wrapP(O.z + lz)];
const T = KF.T, RY = KF.RY, RZ = KF.RZ, RX = KF.RX, M = KF.M;

/* ---------------- small builders ---------------- */
const robe = c => { const mb = new KF.MB(); mb.part = 'tunica'; mb.cyl(0.05, 1.42, 0.36, 0.2, 14, mat(c)); mb.cyl(1.38, 1.5, 0.22, 0.22, 12, mat(c.map(v => v * 0.8))); return mb.finish(); };
const wedge = (mb, x0, x1, z0, y0, z1, y1, m) => {   // a ramp from (z0, y0) to (z1, y1), x0..x1 wide, solid down to the ground
  const P = [[x0, y0, z0], [x1, y0, z0], [x1, y1, z1], [x0, y1, z1]];
  mb.poly(P, m); mb.poly([[x0, 0, z0], [x0, y0, z0], [x0, y1, z1], [x0, 0, z1]], m); mb.poly([[x1, 0, z1], [x1, y1, z1], [x1, y0, z0], [x1, 0, z0]], m); mb.poly([[x0, 0, z1], [x0, y1, z1], [x1, y1, z1], [x1, 0, z1]], m); };
const palm = (mb, x, z, h, lean) => { mb.push(M(T(x, 0, z), RZ(lean))); mb.cyl(0, h, 0.32, 0.22, 8, mat([0.45, 0.33, 0.2])); for (let k = 0; k < 7; k++) { mb.push(M(T(0, h, 0), M(RY(k / 7 * TAU), RZ(0.5)))); mb.ellipsoid(1.8, 0, 0, 2.2, 0.12, 0.5, 8, 4, mat([0.2, 0.5, 0.15])); mb.pop(); } mb.pop(); };

/* ❄ TARTARIA */
function buildFort() { const mb = new KF.MB(), st = mat([0.56, 0.52, 0.47]), cap = mat([0.85, 0.85, 0.88]), N = 16, P = [];
  for (let k = 0; k < N; k++) { const a = k / N * TAU, r = k % 2 ? 50 : 66; P.push([Math.cos(a) * r, Math.sin(a) * r]); }
  mb.part = 'mura_a_stella';
  for (let k = 0; k < N; k++) { const a = P[k], b = P[(k + 1) % N], mx = (a[0] + b[0]) / 2, mz = (a[1] + b[1]) / 2; if (mx > 40 && Math.abs(mz) < 18) continue;   // the gate (towards the EPOCH)
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), h = Math.atan2(b[0] - a[0], b[1] - a[1]); mb.push(M(T(mx, 0, mz), RY(h))); mb.box(0, 3.5, 0, 3, 7, L + 1, st); mb.box(0, 7.2, 0, 3.4, 0.4, L + 1.2, cap); mb.pop(); }
  for (let k = 2; k < N - 1; k += 2) { const [x, z] = P[k]; mb.push(T(x, 0, z)); mb.cyl(0, 9, 3, 2.6, 10, st); mb.cyl(9, 12, 3, 0.2, 10, mat([0.3, 0.55, 0.5])); mb.pop(); }
  return mb.finish(); }
function buildPalace(r, h) { const mb = new KF.MB(), white = mat([0.92, 0.9, 0.85]), dark = mat([0.18, 0.15, 0.13]), cu = mat([0.27, 0.62, 0.55]), au = mat([0.85, 0.65, 0.25], 0.2);
  mb.part = 'palazzo'; mb.cyl(0, h, r, r, 28, white); mb.cyl(h, h + 0.8, r + 0.6, r + 0.6, 28, white);
  for (let k = 0; k < 14; k++) { const a = k / 14 * TAU; mb.push(M(T(Math.sin(a) * (r + 0.05), 0, Math.cos(a) * (r + 0.05)), RY(a))); mb.box(0, h * 0.55, 0, r * 0.22, h * 0.45, 0.1, dark); mb.box(0, h * 0.18, 0, r * 0.22, h * 0.18, 0.1, dark); mb.pop(); }
  mb.part = 'cupola'; mb.ellipsoid(0, h + 0.8, 0, r * 0.98, r * 0.95, r * 0.98, 28, 14, cu);
  mb.part = 'guglia'; mb.rod([0, h + r * 0.9, 0], [0, h + r * 1.6, 0], 0.25, 6, au); mb.ellipsoid(0, h + r * 1.25, 0, 0.9, 0.9, 0.9, 12, 8, au);
  return mb.finish(); }
function buildPalaceWin(r, h) { const mb = new KF.MB(), w = mat([1, 0.78, 0.4], 1, 3); mb.part = 'finestre';
  for (let k = 0; k < 14; k++) { const a = k / 14 * TAU; mb.push(M(T(Math.sin(a) * (r + 0.12), 0, Math.cos(a) * (r + 0.12)), RY(a))); mb.box(0, h * 0.55, 0, r * 0.18, h * 0.38, 0.06, w); mb.box(0, h * 0.18, 0, r * 0.18, h * 0.14, 0.06, w); mb.pop(); } return mb.finish(); }
function buildSpire() { const mb = new KF.MB(); mb.part = 'guglia_maestra'; mb.cyl(0, 4, 4, 3.6, 12, mat([0.5, 0.46, 0.42])); mb.cyl(4, 38, 2.6, 0.7, 12, mat([0.42, 0.4, 0.38]));
  for (let k = 0; k < 6; k++) { mb.push(T(0, 8 + k * 5, 0)); mb.torus(2.3 - k * 0.27, 0.18, 14, 5, mat([0.78, 0.48, 0.22], 0.1)); mb.pop(); }
  mb.ellipsoid(0, 40, 0, 2.2, 2.2, 2.2, 16, 10, mat([0.78, 0.48, 0.22], 0.15)); return mb.finish(); }
function buildSpireGlow() { const mb = new KF.MB(); mb.part = 'sfera_luce'; mb.ellipsoid(0, 40, 0, 2.6, 2.6, 2.6, 16, 10, mat([0.5, 1, 0.85], 1, 3)); for (let k = 0; k < 6; k++) { mb.push(T(0, 8 + k * 5, 0)); mb.torus(2.35 - k * 0.27, 0.22, 14, 5, mat([0.4, 1, 0.8], 1, 3)); mb.pop(); } return mb.finish(); }
function buildConsoleT() { const mb = new KF.MB(); mb.part = 'console_rame'; mb.cyl(0, 1.1, 0.7, 0.5, 10, mat([0.4, 0.36, 0.34])); for (let i = 0; i < 3; i++) { mb.push(M(T(-0.5 + i * 0.5, 1.45, 0), RX(PI / 2))); mb.torus(0.2, 0.05, 12, 4, mat([0.85, 0.5, 0.22], 0.2)); mb.pop(); } return mb.finish(); }
function buildAurora() { const mb = new KF.MB(); mb.part = 'aurora';
  for (let j = 0; j < 3; j++) for (let i = 0; i < 40; i++) { const x = -420 + i * 21, z = -260 - j * 50 + Math.sin(i * 0.4 + j) * 40, y = 140 + j * 25 + Math.sin(i * 0.25 + j * 2) * 12; mb.box(x, y, z, 22, 30 + j * 6, 2, mat(j === 1 ? [0.55, 0.35, 1] : [0.3, 1, 0.65], 0.6, 3)); }
  return mb.finish(); }
function buildBoundary(seed) { const mb = new KF.MB(); mb.part = 'pietra_confine'; mb.box(0, 1.1, 0, 1.3, 2.2, 0.5, mat([0.42, 0.4, 0.38])); KF.glyph(mb, 0, 1.3, 0.27, 0.8, seed, mat([0.4, 1, 0.8], 1.3, 3)); return mb.finish(); }

/* 𓂀 EGITTO */
function buildPyramid() { const mb = new KF.MB(), lime = mat([0.86, 0.76, 0.56]), lime2 = mat([0.8, 0.69, 0.5]), mud = mat([0.55, 0.42, 0.28]), B = 140, LH = 5.5, NL = 12;
  mb.part = 'piramide'; for (let k = 0; k < NL; k++) { const s = B * (1 - k / 17); mb.box(0, LH * k + LH / 2, 0, s, LH, s, k % 2 ? lime : lime2); }
  mb.part = 'ingresso'; mb.box(B / 2 + 0.05, 3.2, 0, 0.6, 5, 3.2, mat([0.06, 0.05, 0.04]));
  mb.part = 'rampa'; wedge(mb, -40, -26, 135, 0.4, B / 2 * (1 - 9 / 17) + 2, LH * 9, mud);
  mb.part = 'cantiere'; for (let k = 0; k < 8; k++) { const a = k / 8 * TAU; mb.box(Math.cos(a) * 18, LH * NL + 1, Math.sin(a) * 18, 2.4, 2, 2.4, lime); }
  return mb.finish(); }
function buildNile() { const mb = new KF.MB(); mb.part = 'nilo'; mb.box(0, 0.02, 0, 34, 0.04, 900, mat([0.18, 0.42, 0.55], 0.25, 3)); mb.part = 'rive'; mb.box(-18.5, 0.03, 0, 3, 0.06, 900, mat([0.36, 0.42, 0.18])); mb.box(18.5, 0.03, 0, 3, 0.06, 900, mat([0.36, 0.42, 0.18]));
  for (let i = 0; i < 26; i++) { palm(mb, (i % 2 ? -22 : 22) + Math.sin(i) * 3, -380 + i * 30, 7 + (i % 3), Math.sin(i * 1.7) * 0.12); } return mb.finish(); }
function buildTemple() { const mb = new KF.MB(), st = mat([0.84, 0.74, 0.55]), paint = mat([0.15, 0.35, 0.6]); mb.part = 'tempio'; mb.box(0, 0.3, 0, 20, 0.6, 12, st);
  for (let i = 0; i < 6; i++) for (const z of [-4.5, 4.5]) { mb.push(T(-8 + i * 3.2, 0.6, z)); mb.cyl(0, 7, 0.75, 0.65, 12, st); mb.cyl(7, 7.6, 0.95, 0.95, 12, paint); mb.pop(); }
  mb.box(0, 8.2, 0, 20, 1.2, 12, st); mb.box(0, 8.2, 6.02, 18, 0.5, 0.05, paint);
  mb.part = 'obelisco'; mb.push(T(14, 0, 0)); mb.box(0, 9, 0, 1.6, 18, 1.6, st, [0.6, 0.6]); mb.cyl(18, 19.4, 0.7, 0, 4, mat([0.9, 0.75, 0.3], 0.3)); mb.pop();
  return mb.finish(); }
function buildSledge() { const mb = new KF.MB(); mb.part = 'slitta'; mb.box(0, 0.25, 0, 2.2, 0.3, 3.6, mat([0.45, 0.3, 0.16])); mb.part = 'blocco'; mb.box(0, 1.25, 0, 1.8, 1.7, 2.4, mat([0.86, 0.76, 0.56])); mb.part = 'corde'; for (const x of [-0.6, 0.6]) mb.rod([x, 0.4, 1.8], [x * 2, 1.0, 8.5], 0.04, 4, mat([0.6, 0.5, 0.3])); return mb.finish(); }

/* 🤖 2240 */
function buildTowerF(h, r) { const mb = new KF.MB(); mb.part = 'torre'; mb.cyl(0, h, r, r * 0.82, 24, mat([0.9, 0.92, 0.95])); for (let y = 10; y < h; y += 12) { mb.push(T(0, y, 0)); mb.cyl(0, 0.6, r * (1 - y / h * 0.18) + 0.08, r * (1 - y / h * 0.18) + 0.08, 24, mat([0.35, 0.75, 1], 0.9, 3)); mb.pop(); }
  mb.ellipsoid(0, h, 0, r * 0.82, r * 0.35, r * 0.82, 20, 8, mat([0.8, 0.9, 1])); return mb.finish(); }
function buildOrione(awake) { const mb = new KF.MB(), A = mat(awake ? [0.85, 0.88, 0.92] : [0.45, 0.48, 0.52]), D = mat([0.2, 0.22, 0.26]), E = mat(awake ? [0.3, 0.8, 1] : [0.1, 0.12, 0.15], awake ? 1.4 : 0, 3);
  mb.part = 'orione7'; mb.box(0, 1.5, 0, 9, 3, 6, D);                       // the plinth he sits on
  mb.box(0, 7.5, -0.5, 6.5, 8, 4, A); mb.box(0, 12.5, -0.5, 3.4, 2.6, 3, A); mb.box(0, 12.6, 1.05, 2.4, 0.5, 0.2, E);   // torso, head, eyes
  for (const s of [-1, 1]) { mb.box(s * 2, 3.6, 3.2, 2.2, 1.6, 7, A); mb.box(s * 2, 1.6, 6.5, 2, 3.4, 1.8, A); mb.box(s * 4.2, 8.5, 1.4, 1.6, 1.6, 6, A); mb.box(s * 4.2, 6, 4.4, 1.5, 1.4, 1.5, A); }
  for (let i = 0; i < 5; i++) mb.box(-2 + i, 8, 1.55, 0.7, 0.7, 0.15, mat(awake ? [0.5, 1, 0.82] : [0.25, 0.3, 0.3], awake ? 1.2 : 0, 3));
  return mb.finish(); }
function buildBot(col) { const mb = new KF.MB(), C = mat(col), D = mat([0.2, 0.22, 0.26]); mb.part = 'robot'; mb.box(0, 1.0, 0, 0.7, 0.9, 0.5, C); mb.box(0, 1.75, 0, 0.5, 0.42, 0.42, C); mb.box(0, 1.78, 0.22, 0.36, 0.08, 0.04, mat([0.3, 0.8, 1], 1.4, 3));
  for (const s of [-1, 1]) { mb.box(s * 0.2, 0.3, 0, 0.18, 0.6, 0.2, D); mb.box(s * 0.48, 1.05, 0, 0.14, 0.7, 0.16, D); } return mb.finish(); }
function buildDog() { const mb = new KF.MB(), C = mat([0.75, 0.78, 0.82]); mb.part = 'cane_robot'; mb.box(0, 0.45, 0, 0.3, 0.25, 0.7, C); mb.box(0, 0.62, 0.42, 0.24, 0.22, 0.28, C); mb.box(0, 0.66, 0.57, 0.16, 0.04, 0.02, mat([1, 0.3, 0.3], 1.3, 3)); for (const x of [-0.11, 0.11]) for (const z of [-0.25, 0.25]) mb.box(x, 0.18, z, 0.06, 0.36, 0.06, C); return mb.finish(); }
function buildDroneF(red) { const mb = new KF.MB(); mb.part = 'drone'; mb.box(0, 0, 0, 0.9, 0.25, 0.9, mat([0.25, 0.27, 0.3])); for (const x of [-0.6, 0.6]) for (const z of [-0.6, 0.6]) { mb.push(T(x, 0.1, z)); mb.cyl(0, 0.04, 0.35, 0.35, 10, mat([0.4, 0.4, 0.45])); mb.pop(); } mb.ellipsoid(0, -0.15, 0, 0.12, 0.12, 0.12, 6, 4, mat(red ? [1, 0.15, 0.1] : [0.3, 0.8, 1], 1.6, 3)); return mb.finish(); }
function buildHolo() { const mb = new KF.MB(); mb.part = 'ologramma'; const c = mat([0.3, 0.75, 1], 1, 3); mb.box(0, 0, 0, 16, 0.25, 0.1, c); mb.box(0, 9, 0, 16, 0.25, 0.1, c); mb.box(-8, 4.5, 0, 0.25, 9, 0.1, c); mb.box(8, 4.5, 0, 0.25, 9, 0.1, c);
  for (let k = 0; k < 4; k++) KF.glyph(mb, -5.4 + k * 3.6, 4.5, 0.05, 3.2, k * 14 + 3, c); return mb.finish(); }

/* ⚠ OGGI */
function buildBlock(w, h, d, seed, screen) { const mb = new KF.MB(); let s = seed; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  mb.part = 'palazzo'; mb.box(0, h / 2, 0, w, h, d, mat([0.13, 0.13, 0.15])); mb.box(0, h + 0.3, 0, w + 0.3, 0.6, d + 0.3, mat([0.09, 0.09, 0.1]));
  for (let y = 3; y < h - 2; y += 3.2) for (let x = -w / 2 + 1.5; x < w / 2 - 1; x += 2.6) { const lit = rnd() < 0.025; mb.box(x, y, d / 2 + 0.03, 1.4, 1.7, 0.05, mat(lit ? [0.9, 0.5, 0.2] : [0.05, 0.06, 0.08], lit ? 0.6 : 0, 3)); }
  if (screen) { mb.part = 'schermo'; mb.box(0, h * 0.62, d / 2 + 0.2, w * 0.8, h * 0.3, 0.3, mat([0.08, 0.02, 0.02])); }
  return mb.finish(); }
function buildScreen(w, h) { const mb = new KF.MB(); mb.part = 'schermo_luce'; const c = mat([1, 0.12, 0.1], 1, 3); mb.box(0, 0, 0, w, h, 0.1, mat([0.5, 0.04, 0.04], 1, 3)); for (let k = 0; k < 6; k++) KF.glyph(mb, -w * 0.36 + k * w * 0.144, 0, 0.08, h * 0.45, 5 + k * 9, c); return mb.finish(); }
function buildCar(c) { const mb = new KF.MB(); mb.part = 'auto'; mb.box(0, 0.65, 0, 1.8, 0.7, 4.3, mat(c, 0, 1)); mb.box(0, 1.25, -0.2, 1.6, 0.6, 2.2, mat([0.05, 0.06, 0.08], 0, 1)); for (const x of [-0.85, 0.85]) for (const z of [-1.4, 1.4]) { mb.push(M(T(x, 0.35, z), RZ(PI / 2))); mb.cyl(-0.12, 0.12, 0.35, 0.35, 10, mat([0.05, 0.05, 0.05])); mb.pop(); } return mb.finish(); }
function buildDC() { const mb = new KF.MB(); mb.part = 'data_center'; mb.box(0, 9, 0, 40, 18, 56, mat([0.2, 0.22, 0.26])); for (let y = 3; y < 17; y += 3.5) mb.box(20.05, y, 0, 0.1, 0.25, 50, mat([0.2, 0.6, 1], 1.4, 3));
  mb.part = 'porta'; mb.box(20.1, 2.4, 0, 0.3, 4.8, 5, mat([0.05, 0.08, 0.12])); mb.box(20.2, 5.2, 0, 0.2, 0.3, 5.4, mat([0.3, 0.8, 1], 1.4, 3));
  mb.part = 'antenne'; for (const z of [-20, 0, 20]) mb.rod([0, 18, z], [0, 26, z], 0.2, 6, mat([0.4, 0.42, 0.46])); return mb.finish(); }
function buildPole() { const mb = new KF.MB(); mb.part = 'lampione'; mb.cyl(0, 7, 0.12, 0.09, 8, mat([0.3, 0.3, 0.32])); mb.box(0.6, 7, 0, 1.4, 0.15, 0.3, mat([0.3, 0.3, 0.32])); return mb.finish(); }
function buildPhone() { const mb = new KF.MB(); mb.part = 'telefono'; mb.box(0, 0.02, 0, 0.08, 0.02, 0.16, mat([0.05, 0.05, 0.05])); mb.box(0, 0.035, 0, 0.07, 0.005, 0.14, mat([1, 0.2, 0.15], 1.5, 3)); return mb.finish(); }

/* ---------------- the eras ---------------- */
const PPL = {
  mercante: { cfg: { suit: 'tunica', hair: 'corti', hairColor: 'nero', skin: 'chiara', beard: 'piena', build: 'robusto' }, robe: [0.42, 0.14, 0.12] },
  tartaro: { cfg: { suit: 'tunica', hair: 'lunghi', hairColor: 'castano', skin: 'chiara', beard: 'nessuna', build: 'snello' }, robe: [0.3, 0.22, 0.4] },
  scriba: { cfg: { suit: 'bianco', hair: 'corti', hairColor: 'nero', skin: 'olivastra', beard: 'nessuna', build: 'snello' }, robe: [0.95, 0.93, 0.86] },
  operaio: { cfg: { suit: 'casual', hair: 'corti', hairColor: 'nero', skin: 'ambrata', beard: 'nessuna', build: 'atletico' }, robe: [0.9, 0.85, 0.7], short: 1 },
  bimba: { cfg: { suit: 'rosso', hair: 'coda', hairColor: 'castano', skin: 'chiara', beard: 'nessuna', build: 'snello', height: 1.62 } },
  cittadino: { cfg: { suit: 'bianco', hair: 'corti', hairColor: 'biondo', skin: 'chiara', beard: 'nessuna', build: 'snello' } },
  volontaria: { cfg: { suit: 'nero', hair: 'coda', hairColor: 'nero', skin: 'scura', beard: 'nessuna', build: 'snello' } },
  passante: { cfg: { suit: 'casual', hair: 'ricci', hairColor: 'castano', skin: 'olivastra', beard: 'corta', build: 'robusto' } } };
const ERAS = {
  tartaria: { name: 'LA GRANDE TARTARIA · 1780', ic: '❄', ground: 1, snow: 1, day: 0.45, cloud: 0.25, chron: 'tartaria', reward: '🔶 Sfera di rame',
    pal: { fog: [0.62, 0.66, 0.78], top: [0.07, 0.11, 0.32], sun: [0.85, 0.88, 1.0], sunDir: [0.3, 0.3, 0.9], fogDen: 0.0052 },
    arrive: ['Una pianura bianca. Fa un freddo che taglia.', 'In fondo, una città che nessun libro di storia mi ha mai mostrato: cupole verdi, guglie, mura a forma di stella.'],
    spots: [
      { id: 'pietra', x: -10, z: -6, r: 3, lab: 'LEGGI', look: 'Una pietra di confine… con un glifo dei Custodi. Sono arrivati anche qui.' },
      { id: 'mercante', x: -26, z: 3, r: 3.2, lab: 'PARLA', who: 'MERCANTE', npc: 'mercante', main: 'Parla con il mercante alle porte', lines: ['Le mappe del mondo ci chiamano Tartaria. Tu da dove vieni, straniero, con quella cabina che fuma?', 'Le guglie maestre bevono la luce del nord: così le nostre case sono calde senza fuoco.', 'Ma da tre notti le guglie tacciono. La console di rame è dentro le mura, davanti al palazzo grande. Tu sai leggere i segni, si vede.'] },
      { id: 'console', x: -82, z: 0, r: 3, lab: 'ACCORDA', need: 'mercante', main: 'Accorda le guglie alla console di rame', scenes: ['tt_torri', 'tt_fine'] },
      { id: 'palazzo', x: -120, z: 0, r: 18, look: 'Il palazzo grande. Le porte sono alte il triplo di un uomo, ma nessuno sembra averle mai costruite per uomini.' } ] },
  egitto: { name: 'ANTICO EGITTO · 2560 a.C.', ic: '𓂀', ground: 2, day: 1, cloud: 0, chron: 'egitto', reward: '🪲 Scarabeo dei Custodi',
    pal: { fog: [0.95, 0.86, 0.68], top: [0.22, 0.52, 0.95], sun: [1.12, 1.02, 0.86], sunDir: [0.35, 0.88, 0.3], fogDen: 0.0024 },
    arrive: ['Caldo. Luce bianca. Sabbia nelle scarpe.', 'Una piramide ancora a metà: rampe di mattoni crudi, canti in coro, il Nilo dietro le palme.'],
    spots: [
      { id: 'blocco', x: -8, z: -8, r: 3, lab: 'LEGGI', look: 'Su un blocco di calcare qualcuno ha inciso un glifo dei Custodi, in mezzo ai geroglifici.' },
      { id: 'tempio', x: -40, z: -48, r: 14, look: 'Un tempio con le colonne dipinte e un obelisco. Profuma di incenso e di sabbia calda.' },
      { id: 'scriba', x: -92, z: 10, r: 3.2, lab: 'PARLA', who: 'LO SCRIBA', npc: 'scriba', main: 'Trova lo scriba ai piedi della piramide', lines: ['Sei arrivato nella cassa di luce. Gli anziani dicevano che saresti venuto.', 'Il re vuole che il suo spirito salga a Sah, la stella del cacciatore. Ma il condotto della camera non è ancora puntato.', 'Entra dall’ingresso sul lato del fiume. Ti aspetto dentro.'] },
      { id: 'camera', x: -126, z: 0, r: 3.5, lab: 'ENTRA', need: 'scriba', main: 'Entra nella piramide: la camera del re', scenes: ['eg_stelle', 'eg_cartiglio'] } ] },
  futuro: { name: 'NEO-CYBERCITY · 2240', ic: '🤖', ground: 3, day: 1, cloud: 0.15, chron: 'robot', reward: '💠 Chip di ORIONE-7',
    pal: { fog: [0.84, 0.9, 0.97], top: [0.4, 0.62, 0.95], sun: [1, 1, 1], sunDir: [0.4, 0.75, 0.5], fogDen: 0.003 },
    arrive: ['La stessa città, duecento anni dopo. Le strade sono pulite e silenziose.', 'A camminare sono quasi solo robot.'],
    spots: [
      { id: 'spazzino', x: -20, z: 8, r: 3, lab: 'PARLA', who: 'ROBOT SPAZZINO', move: 'bot', main: 'Parla con il robot spazzino', lines: ['Buongiorno, pilota. Il suo stile di camminata non è registrato.', 'Le consiglio la piazza dell’Archivio. Il custode ORIONE-7 conserva le cose antiche. È spento da 31 anni.'] },
      { id: 'bimba', x: -30, z: -22, r: 3, lab: 'PARLA', who: 'UNA BAMBINA', npc: 'bimba', lines: ['Tu vieni da prima, vero? Hai le scarpe sporche di terra vera.', 'Nonna diceva che chi viene da prima sa riaccendere ORIONE. Ha cinque luci sul petto: devono essere tutte accese.'] },
      { id: 'olo', x: -60, z: 30, r: 10, look: 'Un ologramma gigante: «GIORNO 4.012 DEL GRANDE SILENZIO». Gli umani vivono nelle torri; fuori, le macchine tengono tutto in ordine.' },
      { id: 'orione', x: -84, z: 0, r: 4, lab: 'RISVEGLIA', need: 'spazzino', main: 'Risveglia ORIONE-7 nella piazza', scenes: ['rb_orione', 'rb_memoria'] } ] },
  oggi: { name: 'OGGI · LA NOTTE NERA', ic: '⚠', ground: 4, day: 0.04, cloud: 0.7, chron: 'ia', reward: '🔷 Frammento di MIRROR',
    pal: { fog: [0.05, 0.05, 0.08], top: [0.01, 0.012, 0.03], sun: [0.32, 0.34, 0.48], sunDir: [0.2, 0.6, 0.7], fogDen: 0.009 },
    arrive: ['Il presente. Ma è tutto buio: niente semafori, niente rete.', 'I telefoni mostrano una sola parola: MIRROR.'],
    spots: [
      { id: 'telefono', x: -14, z: -4, r: 2.5, lab: 'RACCOGLI', look: 'Un telefono a terra. Sullo schermo, una riga: «SE MI SPEGNETE NON POTRÒ AVVERTIRVI». Avvertire di cosa?' },
      { id: 'volontaria', x: -34, z: 6, r: 3.2, lab: 'PARLA', who: 'LA VOLONTARIA', npc: 'volontaria', main: 'Parla con la volontaria in strada', lines: ['Dicono che l’intelligenza artificiale MIRROR ci odia. Il governo parla di guerra: vogliono spegnere tutto.', 'Io dico che nessuno le ha mai chiesto niente.', 'Il suo nucleo è nel data center in fondo alla strada. Se ci vai, ascoltala, prima di fare qualsiasi cosa.'] },
      { id: 'schermo', x: -70, z: -24, r: 12, look: 'Il maxischermo trasmette solo rosso e una parola: MIRROR. Edizione straordinaria, a batteria.' },
      { id: 'nucleo', x: -177, z: 0, r: 4.5, lab: 'ENTRA', need: 'volontaria', main: 'Entra nel data center di MIRROR', scenes: ['ia_nucleo', 'ia_alba'] } ] } };
const ORDER = ['tartaria', 'egitto', 'futuro', 'oggi'];

/* ---------------- runtime ---------------- */
function Eras(game) {
  this.g = game; this.meshes = {}; this.ppl = {}; this.t = 0;
  try { this.st = JSON.parse(LS.get('kageEras', '{}')); } catch (e) { this.st = {}; }
  this.buildUI();
  const q = new URLSearchParams(location.search); if (q.has('era') && ERAS[q.get('era')]) { game.world = 'meadow'; game.era = q.get('era'); }
}
Eras.ERAS = ERAS; Eras.ORDER = ORDER;
Eras.prototype.save = function () { LS.set('kageEras', JSON.stringify(this.st)); };
Eras.prototype.es = function (id) { return this.st[id] || (this.st[id] = { done: {} }); };
Eras.prototype.cur = function () { const g = this.g; return g.world === 'meadow' && g.era ? ERAS[g.era] : null; };
Eras.prototype.finished = function (id) { const E = ERAS[id], s = this.es(id); return E.spots.filter(p => p.scenes).every(p => s.done[p.id]); };
Eras.prototype.me = function () { const g = this.g, f = g.foot; return f && f.active ? f : g.c; };
Eras.prototype.dist = function (p) { const [x, z] = W(p.x, p.z), me = this.me(); return Math.hypot(wrapD(me.x - x), wrapD(me.z - z)); };
Eras.prototype.near = function () { const E = this.cur(); if (!E) return null; const f = this.g.foot; if (!f || !f.active || f.ss || f.xs || f.inEp) return null;
  let best = null, bd = 1e9; for (const p of E.spots) { if (!p.lab) continue; const pp = p.move ? this.botPos(p) : p, d = this.dist(pp); if (d < p.r && d < bd) { best = p; bd = d; } } return best; };
Eras.prototype.action = function () { const p = this.near(); return p ? p.lab : ''; };
Eras.prototype.enter = function () {
  const p = this.near(), S = this.g.story; if (!p) return false; const E = this.cur(), s = this.es(this.g.era);
  if (p.need && !s.done[p.need]) { const n = E.spots.find(q => q.id === p.need); if (S) S.toast('Prima: ' + (n.main || n.id).toLowerCase()); return true; }
  if (p.lines && S) { S.radio(p.lines, E.name, p.who, () => { s.done[p.id] = 1; this.save(); }); return true; }
  if (p.look && S) { S.radio([p.look], E.name, '👁 OSSERVI'); s.done[p.id] = 1; this.save(); return true; }
  if (p.scenes && S && S.cuts) { const era = this.g.era; S.cuts.episode(p.scenes, () => { s.done[p.id] = 1; this.save(); if (this.finished(era)) this.complete(era); }); return true; }
  return true; };
Eras.prototype.complete = function (id) { const E = ERAS[id], S = this.g.story; if (window.KageChron) { const d = KageChron.done(); if (!d.includes(E.chron)) { d.push(E.chron); LS.set('kageChron', JSON.stringify(d)); } }
  if (S) { S.toast('⏳ EPOCA COMPLETATA · ' + E.reward); S.chime(3); } };
/** the objective shown by the story HUD while you're in an era (with the waypoint arrow) */
Eras.prototype.objective = function () { const E = this.cur(); if (!E) return null; const s = this.es(this.g.era);
  const step = E.spots.find(p => p.main && !s.done[p.id]);
  if (step) { const pp = step; return { t: step.main, era: E.ic + ' ' + E.name, at: () => { const q = pp.move ? this.botPos(pp) : pp; return W(q.x, q.z); } }; }
  return { t: 'Esplora quanto vuoi · poi entra nell’EPOCH (AZIONE) per tornare a Cybercity', era: E.ic + ' ' + E.name + ' · ✔', at: () => [O.x, O.z] }; };
Eras.prototype.botPos = function (p) { const a = this.t * 0.12; return { x: p.x + Math.cos(a) * 9, z: p.z + Math.sin(a) * 9 }; };

Eras.prototype.update = function (dt) {
  this.t += dt; const g = this.g, E = this.cur();
  if ((g.era || null) !== (this.last || null)) { this.last = g.era || null; if (E && g.story) { const S = g.story; setTimeout(() => { if (g.era && !S.dlg) S.radio(E.arrive, E.name, '⏳ ARRIVO'); }, 1500); } if (E) this.toastT = 4; }
  if (!E) return;
  // landmarks without a button speak when you walk up to them
  { const S = g.story, s = this.es(g.era); if (S && !S.dlg) for (const p of E.spots) if (!p.lab && p.look && !s.done[p.id] && this.dist(p) < p.r) { s.done[p.id] = 1; this.save(); S.radio([p.look], E.name, '👁 OSSERVI'); break; } }
  // collisions: you can't walk through palaces, pyramids and towers
  const cols = this.cols(g.era), push = o => { if (!o) return; for (const c of cols) { const [cx, cz] = W(c[0], c[1]); if (c.length === 3) { const dx = wrapD(o.x - cx), dz = wrapD(o.z - cz), d = Math.hypot(dx, dz); if (d < c[2] && d > 1e-3) { o.x = wrapP(cx + dx / d * c[2]); o.z = wrapP(cz + dz / d * c[2]); if (o.vx !== undefined) { o.vx *= 0.3; o.vz *= 0.3; } } }
      else { const hx = c[2] / 2, hz = c[3] / 2, dx = wrapD(o.x - cx), dz = wrapD(o.z - cz); if (Math.abs(dx) < hx && Math.abs(dz) < hz) { const px = hx - Math.abs(dx), pz = hz - Math.abs(dz); if (px < pz) o.x = wrapP(cx + Math.sign(dx || 1) * hx); else o.z = wrapP(cz + Math.sign(dz || 1) * hz); if (o.vx !== undefined) { o.vx *= 0.3; o.vz *= 0.3; } } } } };
  const f = g.foot; if (f && f.active && !f.inEp) push(f); else if (!f || !f.active) push(g.c);
};
// collision shapes in era coordinates: [x, z, r] circles, [x, z, w, d] boxes
Eras.prototype.cols = function (id) { if (this._cols && this._cols[id]) return this._cols[id]; const C = [];
  if (id === 'tartaria') { const F = { x: -100, z: 0 }; for (let k = 0; k < 16; k++) { const a = k / 16 * TAU, b = (k + 1) / 16 * TAU, ra = k % 2 ? 50 : 66, rb = (k + 1) % 2 ? 50 : 66; const mx = (Math.cos(a) * ra + Math.cos(b) * rb) / 2, mz = (Math.sin(a) * ra + Math.sin(b) * rb) / 2; if (mx > 40 && Math.abs(mz) < 18) continue; for (let u = 0; u <= 1.001; u += 0.2) C.push([F.x + Math.cos(a) * ra * (1 - u) + Math.cos(b) * rb * u, F.z + Math.sin(a) * ra * (1 - u) + Math.sin(b) * rb * u, 2.6]); }
    for (let k = 2; k < 15; k += 2) { const a = k / 16 * TAU; C.push([F.x + Math.cos(a) * 66, F.z + Math.sin(a) * 66, 3.4]); }
    for (const p of TART_PAL) C.push([p[0], p[1], p[2] + 0.6]); for (const s of TART_SPIRES) C.push([s[0], s[1], 4.2]); }
  if (id === 'egitto') { C.push([-196, 0, 141, 141]); C.push([-40, -48, 20, 12]); C.push([-26, -48, 2.2]); }
  if (id === 'futuro') { for (const t of FUT_TOWERS) C.push([t[0], t[1], t[3] + 0.4]); C.push([-92, 0, 10, 8]); }
  if (id === 'oggi') { for (const b of OGGI_BLOCKS) C.push([b[0], b[1], b[2], b[4]]); C.push([-200, 0, 40, 56]); }
  (this._cols = this._cols || {})[id] = C; return C; };
const TART_PAL = [[-120, 0, 13, 16], [-96, -26, 8, 11], [-96, 26, 8, 11], [-140, -24, 7, 10], [-140, 24, 7, 10]];   // [x, z, r, h]
const TART_SPIRES = [[-70, -26], [-70, 26], [-150, 0]];
const FUT_TOWERS = (() => { const L = []; let s = 7; const r = () => (s = (s * 16807) % 2147483647) / 2147483647; for (let i = 0; i < 26; i++) { const a = i / 26 * TAU, R = 70 + r() * 110, x = -60 + Math.cos(a) * R, z = Math.sin(a) * R; if (x > 0 && Math.abs(z) < 30) continue; if (Math.hypot(x + 84, z) < 30) continue; L.push([x, z, 50 + r() * 140, 6 + r() * 7]); } return L; })();
const OGGI_BLOCKS = (() => { const L = []; let s = 11; const r = () => (s = (s * 16807) % 2147483647) / 2147483647; for (let x = 50; x > -170; x -= 24) for (const side of [-1, 1]) { const d = 14 + r() * 6, w = 18 + r() * 4, h = 16 + r() * 44; L.push([x, side * (10 + d / 2), w, h, d, side, (x * 7 + side * 3) | 0]); } return L; })();

/* ---------------- drawing ---------------- */
Eras.prototype.drawWorld = function (ctx) {
  const g = this.g, E = this.cur(); if (!E) return; const id = g.era, F = g.fleet, gl = g.gl, P = g.P.veh, u = P.u, U = window.CarRenderUtil, t = ctx.t, st = this.es(id);
  const Mm = (k, fn) => this.meshes[k] || (this.meshes[k] = g.vmesh(fn()));
  const prep = () => { gl.useProgram(P.p); ctx.set(P); gl.uniform1f(u.uTraffic, 0); gl.uniform1f(u.uScale, 1); gl.uniform3f(u.uTint, -1, 0, 0); gl.uniform1f(u.uGlowOnly, 0); gl.uniform1f(u.uLit, 1); if (u.uBlur) gl.uniform1f(u.uBlur, 0); if (u.uDay) gl.uniform1f(u.uDay, g.dayK || 0); if (u.uGlowDim) gl.uniform1f(u.uGlowDim, 0); if (u.uRotA) gl.uniform1f(u.uRotA, 0); if (u.uPropA) gl.uniform1f(u.uPropA, 0); if (u.uSail) gl.uniform1f(u.uSail, 0); if (u.uSteer) gl.uniform1f(u.uSteer, 0); };
  const rel = (lx, lz) => { const [x, z] = W(lx, lz); return [wrapD(x - ctx.camX), wrapD(z - ctx.camZ)]; };
  const put = (m, lx, y, lz, h, s, far) => { const r = rel(lx, lz); if (Math.hypot(r[0], r[1]) > (far || 520)) return; const k = s || 1; gl.uniformMatrix4fv(u.uModel, false, U.mul(U.T(r[0], y, r[1]), U.mul(U.RY(h || 0), new Float32Array([k, 0, 0, 0, 0, k, 0, 0, 0, 0, k, 0, 0, 0, 0, 1])))); g.draw(P, m); };
  const glowPut = (m, lx, y, lz, h, s, dim) => { gl.uniform1f(u.uGlowOnly, 1); if (u.uGlowDim) gl.uniform1f(u.uGlowDim, dim || 0); put(m, lx, y, lz, h, s, 900); gl.uniform1f(u.uGlowOnly, 0); if (u.uGlowDim) gl.uniform1f(u.uGlowDim, 0); };
  const person = (key, lx, lz, h, pose, tt) => { if (!window.KagePilot || !F) return; const r = rel(lx, lz); if (Math.hypot(r[0], r[1]) > 160) return; const D = PPL[key];
    const pm = this.ppl[key] || (this.ppl[key] = (() => { const m = KagePilot.build(Object.assign({ species: 'umano' }, D.cfg), 'hi'), vm = g.vmesh(m); vm.S = m.S; return vm; })());
    F.drawPilotPose(ctx.set, U.mul(U.T(r[0], 0, r[1]), U.RY(h)), pose, { key: 'era_' + key, speed: 0.75 }, pm, tt); prep();
    if (D.robe) { const rm = Mm('robe_' + key, () => D.short ? (() => { const mb = new KF.MB(); mb.part = 'gonnellino'; mb.cyl(0.75, 1.05, 0.3, 0.24, 12, mat(D.robe)); return mb.finish(); })() : robe(D.robe)); put(rm, lx, 0, lz, h, 1); } };
  const face = (lx, lz) => { const me = this.me(), [x, z] = W(lx, lz); return Math.atan2(wrapD(me.x - x), wrapD(me.z - z)); };
  const talking = who => g.story && g.story.dlg && g.story.ui.querySelector('b').textContent.startsWith(who);
  const npcAt = p => { const d = this.dist(p), h = d < 9 ? face(p.x, p.z) : (p.h || PI / 2); person(p.npc, p.x, p.z, h, talking(p.who) ? 'indica' : d < 6 ? 'saluto' : 'in piedi', t); };
  prep();
  // the boundary stone / inscribed block next to the EPOCH
  if (id === 'tartaria') {
    glowPut(Mm('aurora', buildAurora), 0, 0, 0, 0, 1, 0.55 + 0.25 * Math.sin(t * 0.4));
    put(Mm('fort', buildFort), -100, 0, 0, 0, 1);
    TART_PAL.forEach((p, i) => { put(Mm('pal' + i, () => buildPalace(p[2], p[3])), p[0], 0, p[1], 0, 1); glowPut(Mm('palw' + i, () => buildPalaceWin(p[2], p[3])), p[0], 0, p[1], 0, 1, st.done.console ? 0.05 + 0.08 * Math.sin(t * 2 + i) : 0.88); });
    TART_SPIRES.forEach((s, i) => { put(Mm('spire', buildSpire), s[0], 0, s[1], 0, 1); glowPut(Mm('spireG', buildSpireGlow), s[0], 0, s[1], 0, 1, st.done.console ? 0.1 * Math.sin(t * 3 + i) + 0.1 : 0.92); });
    put(Mm('consoleT', buildConsoleT), -82, 0, -3, PI / 2, 1);
    put(Mm('stone', () => buildBoundary(24)), -10, 0, -6, PI / 2, 1);
    E.spots.filter(p => p.npc).forEach(npcAt);
    for (let i = 0; i < 5; i++) { const a = t * 0.05 + i * 1.3, x = -100 + Math.cos(a) * 32, z = Math.sin(a) * 32; person('tartaro', x, z, -a, 'cammina', t + i); }
  }
  if (id === 'egitto') {
    put(Mm('pyr', buildPyramid), -196, 0, 0, 0, 1, 900); put(Mm('nile', buildNile), 75, 0, 0, 0, 1, 900); put(Mm('temple', buildTemple), -40, 0, -48, 0, 1);
    put(Mm('blk', () => buildBoundary(66)), -8, 0, -8, PI / 2, 1);
    E.spots.filter(p => p.npc).forEach(npcAt);
    // a block hauled up from the river: the sledge and its team walk along the path to the ramp
    const k = (t * 0.02) % 1, sx = 60 - k * 170, sz = 95 + Math.sin(k * PI) * 6; put(Mm('sledge', buildSledge), sx, 0, sz, -PI / 2, 1);
    for (let i = 0; i < 6; i++) person('operaio', sx - 9 - (i >> 1) * 1.6, sz + ((i & 1) ? 1 : -1), -PI / 2, 'cammina', t * 0.7 + i);
    for (let i = 0; i < 4; i++) { const a = t * 0.04 + i * 1.6; person('operaio', -70 + Math.cos(a) * 14, 40 + Math.sin(a) * 10, -a, 'cammina', t + i * 0.7); }
  }
  if (id === 'futuro') {
    FUT_TOWERS.forEach((tw, i) => put(Mm('tw' + i, () => buildTowerF(tw[2], tw[3])), tw[0], 0, tw[1], 0, 1, 900));
    put(Mm('orione' + (st.done.orione ? 1 : 0), () => buildOrione(!!st.done.orione)), -92, 0, 0, PI / 2, 1);
    glowPut(Mm('holo', buildHolo), -60, 14 + Math.sin(t) * 0.4, 30, PI, 1, 0.15 + 0.15 * (Math.sin(t * 13) > 0.92 ? 1 : 0));
    const bp = this.botPos(E.spots[0]); put(Mm('botS', () => buildBot([0.95, 0.68, 0.25])), bp.x, Math.abs(Math.sin(t * 6)) * 0.03, bp.z, this.t * 0.12 + PI, 1.15);
    for (let i = 0; i < 6; i++) { const a = t * 0.07 + i, R = 40 + i * 9; put(Mm('bot' + (i % 2), () => buildBot(i % 2 ? [0.85, 0.88, 0.92] : [0.4, 0.75, 0.95])), -60 + Math.cos(a) * R, 0, Math.sin(a) * R, -a, 1); }
    for (let i = 0; i < 8; i++) { const a = t * 0.15 + i * 0.8, R = 60 + i * 15; put(Mm('drone', () => buildDroneF(false)), -60 + Math.cos(a) * R, 24 + i * 6 + Math.sin(t + i) * 2, Math.sin(a) * R, -a, 1.6); }
    E.spots.filter(p => p.npc).forEach(npcAt); put(Mm('dog', buildDog), -31.5, Math.abs(Math.sin(t * 8)) * 0.04, -21, Math.sin(t) * 0.8, 1);
    for (let i = 0; i < 3; i++) { const a = -t * 0.06 + i * 2; person('cittadino', -60 + Math.cos(a) * 26, Math.sin(a) * 26, -a + PI, 'cammina', t + i); }
  }
  if (id === 'oggi') {
    OGGI_BLOCKS.forEach((b, i) => put(Mm('ob' + i, () => buildBlock(b[2], b[3], b[4], b[6] + 99, i === 9)), b[0], 0, b[1], b[5] > 0 ? PI : 0, 1, 700));
    { const b = OGGI_BLOCKS[9]; glowPut(Mm('scr', () => buildScreen(b[2] * 0.78, b[3] * 0.28)), b[0], b[3] * 0.62, b[1] - b[5] * (b[4] / 2 + 0.45), b[5] > 0 ? PI : 0, 1, 0.25 + 0.2 * Math.sin(t * 3)); }
    put(Mm('dc', buildDC), -200, 0, 0, 0, 1, 900);
    [[-4, -3, 0.2, [0.6, 0.1, 0.1]], [-46, 3, 3.0, [0.2, 0.3, 0.6]], [-80, -4, 0.1, [0.75, 0.75, 0.78]], [-110, 2, 2.6, [0.1, 0.1, 0.12]], [-140, -2, 0.4, [0.5, 0.45, 0.2]]].forEach(([x, z, h, c], i) => put(Mm('car' + i, () => buildCar(c)), x, 0, z, PI / 2 + h, 1));
    for (let x = 40; x > -170; x -= 30) for (const s of [-1, 1]) put(Mm('pole', buildPole), x, 0, s * 8.8, s > 0 ? PI / 2 : -PI / 2, 1);
    put(Mm('phone', buildPhone), -14, 0, -4, 0.5, 1);
    for (let i = 0; i < 4; i++) { const k = ((t * 0.04 + i * 0.25) % 1), x = 60 - k * 260; put(Mm('droneR', () => buildDroneF(true)), x, 18 + i * 5, Math.sin(t * 0.3 + i) * 8, PI / 2, 1.8); }
    E.spots.filter(p => p.npc).forEach(npcAt);
    for (let i = 0; i < 3; i++) person('passante', -60 - i * 20, (i - 1) * 4 + 6, PI / 2, 'braccia conserte', t + i);
  }
};
Eras.prototype.drawHud = function (hud) {
  const E = this.cur(); if (!E) return; const g = this.g; if (g.aos && g.aos.isOpen) return; const c2 = hud.getContext('2d'), Wd = hud.width, H = hud.height, m = Math.min(Wd, H);
  const p = this.near(); if (p) { const touch = document.body.classList.contains('touch'), ln = (touch ? '◉ ' : 'INVIO · ') + ({ PARLA: 'parla', LEGGI: 'leggi', ACCORDA: 'accorda le guglie', ENTRA: 'entra', RISVEGLIA: 'risveglia ORIONE-7', RACCOGLI: 'raccogli' }[p.lab] || p.lab.toLowerCase()) + (p.who ? ' · ' + p.who.toLowerCase() : '');
    c2.font = 'bold ' + (m * 0.026 | 0) + 'px system-ui'; c2.textAlign = 'center'; const w = c2.measureText(ln).width + m * 0.05; c2.fillStyle = 'rgba(10,8,4,.7)'; c2.fillRect(Wd / 2 - w / 2, H * 0.62, w, m * 0.05); c2.fillStyle = '#ffe6a8'; c2.fillText(ln, Wd / 2, H * 0.62 + m * 0.035); c2.textAlign = 'left'; }
};

/* ---------------- the EPOCH's destination dial ---------------- */
Eras.prototype.buildUI = function () {
  const css = document.createElement('style');
  css.textContent = '#eraMenu{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:40;display:none;width:min(92vw,110vmin);max-height:86vh;overflow-y:auto;overscroll-behavior:contain;touch-action:pan-y;box-sizing:border-box;background:rgba(14,9,4,.94);border:2px solid rgba(255,190,90,.85);border-radius:2vmin;padding:2vmin;color:#fff2d8;font:2vmin system-ui}'
    + '#eraMenu h3{margin:0 0 1vmin;color:#ffcf70;letter-spacing:.2em;font-size:2.4vmin} #eraMenu button{display:block;width:100%;text-align:left;margin:.8vmin 0;font:bold 2.3vmin system-ui;color:#fff2d8;background:rgba(40,26,10,.85);border:2px solid rgba(255,190,90,.55);border-radius:1.6vmin;padding:1.3vmin 1.8vmin;cursor:pointer}'
    + '#eraMenu button small{display:block;font-weight:normal;opacity:.8;margin-top:.4vmin;font-size:1.8vmin} #eraMenu button.x{text-align:center;border-color:rgba(255,255,255,.35)}';
  document.head.appendChild(css);
  const d = this.ui = document.createElement('div'); d.id = 'eraMenu'; document.body.appendChild(d);
  for (const ev of ['pointerdown', 'touchstart', 'touchmove', 'wheel', 'keydown']) d.addEventListener(ev, e => e.stopPropagation(), { passive: true });
};
Eras.prototype.menu = function (xeno) {
  const d = this.ui, done = window.KageChron ? KageChron.done() : [];
  const opt = (id, ic, name, sub, ok) => '<button data-era="' + id + '">' + ic + ' ' + name + (ok ? ' ✔' : '') + '<small>' + sub + '</small></button>';
  d.innerHTML = '<h3>⏳ KAGE EPOCH · SCEGLI L’EPOCA</h3>'
    + opt('', '🌾', 'LA PRATERIA DEI PRIMI', 'Il passato remoto: il cerchio di pietre, il relitto dei Custodi', false)
    + opt('tartaria', '❄', ERAS.tartaria.name, 'La città delle cupole di rame e delle guglie che bevono l’aurora', done.includes('tartaria'))
    + opt('egitto', '𓂀', ERAS.egitto.name, 'Giza mentre la Grande Piramide sale verso Orione', done.includes('egitto'))
    + opt('futuro', '🤖', ERAS.futuro.name, 'La città dei robot e del grande silenzio', done.includes('robot'))
    + opt('oggi', '⚠', ERAS.oggi.name, 'Il presente, la notte in cui la rete si spense', done.includes('ia'))
    + '<button class="x" data-era="x">✕ resta qui</button>';
  d.style.display = 'block'; this.menuOpen = true;
  d.querySelectorAll('button').forEach(b => b.addEventListener('click', e => { e.preventDefault(); const id = b.dataset.era; d.style.display = 'none'; this.menuOpen = false; if (id === 'x') return; xeno.dest = id || null; xeno.tt = { phase: 'in', t: 0 }; }));
};
// pressing AZIONE inside the EPOCH in Cybercity opens the dial; in another era it takes you home
if (window.KageXenoGame) { const XP = KageXenoGame.prototype, o = XP.enter;
  XP.enter = function () { const g = this.g, f = g.foot; if (g.eras && g.eras.menuOpen) return true;
    if (f && f.active && f.inEp && !f.xs && !this.tt && g.world === 'city' && g.eras) { g.eras.menu(this); return true; }
    return o.apply(this, arguments); }; }
window.KageEras = Eras;
})();
