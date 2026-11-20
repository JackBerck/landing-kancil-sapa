// Sumber FAQ landing = data FAQ bot (Project_Magang_KANCIL/database/data/faqs.php), yang sudah dikalibrasi ke
// Inventarisasi FAQ 3.1 + feedback Imigrasi (audit 20-21 Nov 2026) dan seluruhnya terverifikasi di produksi.
// Format WhatsApp (*tebal*, butir "•", baris baru) diubah ke format landing (**tebal**), struktur baris dipertahankan.
//
// Pakai: pnpm faq:sync [path-ke-repo-laravel]   (default ../Project_Magang_KANCIL)
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const laravel = resolve(root, process.argv[2] ?? '../Project_Magang_KANCIL');
const dataFile = resolve(laravel, 'database/data/faqs.php');
const out = resolve(root, 'src/lib/content/faqs.json');
const verifiedAt = process.env.FAQ_VERIFIED_AT ?? '2026-11-21';

const json = execFileSync(
	'php',
	[
		'-r',
		'echo json_encode(require $argv[1], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);',
		dataFile
	],
	{ encoding: 'utf8' }
);

/** *tebal* WhatsApp -> **tebal** landing; spasi akhir baris dibuang. */
export const toLanding = (text) =>
	text
		.replace(/\r\n?/g, '\n')
		.replace(/(^|[^*])\*([^*\n]+?)\*(?!\*)/g, '$1**$2**')
		.split('\n')
		.map((line) => line.trimEnd())
		.join('\n')
		.trim();

const faqs = JSON.parse(json).map((row) => ({
	code: row.code,
	category: row.group ?? null,
	question: row.question.trim(),
	answer: toLanding(row.answer),
	verified_at: verifiedAt
}));

mkdirSync(dirname(out), { recursive: true });
writeFileSync(
	out,
	JSON.stringify({ generated_at: new Date().toISOString(), source: 'laravel', faqs }, null, '\t') +
		'\n'
);
console.log(`${faqs.length} FAQ -> ${out}`);
