import script from './bot-script.json';
import { greeting, isOpen, statusText } from './hours';

/**
 * Mesin chat bot versi web: meniru BotEngine (bagian rule-based) di bot WhatsApp KANCIL SAPA.
 * Teks menu dan jawaban diambil dari bot-script.json (diekspor dari kode bot, `pnpm bot:sync`), jadi isinya sama persis.
 *
 * Perbedaan yang disengaja (landing statis, tanpa petugas dan tanpa AI):
 *  - Hubungi petugas (menu 3, 88, "1" setelah jawaban, Cek Status) diarahkan ke WhatsApp resmi.
 *  - Teks bebas di luar menu diperlakukan sebagai salah input (MSG-01..03), bukan dijawab AI.
 */

export interface ChatState {
	menu: string;
	answer: string | null;
	status: boolean;
	statusNumber: string | null;
	invalid: number;
	lastAt: number | null;
}

export interface Handoff {
	/** Ringkasan yang ditampilkan di tombol/teks, mis. nomor permohonan yang sudah diketik. */
	summary: string | null;
}

export interface BotReply {
	text: string;
	codes: string[];
	handoff?: Handoff;
}

type Option = { label: string; target: string };
type Menu = {
	path: string;
	parent: string | null;
	options: Record<string, Option>;
	text: string | null;
};

const menus = script.menus as Record<string, Menu>;
const answers = script.answers as Record<string, string>;
const places = script.applicationPlaces as Record<string, { label: string; match: string[] }>;
const greetings = new Set(script.greetings as string[]);

export const freshState = (): ChatState => ({
	menu: 'M-00',
	answer: null,
	status: false,
	statusNumber: null,
	invalid: 0,
	lastAt: null
});

/** Sama dengan BotEngine::normalize: huruf kecil, tanda baca/spasi di awal-akhir dibuang. */
export function normalize(text: string): string {
	return text
		.replace(/^[\s\p{P}]+|[\s\p{P}]+$/gu, '')
		.toLowerCase()
		.trim();
}

