import { describe, expect, it } from 'vitest';
import { parseAnswer, type Block } from './answer';
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

	it('tidak menghilangkan teks pada ke-61 FAQ', () => {
		expect(faqs).toHaveLength(61);
		for (const faq of faqs) {
			const norm = (s: string) => s.replace(/[\s.;:]+/g, '');
			expect(norm(flat(parseAnswer(faq.answer))), faq.code).toBe(norm(plainAnswer(faq.answer)));
		}
	});

	it('setiap FAQ masuk tepat satu kelompok, kecuali kontak', () => {
		const grouped = groups.flatMap((g) => faqsOf(g).map((f) => f.code));
		expect(new Set(grouped).size).toBe(grouped.length);
		expect(faqs.filter((f) => !grouped.includes(f.code)).map((f) => f.code)).toEqual(['KTK-001']);
	});
});
