import { error, type ServerLoadEvent } from '@sveltejs/kit';
import { stripe } from '$lib/server/stripeConfig';
import type { OrderConfirmation, ProductWithQuantity } from '$lib/interfaces/interfaces';


export async function load(data: ServerLoadEvent): Promise<{ orderConfirmation: OrderConfirmation }> {
	let orderConfirmation: OrderConfirmation;

	try {
		const stripeSessionId = data.url?.searchParams?.get('session_id');
		if (!stripeSessionId) throw error(404, 'Session ID not found');

		// Fetch the Stripe session
		const session = await stripe.checkout.sessions.retrieve(stripeSessionId, { expand: ['line_items'] });
		if (!session) throw error(404, 'Session not found');
		console.log('sessionJEE: ', session)

		const products: ProductWithQuantity[] = session.line_items?.data?.map(product => {
			return {
				id: product.id,
				title: product.description,
				price: product.amount_subtotal,
				quantity: product.quantity,
				inventoryQuantity: 1000
			};
		}) ?? [];

		orderConfirmation = {
			orderNumber: session.metadata?.order_number,
			priceTotal: session.amount_total,
			items: products,
			name: session.customer_details?.name,
			email: session.customer_details?.email,
			phoneNumber: session.customer_details?.phone,
			shippingAddress: {
				city: session.customer_details?.address?.city,
				country: session.customer_details?.address?.country,
				line1: session.customer_details?.address?.line1,
				line2: session.customer_details?.address?.line2,
				postalCode: session.customer_details?.address?.postal_code,
			}
		}
		console.log('orderConfirmationJee: ', orderConfirmation);
	} catch (err) {
		console.error(err);
		throw error(404, 'Tilausvahvistusta ei löytynyt.');
	}

	return {
		orderConfirmation,
	};
}
