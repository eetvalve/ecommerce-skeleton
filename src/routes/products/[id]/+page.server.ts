import { error, json } from '@sveltejs/kit';
import { productsStore } from '$lib/stores/store';
import { get } from 'svelte/store';

export function load({ params }): { productId: string } {
	return {
		productId: params.id,
	};
}
