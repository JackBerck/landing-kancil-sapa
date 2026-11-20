import { describe, expect, it } from 'vitest';
import script from './bot-script.json';
import { ChatEngine, applicationPlace, isGreeting, mainMenuText, normalize } from './engine';
import { greeting, isOpen, statusText } from './hours';
import { formatLine, formatMessage } from './format';

const WED_10 = new Date('2026-11-11T10:00:00+07:00'); // Rabu, jam layanan
const answers = script.answers as Record<string, string>;

/** Buka chat lalu kirim urutan pesan; kembalikan semua balasan. */
function run(inputs: string[], at = WED_10) {
	const engine = new ChatEngine();
	engine.open(at);
	return { engine, replies: inputs.map((text) => engine.handle(text, at)) };
}
const last = (inputs: string[], at = WED_10) => run(inputs, at).replies.at(-1)!;

describe('jam layanan dan sapaan sama dengan BusinessHours di bot', () => {
	for (const sample of script.samples) {
		it(`status ${sample.at}`, () => {
			const at = new Date(sample.at);
			expect(statusText(at)).toBe(sample.status);
			expect(greeting(at)).toBe(sample.greeting);
			expect(isOpen(at)).toBe(sample.open);
		});
	}
});

describe('menu utama', () => {
	it('sama persis dengan teks bot WhatsApp (BotScenarioTest)', () => {
		expect(mainMenuText(WED_10)).toBe(
			'Selamat Pagi, Halo\n\n' +
				'Selamat Datang , di Layanan Informasi dan Pengaduan Kantor Imigrasi Kelas I TPI Cilacap.\n\n' +
				'*Status Hari Ini: BUKA*\nWaktu pelayanan tersedia setiap hari Senin–Kamis pukul 08.00–16.00 WIB dan Jumat pukul 08.00–16.30 WIB.\n\n' +
				'Silakan pilih menu di bawah ini:\n\n' +
				'Ketik *1* Pelayanan Paspor WNI\nKetik *2* Pelayanan Izin Tinggal (For Foreigners)\nKetik *3* Layanan Pengaduan (Complaint Support)\n\n' +
				'Ketik angka pilihan Anda, lalu ikuti petunjuk selanjutnya\n------------\n_Type your selection, then follow the instructions_'
		);
	});

	it('dibuka saat chat dibuka', () => {
		const engine = new ChatEngine();
		expect(engine.open(WED_10)).toEqual({ text: mainMenuText(WED_10), codes: ['M-00'] });
	});
});

describe('setiap jalur menu menampilkan teks bot yang sama', () => {
	const paths: [string[], string][] = [
		[['1', '1'], '0>1'],
		[['1', '2'], '0>2'],
		[['1', '3'], '0>3'],
		[['1', '4'], '0>4'],
		[['1', '5'], '0>5'],
		[['1', '6'], '0>6'],
		[['1', '7'], '0>7'],
		[['1', '8'], '0>8'],
		[['1', '9'], '0>12'],
		[['1', '10'], '0>9'],
		[['2', '1', '1'], '1>1>1'],
		[['2', '1', '2'], '1>1>2'],
		[['2', '1', '3'], '1>1>3'],
		[['2', '1', '4'], '1>1>4'],
		[['2', '1', '5'], '1>1>5'],
		[['2', '1', '6'], '1>1>6'],
		[['2', '2', '1'], '1>2>1'],
		[['2', '2', '2'], '1>2>2'],
		[['2', '2', '3'], '1>2>3'],
		[['2', '3'], '1>3']
	];

	it('semua jawaban bot tercakup', () => {
		expect(paths.map(([, p]) => p).sort()).toEqual(Object.keys(answers).sort());
	});

	for (const [inputs, path] of paths) {
		it(`${inputs.join(' > ')} = ${path}, lalu 0 = menu utama`, () => {
			const reply = last(inputs);
			expect(reply.codes).toEqual([`ANS-${path}`]);
			expect(reply.text).toBe(answers[path]);
			expect(
				reply.text.startsWith('*Berikut ini adalah informasi dan solusi yang Anda cari:*')
			).toBe(true);
			expect(last([...inputs, '0']).codes).toEqual(['M-00']);
			expect(last([...inputs, '1']).codes).toEqual(['WA']);
		});
	}

	it('submenu dan tombol kembali', () => {
		expect(last(['1']).codes).toEqual(['M-01']);
		expect(last(['1']).text).toBe(script.menus['M-01'].text);
		expect(last(['1', '12']).codes).toEqual(['M-00']);
		expect(last(['2', '1']).codes).toEqual(['M-09']);
		expect(last(['2', '1', '7']).codes).toEqual(['M-08']);
		expect(last(['2', '2', '4']).codes).toEqual(['M-08']);
		expect(last(['2', '4']).codes).toEqual(['M-00']);
	});

	it('PNBP terpisah dan SIPANTAS di jawaban paspor rusak', () => {
		const text = last(['1', '8']).text;
		expect(text).toContain('• Paspor elektronik 5 tahun: Rp650.000');
		expect(text).toContain('• Denda paspor rusak: Rp500.000');
		expect(text).not.toContain('1.150.000');
		expect(text).toContain('https://sipantas.kanimcilacap.com/');
	});
});

