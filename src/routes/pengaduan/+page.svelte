<script lang="ts">
	import Seo from '#lib/components/Seo.svelte';
	import Breadcrumbs from '#lib/components/Breadcrumbs.svelte';
	import WaButton from '#lib/components/WaButton.svelte';
	import { site } from '#lib/site';

	const title = 'Pengaduan Layanan Imigrasi Cilacap lewat WhatsApp | KANCIL SAPA';
	const description =
		'Cara menyampaikan pengaduan ke Kantor Imigrasi Cilacap lewat WhatsApp: ketik 3 di menu utama, petugas membalas di chat, dan tanggapan resmi dikirim ke nomor Anda.';

	// Alur yang berjalan di bot (menu 3 = antrean petugas; petugas mencatat pengaduan resmi dari dashboard).
	const steps = [
		{
			title: 'Ketik 3 di menu utama',
			text: 'Pilih Layanan Pengaduan (Complaint Support). Permintaan Anda masuk antrean petugas.'
		},
		{
			title: 'Tunggu giliran',
			text: 'Bot memberi tahu nomor antrean hari ini dan posisi Anda. Ketik 1 untuk cek posisi, 2 untuk batal, atau 0 untuk kembali ke menu.'
		},
		{
			title: 'Ceritakan kejadiannya ke petugas',
			text: 'Petugas membalas di chat yang sama. Tulis kronologi singkat dengan kalimat sendiri.'
		},
		{
			title: 'Dicatat sebagai pengaduan resmi',
			text: 'Bila perlu, petugas mencatatnya sebagai pengaduan resmi dan Anda diberi tahu di chat.'
		},
		{
			title: 'Terima tanggapan',
			text: 'Tanggapan dikirim ke WhatsApp Anda saat pengaduan diproses dan saat selesai.'
		}
	];

	const categories = [
		{ name: 'Layanan paspor', priority: 'Sedang' },
		{ name: 'Layanan WNA atau izin tinggal', priority: 'Sedang' },
		{ name: 'Pelayanan petugas', priority: 'Tinggi' },
		{ name: 'Lainnya', priority: 'Rendah' }
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
			Pengaduan ditangani langsung oleh petugas {site.office}, di chat yang sama.
		</p>
		<div class="actions">
			<WaButton index={0} text="Halo, saya ingin menyampaikan pengaduan" />
			<WaButton index={1} variant="secondary" text="Halo, saya ingin menyampaikan pengaduan" />
		</div>
	</div>

	<section class="section" aria-labelledby="langkah-h">
		<div class="cols">
			<div class="col-a">
				<h2 id="langkah-h">Lima langkah</h2>
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

	<section class="section" aria-labelledby="kategori-h">
		<div class="cols">
			<div class="col-a">
				<h2 id="kategori-h">Empat kategori pengaduan</h2>
				<p class="lead spaced">
					Petugas memilih kategori saat mencatat pengaduan. Prioritas menentukan urutan tindak
					lanjut.
				</p>
			</div>
			<div class="col-b">
				<dl class="facts">
					{#each categories as c (c.name)}
						<div>
							<dt>{c.name}</dt>
							<dd>Prioritas {c.priority}</dd>
						</div>
					{/each}
				</dl>
			</div>
		</div>
	</section>

	<section class="section" aria-labelledby="jam-h">
		<div class="cols">
			<div class="col-a">
				<h2 id="jam-h">Jam layanan petugas</h2>
			</div>
			<div class="col-b prose">
				<p>{site.hours.staff}.</p>
				<p>
					Di luar jam layanan, permintaan Anda tetap tercatat dalam antrean petugas, sama seperti
					pemberitahuan dari bot.
				</p>
				<p>
					Bot tidak pernah meminta NIK atau nomor paspor. Mohon tidak mengirimkannya di percakapan.
				</p>
			</div>
		</div>
	</section>
</div>
