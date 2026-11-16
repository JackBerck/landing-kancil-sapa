<script lang="ts">
	import Seo from '#lib/components/Seo.svelte';
	import Breadcrumbs from '#lib/components/Breadcrumbs.svelte';
	import Answer from '#lib/components/Answer.svelte';
	import WaButton from '#lib/components/WaButton.svelte';
	import { site } from '#lib/site';
	import { faqsOf, anchorOf, plainAnswer } from '#lib/faq';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const group = $derived(data.group);
	const items = $derived(faqsOf(group));
	const path = $derived(`/layanan/${group.slug}`);

	const jsonLd = $derived([
		{
			'@context': 'https://schema.org',
			'@type': 'FAQPage',
			mainEntity: items.map((f) => ({
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
				{ '@type': 'ListItem', position: 2, name: 'Layanan', item: `${site.url}/layanan` },
				{ '@type': 'ListItem', position: 3, name: group.title, item: `${site.url}${path}` }
			]
		}
	]);
</script>

<Seo title="{group.heading} | KANCIL SAPA" description={group.description} {path} {jsonLd} />

<div class="container">
	<div class="page-head">
		<Breadcrumbs
			items={[
				{ href: '/', label: 'Beranda' },
				{ href: '/layanan', label: 'Layanan' },
				{ label: group.title }
			]}
		/>
		<h1>{group.heading}</h1>
		<p class="lead">{group.intro}</p>
		<p class="stamp-note">
			Diverifikasi petugas {site.office}. Terakhir diperiksa {site.lastVerifiedLabel}.
		</p>
	</div>

	<ul class="qa section">
		{#each items as f (f.code)}
			<li id={anchorOf(f.code)}>
				<h2>{f.question}</h2>
				<Answer text={f.answer} />
			</li>
		{/each}
	</ul>

	<section class="section" aria-labelledby="tanya-h">
		<h2 id="tanya-h">Masih ada yang belum jelas?</h2>
		<p class="lead spaced">
			Tanyakan lewat WhatsApp. Untuk kasus khusus, ketik 88 agar bot memberi kontak petugas.
		</p>
		<div class="actions spaced-l">
			<WaButton index={0} />
			<WaButton index={1} variant="secondary" />
		</div>
	</section>

	<nav class="section" aria-label="Topik lain">
		<ul class="toc">
			{#if data.previous}
				<li>
					<a href="/layanan/{data.previous.slug}"
						><span class="visually-hidden">Sebelumnya: </span>{data.previous.title}</a
					>
				</li>
			{/if}
			{#if data.next}
				<li>
					<a href="/layanan/{data.next.slug}"
						><span class="visually-hidden">Berikutnya: </span>{data.next.title}</a
					>
				</li>
			{/if}
			<li><a href="/layanan">Semua layanan</a></li>
		</ul>
	</nav>
</div>
