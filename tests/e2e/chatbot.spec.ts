import { expect, test, type Page } from '@playwright/test';

/** Chat bot pojok kanan bawah: menu sama dengan bot WhatsApp KANCIL SAPA. */

async function openChat(page: Page) {
	await expect(page.locator('.chatbot[data-ready="true"]')).toHaveCount(1); // skrip widget sudah terpasang
	await page.getByRole('button', { name: 'Buka chat bot KANCIL SAPA' }).click();
	const dialog = page.getByRole('dialog', { name: 'Chat bot KANCIL SAPA' });
	await expect(dialog).toBeVisible();
	return dialog;
}

async function say(page: Page, text: string) {
	const input = page.getByLabel('Ketik angka pilihan');
	await input.fill(text);
	await input.press('Enter');
}

const lastBot = (page: Page) => page.locator('.chatbot__log [data-from="bot"]').last();

test.beforeEach(async ({ page }) => {
	await page.goto('/');
});

test('tombol robot di kanan bawah membuka chat dengan menu utama bot', async ({ page }) => {
	const toggle = page.getByRole('button', { name: 'Buka chat bot KANCIL SAPA' });
	await expect(toggle).toBeVisible();
	const box = (await toggle.boundingBox())!;
	const viewport = page.viewportSize()!;
	expect(box.x + box.width).toBeGreaterThan(viewport.width - 100);
	expect(box.y + box.height).toBeGreaterThan(viewport.height - 100);

	const dialog = await openChat(page);
	await expect(lastBot(page)).toContainText('Selamat Datang , di Layanan Informasi dan Pengaduan');
	await expect(lastBot(page)).toContainText(/Status Hari Ini: (BUKA|TUTUP|LIBUR)/);
	await expect(lastBot(page)).toContainText('Ketik 1 Pelayanan Paspor WNI');
	await expect(lastBot(page)).toContainText('Ketik 3 Layanan Pengaduan (Complaint Support)');
	await expect(page.getByLabel('Ketik angka pilihan')).toBeFocused();

	// Panel tidak keluar layar dan halaman tidak bisa digeser ke samping.
	const panel = (await dialog.boundingBox())!;
	expect(panel.x).toBeGreaterThanOrEqual(0);
	expect(panel.x + panel.width).toBeLessThanOrEqual(viewport.width);
	expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
		true
	);
});

test('menu Paspor → Paspor Rusak: PNBP terpisah dan tautan SIPANTAS, lalu 0 ke menu utama', async ({
	page
}) => {
	await openChat(page);
	await say(page, '1');
	await expect(lastBot(page)).toContainText('Ketik 9 Permohonan Paspor Beda Data');
	await expect(lastBot(page)).toContainText('Ketik 12 untuk kembali ke menu sebelumnya');

	await say(page, '8');
	const answer = lastBot(page);
	await expect(answer).toContainText('Berikut ini adalah informasi dan solusi yang Anda cari:');
	await expect(answer).toContainText('Paspor elektronik 5 tahun: Rp650.000');
	await expect(answer).toContainText('Denda paspor rusak: Rp500.000');
	await expect(answer).not.toContainText('1.150.000');
	await expect(
		answer.getByRole('link', { name: 'https://sipantas.kanimcilacap.com/' })
	).toHaveAttribute('target', '_blank');
	await expect(answer.locator('.b').first()).toHaveText(
		'Berikut ini adalah informasi dan solusi yang Anda cari:'
	);

	await say(page, '0');
	await expect(lastBot(page)).toContainText('Ketik 2 Pelayanan Izin Tinggal (For Foreigners)');
});

test('menu Izin Tinggal sesuai dokumen skenario: tarif ITAS dan lokasi', async ({ page }) => {
	await openChat(page);
	await say(page, '2');
	await expect(lastBot(page)).toContainText(
		'Ketik 1 Tarif Izin Tinggal dan Visa (Stay Permit & Visa Fees)'
	);
	await say(page, '1');
	await say(page, '3');
	await expect(lastBot(page)).toContainText('Sampai 10 tahun: Rp12.000.000');
	await say(page, '0');
	await say(page, '2');
	await say(page, '3');
	await expect(lastBot(page)).toContainText('Mal Pelayanan Publik (MPP) Purbalingga');
	await expect(
		lastBot(page).getByRole('link', { name: 'https://maps.app.goo.gl/wFeYgwqUDX7Byi31A' })
	).toBeVisible();
});