describe('hubungi petugas diarahkan ke WhatsApp', () => {
	it('menu 3, 88 di mana saja, dan 1 setelah jawaban', () => {
		for (const inputs of [
			['3'],
			['88'],
			['1', '88'],
			['2', '1', '88'],
			['1', '2', '1'],
			['1', '11', '88']
		]) {
			const reply = last(inputs);
			expect(reply.codes, inputs.join('>')).toEqual(['WA']);
			expect(reply.handoff).toBeDefined();
			expect(reply.text).toContain('WhatsApp resmi');
		}
	});

	it('setelah diarahkan, chat kembali ke menu utama', () => {
		expect(last(['3', '1']).codes).toEqual(['M-01']);
	});

	it('di luar jam layanan menyebut jam layanan', () => {
		const saturday = new Date('2026-11-14T10:00:00+07:00');
		expect(last(['3'], saturday).text).toContain('Saat ini di luar jam layanan petugas');
		expect(last(['3']).text).not.toContain('di luar jam layanan');
	});
});

describe('cek status paspor (nomor lalu tempat permohonan)', () => {
	it('prompt sama dengan bot, lalu pilih tempat', () => {
		expect(last(['1', '11']).text).toBe(script.statusPrompt);
		const place = last(['1', '11', '1498 0000 0001 2345']);
		expect(place.codes).toEqual(['STATUS-PLACE']);
		expect(place.text).toBe(script.placePrompt.replace('{{NOMOR}}', '1498000000012345'));

		const done = last(['1', '11', '1498000000012345', '2']);
		expect(done.codes).toEqual(['WA']);
		expect(done.handoff?.summary).toBe(
			'Nomor permohonan 1498000000012345, tempat permohonan MPP Banyumas'
		);
		expect(done.text).toContain('nomor permohonan *1498000000012345*');
	});

	it('nomor dan tempat dalam satu pesan', () => {
		const reply = last(['1', '11', '1498000000012345 Ngapak Purbalingga']);
		expect(reply.handoff?.summary).toContain('Ngapak Purbalingga');
	});

	it('salah input diulang dengan prompt yang sama, 3x = MSG-03', () => {
		const { replies } = run(['1', '11', 'bukan nomor', 'masih salah', 'lagi']);
		expect(replies[2].codes).toEqual(['MSG-01']);
		expect(replies[2].text).toBe(`${script.messages['MSG-01']}\n\n${script.statusPrompt}`);
		expect(replies[3].codes).toEqual(['MSG-02']);
		expect(replies[4]).toEqual({ text: script.messages['MSG-03'], codes: ['MSG-03'] });
	});

	it('tempat tidak dikenal = salah input; 0 = menu utama', () => {
		expect(last(['1', '11', '1498000000012345', '9']).codes).toEqual(['MSG-01']);
		expect(last(['1', '11', '1498000000012345', '0']).codes).toEqual(['M-00']);
	});
});

