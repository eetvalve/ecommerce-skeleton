<script lang="ts">
	import { shoppingCartStore } from '$lib/stores/store';
	import type { Product, ProductWithQuantity, ShoppingCart } from '$lib/interfaces/interfaces';
	import { updateCartSession } from '$lib/utils';

	export let product: Product;
	export let buttonTitle = 'Lisää ostoskoriin';
	export let quantity = 1;

	function addToCart(product: Product) {
		shoppingCartStore.update((cart: ShoppingCart) => {
			const existingProduct: ProductWithQuantity | undefined = cart?.items?.find(item => item.id === product.id);
			if (!existingProduct) {
				cart.items = [...cart.items, { ...product, quantity }];
			} else {
				existingProduct.quantity = quantity;
				cart.items = [...cart.items];
			}
			updateCartSession(cart);
			return cart;
		});
	}
</script>

<label for="amount-input">Määrä:</label>
<input
	type="number"
	id="amount-input"
	bind:value={quantity}
	min="1"
	max="1000"
/>
<button on:click={addToCart(product)}>{buttonTitle}</button>