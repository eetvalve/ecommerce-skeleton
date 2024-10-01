import { json, type RequestHandler, type RequestEvent, error } from '@sveltejs/kit';
import { stripe } from '$lib/server/stripeConfig';
import type { ProductWithQuantity } from '$lib/interfaces/interfaces';
const environmentUrl: string = import.meta.env.VITE_ENVIRONMENT_URL;


export const POST: RequestHandler = async (request: RequestEvent) => {
	const products: ProductWithQuantity[] = await request.request.json();

	if (!products || products.length === 0) {
		throw error(400, 'No Products to send.');
	}

	// Stripe uses priceId as unique identifier.
	const session = await stripe.checkout.sessions.create({
		line_items: products.map(product => ({price: product.id, quantity: product.quantity})),
		mode: 'payment',
		success_url: `${environmentUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
		cancel_url: `${environmentUrl}/checkout/cancel`,
		billing_address_collection: 'required',
		phone_number_collection: {
			enabled: true,
		},
		metadata: {
			order_number: crypto.randomUUID(),
		},
		locale: 'auto',
	});
	return json({ session: session.url }, { status: 200 });
};