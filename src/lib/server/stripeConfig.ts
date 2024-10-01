import Stripe from 'stripe';

const privateKey: string = import.meta.env.VITE_STRIPE_API_KEY;
export const stripe = new Stripe(privateKey);