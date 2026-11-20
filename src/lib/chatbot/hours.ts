import script from './bot-script.json';

/** Jam layanan dan sapaan, sama dengan BusinessHours dan BotScript::greeting di bot (zona Asia/Jakarta). */
const TZ = 'Asia/Jakarta';

interface Clock {
	date: string; // YYYY-MM-DD
	isoDay: number; // 1 = Senin ... 7 = Minggu
	hour: number;
	time: string; // HH:mm
}

const DAYS: Record<string, number> = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 };

export function jakarta(at: Date): Clock {
	const parts = Object.fromEntries(
		new Intl.DateTimeFormat('en-US', {
			timeZone: TZ,
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			weekday: 'short',
			hour: '2-digit',
			minute: '2-digit',
			hourCycle: 'h23'
		})
			.formatToParts(at)
			.map((p) => [p.type, p.value])
	);
	return {
		date: `${parts.year}-${parts.month}-${parts.day}`,
		isoDay: DAYS[parts.weekday],
		hour: Number(parts.hour),
		time: `${parts.hour}:${parts.minute}`
	};
}

const holidays = script.holidays as Record<string, string>;

export function isOpen(at: Date): boolean {
	const c = jakarta(at);
	if (!script.hours.workingDays.includes(c.isoDay) || holidays[c.date]) return false;
	const closing = c.isoDay === 5 ? script.hours.endFriday : script.hours.end;
	return c.time >= script.hours.start && c.time < closing;
}

export function statusText(at: Date): string {
	const c = jakarta(at);
	const status = holidays[c.date]
		? `LIBUR (${holidays[c.date]})`
		: !script.hours.workingDays.includes(c.isoDay)
			? 'LIBUR (Akhir Pekan)'
			: isOpen(at)
				? 'BUKA'
				: 'TUTUP (di luar jam pelayanan)';
	return `*Status Hari Ini: ${status}*\nWaktu pelayanan tersedia setiap hari ${script.hours.scheduleText}.`;
}

export function greeting(at: Date): string {
	const { hour } = jakarta(at);
	const part =
		hour >= 4 && hour < 11
			? 'Pagi'
			: hour >= 11 && hour < 15
				? 'Siang'
				: hour >= 15 && hour < 18
					? 'Sore'
					: 'Malam';
	return `Selamat ${part}, Halo`;
}
