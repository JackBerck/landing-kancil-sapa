import data from './content/faqs.json';

export interface Faq {
	code: string;
	category: string | null;
	question: string;
	answer: string;
	verified_at: string | null;
}

export interface FaqGroup {
	slug: string;
	prefix: string;
	title: string;
	/** Judul halaman (h1). */
	heading: string;
	/** Meta description, di bawah 155 karakter. */
	description: string;
	intro: string;
	/** Ringkasan sangat pendek untuk daftar di beranda. */
	blurb: string;
}

export const faqs: Faq[] = (data.faqs as Faq[])
	.slice()
	.sort((a, b) => a.code.localeCompare(b.code));

export const groups: FaqGroup[] = [
	{
		slug: 'paspor-wni',
		blurb: 'Baru, ganti, hilang, dan tujuan',
		prefix: 'PSP',
		title: 'Syarat paspor WNI',
		heading: 'Syarat paspor WNI di Cilacap',
		description:
			'Syarat paspor baru, penggantian, paspor hilang, dan paspor menurut tujuan (wisata, umrah, haji, pelaut, CPMI) di Kantor Imigrasi Cilacap.',
		intro:
			'Persyaratan permohonan paspor bagi Warga Negara Indonesia: paspor baru, penggantian, paspor hilang, affidavit, dan syarat menurut tujuan perjalanan.'
	},
	{
		slug: 'paspor-anak',
		blurb: 'Syarat, M-Paspor, kondisi keluarga',
		prefix: 'ANK',
		title: 'Paspor anak',
		heading: 'Paspor anak dan kondisi keluarga',
		description:
			'Syarat paspor anak, aturan M-Paspor menurut usia, masa berlaku, dan surat pernyataan bila orang tua bercerai, meninggal, atau anak diadopsi.',
		intro:
			'Syarat paspor anak dan siapa yang menandatangani surat pernyataan pada berbagai kondisi keluarga.'
	},
	{
		slug: 'pengambilan-paspor',
		blurb: 'Ambil, kirim lewat pos, cek status',
		prefix: 'AMB',
		title: 'Pengambilan paspor',
		heading: 'Pengambilan, pengiriman, dan status paspor',
		description:
			'Syarat mengambil paspor sendiri atau diwakilkan, pengiriman paspor lewat pos di Kanim Cilacap, dan cara mengecek status permohonan paspor.',
		intro:
			'Cara mengambil paspor sendiri atau lewat perwakilan, ketentuan pengiriman lewat pos, dan cara menanyakan status permohonan.'
	},
	{
		slug: 'pembayaran-paspor',
		blurb: 'ATM, mobile banking, dompet digital',
		prefix: 'BYR',
		title: 'Pembayaran paspor',
		heading: 'Cara membayar paspor',
		description:
			'Cara membayar paspor dengan kode billing lewat ATM, mobile banking, dompet digital, kantor pos, Indomaret, atau Alfamart.',
		intro: 'Pembayaran paspor memakai kode billing. Pilih saluran yang paling mudah bagi Anda.'
	},
	{
		slug: 'tarif-pnbp',
		blurb: 'Paspor, izin tinggal, visa',
		prefix: 'TRF',
		title: 'Tarif PNBP',
		heading: 'Tarif paspor, izin tinggal, dan visa',
		description:
			'Tarif paspor elektronik 5 dan 10 tahun, denda, percepatan, izin masuk kembali, ITK, ITAS, ITAP, exit permit, dan visa kunjungan menurut PP 45 Tahun 2024.',
		intro:
			'Tarif Penerimaan Negara Bukan Pajak (PNBP) layanan keimigrasian. Dasar hukum: PP Nomor 45 Tahun 2024.'
	},
	{
		slug: 'layanan-khusus',
		blurb: 'NARI, PERSAMI, PESAT, NGAPAK',
		prefix: 'LYK',
		title: 'Layanan khusus KANCIL',
		heading: 'Layanan khusus Kantor Imigrasi Cilacap',
		description:
			'KANCIL NARI, KANCIL PERSAMI, KANCIL PESAT, KANCIL NGAPAK, Eazy Paspor, dan HOTS: layanan paspor khusus dari Kantor Imigrasi Cilacap.',
		intro:
			'Enam layanan khusus untuk kelompok prioritas, akhir pekan, pemohon yang sakit, layanan di kabupaten, dan jemput bola.'
	},
	{
		slug: 'layanan-wna',
		blurb: 'Pelaporan, dokumen, alur',
		prefix: 'WNA',
		title: 'Layanan WNA',
		heading: 'Pelaporan WNA meninggal di Indonesia',
		description:
			'Siapa yang wajib melapor, batas 60 hari, dokumen, dan alur pelaporan Warga Negara Asing yang meninggal di Indonesia ke kantor imigrasi.',
		intro:
			'Kewajiban pelaporan, dokumen, dan alur ketika Warga Negara Asing meninggal di Indonesia.'
	}
];

export const groupBySlug = (slug: string) => groups.find((g) => g.slug === slug);
export const faqsOf = (group: FaqGroup) =>
	faqs.filter((f) => f.code.startsWith(group.prefix + '-'));
export const groupOfCode = (code: string) => groups.find((g) => code.startsWith(g.prefix + '-'));
export const faqByCode = (code: string) => faqs.find((f) => f.code === code);
export const anchorOf = (code: string) => code.toLowerCase();

/** Teks polos jawaban (tanpa tanda **), untuk JSON-LD dan meta. */
export function plainAnswer(answer: string): string {
	return answer
		.replace(/\*\*/g, '')
		.replace(/\.;/g, ';')
		.replace(/\.{2,}/g, '.');
}
