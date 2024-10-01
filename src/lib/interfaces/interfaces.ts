export interface OrderConfirmation {
	orderNumber: StringOrUndefined;
	priceTotal: NumberOrNull;
	items: ProductWithQuantity[],
	name: StringOrUndefined;
	email: StringOrUndefined;
	phoneNumber: StringOrUndefined;
	shippingAddress: ShippingAddress;
}

export interface ShippingAddress {
	city: StringOrUndefined;
	country: StringOrUndefined;
	line1: StringOrUndefined;
	line2?: StringOrUndefined;
	postalCode: StringOrUndefined;
}

export interface ProductWithQuantity extends Product {
	quantity: NumberOrNull;
}

export interface Product {
	id: string;
	title: StringOrUndefined;
	description?: string;
	price: number;
	inventoryQuantity: NumberOrNull;
}

export interface ShoppingCart {
	items: ProductWithQuantity[],
}

export type NumberOrNull = number | null;
export type StringOrUndefined = string | null | undefined;