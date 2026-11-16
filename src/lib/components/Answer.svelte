<script lang="ts">
	import { parseAnswer, type Part } from '#lib/answer';

	let { text }: { text: string } = $props();
	const blocks = $derived(parseAnswer(text));
</script>

{#snippet inline(parts: Part[])}
	{#each parts as part, i (i)}
		{#if part.bold}<strong>{part.text}</strong>{:else}{part.text}{/if}
	{/each}
{/snippet}

<div class="answer">
	{#each blocks as block, i (i)}
		{#if block.type === 'p'}
			<p>{@render inline(block.parts)}</p>
		{:else if block.type === 'ul'}
			<ul>
				{#each block.items as item, j (j)}
					<li>{@render inline(item)}</li>
				{/each}
			</ul>
		{:else if block.type === 'rows'}
			<dl class="rows">
				{#each block.rows as row, j (j)}
					<div>
						<dt>{row.label}</dt>
						<dd>{row.value}</dd>
					</div>
				{/each}
			</dl>
		{:else}
			<dl>
				{#each block.items as item, j (j)}
					<div>
						<dt>{item.term}</dt>
						<dd>{@render inline(item.parts)}</dd>
					</div>
				{/each}
			</dl>
		{/if}
	{/each}
</div>
