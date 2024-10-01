<script lang="ts">
	import { shoppingCartStore } from '$lib/stores/store';
	import ProductsAmountSelector from '$lib/components/ProductsAmountSelector.svelte';
	import type { ProductWithQuantity, ShoppingCart } from '$lib/interfaces/interfaces';
	import { parseStripePrice, updateCartSession } from '$lib/utils';

	let productsList: ProductWithQuantity[] = [];
	let priceTotal = 0;

	$: {
		priceTotal = 0;
		productsList = $shoppingCartStore.items;
		$shoppingCartStore.items.forEach((product: ProductWithQuantity) => {
			if (product.quantity > 0) {
				priceTotal += product.price * product.quantity;
			}
		})
	}

	function removeFromCart(productId: string) {
		shoppingCartStore.update((cart: ShoppingCart) => {
			cart.items = cart.items.filter(product => product.id !== productId);
			updateCartSession(cart);
			return cart;
		});
	}

	async function checkout() {
		try {
			const res = await fetch('/api/checkout', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'  // Ensure JSON content type
				},
				body: JSON.stringify(productsList),
			});

			const body = await res.json();
			window.location.href = body.session;
		} catch (error) {
			console.error('error: ', error);
		}
	}
</script>

<h1>Ostoskori</h1>
<ul>
	{#each productsList as product }
	<li>
		nimi: {product.title}
		hinta: {parseStripePrice(product.price)} €
		<ProductsAmountSelector product={product} buttonTitle={'päivitä ostoskori'} quantity={product.quantity} />
		<button on:click={removeFromCart(product.id)}>Poista</button>
	</li>
		{/each}
</ul>
Yhteensä: {parseStripePrice(priceTotal)} €
{#if productsList?.length }
	<form on:submit|preventDefault={checkout}>
		<button type="submit">Siirry maksamaan</button>
	</form>
{/if}