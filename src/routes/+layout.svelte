<script lang="ts">
	import './app.css';
	import '@fontsource-variable/instrument-sans';
	import '@fontsource-variable/schibsted-grotesk';
	import { page } from '$app/state';
	import logo from '#lib/assets/brand/logo-imigrasi.png';
	import { site, nav, waUrl } from '#lib/site';
	import { groups } from '#lib/faq';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	const isCurrent = (href: string) =>
		page.url.pathname === href || page.url.pathname.startsWith(href + '/');

	const office = {
		'@context': 'https://schema.org',
		'@type': 'GovernmentOffice',
		'@id': `${site.url}/#office`,
		name: site.office,
		url: site.url,
		logo: `${site.url}/og/logo.png`,
		email: site.email,
		telephone: '+6281217000900',
		address: {
			'@type': 'PostalAddress',
			streetAddress: `${site.address.street}, ${site.address.area}`,
			addressLocality: site.address.district.replace('Kec. ', ''),
			addressRegion: site.address.region,
			postalCode: site.address.postalCode,
			addressCountry: 'ID'
		},
		openingHoursSpecification: {
			'@type': 'OpeningHoursSpecification',
			dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
			opens: '08:00',
			closes: '16:00'
		}
	};
	const website = {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		'@id': `${site.url}/#website`,
		name: site.name,
		url: site.url,
		inLanguage: 'id-ID',
		publisher: { '@id': `${site.url}/#office` }
	};
	// Seo di layout hanya memuat data terstruktur situs; judul dan meta dipasang tiap halaman.
</script>

<svelte:head>
	<link rel="icon" href="/favicon.ico" sizes="48x48" />
	<link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png" />
	<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
	<link rel="manifest" href="/manifest.webmanifest" />
	<meta name="theme-color" content="#0c2042" />
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html `<script type="application/ld+json">${JSON.stringify(website)}<` + `/script>`}
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html `<script type="application/ld+json">${JSON.stringify(office)}<` + `/script>`}
</svelte:head>

<a class="skip-link" href="#isi">Lewati ke isi halaman</a>

<header class="site-header">
	<div class="container site-header__bar">
		<a class="wordmark" href="/" aria-label="{site.name}, beranda">
			<img src={logo} width="44" height="44" alt="" />
			<span class="wordmark__text"><span>KANCIL</span><span>SAPA</span></span>
		</a>
		<nav class="site-nav" aria-label="Utama">
			<ul>
				{#each nav as item (item.href)}
					<li>
						<a href={item.href} aria-current={isCurrent(item.href) ? 'page' : undefined}
							>{item.label}</a
						>
					</li>
				{/each}
			</ul>
		</nav>
		<div class="site-header__actions">
			<a
				class="btn btn--primary btn--small"
				href={waUrl(site.whatsapp[0].number)}
				target="_blank"
				rel="noopener noreferrer">Chat<span class="cta-long">&nbsp;WhatsApp</span></a
			>
			<details class="nav-menu">
				<summary>Menu</summary>
				<nav class="nav-menu__panel" aria-label="Menu utama">
					<ul>
						<li>
							<a href="/" aria-current={page.url.pathname === '/' ? 'page' : undefined}>Beranda</a>
						</li>
						{#each nav as item (item.href)}
							<li>
								<a href={item.href} aria-current={isCurrent(item.href) ? 'page' : undefined}
									>{item.label}</a
								>
							</li>
						{/each}
					</ul>
				</nav>
			</details>
		</div>
	</div>
</header>

<main id="isi">
	{@render children()}
</main>

<footer class="site-footer">
	<div class="container">
		<div class="site-footer__grid">
			<div class="site-footer__brand">
				<a class="wordmark" href="/" aria-label="{site.name}, beranda">
					<img src={logo} width="44" height="44" alt="" />
					<span class="wordmark__text"><span>KANCIL</span><span>SAPA</span></span>
				</a>
				<p>{site.tagline}. Dikelola oleh {site.office}.</p>
			</div>
			<div class="site-footer__links">
				<h2>Halaman</h2>
				<ul>
					{#each groups as g (g.slug)}
						<li><a href="/layanan/{g.slug}">{g.title}</a></li>
					{/each}
					<li><a href="/pengaduan">Pengaduan</a></li>
					<li><a href="/faq">Semua tanya jawab</a></li>
					<li><a href="/tentang">Tentang</a></li>
					<li><a href="/privasi">Kebijakan privasi</a></li>
				</ul>
			</div>
			<div class="site-footer__contact">
				<h2>WhatsApp dan email</h2>
				<ul>
					{#each site.whatsapp as wa (wa.id)}
						<li>
							<a href={waUrl(wa.number)} target="_blank" rel="noopener noreferrer">{wa.display}</a>
						</li>
					{/each}
					<li><a href="mailto:{site.email}">{site.email}</a></li>
					<li><a href="/kontak">Alamat dan jam layanan</a></li>
				</ul>
			</div>
		</div>
		<p class="site-footer__legal">
			Informasi di situs ini bersifat umum dan bersumber dari tanya jawab yang telah diverifikasi
			petugas {site.office}. Ketentuan yang berlaku mengikuti keputusan resmi kantor imigrasi.
		</p>
	</div>
</footer>
