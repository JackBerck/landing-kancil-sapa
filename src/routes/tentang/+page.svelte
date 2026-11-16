<script lang="ts">
	import Seo from '#lib/components/Seo.svelte';
	import Breadcrumbs from '#lib/components/Breadcrumbs.svelte';
	import { site } from '#lib/site';

	const title = 'Tentang KANCIL SAPA, Bot WhatsApp Imigrasi Cilacap';
	const description =
		'KANCIL SAPA adalah layanan WhatsApp Kantor Imigrasi Kelas I TPI Cilacap untuk informasi paspor, izin tinggal, dan pengaduan. Kenali cara kerja dan batasannya.';

	const jsonLd = [
		{
			'@context': 'https://schema.org',
			'@type': 'BreadcrumbList',
			itemListElement: [
				{ '@type': 'ListItem', position: 1, name: 'Beranda', item: `${site.url}/` },
				{ '@type': 'ListItem', position: 2, name: 'Tentang', item: `${site.url}/tentang` }
			]
		}
	];
</script>

<Seo {title} {description} path="/tentang" {jsonLd} />

<div class="container">
	<div class="page-head">
		<Breadcrumbs items={[{ href: '/', label: 'Beranda' }, { label: 'Tentang' }]} />
		<h1>Tentang KANCIL SAPA</h1>
		<p class="lead">
			Layanan WhatsApp {site.office} untuk informasi paspor, izin tinggal, dan pengaduan.
		</p>
	</div>

	<section class="section" aria-labelledby="siapa-h">
		<div class="cols">
			<div class="col-a"><h2 id="siapa-h">Siapa yang mengelola</h2></div>
			<div class="col-b prose">
				<p>
					KANCIL SAPA dikelola oleh {site.office}. Petugas kantor memverifikasi setiap jawaban,
					memantau percakapan, dan menangani pengaduan lewat dashboard khusus petugas.
				</p>
			</div>
		</div>
	</section>

	<section class="section" aria-labelledby="cara-h">
		<div class="cols">
			<div class="col-a"><h2 id="cara-h">Cara kerja</h2></div>
			<div class="col-b prose">
				<p>
					Bot menampilkan menu bernomor. Anda membalas dengan angka, dan bot menjawab dari tanya
					jawab yang sudah diverifikasi petugas.
				</p>
				<p>
					Pertanyaan di luar menu dijawab asisten AI. Asisten hanya boleh memakai tanya jawab yang
					sudah diverifikasi. Bila tidak yakin, ia mengarahkan Anda ke petugas.
				</p>
				<p>Ketik 88 kapan saja untuk menghubungi petugas.</p>
			</div>
		</div>
	</section>

	<section class="section" aria-labelledby="batas-h">
		<div class="cols">
			<div class="col-a"><h2 id="batas-h">Batasan</h2></div>
			<div class="col-b prose">
				<ul>
					<li>Bot tidak meminta NIK atau nomor paspor.</li>
					<li>
						Bot tidak mengecek status permohonan paspor. Gunakan format yang ada di halaman
						<a href="/kontak">kontak</a>.
					</li>
					<li>
						Informasi bersifat umum. Untuk kasus khusus, keputusan ada pada petugas Kantor Imigrasi
						Cilacap.
					</li>
					<li>Bot tidak menerima foto, suara, atau berkas di luar langkah lampiran pengaduan.</li>
				</ul>
			</div>
		</div>
	</section>

	<section class="section" aria-labelledby="dashboard-h">
		<div class="cols">
			<div class="col-a"><h2 id="dashboard-h">Untuk petugas</h2></div>
			<div class="col-b prose">
				<p>
					Petugas dan pimpinan masuk ke dashboard di
					<a href={site.dashboardUrl} rel="nofollow">dashboard.kancilsapa.com</a>.
				</p>
			</div>
		</div>
	</section>
</div>
