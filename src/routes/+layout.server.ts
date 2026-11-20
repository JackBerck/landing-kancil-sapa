import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { LayoutServerLoad } from './$types';

/**
 * Skrip chat bot (bundel terpisah, `pnpm build:chatbot`). Dibaca saat prerender; hash isi dipakai sebagai ?v= agar
 * pengunjung selalu mendapat versi terbaru. Bila belum dibangun (mis. `pnpm dev` tanpa build:chatbot), widget tidak dipasang.
 */
export const load: LayoutServerLoad = () => {
	const manifest = resolve('static/chatbot/manifest.json');
	if (!existsSync(manifest)) return { chatbotSrc: null };

	const { file, hash } = JSON.parse(readFileSync(manifest, 'utf8')) as {
		file: string;
		hash: string;
	};
	return { chatbotSrc: `/chatbot/${file}?v=${hash}` };
};
