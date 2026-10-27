// Completion-code tests for Retro Reactions (Step 5 of COMPLETION_CODE_FIXES.md).
// Checks the game's code function against the instructor's checker, which is the reference function.
// The checker is private and is NOT in this repository; point CHECKER_HTML at it:
//   CHECKER_HTML=../SmallerThanSmall/checker.html node test/completion-code.test.mjs
// (default: ../SmallerThanSmall/checker.html next to this repository).
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import vm from 'node:vm';

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, '..');
const checkerPath = path.resolve(process.env.CHECKER_HTML || path.join(repo, '..', 'SmallerThanSmall', 'checker.html'));
const gamePath = path.resolve(process.env.GAME_HTML || path.join(repo, 'index.html'));

let failures = 0, checks = 0;
function ok(cond, msg) { checks++; if (!cond) { failures++; if (failures <= 20) console.error('FAIL: ' + msg); } }

// ---------- the checker (reference) ----------
const checkerHtml = readFileSync(checkerPath, 'utf8').replace(/\r\n/g, '\n');
const checkerJs = checkerHtml.slice(checkerHtml.indexOf('<script>') + 8, checkerHtml.indexOf('// ---------- One student'));
const C = vm.createContext({ TextEncoder, BigInt, Uint8Array, Uint32Array, DataView, Map, Date, String, Number, Math, Object });
vm.runInContext(checkerJs + '\n;this.api = { SECRET, ALPHABET, GAMES, normalize, sha256, makeCode, codeFor, clean, prefixOf, findScore, judge, dayKey };', C);
const chk = C.api;

// ---------- the game ----------
const gameHtml = readFileSync(gamePath, 'utf8').replace(/\r\n/g, '\n');
const start = gameHtml.indexOf('const CODE_PREFIX');
const dayStart = gameHtml.indexOf('const dayKey', start);
const end = gameHtml.indexOf('\n', dayStart);
const xc = gameHtml.match(/const EXTRA_CREDIT = (\d+(?:\.\d+)?);/);
if (start < 0 || dayStart < 0 || !xc) { console.error('Could not find the code functions or EXTRA_CREDIT in index.html'); process.exit(2); }
const G = vm.createContext({ TextEncoder, BigInt, Uint8Array, Uint32Array, DataView, Date, String, Number, Math });
vm.runInContext(gameHtml.slice(start, end) + '\n;this.api = { CODE_PREFIX, CODE_SECRET, normalizeUser, completionCode, certCode, dayKey };', G);
const game = G.api;
const EXTRA_CREDIT = Number(xc[1]);

// ---------- random inputs ----------
let seed = 20261026;
const rnd = () => (seed = (seed * 48271) % 2147483647) / 2147483647;
const pick = s => s[Math.floor(rnd() * s.length)];
function randomUser() {
  const letters = 'abcdefghijklmnopqrstuvwxyz', digits = '0123456789';
  const kind = Math.floor(rnd() * 5);
  if (kind === 0) return 'n00' + Array.from({ length: 6 }, () => pick(digits)).join('');            // student number
  let u = Array.from({ length: 3 + Math.floor(rnd() * 8) }, () => pick(letters + digits)).join('');
  if (kind === 1) u = u[0].toUpperCase() + u.slice(1) + '.' + pick(letters) + pick(letters);        // Name.xx
  if (kind === 2) u = '  ' + u.toUpperCase() + ' ';                                                   // spaces and caps
  if (kind === 3) u = u + '@students.example.edu';                                                    // an email
  return u;
}
const randomDay = () => `2026-${String(1 + Math.floor(rnd() * 12)).padStart(2, '0')}-${String(1 + Math.floor(rnd() * 28)).padStart(2, '0')}`;
const maxHalf = Math.round(EXTRA_CREDIT * 2);

