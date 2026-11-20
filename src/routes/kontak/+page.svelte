<script lang="ts">
	import Seo from '#lib/components/Seo.svelte';
	import Breadcrumbs from '#lib/components/Breadcrumbs.svelte';
	import WaButton from '#lib/components/WaButton.svelte';
	import { site, addressLine, mapsUrl } from '#lib/site';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const title = 'Kontak, Alamat, dan Jam Layanan Imigrasi Cilacap | KANCIL SAPA';
	const description =
		'Nomor WhatsApp, email, alamat Jl. Urip Sumoharjo No.249 Cilacap, dan jam layanan petugas Senin sampai Kamis 08.00 sampai 16.00 WIB, Jumat sampai 16.30 WIB. Bot aktif 24 jam.';

	const jsonLd = [
		{
			'@context': 'https://schema.org',
			'@type': 'BreadcrumbList',
			itemListElement: [
				{ '@type': 'ListItem', position: 1, name: 'Beranda', item: `${site.url}/` },
				{ '@type': 'ListItem', position: 2, name: 'Kontak', item: `${site.url}/kontak` }
			]
		}
	];
</script>

<Seo {title} {description} path="/kontak" {jsonLd} />

<div class="container">
	<div class="page-head">
		<Breadcrumbs items={[{ href: '/', label: 'Beranda' }, { label: 'Kontak' }]} />
		<h1>Kontak dan jam layanan</h1>
		<p class="lead">Dua nomor WhatsApp resmi. Bot menjawab {site.hours.bot}.</p>
	</div>

	<section class="section" aria-labelledby="wa-h">
		<h2 class="visually-hidden" id="wa-h">Nomor WhatsApp</h2>
		<div class="contact-grid">
			{#each site.whatsapp as wa, i (wa.id)}
				<div class="contact-card plastic tint-{i === 0 ? 1 : 3}">
					<h3>Nomor {i + 1}</h3>
					<p class="lead">{wa.display}</p>
					<div class="qr" role="img" aria-label="Kode QR untuk membuka WhatsApp {wa.display}">
						<!-- eslint-disable-next-line svelte/no-at-html-tags -->
						{@html data.qrs[i].svg}
					</div>
					<div class="actions">
						<WaButton index={i === 0 ? 0 : 1} />
					</div>
				</div>
			{/each}
		</div>
	</section>

	<section class="section" aria-labelledby="info-h">
		<div class="cols">
			<div class="col-a">
				<h2 id="info-h">Jam layanan</h2>
			</div>
			<div class="col-b">
				<dl class="facts">
					<div>
						<dt>Bot WhatsApp</dt>
						<dd>{site.hours.bot}</dd>
					</div>
					<div>
						<dt>Petugas</dt>
						<dd>{site.hours.staff}</dd>
					</div>
					<div>
						<dt>Email</dt>
						<dd><a href="mailto:{site.email}">{site.email}</a></dd>
					</div>
					<div>
						<dt>Cek status permohonan paspor</dt>
						<dd>
							Lewat bot: ketik 1, lalu 11 (Cek Status Paspor). Kirim nomor permohonan dan pilih
							tempat permohonan ({site.applicationPlaces.join(', ')}). Petugas membalas di chat pada
							jam layanan.
						</dd>
					</div>
				</dl>
			</div>
		</div>
	</section>

	<section class="section" aria-labelledby="alamat-h">
		<div class="cols">
			<div class="col-a">
				<h2 id="alamat-h">Alamat kantor</h2>
			</div>
			<div class="col-b">
				<address class="lead">{site.office}<br />{addressLine}</address>
				<p class="spaced">
					<a class="btn btn--secondary" href={mapsUrl} target="_blank" rel="noopener noreferrer"
						>Buka di Google Maps</a
					>
				</p>
			</div>
		</div>
	</section>

	<section class="section" aria-labelledby="lokasi-h">
		<div class="cols">
			<div class="col-a">
				<h2 id="lokasi-h">Lokasi layanan lain</h2>
				<p class="lead spaced">
					Layanan paspor {site.office} juga tersedia di Mal Pelayanan Publik berikut.
				</p>
			</div>
			<div class="col-b">
				<ul class="location-list">
					{#each site.locations as place (place.name)}
						<li>
							<h3>{place.name}</h3>
							<address>{place.address}</address>
							<a href={place.maps} target="_blank" rel="noopener noreferrer"
								>Buka di Google Maps<span class="visually-hidden">: {place.name}</span></a
							>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	</section>
</div>
