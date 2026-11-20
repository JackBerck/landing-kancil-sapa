// Tulis src/lib/chatbot/bot-script.json dari repo bot (Laravel) agar chat bot landing identik dengan bot WhatsApp.
// Pakai: pnpm bot:sync [path-ke-repo-laravel]   (default ../Project_Magang_KANCIL)
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const laravel = resolve(root, process.argv[2] ?? '../Project_Magang_KANCIL');
const out = resolve(root, 'src/lib/chatbot/bot-script.json');

const json = execFileSync('php', [resolve(root, 'scripts/bot-export.php'), laravel], {
	encoding: 'utf8',
	maxBuffer: 16 * 1024 * 1024
});
const data = JSON.parse(json);

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify(data, null, '\t') + '\n');
console.log(
	`bot-script.json: ${Object.keys(data.menus).length} menu, ${Object.keys(data.answers).length} jawaban -> ${out}`
);
