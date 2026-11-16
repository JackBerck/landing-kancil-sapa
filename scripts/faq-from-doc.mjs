// Fallback sumber FAQ: baca Dokumen_Inventarisasi_FAQ.docx.md -> src/lib/content/faqs.json
// Sumber utama tetap `php artisan faq:export` (hanya FAQ terverifikasi + aktif).
// Semua FAQ dianggap terverifikasi (konfirmasi pemilik, 2026-11-16).
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const src = resolve(root, '../Dokumen/Dokumen_Inventarisasi_FAQ.docx.md');
const out = resolve(root, 'src/lib/content/faqs.json');

const BACKSLASH = String.fromCharCode(92);
const clean = (s) => s.split(BACKSLASH).join('').replace(/\s+/g, ' ').trim();
const faqs = [];

for (const line of readFileSync(src, 'utf8').split(/\r?\n/)) {
	const m = line.match(/^\|\s*\*\*([A-Z]{3}-\d{3})\*\*\s*\|(.+)\|\s*$/);
	if (!m) continue;
	const cols = m[2].split('|').map((c) => c.trim());
	if (cols.length < 4) continue;
	faqs.push({
		code: m[1],
		category: null,
		question: clean(cols[0]),
		answer: clean(cols[1]),
		verified_at: '2026-11-16'
	});
}

mkdirSync(dirname(out), { recursive: true });
writeFileSync(
	out,
	JSON.stringify({ generated_at: new Date().toISOString(), source: 'dokumen', faqs }, null, '\t') +
		'\n'
);
console.log(`${faqs.length} FAQ -> ${out}`);
