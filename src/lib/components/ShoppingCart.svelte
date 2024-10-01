<script lang="ts">
	import { shoppingCartStore } from '$lib/stores/store';
	import type { ProductWithQuantity } from '$lib/interfaces/interfaces';

	let productsAmount = 0;

	$: {
		productsAmount = 0;
		$shoppingCartStore?.items.forEach((product: ProductWithQuantity) => {
			productsAmount = productsAmount + product.quantity;
		})
	}
</script>

<a href="/cart">ostoskori: {productsAmount} kpl</a>