// 1. The checker is the same one that verifies STS and LM, and it is set up for this game
for (const [u, c] of [['jdoe', 'STS-DLBB-28EH'], ['n00123456', 'STS-UUQE-NY6P'], ['maria.lopez', 'STS-XWWC-RT88']]) ok(chk.codeFor(u) === c, `checker STS test vector ${u}`);
const RR = chk.GAMES.RR;
ok(RR && RR.ready, 'the checker has Retro Reactions turned on');
ok(RR && RR.prefix === 'RR' && game.CODE_PREFIX === 'RR', 'prefix is RR in the game and the checker');
ok(RR && RR.secret === game.CODE_SECRET, 'the checker holds the game\'s secret');
ok(RR && RR.scored && RR.outOf === EXTRA_CREDIT, `the checker scores RR out of EXTRA_CREDIT (${EXTRA_CREDIT})`);
ok(game.CODE_SECRET !== chk.SECRET && game.CODE_SECRET !== chk.GAMES.LM.secret, 'Retro Reactions has its own secret');

// 2. 2,000 random usernames, scores and dates: the game's code equals the checker's, and each changed field fails
const N = 2000;
for (let i = 0; i < N; i++) {
  const u = randomUser(), k = Math.floor(rnd() * (maxHalf + 1)), pts = k / 2, day = randomDay();
  const code = game.certCode(u, pts, day);
  const ref = chk.codeFor(u, 'RR', pts, day);
  ok(code === ref, `same code as the checker for ${JSON.stringify(u)}, ${pts} points, ${day}: ${code} vs ${ref}`);
  ok(game.normalizeUser(u) === chk.normalize(u), `same username normalization for ${JSON.stringify(u)}`);
  ok(/^RR-[2-9A-HJ-NP-Z]{4}-[2-9A-HJ-NP-Z]{4}$/.test(code), `code format ${code}`);
  ok(chk.prefixOf(code) === 'RR', `the checker reads the prefix of ${code}`);

  let other = randomUser(); while (chk.normalize(other) === chk.normalize(u)) other = randomUser();
  ok(chk.codeFor(other, 'RR', pts, day) !== code, `fails under another username (${u} vs ${other})`);
  const k2 = (k + 1 + Math.floor(rnd() * maxHalf)) % (maxHalf + 1);
  ok(chk.codeFor(u, 'RR', k2 / 2, day) !== code, `fails with another score (${k} vs ${k2} half-points)`);
  let day2 = randomDay(); while (day2 === day) day2 = randomDay();
  ok(chk.codeFor(u, 'RR', pts, day2) !== code, `fails with another date (${day} vs ${day2})`);
  // another prefix: Lewis Manor's steps with the same fields, the STS code, and the checker rejecting the code under the other games
  ok(chk.codeFor(u, 'LM', pts, day).slice(3) !== code.slice(3), 'differs from the LM code for the same username, points and date');
  ok(chk.codeFor(u).slice(4) !== code.slice(3), 'differs from the STS code for the same username');
  ok(chk.judge(u, code, 'LM').kind === 'no', 'an RR code checked as Lewis Manor is rejected (wrong game)');
  ok(chk.judge(u, code, 'STS').kind === 'no', 'an RR code checked as Smaller Than Small is rejected (wrong game)');
  ok(chk.judge(u, 'LM' + code.slice(2), 'LM').kind === 'no', 'an RR code with its prefix changed to LM fails the LM check');
}

// 3. The checker's full check (what the instructor clicks) recovers the points and date of recent codes, and rejects a changed username
const today = new Date();
for (let i = 0; i < 200; i++) {
  const u = randomUser(), k = i % 4 === 0 ? Math.floor(rnd() * (maxHalf + 1)) : maxHalf;   // mostly full credit, as the game gives
  const d = new Date(today); d.setDate(today.getDate() - Math.floor(rnd() * 380));
  const day = game.dayKey(d);
  const code = game.certCode(u, k / 2, day);
  const j = chk.judge(u, code.toLowerCase().replace(/-/g, ' '), 'RR');
  ok(j.kind === 'ok' && j.ptsNum === k / 2 && j.day === day, `checker recovers ${k / 2} points on ${day} for ${u}: ${JSON.stringify(j)}`);
  let other = randomUser(); while (chk.normalize(other) === chk.normalize(u)) other = randomUser();
  ok(chk.judge(other, code, 'RR').kind === 'no', 'checker rejects the code under another username');
}

console.log(`${checks - failures} of ${checks} checks passed (${N} random cases).`);
process.exit(failures ? 1 : 0);
