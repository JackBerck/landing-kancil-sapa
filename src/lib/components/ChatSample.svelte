<script lang="ts">
	import { botMenu, site } from '#lib/site';

	let { note = true }: { note?: boolean } = $props();

	type Line = { text: string; digit?: string };

	// Menu utama persis seperti yang dikirim bot (sapaan, status hari ini, pilihan).
	const lines: Line[] = [
		{ text: 'Silakan pilih menu di bawah ini:' },
		...botMenu.main.map((m) => ({ digit: m.digit, text: m.label })),
		{ text: 'Ketik angka pilihan Anda, lalu ikuti petunjuk selanjutnya' }
	];

	const messages = [
		{ from: 'user', time: '09.14', text: 'Halo' },
		{ from: 'bot', time: '09.14', text: '' }
	] as const;
</script>

<div class="chat" role="group" aria-label="Contoh percakapan dengan bot">
	<div class="chat__day"><span>HARI INI</span></div>
	{#each messages as m, i (i)}
		<div class="chat__msg chat__msg--{m.from}">
			{#if m.from === 'bot'}
				<p class="chat__p">Selamat Pagi, Halo</p>
				<p class="chat__p">
					Selamat Datang, di Layanan Informasi dan Pengaduan <strong>{site.office}.</strong>
				</p>
				<p class="chat__p"><strong>Status Hari Ini: BUKA</strong></p>
				{#each lines as line (line.text)}
					<p class={['chat__p', line.digit && 'chat__p--opt']}>
						{#if line.digit}
							Ketik <strong>{line.digit}</strong> {line.text}
						{:else}
							{line.text}
						{/if}
					</p>
				{/each}
			{:else}
				<span class="chat__text">{m.text}</span>
			{/if}
			<span class="chat__meta" aria-hidden="true">
				<span>{m.time}</span>
				{#if m.from === 'user'}
					<svg class="chat__ticks" width="16" height="11" viewBox="0 0 16 11" fill="none">
						<path
							d="M11.07 1.2 4.82 8.2 1.93 5.31"
							stroke="#53bdeb"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
						<path
							d="m14.57 1.2-6.25 7-1.15-1.15"
							stroke="#53bdeb"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				{/if}
			</span>
		</div>
	{/each}
</div>
{#if note}
	<p class="chat-note">Contoh percakapan. Tampilan di WhatsApp Anda dapat sedikit berbeda.</p>
{/if}