describe('input salah, salam, dan sesi', () => {
	it('MSG-01, MSG-02, lalu MSG-03 (teks bebas tidak dijawab AI di web)', () => {
		const { replies } = run(['paspor saya hilang', 'halo?', 'tolong']);
		expect(replies[0].codes).toEqual(['MSG-01']);
		expect(replies[0].text.startsWith(script.messages['MSG-01'])).toBe(true);
		expect(replies[1].codes).toEqual(['M-00']); // salam = menu utama, seperti bot
		expect(last(['abc', 'def', 'ghi']).codes).toEqual(['MSG-03']);
	});

	it('angka di luar pilihan dan angka lain setelah jawaban', () => {
		expect(last(['9']).codes).toEqual(['MSG-01']);
		expect(last(['1', '13']).codes).toEqual(['MSG-01']);
		expect(last(['1', '2', '5']).text).toBe(
			`${script.messages['MSG-01']}\n\n${script.answerFooter}`
		);
	});

	it('perintah toleran spasi dan tanda baca; 99 dan "menu" = menu utama', () => {
		expect(last([' 1. ']).codes).toEqual(['M-01']);
		expect(last(['1', 'MENU!']).codes).toEqual(['M-00']);
		expect(last(['1', '99']).codes).toEqual(['M-00']);
	});

	it('sesi berakhir setelah 30 menit (MSG-06)', () => {
		const engine = new ChatEngine();
		engine.open(WED_10);
		engine.handle('1', WED_10);
		const later = new Date(WED_10.getTime() + 31 * 60_000);
		expect(engine.handle('1', later).codes).toEqual(['MSG-06', 'M-00']);

		const engine2 = new ChatEngine();
		engine2.open(WED_10);
		engine2.handle('1', WED_10);
		expect(engine2.handle('1', new Date(WED_10.getTime() + 29 * 60_000)).codes).toEqual([
			'ANS-0>1'
		]);
	});

	it('state bisa disimpan lalu dipulihkan (sessionStorage)', () => {
		const { engine } = run(['1']);
		const restored = new ChatEngine(JSON.parse(JSON.stringify(engine.state)));
		expect(restored.handle('8', WED_10).codes).toEqual(['ANS-0>8']);
	});
});

describe('helper', () => {
	it('normalize, salam, tempat', () => {
		expect(normalize('  *1.* ')).toBe('1');
		expect(isGreeting('Assalamualaikum pak')).toBe(true);
		expect(isGreeting('paspor hilang')).toBe(false);
		expect(applicationPlace('1498 kancil ngapak banyumas')[0]).toBe('Ngapak Banyumas');
		expect(applicationPlace('banyumasan')[0]).toBeNull();
	});
});

describe('format WhatsApp', () => {
	it('tebal, miring, tautan, dan penanda di tengah kata diabaikan', () => {
		expect(formatLine('Ketik *1* untuk _lanjut_')).toEqual([
			{ text: 'Ketik ' },
			{ text: '1', bold: true },
			{ text: ' untuk ' },
			{ text: 'lanjut', italic: true }
		]);
		expect(formatLine('Daftar di https://sipantas.kanimcilacap.com/, lalu datang.')).toContainEqual(
			{
				text: 'https://sipantas.kanimcilacap.com/',
				href: 'https://sipantas.kanimcilacap.com/'
			}
		);
		expect(formatLine('kode_billing_2*3*4')).toEqual([{ text: 'kode_billing_2*3*4' }]);
	});

	it('setiap jawaban bot tampil tanpa tanda "*" atau "_" penanda yang tersisa di awal/akhir kata', () => {
		for (const [path, text] of Object.entries(answers)) {
			const rendered = formatMessage(text)
				.flat()
				.map((s) => s.text)
				.join('');
			expect(rendered, path).not.toMatch(/(^|\s)\*\S|\S\*(\s|$)/);
		}
	});
});
