import { error, json, type RequestHandler } from '@sveltejs/kit';
import * as database from '$lib/server/database';
import { stripe } from '$lib/server/stripeConfig';
import type { Product } from '$lib/interfaces/interfaces';

export const GET: RequestHandler = async () => {
	//const localProducts = await database.getProducts();

	const stripeProducts = await stripe.products.list({ active: true });
	if (!stripeProducts) throw error(404, 'Could not get products');

	const products = await Promise.all(stripeProducts.data.map(async product => {
		return {
			id: product.default_price,
			title: product.name,
			description: product.description,
			price: await getPrice(product.id),
			inventoryQuantity: 1000,
		} as Product;
	}));
	return json(products, { status: 200 });
};

async function getPrice(id: string): Promise<number | null> {
	const priceList = await stripe.prices.list({
		product: id, // Fetch prices for the specific product
	});

	if (!priceList) throw error(404, 'Could not get prices');
	return priceList.data[0].unit_amount;
}
