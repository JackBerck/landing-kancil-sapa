<script lang="ts">
	let { note = true }: { note?: boolean } = $props();

	const messages = [
		{ from: 'user', text: 'Halo' },
		{
			from: 'bot',
			text: [
				'Selamat datang di layanan WhatsApp Kantor Imigrasi Kelas I TPI Cilacap. Silakan pilih layanan dengan mengetik angka:',
				'0 = Warga Negara Indonesia (WNI)',
				'1 = Warga Negara Asing (WNA)',
				'2 = Pengaduan',
				'3 = Hubungi Petugas',
				'Ketik 88 kapan saja untuk menghubungi petugas.'
			].join('\n')
		}
	] as const;
</script>

<div class="chat" role="group" aria-label="Contoh percakapan dengan bot">
	{#each messages as m, i (i)}
		<div class="chat__msg chat__msg--{m.from}">
			<span class="chat__who">{m.from === 'bot' ? 'KANCIL SAPA' : 'Anda'}</span>{m.text}
		</div>
	{/each}
</div>
{#if note}
	<p class="chat-note">Contoh percakapan. Tampilan di WhatsApp Anda dapat sedikit berbeda.</p>
{/if}
