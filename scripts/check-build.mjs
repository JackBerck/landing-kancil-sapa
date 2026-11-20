// Uji hasil akhir (HTML prerender di build/) setelah `pnpm build`: memastikan halaman publik memuat informasi terbaru
// dan tidak lagi memuat informasi usang (menu Dokumen 3.2, alur pengaduan swalayan, format CEK#, lokasi lama).
// Pakai: pnpm build && pnpm test:build
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const build = resolve(fileURLToPath(new URL('..', import.meta.url)), 'build');
const html = (page) => readFileSync(join(build, page), 'utf8');
/** Teks yang terlihat: tag, skrip, dan entitas dasar dibuang. */
const text = (page) =>
	html(page)
		.replace(/<script[\s\S]*?<\/script>/g, ' ')
		.replace(/<style[\s\S]*?<\/style>/g, ' ')
		.replace(/<[^>]+>/g, ' ')
		.replace(/&amp;/g, '&')
		.replace(/&nbsp;/g, ' ')
		.replace(/\s+/g, ' ');

const failures = [];
const must = (page, needle) => {
	if (!text(page).includes(needle)) failures.push(`${page}: tidak memuat "${needle}"`);
};
const mustNot = (page, needle) => {
	if (text(page).includes(needle)) failures.push(`${page}: masih memuat "${needle}"`);
};

// Beranda: menu bot terbaru.
must('index.html', 'Pelayanan Paspor WNI');
must('index.html', 'Pelayanan Izin Tinggal (For Foreigners)');
must('index.html', 'Layanan Pengaduan (Complaint Support)');
must('index.html', 'Permohonan Paspor Beda Data');
must('index.html', 'Tarif Izin Tinggal dan Visa');
must('index.html', 'Hubungi petugas, kapan saja');
mustNot('index.html', '0 = Warga Negara Indonesia');
mustNot('index.html', 'Kembali satu langkah');
mustNot('index.html', 'Buat pengaduan atau cek tiket');

// Pengaduan: lewat petugas, tanpa nomor tiket ke pemohon.
must('pengaduan.html', 'Ketik 3 di menu utama');
must('pengaduan.html', 'Pelayanan petugas');
mustNot('pengaduan.html', 'ADU-');
mustNot('pengaduan.html', 'Ketik 2 di menu utama');
mustNot('pengaduan.html', 'nomor tiket');

// Kontak: cek status lewat menu, empat lokasi.
must('kontak.html', 'ketik 1, lalu 11');
must('kontak.html', 'Mal Pelayanan Publik (MPP) Banyumas');
must('kontak.html', 'Mal Pelayanan Publik (MPP) Purbalingga');
must('kontak.html', 'Mal Pelayanan Publik (MPP) Cilacap');
must('kontak.html', 'Jumat 08.00 sampai 16.30 WIB');
mustNot('kontak.html', 'CEK#');

// Tentang dan privasi.
mustNot('tentang.html', 'Bot tidak mengecek status permohonan paspor');
mustNot('tentang.html', 'langkah lampiran pengaduan');
mustNot('privasi.html', 'nomor tiket');

// Tanya jawab: data terbaru, PNBP terpisah.
must('faq.html', 'Apa syarat permohonan paspor beda data?');
must('faq.html', '65 jawaban');
must('layanan/paspor-wni.html', 'Surat kehilangan (kepolisian)');
must('layanan/tarif-pnbp.html', 'Denda paspor rusak');
if (!html('layanan/paspor-wni.html').includes('<a href="https://sipantas.kanimcilacap.com/"')) {
	failures.push('layanan/paspor-wni.html: tautan SIPANTAS tidak bisa diklik');
}

// Chat bot: bundel ada, setiap halaman memuatnya (tanpa skrip inline, sesuai CSP script-src 'self').
try {
	readFileSync(join(build, 'chatbot/widget.js'));
} catch {
	failures.push(
		'chatbot/widget.js tidak ada (jalankan pnpm build, yang juga menjalankan build:chatbot)'
	);
}
const csp = readFileSync(resolve(build, '../deploy/kancilsapa-security-headers.conf'), 'utf8');
if (!csp.includes("script-src 'self'"))
	failures.push("CSP deploy belum mengizinkan script-src 'self' untuk chat bot");
must('faq.html', 'ketik 1 (Pelayanan Paspor WNI), lalu 11 (Cek Status Paspor)');
mustNot('faq.html', 'CEK#');

// Semua halaman: tidak ada penanda tebal mentah dan tidak ada angka PNBP gabungan.
const pages = [];
const walk = (dir) => {
	for (const name of readdirSync(dir)) {
		const path = join(dir, name);
		if (statSync(path).isDirectory()) walk(path);
		else if (name.endsWith('.html')) pages.push(path.slice(build.length + 1));
	}
};
walk(build);
for (const page of pages) {
	const markup = html(page);
	if (
		page !== '404.html' &&
		!/<script src="\/chatbot\/widget\.js\?v=[a-f0-9]{12}" defer/.test(markup)
	) {
		failures.push(`${page}: skrip chat bot tidak dimuat`);
	}
	if (
		/<script(?![^>]*\bsrc=)[^>]*>(?!\s*<\/script>)/.test(
			markup.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '')
		)
	) {
		failures.push(`${page}: ada skrip inline (diblokir CSP)`);
	}
	mustNot(page, '**');
	for (const total of ['1.150.000', '1.450.000', '1.650.000', '1.950.000']) mustNot(page, total);
}

if (failures.length) {
	console.error(`Pemeriksaan build gagal (${failures.length}):\n- ${failures.join('\n- ')}`);
	process.exit(1);
}
console.log(`Pemeriksaan build lolos: ${pages.length} halaman HTML.`);
