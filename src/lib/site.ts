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
	/** Lokasi layanan paspor lain (sama dengan menu "Lokasi Kami" di bot, feedback Imigrasi 20-21 Nov 2026). */
	locations: [
		{
			name: 'Mal Pelayanan Publik (MPP) Cilacap',
			address:
				'Jl. Gatot Subroto No.268 Lantai 2, Karang Lor, Gunungsimping, Kec. Cilacap Tengah, Kabupaten Cilacap, Jawa Tengah 53224',
			maps: 'https://maps.app.goo.gl/8nMhuDQmjkW56mnE9'
		},
		{
			name: 'Mal Pelayanan Publik (MPP) Banyumas',
			address:
				'Jl. Dr. Angka No.45, Karangkobar, Sokanegara, Kec. Purwokerto Tim., Kabupaten Banyumas, Jawa Tengah 53115',
			maps: 'https://maps.app.goo.gl/9NsKFWBDHz8kRGRi6'
		},
		{
			name: 'Mal Pelayanan Publik (MPP) Purbalingga',
			address:
				'Jl. Raya Mayjen Sungkono No. 16, Selabaya, Kecamatan Kalimanah, Kabupaten Purbalingga, Jawa Tengah 53371',
			maps: 'https://maps.app.goo.gl/wFeYgwqUDX7Byi31A'
		}
	],
	officeMaps: 'https://maps.app.goo.gl/nsSRkK4pQqpF6rHM6',
	/** Tempat permohonan pada menu Cek Status Paspor. */
	applicationPlaces: [
		'Imigrasi Cilacap',
		'MPP Banyumas',
		'MPP Purbalingga',
		'Ngapak Banyumas',
		'Ngapak Purbalingga'
	],
	sipantasUrl: 'https://sipantas.kanimcilacap.com/',
	lastVerified: '2026-11-21',
	lastVerifiedLabel: '21 November 2026'
} as const;

/**
 * Menu bot WhatsApp persis seperti yang dikirim bot (BotScript::MENUS di dashboard). Ubah di sini bila menu bot berubah;
 * dikunci test src/lib/site.test.ts.
 */
export const botMenu = {
	main: [
		{ digit: '1', label: 'Pelayanan Paspor WNI' },
		{ digit: '2', label: 'Pelayanan Izin Tinggal (For Foreigners)' },
		{ digit: '3', label: 'Layanan Pengaduan (Complaint Support)' }
	],
	paspor: [
		'Biaya Paspor',
		'Persyaratan Paspor Baru',
		'Persyaratan Penggantian Paspor',
		'Persyaratan Paspor Anak',
		'Pendaftaran Paspor (M-Paspor)',
		'Layanan Prioritas Ramah HAM',
		'Permohonan Paspor Hilang',
		'Permohonan Paspor Rusak',
		'Permohonan Paspor Beda Data',
		'Penambahan Nama pada Paspor',
		'Cek Status Paspor',
		'Kembali ke menu sebelumnya'
	],
	izinTinggal: [
		'Tarif Izin Tinggal dan Visa (Stay Permit & Visa Fees)',
		'Pelaporan WNA Meninggal (Death Report of a Foreigner)',
		'Lokasi Kami (Our Locations)',
		'Kembali ke menu sebelumnya'
	]
} as const;

export const addressLine = `${site.address.street}, ${site.address.area}, ${site.address.district}, ${site.address.city}, ${site.address.region} ${site.address.postalCode}`;

/** Tautan peta resmi kantor (sama dengan bot). */
export const mapsUrl = site.officeMaps;

export function waUrl(number: string, text = 'Halo'): string {
	return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

export const nav = [
	{ href: '/layanan', label: 'Layanan' },
	{ href: '/faq', label: 'Tanya jawab' },
	{ href: '/pengaduan', label: 'Pengaduan' },
	{ href: '/kontak', label: 'Kontak' }
] as const;
