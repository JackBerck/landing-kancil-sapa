/**
 * Ubah jawaban FAQ (teks dengan **tebal** dan butir bertanda titik koma) menjadi blok terstruktur.
 * Hasilnya dirender tanpa {@html}, jadi aman dari injeksi.
 */
export type Part = { text: string; bold: boolean };
export type Block =
	| { type: 'p'; parts: Part[] }
	| { type: 'ul'; items: Part[][] }
	| { type: 'rows'; rows: { label: string; value: string }[] }
	| { type: 'dl'; items: { term: string; parts: Part[] }[] };

export function inline(text: string): Part[] {
	const parts: Part[] = [];
	text.split('**').forEach((chunk, i) => {
		if (chunk) parts.push({ text: chunk, bold: i % 2 === 1 });
	});
	return parts;
}

const tidy = (s: string) =>
	s
		.replace(/\.;/g, ';')
		.replace(/\.{2,}/g, '.')
		.replace(/\s+/g, ' ')
		.trim();

/** Pisahkan butir terakhir dari kalimat penutup: "…item terakhir. Bawa berkas asli." */
function splitTail(list: string[]): { items: string[]; tail: string } {
	const items = list.slice();
	const last = items.pop() ?? '';
	const m = last.match(/^(.*?)\.\s+([A-Z].*)$/);
	const balanced = m ? m[1].split('(').length === m[1].split(')').length : false;
	if (m && balanced) {
		items.push(m[1]);
		return { items, tail: m[2] };
	}
	items.push(last.replace(/\.$/, ''));
	return { items, tail: '' };
}

export function parseAnswer(raw: string): Block[] {
	const text = tidy(raw);
	const blocks: Block[] = [];

	// 1) Beberapa label tebal bernada "**BCA:** langkah": daftar definisi.
	const labelled = [...text.matchAll(/\*\*([^*]+?):\*\*/g)];
	if (labelled.length >= 2 && !/^\*\*[^*]+:\*\*/.test(text)) {
		const first = labelled[0].index ?? 0;
		const intro = text.slice(0, first).trim();
		if (intro) blocks.push({ type: 'p', parts: inline(intro) });
		const items = labelled.map((m, i) => {
			const start = (m.index ?? 0) + m[0].length;
			const end = i + 1 < labelled.length ? (labelled[i + 1].index ?? text.length) : text.length;
			return { term: m[1].trim(), parts: inline(text.slice(start, end).trim()) };
		});
		blocks.push({ type: 'dl', items });
		return blocks;
	}

	// 2) Label tebal di awal + butir bertitik koma: judul kecil lalu daftar.
	const lead = text.match(/^\*\*([^*]+?):\*\*\s*(.*)$/);
	const body = lead ? lead[2] : text;
	const pieces = body.split(/;\s+/);

	if (pieces.length >= 3) {
		const { items, tail } = splitTail(pieces);
		if (lead) blocks.push({ type: 'p', parts: [{ text: lead[1], bold: true }] });

		// Semua butir berbentuk "Label: nilai" jadi baris tabel (tarif).
		if (items.every((it) => /^[^:]{2,60}:\s+\S/.test(it))) {
			blocks.push({
				type: 'rows',
				rows: items.map((it) => {
					const [label, ...rest] = it.split(/:\s+/);
					return { label, value: rest.join(': ') };
				})
			});
		} else {
			blocks.push({ type: 'ul', items: items.map((it) => inline(it)) });
		}
		if (tail) blocks.push({ type: 'p', parts: inline(tail) });
		return blocks;
	}

	// 3) Paragraf biasa; titik koma dua butir tetap kalimat.
	blocks.push({ type: 'p', parts: inline(text) });
	return blocks;
}
