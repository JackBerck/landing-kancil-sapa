<script lang="ts">
	import Seo from '#lib/components/Seo.svelte';
	import WaButton from '#lib/components/WaButton.svelte';
	import ChatSample from '#lib/components/ChatSample.svelte';
	import logo from '#lib/assets/brand/logo-imigrasi.png';
	import { site, waUrl } from '#lib/site';
	import { faqs, groups, faqsOf, faqByCode, groupOfCode, anchorOf } from '#lib/faq';

	const steps = [
		{
			title: 'Buka WhatsApp',
			text: 'Kirim pesan ke salah satu nomor resmi. Cukup ketik "Halo".'
		},
		{
			title: 'Ketik angka',
			text: 'Bot menampilkan menu bernomor. Balas dengan angka pilihan Anda.'
		},
		{
			title: 'Baca jawabannya',
			text: 'Jawaban sudah diverifikasi petugas. Ingin bicara dengan petugas? Ketik 88.'
		}
	];

	const menu = [
		{
			digit: '0',
			title: 'Warga Negara Indonesia',
			text: 'Paspor, pembayaran, pengambilan, tarif.'
		},
		{ digit: '1', title: 'Warga Negara Asing', text: 'Izin tinggal, visa, pelaporan WNA.' },
		{ digit: '2', title: 'Pengaduan', text: 'Buat pengaduan atau cek tiket.' },
		{ digit: '3', title: 'Hubungi petugas', text: 'Kontak resmi petugas.' }
	];

	const special = [
		{
			code: 'LYK-002',
			name: 'KANCIL NARI',
			text: 'Antrean prioritas ibu hamil, disabilitas, anak, lansia.'
		},
		{ code: 'LYK-003', name: 'KANCIL PERSAMI', text: 'Ambil paspor Sabtu dan Minggu.' },
		{ code: 'LYK-004', name: 'KANCIL PESAT', text: 'Paspor darurat bagi pemohon sakit.' },
		{ code: 'LYK-009', name: 'KANCIL NGAPAK', text: 'Paspor akhir pekan di MPP.' },
		{ code: 'LYK-006', name: 'Eazy Paspor', text: 'Jemput bola untuk kelompok.' },
		{ code: 'LYK-010', name: 'HOTS', text: 'Paspor calon jemaah haji di lokasi.' }
	];

	const popular = ['PSP-001', 'TRF-001', 'BYR-004', 'AMB-009', 'LYK-002']
		.map((c) => faqByCode(c))
		.filter((f) => f !== undefined);

	const title = 'Layanan Imigrasi Cilacap lewat WhatsApp | KANCIL SAPA';
	const description =
		'Tanya syarat, tarif, dan pembayaran paspor ke Kantor Imigrasi Cilacap lewat WhatsApp. Bot KANCIL SAPA menjawab 24 jam, petugas melayani Senin sampai Jumat.';

	const service = {
		'@context': 'https://schema.org',
		'@type': 'Service',
		name: 'KANCIL SAPA',
		serviceType: 'Informasi layanan keimigrasian lewat WhatsApp',
		description,
		provider: { '@id': `${site.url}/#office` },
		areaServed: { '@type': 'AdministrativeArea', name: 'Kabupaten Cilacap' },
		availableChannel: site.whatsapp.map((wa) => ({
			'@type': 'ServiceChannel',
			serviceUrl: waUrl(wa.number),
			availableLanguage: 'id'
		}))
	};
</script>

<Seo {title} {description} path="/" jsonLd={[service]} />

<section class="hero">
	<div class="hero__glow hero__glow--a"></div>
	<div class="hero__glow hero__glow--b"></div>
	<div class="container hero__grid">
		<div class="hero__text">
			<h1>Layanan imigrasi Cilacap, lewat WhatsApp</h1>
			<p class="lead">Tanya syarat, tarif, dan cara bayar paspor kapan saja lewat chat.</p>
			<div class="actions">
				<WaButton index={0} />
				<WaButton index={1} variant="secondary" />
			</div>
			<ul class="hero__note">
				<li>Bot aktif {site.hours.bot}</li>
				<li>Petugas {site.hours.staff}</li>
			</ul>
		</div>
		<div class="phone">
			<div class="phone__bar">
				<img src={logo} width="36" height="36" alt="" />
				<span>KANCIL SAPA</span>
			</div>
			<ChatSample note={false} />
		</div>
	</div>
</section>

