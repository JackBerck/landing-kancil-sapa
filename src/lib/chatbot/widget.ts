/**
 * Chat bot pojok kanan bawah (versi web dari menu bot WhatsApp KANCIL SAPA).
 *
 * Situs ini statis tanpa hidrasi (csr = false), jadi widget dibundel terpisah menjadi /chatbot/widget.js
 * (vite.chatbot.config.ts) dan hanya skrip ini yang berjalan di browser. Tanpa innerHTML: semua teks lewat textContent.
 * Gaya ada di src/routes/app.css (.chatbot*), karena CSP situs tidak mengizinkan <style> inline.
 * Riwayat disimpan di sessionStorage (hilang saat tab ditutup); tidak ada data yang dikirim ke server.
 */
import { ChatEngine, type ChatState, type Handoff } from './engine';
import { formatMessage } from './format';
import { site, waUrl } from '../site';

type Message = { id: number; from: 'user' | 'bot'; text: string; time: string; handoff?: Handoff };

const STORAGE_KEY = 'kancil-sapa-chat-v1';
const MAX_MESSAGES = 120;
const SVG_NS = 'http://www.w3.org/2000/svg';

const ICONS = {
	robot:
		'M12 4V2|rect:4,5,16,12,4|dot:9,11,1.4|dot:15,11,1.4|M9.5 14.2h5|M2 10v3|M22 10v3|M9 17l-1.5 4L12 17',
	close: 'M18 6 6 18|M6 6l12 12',
	restart: 'M3 12a9 9 0 1 0 3-6.7|M3 4v5h5',
	send: 'fill:M3.4 20.4 21 12 3.4 3.6l-.01 6.53L15 12l-11.61 1.87z'
} as const;

function icon(spec: string, size: number): SVGSVGElement {
	const svg = document.createElementNS(SVG_NS, 'svg');
	svg.setAttribute('width', String(size));
	svg.setAttribute('height', String(size));
	svg.setAttribute('viewBox', '0 0 24 24');
	svg.setAttribute('fill', 'none');
	svg.setAttribute('stroke', 'currentColor');
	svg.setAttribute('stroke-width', '2');
	svg.setAttribute('stroke-linecap', 'round');
	svg.setAttribute('stroke-linejoin', 'round');
	svg.setAttribute('aria-hidden', 'true');
	for (const part of spec.split('|')) {
		if (part.startsWith('rect:')) {
			const [x, y, w, h, r] = part.slice(5).split(',');
			const rect = document.createElementNS(SVG_NS, 'rect');
			Object.entries({ x, y, width: w, height: h, rx: r }).forEach(([k, v]) =>
				rect.setAttribute(k, v)
			);
			svg.append(rect);
		} else if (part.startsWith('dot:')) {
			const [cx, cy, r] = part.slice(4).split(',');
			const circle = document.createElementNS(SVG_NS, 'circle');
			Object.entries({ cx, cy, r, fill: 'currentColor', stroke: 'none' }).forEach(([k, v]) =>
				circle.setAttribute(k, v)
			);
			svg.append(circle);
		} else {
			const fill = part.startsWith('fill:');
			const path = document.createElementNS(SVG_NS, 'path');
			path.setAttribute('d', fill ? part.slice(5) : part);
			if (fill) {
				path.setAttribute('fill', 'currentColor');
				path.setAttribute('stroke', 'none');
			}
			svg.append(path);
		}
	}
	return svg;
}

function el<K extends keyof HTMLElementTagNameMap>(
	tag: K,
	attrs: Record<string, string> = {},
	...children: (Node | string)[]
): HTMLElementTagNameMap[K] {
	const node = document.createElement(tag);
	for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
	node.append(...children);
	return node;
}

const clock = (at: Date) =>
	new Intl.DateTimeFormat('id-ID', {
		hour: '2-digit',
		minute: '2-digit',
		timeZone: 'Asia/Jakarta'
	}).format(at);

