import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import data from './content/faqs.json';
import { faqByCode, faqs } from './faq';
import { botMenu, site } from './site';

/**
 * Kontrak isi landing terhadap informasi terbaru (audit 20 Nov 2026 + feedback Imigrasi 20-21 Nov).
 * Bagian "sinkron dengan repo bot" hanya berjalan bila repo Laravel ada di sebelah (lokal), dilewati di CI.
 */
const laravel = resolve(__dirname, '../../../Project_Magang_KANCIL');
const hasLaravel = existsSync(resolve(laravel, 'database/data/faqs.php'));

const answer = (code: string) => faqByCode(code)?.answer ?? '';

describe('isi FAQ', () => {
	it('65 FAQ dari data bot, termasuk M-Paspor, rusak, penambahan nama, dan beda data', () => {
		expect(data.source).toBe('laravel');
		expect(faqs).toHaveLength(65);
		for (const code of ['PSP-013', 'PSP-014', 'PSP-015', 'PSP-016']) {
			expect(faqByCode(code), code).toBeDefined();
		}
		expect(faqByCode('PSP-016')?.question).toBe('Apa syarat permohonan paspor beda data?');
	});

	it('PNBP tidak pernah dijumlahkan (feedback Imigrasi 20 Nov)', () => {
		for (const faq of faqs) {
			for (const total of ['1.150.000', '1.450.000', '1.650.000', '1.950.000']) {
				expect(faq.answer, faq.code).not.toContain(total);
			}
		}
		expect(answer('TRF-001')).toContain('Rp650.000');
		expect(answer('TRF-002')).toContain('Rp950.000');
		expect(answer('TRF-003')).toContain('Denda paspor rusak: Rp500.000');
	});

	it('SIPANTAS hanya untuk paspor hilang, rusak, dan beda data', () => {
		for (const code of ['PSP-011', 'PSP-014', 'PSP-016']) {
			expect(answer(code), code).toContain(site.sipantasUrl);
		}
		expect(answer('PSP-015')).not.toMatch(/sipantas/i);
		expect(answer('TRF-003')).toContain('hilang, rusak, dan beda data');
		expect(answer('TRF-003')).not.toContain('penambahan nama');
		expect(answer('PSP-016')).toContain('Penetapan pengadilan');
	});

	it('cek status paspor lewat menu 1 > 11, bukan format CEK# (keputusan 21 Nov)', () => {
		for (const faq of faqs) expect(faq.answer, faq.code).not.toContain('CEK#');
		expect(answer('AMB-009')).toContain('lalu **11** (Cek Status Paspor)');
	});

	it.skipIf(!hasLaravel)(
		'bot-script.json chat bot sama dengan ekspor terbaru dari bot (jalankan pnpm bot:sync bila gagal)',
		() => {
			const fresh = JSON.parse(
				execFileSync('php', [resolve(__dirname, '../../scripts/bot-export.php'), laravel], {
					encoding: 'utf8',
					maxBuffer: 16 * 1024 * 1024
				})
			);
			const saved = JSON.parse(readFileSync(resolve(__dirname, 'chatbot/bot-script.json'), 'utf8'));
			expect(saved).toEqual(fresh);
		},
		60_000
	);

	it('format WhatsApp sudah diubah: tidak ada tebal satu bintang', () => {
		for (const faq of faqs) {
			expect(faq.answer.replace(/\*\*[^*]+\*\*/g, ''), faq.code).not.toContain('*');
		}
	});

	it.skipIf(!hasLaravel)(
		'faqs.json sama dengan data bot terbaru (jalankan pnpm faq:sync bila gagal)',
		() => {
			const json = execFileSync(
				'php',
				[
					'-r',
					'echo json_encode(require $argv[1], JSON_UNESCAPED_UNICODE);',
					resolve(laravel, 'database/data/faqs.php')
				],
				{ encoding: 'utf8' }
			);
			const rows: { code: string; question: string }[] = JSON.parse(json);
			expect(rows.map((r) => r.code).sort()).toEqual(faqs.map((f) => f.code).sort());
			for (const row of rows) {
				expect(faqByCode(row.code)?.question, row.code).toBe(row.question.trim());
			}
		}
	);
});

describe('fakta situs', () => {
	it('menu bot sesuai versi terbaru', () => {
		expect(botMenu.main.map((m) => m.digit)).toEqual(['1', '2', '3']);
		expect(botMenu.paspor).toHaveLength(12);
		expect(botMenu.paspor[8]).toBe('Permohonan Paspor Beda Data');
		expect(botMenu.paspor[9]).toBe('Penambahan Nama pada Paspor');
		expect(botMenu.paspor[10]).toBe('Cek Status Paspor');
		expect(botMenu.izinTinggal[0]).toContain('Tarif Izin Tinggal dan Visa');
		expect(botMenu.izinTinggal[1]).toContain('Pelaporan WNA Meninggal');
	});

	it.skipIf(!hasLaravel)('menu landing sama persis dengan BotScript::MENUS di bot', () => {
		const json = execFileSync(
			'php',
			[
				'-r',
				'require "vendor/autoload.php"; echo json_encode(App\\Services\\Bot\\BotScript::MENUS, JSON_UNESCAPED_UNICODE);'
			],
			{ encoding: 'utf8', cwd: laravel }
		);
		const menus: Record<string, { options: Record<string, [string, string]> }> = JSON.parse(json);
		const labels = (code: string) =>
			Object.values(menus[code].options).map(([label]) =>
				label === 'untuk kembali ke menu sebelumnya' ? 'Kembali ke menu sebelumnya' : label
			);

		expect(botMenu.main.map((m) => m.label)).toEqual(labels('M-00'));
		expect([...botMenu.paspor]).toEqual(labels('M-01'));
		expect([...botMenu.izinTinggal]).toEqual(labels('M-08'));
	});

	it('jam layanan, lokasi, dan tempat permohonan sesuai bot', () => {
		expect(site.hours.staff).toBe(
			'Senin sampai Kamis 08.00 sampai 16.00 WIB, Jumat 08.00 sampai 16.30 WIB'
		);
		expect(site.locations.map((l) => l.name)).toEqual([
			'Mal Pelayanan Publik (MPP) Cilacap',
			'Mal Pelayanan Publik (MPP) Banyumas',
			'Mal Pelayanan Publik (MPP) Purbalingga'
		]);
		for (const place of site.locations) {
			expect(place.maps, place.name).toMatch(/^https:\/\/maps\.app\.goo\.gl\/\w+$/);
			expect(place.address, place.name).toMatch(/Jawa Tengah \d{5}$/);
		}
		expect(site.applicationPlaces).toHaveLength(5);
	});
});
