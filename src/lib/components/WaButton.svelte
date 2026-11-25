<script lang="ts">
	import { site, waUrl } from '#lib/site';

	interface Props {
		variant?: 'primary' | 'secondary';
		size?: 'normal' | 'small';
		text?: string;
		label?: string;
	}

	let { variant = 'primary', size = 'normal', text = 'Halo', label }: Props = $props();
	const wa = $derived(site.whatsapp[0]);
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
