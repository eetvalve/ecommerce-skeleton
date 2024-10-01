<script lang="ts">
	import type { PageData } from './$types';
	import ProductsAmountSelector from '$lib/components/ProductsAmountSelector.svelte';
	import { productsStore } from '$lib/stores/store';
	import type { Product } from '$lib/interfaces/interfaces';
	import { parseStripePrice } from '$lib/utils.js';
	export let data: PageData;

	let product: Product | undefined;
	$: product = $productsStore?.find(prod => prod.id === data.productId);
</script>

<h1>Product: {product?.title}</h1>
{#if product}
	<p>{product.description}</p>
	<p>{parseStripePrice(product.price)} €</p>
	<ProductsAmountSelector product={product} />
{:else}
	<p>Tuotetta ei löytynyt</p>
{/if}

