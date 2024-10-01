import { shoppingCartStore } from '$lib/stores/store';
import type { NumberOrNull, ShoppingCart } from '$lib/interfaces/interfaces';

export function clearCartSession() {
	localStorage.removeItem('cart');
	shoppingCartStore.set({ items: [] });
}

export function updateCartSession(cart: ShoppingCart) {
	localStorage.setItem('cart', JSON.stringify(cart));
}

export function getCartSession() {
	const cartString = localStorage.getItem('cart');
	if (cartString) {
		return JSON.parse(cartString);
	}
	return null;
}

export function parseStripePrice(price: NumberOrNull): string {
	if (!price) {
		return '';
	}
	const priceString = price.toString();

	// 0 €
	if (priceString.length === 1) {
		return priceString;
	}

	const centsStartingPoint = (priceString.length - 2);
	return priceString.slice(0, centsStartingPoint) + ',' + priceString.slice(centsStartingPoint, priceString.length);
}