import { describe, expect, it } from 'vitest';
import { inline, parseAnswer, type Block } from './answer';
import { faqs, groups, faqsOf, plainAnswer } from './faq';

const flat = (blocks: Block[]) =>
	blocks
		.map((b) => {
			if (b.type === 'p') return b.parts.map((p) => p.text).join('');
			if (b.type === 'ul') return b.items.map((i) => i.map((p) => p.text).join('')).join(' ');
			if (b.type === 'rows') return b.rows.map((r) => `${r.label} ${r.value}`).join(' ');
			return b.items.map((i) => `${i.term} ${i.parts.map((p) => p.text).join('')}`).join(' ');
		})
		.join(' ');

describe('parseAnswer', () => {
	it('memecah syarat menjadi daftar dan kalimat penutup', () => {
		const blocks = parseAnswer(
			'**Persyaratan:** KTP elektronik; Kartu Keluarga; Paspor lama (jika ada). Bawa berkas asli dan fotokopi ukuran A4.'
		);
		expect(blocks[0]).toEqual({ type: 'p', parts: [{ text: 'Persyaratan', bold: true }] });
		expect(blocks[1].type).toBe('ul');
		expect(blocks[2]).toMatchObject({ type: 'p' });
	});

	it('mengubah tarif "Label: nilai" menjadi baris tabel', () => {
		const [block] = parseAnswer(
			'Sampai 30 hari: Rp300.000; Sampai 60 hari: Rp400.000; Sampai 90 hari: Rp500.000.'
		);
		expect(block).toEqual({
			type: 'rows',
			rows: [
				{ label: 'Sampai 30 hari', value: 'Rp300.000' },
				{ label: 'Sampai 60 hari', value: 'Rp400.000' },
				{ label: 'Sampai 90 hari', value: 'Rp500.000' }
			]
		});
	});

	it('mengubah beberapa label tebal menjadi daftar definisi', () => {
		const blocks = parseAnswer(
			'Siapkan kode billing, lalu: **BCA:** Pembayaran. **BNI:** Menu Lainnya.'
		);
		expect(blocks[1].type).toBe('dl');
	});

	it('tidak menghilangkan teks pada ke-65 FAQ', () => {
		expect(faqs).toHaveLength(65);
		for (const faq of faqs) {
			const norm = (s: string) => s.replace(/[\s.;:]+/g, '');
			expect(norm(flat(parseAnswer(faq.answer))), faq.code).toBe(norm(plainAnswer(faq.answer)));
		}
	});

	it('format baris (data bot): paragraf, judul tebal, daftar, kalimat penutup', () => {
		const blocks = parseAnswer(
			'Daftar melalui SIPANTAS.\n\n**Persyaratan:**\n• Kartu Keluarga\n• Paspor lama\nBawa berkas asli.'
		);
		expect(blocks).toEqual([
			{ type: 'p', parts: [{ text: 'Daftar melalui SIPANTAS.', bold: false }] },
			{ type: 'p', parts: [{ text: 'Persyaratan:', bold: true }] },
			{
				type: 'ul',
				items: [[{ text: 'Kartu Keluarga', bold: false }], [{ text: 'Paspor lama', bold: false }]]
			},
			{ type: 'p', parts: [{ text: 'Bawa berkas asli.', bold: false }] }
		]);
	});

	it('format baris: butir berlabel tebal jadi daftar definisi, "Label: nilai" jadi tabel', () => {
		const [, dl] = parseAnswer(
			'Siapkan kode billing, lalu:\n• **BCA:** Pembayaran.\n• **BNI:** Menu.'
		);
		expect(dl).toMatchObject({ type: 'dl', items: [{ term: 'BCA' }, { term: 'BNI' }] });

		const [rows] = parseAnswer(
			'• Call center / WhatsApp: **081217000900**\n• Email: **cilacap@imigrasi.go.id**.'
		);
		expect(rows).toEqual({
			type: 'rows',
			rows: [
				{ label: 'Call center / WhatsApp', value: '081217000900' },
				{ label: 'Email', value: 'cilacap@imigrasi.go.id' }
			]
		});
	});

	it('format baris: daftar campuran tetap daftar biasa', () => {
		const [ul] = parseAnswer('• KANCIL NARI (layanan prioritas)\n• Catatan: lihat petugas');
		expect(ul.type).toBe('ul');
	});

	it('URL https menjadi tautan, tanda baca penutup tidak ikut', () => {
		expect(inline('Daftar melalui https://sipantas.kanimcilacap.com/, lalu datang.')).toEqual([
			{ text: 'Daftar melalui ', bold: false },
			{
				text: 'https://sipantas.kanimcilacap.com/',
				bold: false,
				href: 'https://sipantas.kanimcilacap.com/'
			},
			{ text: ', lalu datang.', bold: false }
		]);
		expect(inline('Lihat https://a.id/x.')).toContainEqual({
			text: 'https://a.id/x',
			bold: false,
			href: 'https://a.id/x'
		});
		expect(inline('tanpa tautan')).toEqual([{ text: 'tanpa tautan', bold: false }]);
	});

	it('plainAnswer mengubah butir menjadi kalimat bertitik koma tanpa tanda tebal', () => {
		expect(plainAnswer('**Persyaratan:**\n• KTP\n• Kartu Keluarga\nBawa berkas asli.')).toBe(
			'Persyaratan: KTP; Kartu Keluarga Bawa berkas asli.'
		);
	});

	it('tidak ada penanda tebal mentah ("**") yang lolos ke tampilan', () => {
		const texts = (b: Block): string[] => {
			if (b.type === 'p') return b.parts.map((p) => p.text);
			if (b.type === 'ul') return b.items.flat().map((p) => p.text);
			if (b.type === 'rows') return b.rows.flatMap((r) => [r.label, r.value]);
			return b.items.flatMap((i) => [i.term, ...i.parts.map((p) => p.text)]);
		};
		for (const faq of faqs) {
			for (const text of parseAnswer(faq.answer).flatMap(texts)) {
				expect(text, faq.code).not.toContain('*');
			}
		}
	});

	it('setiap FAQ masuk tepat satu kelompok, kecuali kontak', () => {
		const grouped = groups.flatMap((g) => faqsOf(g).map((f) => f.code));
		expect(new Set(grouped).size).toBe(grouped.length);
		expect(faqs.filter((f) => !grouped.includes(f.code)).map((f) => f.code)).toEqual(['KTK-001']);
	});
});
