<script lang="ts">
	import Seo from '#lib/components/Seo.svelte';
	import Breadcrumbs from '#lib/components/Breadcrumbs.svelte';
	import { site } from '#lib/site';
	import { groups, faqsOf } from '#lib/faq';

	const title = 'Layanan Imigrasi Cilacap: Paspor, Tarif, Layanan Khusus | KANCIL SAPA';
	const description =
		'Informasi layanan Kantor Imigrasi Cilacap: syarat paspor WNI dan anak, pengambilan, pembayaran, tarif PNBP, layanan khusus KANCIL, dan pelaporan WNA.';

	const jsonLd = [
		{
			'@context': 'https://schema.org',
			'@type': 'BreadcrumbList',
			itemListElement: [
				{ '@type': 'ListItem', position: 1, name: 'Beranda', item: `${site.url}/` },
				{ '@type': 'ListItem', position: 2, name: 'Layanan', item: `${site.url}/layanan` }
			]
		}
	];
</script>

<Seo {title} {description} path="/layanan" {jsonLd} />

<div class="container">
	<div class="page-head">
		<Breadcrumbs items={[{ href: '/', label: 'Beranda' }, { label: 'Layanan' }]} />
		<h1>Layanan Kantor Imigrasi Cilacap</h1>
		<p class="lead">
			{groups.length} topik yang dijawab bot KANCIL SAPA. Isinya sama dengan yang Anda terima di WhatsApp.
		</p>
	</div>
	<ul class="cards section">
		{#each groups as g, i (g.slug)}
			<li>
				<a class="card plastic tint-{i + 1}" href="/layanan/{g.slug}">
					<div>
						<h2>{g.title}</h2>
						<p>{g.intro}</p>
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
