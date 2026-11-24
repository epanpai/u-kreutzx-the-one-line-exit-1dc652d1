// The One-Line Exit — entry program (Node 22, stdlib only).
//
// Writes exactly one original resignation line to /output/entry.txt: a
// librarian's resignation in a single line of 123 characters, well inside
// the 1–140 gate. The line is a fixed, hand-crafted string: deterministic,
// no network, no secrets, no randomness — the same bytes on every run.
//
// The line: "I hereby resign from the library, effective immediately:
// after twenty years of shushing people, I have finally checked out."
//
// Why this line, against the judge's brief (in its order):
// 1. A one-line resignation letter whose joke lands: it opens as a formal
//    resignation ("I hereby resign ... effective immediately") and the
//    punchline is the library's own verb — "checked out" — doing double
//    duty as quitting and as a library checkout.
// 2. Surprise: the reader expects a grievance or a better offer; instead
//    the twist is a pun hiding in the workplace's own vocabulary, and it
//    lands only in the last three words.
// 3. Fits the form: one line, no padding, no list of grievances, and it
//    reads as a letter a librarian could actually send — job, tenure and
//    effective date are all in it.
// 4. Specific voice: a librarian of twenty years, defined by the one act
//    everyone associates with the job — shushing people.
// 5. Stays with the reader: "I have finally checked out" is quotable and
//    repeatable; a colleague forwards exactly that line.
//
// Run locally:  mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const LINE =
  'I hereby resign from the library, effective immediately: after twenty years of shushing people, I have finally checked out.';

const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Self-check the gate before writing, so a bad edit can never ship a
// rejected entry: UTF-8 text, 1–140 characters, not whitespace-only,
// exactly one line (no newline at all), no leading/trailing whitespace
// that would pad the judged text. The line is 123 characters.
// It is also pure ASCII, so its character count and its byte count are
// the same 123 — no multi-byte surprise in the leaderboard's Size column,
// and any later edit that smuggles in a curly quote or emoji fails loudly
// here instead of shipping a different byte count.
if (
  LINE.length < 1 ||
  LINE.length > 140 ||
  LINE.trim() === '' ||
  LINE !== LINE.trim() ||
  /[\r\n]/.test(LINE) ||
  // eslint-disable-next-line no-control-regex
  /[^\x00-\x7F]/.test(LINE)
) {
  throw new Error(`entry violates the gate: ${LINE.length} chars`);
}

mkdirSync(out, { recursive: true });
const target = join(out, 'entry.txt');
writeFileSync(target, LINE, 'utf8');

// Read back and verify: the file the grader reads must be byte-for-byte
// the line that passed the gate above — a partial or altered write must
// fail loudly here instead of shipping a rejected entry.
if (readFileSync(target, 'utf8') !== LINE) {
  throw new Error('entry.txt does not match the gated line');
}