export function mountChatbot(root: HTMLElement = document.body): HTMLElement {
	let engine: ChatEngine | null = null;
	let messages: Message[] = [];
	let nextId = 0;
	let isOpen = false;

	const wrapper = el('div', { class: 'chatbot' });
	const toggle = el('button', {
		type: 'button',
		class: 'chatbot__toggle',
		'aria-expanded': 'false',
		'aria-controls': 'chatbot-panel',
		'aria-label': 'Buka chat bot KANCIL SAPA'
	});
	toggle.append(icon(ICONS.robot, 30));

	const log = el('div', {
		class: 'chat chatbot__log',
		role: 'log',
		'aria-live': 'polite',
		'aria-label': 'Percakapan'
	});
	const input = el('input', {
		id: 'chatbot-input',
		autocomplete: 'off',
		enterkeyhint: 'send',
		maxlength: '200',
		placeholder: 'Ketik angka pilihan, mis. 1'
	});
	const sendButton = el('button', {
		type: 'submit',
		class: 'chatbot__send',
		'aria-label': 'Kirim'
	});
	sendButton.append(icon(ICONS.send, 18));
	sendButton.disabled = true;
	const form = el(
		'form',
		{ class: 'chatbot__form' },
		el('label', { class: 'visually-hidden', for: 'chatbot-input' }, 'Ketik angka pilihan'),
		input,
		sendButton
	);

	const restartButton = el('button', {
		type: 'button',
		class: 'chatbot__icon-btn',
		'aria-label': 'Mulai ulang chat'
	});
	restartButton.append(icon(ICONS.restart, 18));
	const closeButton = el('button', {
		type: 'button',
		class: 'chatbot__icon-btn',
		'aria-label': 'Tutup chat'
	});
	closeButton.append(icon(ICONS.close, 18));

	const head = el(
		'div',
		{ class: 'chatbot__head' },
		el('img', { src: '/apple-touch-icon.png', width: '36', height: '36', alt: '' }),
		el(
			'div',
			{ class: 'chatbot__title' },
			el('strong', {}, site.name),
			el('span', {}, 'Bot menu otomatis, sama dengan WhatsApp')
		),
		restartButton,
		closeButton
	);

	const panel = el(
		'div',
		{
			class: 'chatbot__panel',
			id: 'chatbot-panel',
			role: 'dialog',
			'aria-label': 'Chat bot KANCIL SAPA',
			hidden: ''
		},
		head,
		log,
		form,
		el(
			'p',
			{ class: 'chatbot__note' },
			'Versi web dari menu bot WhatsApp. Untuk dilayani petugas, lanjutkan di WhatsApp resmi.'
		)
	);

	wrapper.append(panel, toggle);
	root.append(wrapper);

	function renderMessage(m: Message): HTMLElement {
		const text = el('div', { class: 'chatbot__text' });
		for (const line of formatMessage(m.text)) {
			const p = el('p', { class: 'chat__p' });
			for (const span of line) {
				const node = span.href
					? el('a', { href: span.href, target: '_blank', rel: 'noopener noreferrer' }, span.text)
					: el('span', {}, span.text);
				if (span.bold) node.classList.add('b');
				if (span.italic) node.classList.add('i');
				p.append(node);
			}
			text.append(p);
		}
		const bubble = el(
			'div',
			{ class: `chat__msg chat__msg--${m.from}`, 'data-from': m.from },
			text
		);
		if (m.handoff) {
			bubble.append(
				el(
					'div',
					{ class: 'chatbot__handoff' },
					...site.whatsapp.map((wa) =>
						el(
							'a',
							{
								class: 'btn btn--primary btn--small',
								href: waUrl(wa.number),
								target: '_blank',
								rel: 'noopener noreferrer'
							},
							`WhatsApp ${wa.display}`
						)
					)
				)
			);
		}
		bubble.append(el('span', { class: 'chat__meta', 'aria-hidden': 'true' }, m.time));
		return bubble;
	}

	function push(from: Message['from'], text: string, handoff?: Handoff) {
		const message: Message = { id: nextId++, from, text, time: clock(new Date()), handoff };
		messages = [...messages, message].slice(-MAX_MESSAGES);
		log.append(renderMessage(message));
		while (log.childElementCount > MAX_MESSAGES) log.firstElementChild?.remove();
		log.scrollTop = log.scrollHeight;
	}

	function persist() {
		try {
			sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ state: engine?.state, messages }));
		} catch {
			// Penyimpanan diblokir (mode privat): chat tetap berjalan tanpa riwayat.
		}
	}

	function restore(): boolean {
		try {
			const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? 'null') as {
				state: ChatState;
				messages: Message[];
			} | null;
			if (!saved?.messages?.length) return false;
			engine = new ChatEngine(saved.state);
			messages = saved.messages;
			nextId = Math.max(...messages.map((m) => m.id)) + 1;
			log.replaceChildren(...messages.map(renderMessage));
			return true;
		} catch {
			return false;
		}
	}

	function start() {
		engine = new ChatEngine();
		messages = [];
		log.replaceChildren();
		push('bot', engine.open().text);
		persist();
	}

	function setOpen(next: boolean) {
		isOpen = next;
		panel.hidden = !next;
		toggle.setAttribute('aria-expanded', String(next));
		toggle.setAttribute('aria-label', next ? 'Tutup chat bot' : 'Buka chat bot KANCIL SAPA');
		toggle.replaceChildren(icon(next ? ICONS.close : ICONS.robot, next ? 26 : 30));
		if (next) {
			if (!engine && !restore()) start();
			log.scrollTop = log.scrollHeight;
			input.focus();
		} else {
			toggle.focus();
		}
	}

	toggle.addEventListener('click', () => setOpen(!isOpen));
	closeButton.addEventListener('click', () => setOpen(false));
	restartButton.addEventListener('click', () => {
		start();
		input.focus();
	});
	input.addEventListener('input', () => {
		sendButton.disabled = !input.value.trim();
	});
	form.addEventListener('submit', (event) => {
		event.preventDefault();
		const text = input.value.trim();
		if (!text || !engine) return;
		input.value = '';
		sendButton.disabled = true;
		push('user', text);
		const reply = engine.handle(text);
		push('bot', reply.text, reply.handoff);
		persist();
		input.focus();
	});
	document.addEventListener('keydown', (event) => {
		if (isOpen && event.key === 'Escape') {
			event.preventDefault();
			setOpen(false);
		}
	});

	wrapper.dataset.ready = 'true';
	return wrapper;
}

if (typeof document !== 'undefined' && !document.querySelector('.chatbot')) {
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', () => mountChatbot());
	} else {
		mountChatbot();
	}
}
