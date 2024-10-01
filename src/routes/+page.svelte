<script lang="ts">
	import { productsStore } from '$lib/stores/store';
</script>

<h1>Fofa toilet</h1>
{#if $productsStore?.length}
<ul>
	{#each $productsStore as product }
		<li>
			<a href="/products/{product.id}">
				{product.title}
			</a>
		</li>
	{/each}
</ul>
{/if}