test('setelah jawaban tarif, 9 kembali ke daftar tarif (laporan Imigrasi 23 Nov)', async ({
	page
}) => {
	await openChat(page);
	await say(page, '2');
	await say(page, '1');
	await say(page, '1');
	await expect(lastBot(page)).toContainText('Ketik 9 untuk kembali ke menu sebelumnya');
	await expect(lastBot(page)).toContainText('Ketik 0 untuk kembali ke menu utama');
	await expect(lastBot(page)).toContainText('(Type 9 to return to the previous menu)');
	await say(page, '9');
	await expect(lastBot(page)).toContainText('Ketik 7 untuk kembali ke menu sebelumnya');
	await expect(lastBot(page)).not.toContainText('Selamat Datang');
	await say(page, '2');
	await expect(lastBot(page)).toContainText('Izin Tinggal Kunjungan');
	await say(page, '0');
	await expect(lastBot(page)).toContainText('Selamat Datang');
});

test('pengaduan (menu 3) dan 88 diarahkan ke WhatsApp resmi', async ({ page }) => {
	await openChat(page);
	await say(page, '3');
	const handoff = lastBot(page);
	await expect(handoff).toContainText('lanjutkan percakapan di WhatsApp resmi');
	await expect(handoff.getByRole('link', { name: 'WhatsApp 0812-1700-0900' })).toHaveAttribute(
		'href',
		/^https:\/\/wa\.me\/6281217000900/
	);

	await say(page, '1');
	await say(page, '88');
	await expect(lastBot(page)).toContainText('WhatsApp resmi');
});

test('cek status: nomor permohonan lalu tempat permohonan', async ({ page }) => {
	await openChat(page);
	await say(page, '1');
	await say(page, '11');
	await expect(lastBot(page)).toContainText(
		'Tempat permohonan: Imigrasi Cilacap / MPP Banyumas / MPP Purbalingga / Ngapak Banyumas / Ngapak Purbalingga'
	);
	await say(page, '1568000000012345');
	await expect(lastBot(page)).toContainText('Nomor permohonan: 1568000000012345');
	await say(page, '2');
	await expect(lastBot(page)).toContainText(
		'kirim nomor permohonan 1568000000012345, lalu pilih tempat permohonan MPP Banyumas'
	);
});

test('salah input tiga kali memberi pesan standar bot', async ({ page }) => {
	await openChat(page);
	await say(page, 'abc');
	await expect(lastBot(page)).toContainText(
		'Maaf, pilihan tidak valid. Silakan ketik angka sesuai daftar menu.'
	);
	await say(page, 'def');
	await expect(lastBot(page)).toContainText('Maaf, pilihan masih belum sesuai.');
	await say(page, 'ghi');
	await expect(lastBot(page)).toContainText('Mohon maaf, bot belum dapat memahami pesan Anda.');
});

test('riwayat tetap saat pindah halaman; mulai ulang mengosongkan chat', async ({ page }) => {
	await openChat(page);
	await say(page, '1');
	await say(page, '7');
	await page.goto('/kontak'); // tab yang sama: sessionStorage tetap
	await expect(page).toHaveURL(/\/kontak$/);

	await openChat(page);
	await expect(page.locator('.chatbot__log [data-from="user"]')).toHaveCount(2);
	await say(page, '0');
	await expect(lastBot(page)).toContainText('Ketik 1 Pelayanan Paspor WNI');

	await page.getByRole('button', { name: 'Mulai ulang chat' }).click();
	await expect(page.locator('.chatbot__log [data-from="user"]')).toHaveCount(0);
	await expect(page.locator('.chatbot__log [data-from="bot"]')).toHaveCount(1);
});

test('Escape menutup chat dan fokus kembali ke tombol robot', async ({ page }) => {
	await openChat(page);
	await page.keyboard.press('Escape');
	await expect(page.getByRole('dialog', { name: 'Chat bot KANCIL SAPA' })).toHaveCount(0);
	await expect(page.getByRole('button', { name: 'Buka chat bot KANCIL SAPA' })).toBeFocused();
});
