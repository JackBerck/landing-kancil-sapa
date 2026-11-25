<script lang="ts">
	import Seo from '#lib/components/Seo.svelte';
	import WaButton from '#lib/components/WaButton.svelte';
	import ChatSample from '#lib/components/ChatSample.svelte';
	import logo from '#lib/assets/brand/logo-imigrasi.png';
	import { site, waUrl, botMenu } from '#lib/site';
	import { faqs, groups, faqsOf, faqByCode, groupOfCode, anchorOf } from '#lib/faq';

	const steps = [
		{
			title: 'Buka WhatsApp',
			text: 'Kirim pesan ke nomor resmi. Cukup ketik "Halo".'
		},
		{
			title: 'Ketik angka',
			text: 'Bot menampilkan menu bernomor. Balas dengan angka pilihan Anda.'
		},
		{
			title: 'Baca jawabannya',
			text: 'Jawaban sudah diverifikasi petugas. Setelah jawaban, ketik 1 untuk bicara dengan petugas.'
		}
	];

	const summaries: Record<string, string> = {
		'1': 'Biaya, syarat paspor baru, ganti, anak, hilang, rusak, beda data, M-Paspor, dan cek status.',
		'2': 'Tarif izin tinggal dan visa, pelaporan WNA meninggal, dan lokasi layanan.',
		'3': 'Diteruskan ke petugas. Bila perlu, petugas mencatatnya sebagai pengaduan resmi.'
	};
	const menu = botMenu.main.map((item) => ({ ...item, text: summaries[item.digit] }));

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

	const popular = ['PSP-001', 'TRF-001', 'PSP-011', 'BYR-004', 'LYK-002']
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
	<div class="container hero__grid">
		<div class="hero__text">
			<h1>Layanan imigrasi Cilacap, lewat WhatsApp</h1>
			<p class="lead">Tanya syarat, tarif, dan cara bayar paspor kapan saja lewat chat.</p>
			<div class="actions">
				<WaButton />
			</div>
			<ul class="hero__note">
				<li>Bot aktif {site.hours.bot}</li>
				<li>Petugas {site.hours.staff}</li>
			</ul>
		</div>
		<div class="phone" aria-label="Pratinjau chat WhatsApp KANCIL SAPA">
			<div class="phone__screen">
				<div class="wa-head">
					<svg
						class="wa-head__back"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2.2"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"
					>
						<path d="M19 12H5" />
						<path d="m12 19-7-7 7-7" />
					</svg>
					<span class="wa-head__avatar">
						<img src={logo} width="34" height="34" alt="" />
					</span>
					<div class="wa-head__info">
						<span class="wa-head__name">
							KANCIL SAPA
							<svg width="14" height="14" viewBox="0 0 24 24" fill="#25d366" aria-hidden="true">
								<circle cx="12" cy="12" r="10" />
								<path
									d="m8.5 12.2 2.3 2.3 4.7-4.8"
									fill="none"
									stroke="#ffffff"
									stroke-width="2.2"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
						</span>
						<span class="wa-head__status">Akun Resmi</span>
					</div>
					<div class="wa-head__icons" aria-hidden="true">
						<svg
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path
								d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
							/>
						</svg>
						<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
							<circle cx="12" cy="5" r="1.7" />
							<circle cx="12" cy="12" r="1.7" />
							<circle cx="12" cy="19" r="1.7" />
						</svg>
					</div>
				</div>
				<ChatSample note={false} />
				<div class="wa-compose" aria-hidden="true">
					<div class="wa-compose__input">
						<svg
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.9"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<circle cx="12" cy="12" r="10" />
							<path d="M8 14s1.5 2 4 2 4-2 4-2" />
							<line x1="9" y1="9" x2="9.01" y2="9" />
							<line x1="15" y1="9" x2="15.01" y2="9" />
						</svg>
						<span>Ketik pesan</span>
						<svg
							class="wa-compose__clip"
							width="17"
							height="17"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.9"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path
								d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"
							/>
						</svg>
						<svg
							width="17"
							height="17"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.9"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path
								d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"
							/>
							<circle cx="12" cy="13" r="3" />
						</svg>
					</div>
					<span class="wa-compose__mic">
						<svg
							width="17"
							height="17"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
							<path d="M19 10v2a7 7 0 0 1-14 0v-2" />
							<line x1="12" y1="19" x2="12" y2="22" />
						</svg>
					</span>
				</div>
			</div>
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
			<p class="lead">Tiga pilihan, masing-masing berisi submenu bernomor.</p>
		</div>
		<ul class="keys">
			{#each menu as item, i (item.digit)}
				<li class="key plastic tint-{[4, 5, 6][i]}">
					<span class="key__digit" aria-hidden="true">{item.digit}</span>
					<h3>{item.label}</h3>
					<p>{item.text}</p>
				</li>
			{/each}
		</ul>
		<dl class="commands">
			<div>
				<dt>0</dt>
				<dd>Ke menu utama</dd>
			</div>
			<div>
				<dt>1</dt>
				<dd>Hubungi petugas, setelah bot menjawab</dd>
			</div>
			<div>
				<dt>88</dt>
				<dd>Hubungi petugas, kapan saja</dd>
			</div>
		</dl>
		<div class="cols spaced-l">
			<div class="col-a prose">
				<h3>Isi menu 1, Pelayanan Paspor WNI</h3>
				<ol>
					{#each botMenu.paspor as label (label)}
						<li>{label}</li>
					{/each}
				</ol>
			</div>
			<div class="col-b prose">
				<h3>Isi menu 2, Pelayanan Izin Tinggal</h3>
				<ol>
					{#each botMenu.izinTinggal as label (label)}
						<li>{label}</li>
					{/each}
				</ol>
			</div>
		</div>
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
				Untuk cek status, bot hanya menanyakan nomor permohonan dan tempat permohonan. Pengaduan
				ditangani langsung oleh petugas di chat.
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
						Chat ke nomor resmi kami. Bot menjawab {site.hours.bot}.
					</p>
					<div class="actions spaced-l">
						<WaButton />
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
