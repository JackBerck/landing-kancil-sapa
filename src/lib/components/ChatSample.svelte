<script lang="ts">
	let { note = true }: { note?: boolean } = $props();

	const messages = [
		{ from: 'user', time: '09.14', text: 'Halo' },
		{
			from: 'bot',
			time: '09.14',
			parts: [
				{
					text: 'Selamat datang di layanan WhatsApp ',
					bold: false
				},
				{
					text: 'Kantor Imigrasi Kelas I TPI Cilacap.',
					bold: true
				}
			],
			lines: [
				'Silakan pilih layanan dengan mengetik angka:',
				'0 = Warga Negara Indonesia (WNI)',
				'1 = Warga Negara Asing (WNA)',
				'2 = Pengaduan',
				'3 = Hubungi Petugas',
				'Ketik *88* kapan saja untuk menghubungi petugas.'
			]
		}
	] as const;
</script>

<div class="chat" role="group" aria-label="Contoh percakapan dengan bot">
	<div class="chat__day"><span>HARI INI</span></div>
	{#each messages as m, i (i)}
		<div class="chat__msg chat__msg--{m.from}">
			{#if m.from === 'bot'}
				<p class="chat__p">
					{#each m.parts as p, j (j)}{#if p.bold}<strong>{p.text}</strong
							>{:else}{p.text}{/if}{/each}
				</p>
				{#each m.lines as line, k (k)}
					<p class="chat__p" class:chat__p--opt={/^\d\s*=/.test(line)}>
						{#if line.includes('*88*')}
							Ketik <strong>88</strong> kapan saja untuk menghubungi petugas.
						{:else}
							{line}
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
