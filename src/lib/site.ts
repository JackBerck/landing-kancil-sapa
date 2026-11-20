/** Fakta situs. Satu tempat untuk nomor, alamat, dan jam, supaya mudah diganti (mis. saat pindah ke WABA). */
export const site = {
	name: 'KANCIL SAPA',
	tagline: 'Layanan WhatsApp Kantor Imigrasi Cilacap',
	office: 'Kantor Imigrasi Kelas I TPI Cilacap',
	url: 'https://kancilsapa.com',
	dashboardUrl: 'https://dashboard.kancilsapa.com',
	locale: 'id_ID',
	email: 'cilacap@imigrasi.go.id',
	/** Dua nomor WhatsApp bot. Format wa.me: kode negara tanpa plus. */
	whatsapp: [
		{ id: 'utama', number: '6281217000900', display: '0812-1700-0900', raw: '081217000900' },
		{ id: 'kedua', number: '6285184542256', display: '0851-8454-2256', raw: '085184542256' }
	],
	address: {
		street: 'Jl. Urip Sumoharjo No.249',
		area: 'Pantusan, Gumilir',
		district: 'Kec. Cilacap Utara',
		city: 'Kabupaten Cilacap',
		region: 'Jawa Tengah',
		postalCode: '53231'
	},
	hours: {
		bot: '24 jam, setiap hari',
		staff: 'Senin sampai Kamis 08.00 sampai 16.00 WIB, Jumat 08.00 sampai 16.30 WIB'
	},
	lastVerified: '2026-11-16',
	lastVerifiedLabel: '16 November 2026'
} as const;

export const addressLine = `${site.address.street}, ${site.address.area}, ${site.address.district}, ${site.address.city}, ${site.address.region} ${site.address.postalCode}`;

export const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
	`${site.office}, ${addressLine}`
)}`;

export function waUrl(number: string, text = 'Halo'): string {
	return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

export const nav = [
	{ href: '/layanan', label: 'Layanan' },
	{ href: '/faq', label: 'Tanya jawab' },
	{ href: '/pengaduan', label: 'Pengaduan' },
	{ href: '/kontak', label: 'Kontak' }
] as const;
