<script lang="ts">
	import Seo from '#lib/components/Seo.svelte';
	import Breadcrumbs from '#lib/components/Breadcrumbs.svelte';
	import { site } from '#lib/site';

	const title = 'Kebijakan Privasi KANCIL SAPA | Imigrasi Cilacap';
	const description =
		'Data apa yang diproses bot WhatsApp KANCIL SAPA, untuk apa, siapa yang dapat mengaksesnya, dan cara menghubungi kami terkait data pribadi Anda.';

	const jsonLd = [
		{
			'@context': 'https://schema.org',
			'@type': 'BreadcrumbList',
			itemListElement: [
				{ '@type': 'ListItem', position: 1, name: 'Beranda', item: `${site.url}/` },
				{ '@type': 'ListItem', position: 2, name: 'Kebijakan privasi', item: `${site.url}/privasi` }
			]
		}
	];
</script>

<Seo {title} {description} path="/privasi" {jsonLd} />

<div class="container">
	<div class="page-head">
		<Breadcrumbs items={[{ href: '/', label: 'Beranda' }, { label: 'Kebijakan privasi' }]} />
		<h1>Kebijakan privasi</h1>
		<p class="lead">
			Apa yang kami simpan saat Anda memakai KANCIL SAPA, dan untuk apa. Diperbarui {site.lastVerifiedLabel}.
		</p>
	</div>

	<div class="section prose">
		<h2>Pengelola data</h2>
		<p>
			{site.office} mengelola layanan ini. Pertanyaan tentang data pribadi dapat dikirim ke
			<a href="mailto:{site.email}">{site.email}</a>.
		</p>

		<h2>Data yang diproses lewat WhatsApp</h2>
		<ul>
			<li>Nomor WhatsApp dan nama profil Anda.</li>
			<li>Isi pesan yang Anda kirim ke bot, dan balasan bot atau petugas.</li>
			<li>
				Untuk pengaduan: nama yang Anda ketik, kategori, isi pengaduan, dan lampiran yang Anda
				kirim.
			</li>
		</ul>
		<p>Bot tidak meminta NIK atau nomor paspor. Mohon tidak mengirimkannya di percakapan.</p>

		<h2>Tujuan</h2>
		<ul>
			<li>Menjawab pertanyaan dan meneruskan Anda ke petugas bila perlu.</li>
			<li>Menangani pengaduan dan memberi nomor tiket serta statusnya.</li>
			<li>Memantau mutu layanan dan memperbarui jawaban.</li>
		</ul>

		<h2>Siapa yang dapat mengakses</h2>
		<p>
			Petugas dan pimpinan {site.office} melalui dashboard yang dilindungi login. Percakapan disalurkan
			lewat penyedia gateway WhatsApp. Pertanyaan di luar menu diproses penyedia model AI; angka panjang
			seperti NIK dan alamat email disamarkan sebelum dikirim ke AI.
		</p>

		<h2>Penyimpanan</h2>
		<p>
			Data disimpan selama diperlukan untuk penanganan layanan dan pengaduan, lalu dihapus atau
			dianonimkan sesuai kebijakan {site.office}.
		</p>

		<h2>Situs ini</h2>
		<p>
			Situs kancilsapa.com tidak memiliki formulir, tidak memasang cookie pelacak, dan tidak memakai
			layanan analitik pihak ketiga.
		</p>

		<h2>Hak Anda</h2>
		<p>
			Anda dapat meminta akses, perbaikan, atau penghapusan data Anda sesuai Undang-Undang Nomor 27
			Tahun 2022 tentang Pelindungan Data Pribadi. Kirim permintaan ke
			<a href="mailto:{site.email}">{site.email}</a>.
		</p>
	</div>
</div>
