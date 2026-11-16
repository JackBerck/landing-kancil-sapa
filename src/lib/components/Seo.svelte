<script lang="ts">
	import { site } from '#lib/site';

	interface Props {
		title: string;
		description: string;
		path: string;
		jsonLd?: Record<string, unknown>[];
		noindex?: boolean;
		ogType?: 'website' | 'article';
	}

	let {
		title,
		description,
		path,
		jsonLd = [],
		noindex = false,
		ogType = 'website'
	}: Props = $props();

	const canonical = $derived(`${site.url}${path === '/' ? '/' : path}`);
	const image = `${site.url}/og/default.png`;
	const scripts = $derived(
		jsonLd
			.map(
				(obj) =>
					`<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\u003c')}<` +
					`/script>`
			)
			.join('')
	);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonical} />
	{#if noindex}
		<meta name="robots" content="noindex, nofollow" />
	{:else}
		<meta name="robots" content="index, follow, max-image-preview:large" />
	{/if}
	<meta property="og:type" content={ogType} />
	<meta property="og:site_name" content={site.name} />
	<meta property="og:locale" content={site.locale} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content={image} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content="KANCIL SAPA, layanan WhatsApp Kantor Imigrasi Cilacap" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={image} />
	<!-- JSON-LD dibangkitkan saat build dari data tepercaya; "<" sudah di-escape. -->
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html scripts}
</svelte:head>
