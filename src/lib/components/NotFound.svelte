<script lang="ts">
	import { page } from '$app/state';
	import Seo from '#lib/components/Seo.svelte';
	import WaButton from '#lib/components/WaButton.svelte';

	let { status = 404 }: { status?: number } = $props();
</script>

<Seo
	title="Halaman tidak ditemukan | KANCIL SAPA"
	description="Halaman yang Anda cari tidak ada. Kembali ke beranda atau tanyakan lewat WhatsApp."
	path={page.url.pathname}
	noindex
/>

<div class="container not-found">
	<h1>{status === 404 ? 'Halaman tidak ditemukan' : 'Terjadi kesalahan'}</h1>
	<p class="lead">Alamat yang Anda buka tidak ada atau sudah dipindahkan.</p>
	<div class="actions">
		<a class="btn btn--primary" href="/">Ke beranda</a>
		<WaButton variant="secondary" />
	</div>
</div>
