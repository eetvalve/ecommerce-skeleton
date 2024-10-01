import { writable } from 'svelte/store';
import type { Product, ShoppingCart } from '$lib/interfaces/interfaces';

export const productsStore = writable<Product[]>();

export const shoppingCartStore = writable<ShoppingCart>({ items: [] });