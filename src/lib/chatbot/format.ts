/**
 * Render format WhatsApp (*tebal*, _miring_, tautan, baris baru) menjadi potongan teks aman (tanpa {@html}).
 */
export interface Span {
	text: string;
	bold?: boolean;
	italic?: boolean;
	href?: string;
}

const URL_RE = /(https:\/\/[^\s)]+?)(?=[.,;:]?(?:\s|$))/g;

function links(text: string, style: Omit<Span, 'text' | 'href'>): Span[] {
	const out: Span[] = [];
	let last = 0;
	for (const m of text.matchAll(URL_RE)) {
		const at = m.index ?? 0;
		if (at > last) out.push({ text: text.slice(last, at), ...style });
		out.push({ text: m[1], href: m[1], ...style });
		last = at + m[1].length;
	}
	if (last < text.length) out.push({ text: text.slice(last), ...style });
	return out;
}

/** Satu baris -> potongan. Penanda WhatsApp: *tebal* dan _miring_ (boleh bertumpuk: _*x*_). */
export function formatLine(line: string): Span[] {
	const out: Span[] = [];
	const re = /(\*[^*\n]+\*|_[^_\n]+_)/g;
	let last = 0;
	for (const m of line.matchAll(re)) {
		const at = m.index ?? 0;
		// Penanda hanya berlaku di batas kata (seperti WhatsApp), bukan di tengah kata/URL.
		const before = line[at - 1];
		const after = line[at + m[0].length];
		if ((before && /[\p{L}\p{N}]/u.test(before)) || (after && /[\p{L}\p{N}]/u.test(after)))
			continue;
		if (at > last) out.push(...links(line.slice(last, at), {}));
		const inner = m[0].slice(1, -1);
		if (m[0][0] === '*') out.push(...links(inner, { bold: true }));
		else out.push(...formatLine(inner).map((s) => ({ ...s, italic: true })));
		last = at + m[0].length;
	}
	if (last < line.length) out.push(...links(line.slice(last), {}));
	return out;
}

export function formatMessage(text: string): Span[][] {
	return text.split('\n').map(formatLine);
}