<section class="section" id="cara-pakai" aria-labelledby="cara-pakai-h">
	<div class="container">
		<div class="section-head">
			<h2 id="cara-pakai-h">Tiga langkah, tanpa aplikasi tambahan</h2>
			<p class="lead">Semua lewat WhatsApp yang sudah ada di ponsel Anda.</p>
		</div>
		<ol class="steps-grid">
			{#each steps as s, i (s.title)}
				<li class="plastic tint-{[1, 2, 3][i]}">
					<h3>{s.title}</h3>
					<p>{s.text}</p>
				</li>
			{/each}
		</ol>
	</div>
</section>

<section class="section" id="menu" aria-labelledby="menu-h">
	<div class="container">
		<div class="section-head">
			<h2 id="menu-h">Pilih angka di menu utama</h2>
			<p class="lead">Empat pilihan. Angka lain bisa dipakai kapan saja.</p>
		</div>
		<ul class="keys">
			{#each menu as item, i (item.digit)}
				<li class="key plastic tint-{[4, 5, 6, 7][i]}">
					<span class="key__digit" aria-hidden="true">{item.digit}</span>
					<h3>{item.title}</h3>
					<p>{item.text}</p>
				</li>
			{/each}
		</ul>
		<dl class="commands">
			<div>
				<dt>9</dt>
				<dd>Kembali satu langkah</dd>
			</div>
			<div>
				<dt>99</dt>
				<dd>Ke menu utama</dd>
			</div>
			<div>
				<dt>88</dt>
				<dd>Hubungi petugas</dd>
			</div>
		</dl>
		<p class="spaced-l lead">
			Pertanyaan di luar menu dijawab asisten AI. Ia hanya memakai jawaban yang diverifikasi
			petugas, dan mengarahkan Anda ke petugas bila tidak yakin.
		</p>
	</div>
</section>

<section class="section" id="topik" aria-labelledby="topik-h">
	<div class="container">
		<div class="section-head">
			<h2 id="topik-h">{faqs.length} jawaban resmi, {groups.length} topik</h2>
			<p class="lead">Semua sudah diverifikasi petugas. Pilih topik untuk membacanya di sini.</p>
		</div>
		<ul class="cards">
			{#each groups as g, i (g.slug)}
				<li>
					<a class="card plastic tint-{i + 1}" href="/layanan/{g.slug}">
						<div>
							<h3>{g.title}</h3>
							<p>{g.blurb}</p>
						</div>
						<div class="card__foot">
							<span class="pill">{faqsOf(g).length} jawaban</span>
							<span class="card__go">Baca</span>
						</div>
					</a>
				</li>
			{/each}
		</ul>
	</div>
</section>

<section class="section" id="layanan-khusus" aria-labelledby="khusus-h">
	<div class="container">
		<div class="section-head">
			<h2 id="khusus-h">Enam layanan khusus Kanim Cilacap</h2>
		</div>
		<ul class="cards">
			{#each special as s, i (s.code)}
				<li>
					<a
						class="card plastic tint-{[2, 3, 4, 5, 6, 1][i]}"
						href="/layanan/layanan-khusus#{anchorOf(s.code)}"
					>
						<div>
							<h3>{s.name}</h3>
							<p>{s.text}</p>
						</div>
						<div class="card__foot"><span class="card__go">Baca</span></div>
					</a>
				</li>
			{/each}
		</ul>
	</div>
</section>

<section class="section" aria-labelledby="aman-h">
	<div class="container">
		<div class="band">
			<h2 id="aman-h">Bot tidak pernah meminta NIK atau nomor paspor.</h2>
			<p class="lead">
				Pada pengaduan, bot hanya menanyakan nama, kategori, dan isi pengaduan Anda.
			</p>
		</div>
	</div>
</section>

<section class="section" id="populer" aria-labelledby="populer-h">
	<div class="container">
		<div class="section-head">
			<h2 id="populer-h">Yang paling sering ditanyakan</h2>
		</div>
		<ul class="rows-list">
			{#each popular as f (f.code)}
				{@const g = groupOfCode(f.code)}
				<li>
					<a class="sheet" href="/layanan/{g?.slug}#{anchorOf(f.code)}">
						<span class="rows-list__q">{f.question}</span>
						<span class="rows-list__meta">{g?.title}</span>
					</a>
				</li>
			{/each}
		</ul>
		<p class="spaced-l"><a class="btn btn--secondary" href="/faq">Semua tanya jawab</a></p>
	</div>
</section>

<section class="section" id="mulai" aria-labelledby="mulai-h">
	<div class="container">
		<div class="panel">
			<div class="cols">
				<div class="col-a">
					<h2 id="mulai-h">Mulai lewat WhatsApp</h2>
					<p class="lead spaced">
						Pilih salah satu dari dua nomor resmi. Bot menjawab {site.hours.bot}.
					</p>
					<div class="actions spaced-l">
						<WaButton index={0} />
						<WaButton index={1} variant="secondary" />
					</div>
				</div>
				<div class="col-b">
					<dl class="facts">
						<div>
							<dt>Petugas</dt>
							<dd>{site.hours.staff}</dd>
						</div>
						<div>
							<dt>Alamat</dt>
							<dd>
								{site.address.street}, {site.address.area}, {site.address.district}, {site.address
									.city}, {site.address.region}
								{site.address.postalCode}
							</dd>
						</div>
						<div>
							<dt>Email</dt>
							<dd><a href="mailto:{site.email}">{site.email}</a></dd>
						</div>
					</dl>
				</div>
			</div>
		</div>
	</div>
</section>
