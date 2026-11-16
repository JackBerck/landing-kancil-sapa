import { site } from '#lib/site';
import { groups } from '#lib/faq';

export const prerender = true;

const pages = [
	{ path: '/', priority: '1.0' },
	{ path: '/layanan', priority: '0.8' },
	...groups.map((g) => ({ path: `/layanan/${g.slug}`, priority: '0.8' })),
	{ path: '/faq', priority: '0.8' },
	{ path: '/pengaduan', priority: '0.6' },
	{ path: '/kontak', priority: '0.6' },
	{ path: '/tentang', priority: '0.4' },
	{ path: '/privasi', priority: '0.3' }
];

export function GET() {
	const urls = pages
		.map(
			(p) =>
				`  <url>\n    <loc>${site.url}${p.path === '/' ? '/' : p.path}</loc>\n    <lastmod>${site.lastVerified}</lastmod>\n    <priority>${p.priority}</priority>\n  </url>`
		)
		.join('\n');
	const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
	return new Response(body, {
		headers: { 'Content-Type': 'application/xml; charset=utf-8' }
	});
}
