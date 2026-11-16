// Bangkitkan ikon dan gambar OG dari logo Imigrasi Cilacap.
//   node scripts/make-assets.mjs
// OG memakai Playwright (Chromium) untuk merender scripts/og-card.html.
import { mkdirSync, copyFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import sharp from 'sharp';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const logo = resolve(root, 'src/lib/assets/brand/logo-imigrasi.png');
const stat = (p) => resolve(root, 'static', p);
mkdirSync(stat('og'), { recursive: true });

const paper = { r: 250, g: 247, b: 240, alpha: 1 };

await sharp(logo)
	.resize(96, 96)
	.png({ compressionLevel: 9 })
	.toFile(resolve(root, 'src/lib/assets/brand/logo-96.png'));
await sharp(logo).resize(32, 32).png().toFile(stat('favicon-32.png'));
await sharp(logo).resize(48, 48).png().toFile(stat('favicon.ico'));
await sharp(logo)
	.resize(144, 144)
	.extend({ top: 18, bottom: 18, left: 18, right: 18, background: paper })
	.png()
	.toFile(stat('apple-touch-icon.png'));
await sharp(logo).resize(192, 192).png({ palette: true }).toFile(stat('icon-192.png'));
await sharp(logo).resize(512, 512).png({ palette: true }).toFile(stat('icon-512.png'));
copyFileSync(logo, stat('og/logo.png'));

const { chromium } = await import('playwright');
const browser = await chromium.launch();
const page = await browser.newPage({
	viewport: { width: 1200, height: 630 },
	deviceScaleFactor: 1
});
await page.goto(pathToFileURL(resolve(root, 'scripts/og-card.html')).href);
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: stat('og/default.png') });
await browser.close();
console.log('assets ok');
