<script lang="ts">
	import Seo from '#lib/components/Seo.svelte';
	import Breadcrumbs from '#lib/components/Breadcrumbs.svelte';
	import Answer from '#lib/components/Answer.svelte';
	import WaButton from '#lib/components/WaButton.svelte';
	import { site } from '#lib/site';
	import { faqs, groups, faqsOf, anchorOf, plainAnswer } from '#lib/faq';

	const title = 'Tanya Jawab Imigrasi Cilacap: Paspor, Tarif, WNA | KANCIL SAPA';
	const description = `${faqs.length} tanya jawab layanan Kantor Imigrasi Cilacap: syarat paspor, pembayaran, tarif PNBP, layanan khusus KANCIL, dan pelaporan WNA. Sudah diverifikasi petugas.`;

	const jsonLd = [
		{
			'@context': 'https://schema.org',
			'@type': 'FAQPage',
			mainEntity: faqs.map((f) => ({
				'@type': 'Question',
				name: f.question,
				acceptedAnswer: { '@type': 'Answer', text: plainAnswer(f.answer) }
			}))
		},
		{
			'@context': 'https://schema.org',
			'@type': 'BreadcrumbList',
			itemListElement: [
				{ '@type': 'ListItem', position: 1, name: 'Beranda', item: `${site.url}/` },
				{ '@type': 'ListItem', position: 2, name: 'Tanya jawab', item: `${site.url}/faq` }
			]
		}
	];
</script>

<Seo {title} {description} path="/faq" {jsonLd} />

<div class="container">
	<div class="page-head">
		<Breadcrumbs items={[{ href: '/', label: 'Beranda' }, { label: 'Tanya jawab' }]} />
		<h1>Tanya jawab layanan imigrasi Cilacap</h1>
		<p class="lead">
			{faqs.length} jawaban dari petugas {site.office}. Terakhir diverifikasi {site.lastVerifiedLabel}.
		</p>
		<ul class="toc">
			{#each groups as g (g.slug)}
				<li><a href="#{g.slug}">{g.title}</a></li>
			{/each}
		</ul>
	</div>

	{#each groups as g (g.slug)}
		<section class="section" id={g.slug} aria-labelledby="{g.slug}-h">
			<div class="section-head">
				<h2 id="{g.slug}-h">{g.heading}</h2>
				<p>
					<a href="/layanan/{g.slug}">Buka sebagai halaman sendiri</a>
				</p>
			</div>
			<ul class="accordion">
				{#each faqsOf(g) as f (f.code)}
					<li id={anchorOf(f.code)}>
						<details>
							<summary>{f.question}</summary>
							<Answer text={f.answer} />
						</details>
					</li>
				{/each}
			</ul>
		</section>
	{/each}

	<section class="section" aria-labelledby="belum-h">
		<h2 id="belum-h">Belum ketemu jawabannya?</h2>
		<p class="lead spaced">Tanyakan ke bot atau hubungi petugas lewat kontak resmi.</p>
		<div class="actions spaced-l">
			<WaButton />
		</div>
	</section>
</div>
