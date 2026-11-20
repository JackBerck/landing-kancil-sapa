import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

/**
 * Bundel terpisah untuk chat bot (satu-satunya JavaScript di situs ini; halaman lain tetap tanpa hidrasi).
 * Keluaran: static/chatbot/widget.js + static/chatbot/manifest.json (hash isi untuk cache busting ?v=).
 * Dijalankan oleh `pnpm build:chatbot` sebelum `vite build`.
 */
const outDir = resolve(__dirname, 'static/chatbot');

export default defineConfig({
	resolve: {
		alias: { '#lib': resolve(__dirname, 'src/lib') }
	},
	build: {
		outDir,
		emptyOutDir: true,
		copyPublicDir: false,
		target: 'es2020',
		minify: true,
		lib: {
			entry: resolve(__dirname, 'src/lib/chatbot/widget.ts'),
			name: 'KancilSapaChatbot',
			formats: ['iife'],
			fileName: () => 'widget.js'
		}
	},
	plugins: [
		{
			name: 'chatbot-manifest',
			closeBundle() {
				const code = readFileSync(resolve(outDir, 'widget.js'));
				const hash = createHash('sha256').update(code).digest('hex').slice(0, 12);
				writeFileSync(
					resolve(outDir, 'manifest.json'),
					JSON.stringify({ file: 'widget.js', hash }) + '\n'
				);
			}
		}
	]
});
