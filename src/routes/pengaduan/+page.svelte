<script lang="ts">
	import Seo from '#lib/components/Seo.svelte';
	import Breadcrumbs from '#lib/components/Breadcrumbs.svelte';
	import WaButton from '#lib/components/WaButton.svelte';
	import { site } from '#lib/site';

	const title = 'Pengaduan Layanan Imigrasi Cilacap lewat WhatsApp | KANCIL SAPA';
	const description =
		'Cara menyampaikan pengaduan ke Kantor Imigrasi Cilacap lewat WhatsApp: pilih menu 2, isi data, dapatkan nomor tiket, lalu cek statusnya kapan saja.';

	const steps = [
		{ title: 'Ketik 2 di menu utama', text: 'Lalu pilih 1 untuk membuat pengaduan baru.' },
		{ title: 'Tulis nama lengkap', text: 'Hanya nama. Bot tidak meminta NIK atau nomor paspor.' },
		{
			title: 'Pilih kategori',
			text: 'Layanan paspor, layanan WNA atau izin tinggal, pelayanan petugas, atau lainnya.'
		},
		{ title: 'Ceritakan kejadiannya', text: 'Tulis kronologi singkat dengan kalimat sendiri.' },
		{
			title: 'Lampirkan foto atau dokumen',
			text: 'Boleh dilewati. Ketik selesai setelah semua berkas terkirim.'
		},
		{
			title: 'Periksa ringkasan, lalu kirim',
			text: 'Data tersimpan hanya jika Anda memilih kirim. Ketik batal untuk membatalkan.'
		},
		{
			title: 'Simpan nomor tiket',
			text: 'Bot memberi nomor berformat ADU-TahunBulan-NomorUrut, misalnya ADU-202612-0001.'
		}
	];

	const jsonLd = [
		{
			'@context': 'https://schema.org',
			'@type': 'BreadcrumbList',
			itemListElement: [
				{ '@type': 'ListItem', position: 1, name: 'Beranda', item: `${site.url}/` },
				{ '@type': 'ListItem', position: 2, name: 'Pengaduan', item: `${site.url}/pengaduan` }
			]
		}
	];
</script>

<Seo {title} {description} path="/pengaduan" {jsonLd} />

<div class="container">
	<div class="page-head">
		<Breadcrumbs items={[{ href: '/', label: 'Beranda' }, { label: 'Pengaduan' }]} />
		<h1>Sampaikan pengaduan lewat WhatsApp</h1>
		<p class="lead">
			Pengaduan masuk ke dashboard petugas {site.office} dan Anda mendapat nomor tiket.
		</p>
		<div class="actions">
			<WaButton index={0} text="Halo, saya ingin membuat pengaduan" />
			<WaButton index={1} variant="secondary" text="Halo, saya ingin membuat pengaduan" />
		</div>
	</div>

	<section class="section" aria-labelledby="langkah-h">
		<div class="cols">
			<div class="col-a">
				<h2 id="langkah-h">Tujuh langkah</h2>
				<p class="lead spaced">Semua dilakukan di percakapan WhatsApp, tanpa formulir tambahan.</p>
			</div>
			<div class="col-b">
				<ol class="steps">
					{#each steps as s (s.title)}
						<li>
							<div>
								<strong>{s.title}</strong>
								<span class="muted">{s.text}</span>
							</div>
						</li>
					{/each}
				</ol>
			</div>
		</div>
	</section>

	<section class="section" aria-labelledby="status-h">
		<div class="cols">
			<div class="col-a">
				<h2 id="status-h">Cek status pengaduan</h2>
			</div>
			<div class="col-b prose">
				<p>
					Ketik 2 di menu utama, pilih 2 untuk cek status, lalu masukkan nomor tiket. Status yang
					tampil adalah Baru, Diproses, atau Selesai, beserta tanggapan petugas.
				</p>
				<p>Status hanya dapat dilihat dari nomor WhatsApp yang dipakai saat membuat pengaduan.</p>
				<p>
					Untuk hal mendesak, hubungi petugas di <a href="/kontak">kontak resmi</a> pada jam layanan.
				</p>
			</div>
		</div>
	</section>
</div>