function words(text: string): string[] {
	return text
		.toLowerCase()
		.split(/[^\p{L}\p{N}']+/u)
		.filter(Boolean);
}

export function isGreeting(text: string): boolean {
	const list = words(text);
	return list.length > 0 && list.every((w) => greetings.has(w));
}

/** Sama dengan BotEngine::applicationPlace: kata kunci terpanjang menang, hanya kata utuh. */
export function applicationPlace(text: string): [string | null, string] {
	const lower = text.toLowerCase();
	const candidates = Object.values(places)
		.flatMap((p) => p.match.map((keyword) => [keyword, p.label] as const))
		.sort((a, b) => b[0].length - a[0].length);

	for (const [keyword, label] of candidates) {
		const re = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'u');
		if (re.test(lower)) return [label, lower.replace(new RegExp(re.source, 'gu'), ' ').trim()];
	}
	return [null, text];
}

export function mainMenuText(at: Date): string {
	return script.mainMenu
		.replace('{{GREETING}}', greeting(at))
		.replace('{{STATUS}}', statusText(at));
}

const HANDOFF_TEXT =
	'Untuk dihubungkan dengan *Petugas*, silakan lanjutkan percakapan di WhatsApp resmi kami. ' +
	'Petugas membalas sesuai urutan antrean pada jam layanan.';

export class ChatEngine {
	state: ChatState;

	constructor(state?: ChatState) {
		this.state = state ? { ...freshState(), ...state } : freshState();
	}

	/** Pesan pertama saat chat dibuka: menu utama (seperti pemohon mengetik "Halo"). */
	open(at: Date = new Date()): BotReply {
		this.state = { ...freshState(), lastAt: at.getTime() };
		return { text: mainMenuText(at), codes: ['M-00'] };
	}

	handle(raw: string, at: Date = new Date()): BotReply {
		const text = raw.trim();
		const expired =
			this.state.lastAt !== null &&
			at.getTime() - this.state.lastAt > script.sessionTimeoutMinutes * 60_000;

		if (this.state.lastAt === null || expired) {
			this.state = { ...freshState(), lastAt: at.getTime() };
			return expired
				? { text: `${script.messages['MSG-06']}\n\n${mainMenuText(at)}`, codes: ['MSG-06', 'M-00'] }
				: { text: mainMenuText(at), codes: ['M-00'] };
		}

		this.state.lastAt = at.getTime();
		const command = normalize(text);

		if (this.state.status) return this.statusStep(command, text, at);
		if (this.state.answer) return this.answerAction(command, text, at);

		if (['0', '99', 'menu'].includes(command)) return this.goMainMenu(at);
		if (command === '88') return this.escalate(at);
		if (/^\d+$/.test(command)) return this.selectOption(command, text, at);
		if (isGreeting(text)) return this.goMainMenu(at);
		return this.invalidInput(at);
	}

	private answerAction(command: string, text: string, at: Date): BotReply {
		if (['0', '99', 'menu'].includes(command)) return this.goMainMenu(at);
		if (['1', '88'].includes(command)) return this.escalate(at);
		if (/^\d+$/.test(command)) return this.invalidInput(at);
		if (isGreeting(text)) return this.goMainMenu(at);
		return this.invalidInput(at);
	}

	private goMainMenu(at: Date): BotReply {
		this.state = { ...freshState(), lastAt: this.state.lastAt };
		return { text: mainMenuText(at), codes: ['M-00'] };
	}

	private showMenu(code: string, at: Date): BotReply {
		this.state.menu = code;
		this.state.answer = null;
		this.state.status = false;
		this.state.statusNumber = null;
		return code === 'M-00'
			? { text: mainMenuText(at), codes: ['M-00'] }
			: { text: menus[code].text ?? '', codes: [code] };
	}

	private selectOption(key: string, text: string, at: Date): BotReply {
		const option = menus[this.state.menu].options[key];
		if (!option) return this.invalidInput(at);

		this.state.invalid = 0;
		const target = option.target;

		if (target.startsWith('M-')) return this.showMenu(target, at);
		if (target === 'BACK') return this.showMenu(menus[this.state.menu].parent ?? 'M-00', at);
		if (target.startsWith('ANS:')) {
			const path = target.slice(4);
			this.state.answer = path;
			return { text: answers[path], codes: [`ANS-${path}`] };
		}
		if (target.startsWith('STATUS:')) {
			this.state.status = true;
			this.state.statusNumber = null;
			this.state.answer = null;
			return { text: script.statusPrompt, codes: ['STATUS'] };
		}
		return this.escalate(at); // ESK:... (menu 3 Layanan Pengaduan)
	}

	private statusStep(command: string, text: string, at: Date): BotReply {
		if (['0', '99', 'menu'].includes(command)) return this.goMainMenu(at);
		if (command === '88') return this.escalate(at);

		if (this.state.statusNumber) {
			const place = places[command]?.label ?? applicationPlace(text)[0];
			return place ? this.escalate(at, this.state.statusNumber, place) : this.invalidInput(at);
		}

		const [place, rest] = applicationPlace(text);
		const number = place ? rest.replace(/\D+/g, '') : rest.replace(/[\s.-]+/g, '');
		if (!/^\d{10,25}$/.test(number)) return this.invalidInput(at);
		if (place) return this.escalate(at, number, place);

		this.state.invalid = 0;
		this.state.statusNumber = number;
		return { text: script.placePrompt.replace('{{NOMOR}}', number), codes: ['STATUS-PLACE'] };
	}

	/** Versi web: tidak ada antrean petugas di situs, jadi pemohon diarahkan ke WhatsApp resmi. */
	private escalate(at: Date, number?: string, place?: string): BotReply {
		const summary =
			number && place ? `Nomor permohonan ${number}, tempat permohonan ${place}` : null;
		this.state = { ...freshState(), lastAt: this.state.lastAt };

		const closed = isOpen(at)
			? ''
			: `\n\n_Saat ini di luar jam layanan petugas. Jam layanan: ${script.hours.scheduleText}._`;
		const status = summary
			? `\n\nDi WhatsApp, ketik *1* lalu *11* (Cek Status Paspor), kirim nomor permohonan *${number}*, lalu pilih tempat permohonan *${place}*.`
			: '';

		return { text: HANDOFF_TEXT + status + closed, codes: ['WA'], handoff: { summary } };
	}

	private invalidInput(at: Date): BotReply {
		this.state.invalid += 1;

		if (this.state.invalid >= 3) {
			this.state.invalid = 0; // sama dengan BotEngine: posisi menu tetap, pemohon bisa 0 atau 88
			return { text: script.messages['MSG-03'], codes: ['MSG-03'] };
		}

		const id = this.state.invalid === 1 ? 'MSG-01' : 'MSG-02';
		return { text: `${script.messages[id]}\n\n${this.currentPrompt(at)}`, codes: [id] };
	}

	private currentPrompt(at: Date): string {
		if (this.state.status) {
			return this.state.statusNumber
				? script.placePrompt.replace('{{NOMOR}}', this.state.statusNumber)
				: script.statusPrompt;
		}
		if (this.state.answer) return script.answerFooter;
		return this.state.menu === 'M-00' ? mainMenuText(at) : (menus[this.state.menu].text ?? '');
	}
}
