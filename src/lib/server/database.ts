import type { Product } from '$lib/interfaces/interfaces';
import products from '$lib/server/data/products.json';

export async function getProducts(): Promise<Product[]> {
	return products;
}