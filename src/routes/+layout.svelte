<script lang="ts">
import { shoppingCartStore, productsStore } from '$lib/stores/store';
import type { Product, ShoppingCart } from '$lib/interfaces/interfaces';
import { onMount } from 'svelte';
import { getCartSession } from '$lib/utils';
import Header from '$lib/components/Header.svelte';

onMount(async () => {
	await getProductsForStore();
	await getShoppingCartForStore();
});

async function getShoppingCartForStore() {
	if (!$shoppingCartStore?.items?.length) {
		const cart: ShoppingCart = getCartSession();
		if (cart) {
			shoppingCartStore.set(cart);
		}
	}
}

async function getProductsForStore() {
	console.log('olemassaolevat productit: ', $productsStore)

	if (!$productsStore?.length) {
		console.log('hakee productit')
		const products: Product[] | undefined = await getProducts();
		if (products) {
			productsStore.set(products);
			console.log('haetut productit: ', $productsStore);
		}
	} else {
		console.log('productit jo haettu storeen')
	}
}

async function getProducts(): Promise<Product[] | undefined> {
	try {
		const res = await fetch('/api/products', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
		});
		return res.json();
	} catch (error) {
		console.error('error: ', error);
	}
}
</script>

<div>
	<Header/>
	<main>
		<slot />
	</main>
</div>