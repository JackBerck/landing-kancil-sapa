import QRCode from 'qrcode';
import { site, waUrl } from '#lib/site';
import type { PageServerLoad } from './$types';

// Dijalankan saat build (prerender): QR dibangkitkan sebagai SVG, tanpa berkas gambar.
export const load: PageServerLoad = async () => {
	const qrs = await Promise.all(
		site.whatsapp.map(async (wa) => ({
			id: wa.id,
			svg: await QRCode.toString(waUrl(wa.number), {
				type: 'svg',
				margin: 0,
				errorCorrectionLevel: 'M'
			})
		}))
	);
	return { qrs };
};
