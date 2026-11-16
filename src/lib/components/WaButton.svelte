<script lang="ts">
	import { site, waUrl } from '#lib/site';

	interface Props {
		index?: 0 | 1;
		variant?: 'primary' | 'secondary';
		size?: 'normal' | 'small';
		text?: string;
		label?: string;
	}

	let { index = 0, variant = 'primary', size = 'normal', text = 'Halo', label }: Props = $props();
	const wa = $derived(site.whatsapp[index]);
</script>

<a
	class="btn btn--{variant}"
	class:btn--small={size === 'small'}
	href={waUrl(wa.number, text)}
	target="_blank"
	rel="noopener noreferrer"
>
	{label ?? `WhatsApp ${wa.display}`}
</a>
