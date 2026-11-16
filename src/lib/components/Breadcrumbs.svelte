<script lang="ts">
	let { items }: { items: { href?: string; label: string }[] } = $props();
</script>

<nav aria-label="Jejak halaman">
	<ol class="crumbs">
		{#each items as item, i (i)}
			<li>
				{#if item.href}<a href={item.href}>{item.label}</a>{:else}<span aria-current="page"
						>{item.label}</span
					>{/if}
			</li>
		{/each}
	</ol>
</nav>
