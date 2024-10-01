<script lang="ts">
	import type { PageData } from './$types';
	import { clearCartSession } from '$lib/utils';
	import { onMount } from 'svelte';
	import { parseStripePrice } from '$lib/utils.js';
	export let data: PageData;

	onMount(async () => {
		await clearCartSession();
	});
</script>

<h1>Tilausvahvistus</h1>
{#if data.orderConfirmation}
	<p>Tilausnumero: {data.orderConfirmation.orderNumber}</p>
	<p>Nimi: {data.orderConfirmation.name}</p>
	<p>Sähköposti: {data.orderConfirmation.email}</p>
	<p>Puhelinnumero: {data.orderConfirmation.phoneNumber}</p>
	<h2>Toimitusosoite:</h2>
	<p>{data.orderConfirmation.shippingAddress.line1}</p>
	{#if  data.orderConfirmation?.shippingAddress?.line2}
	<p>{data.orderConfirmation.shippingAddress.line2}</p>
	{/if}
	<p>{data.orderConfirmation.shippingAddress.postalCode}</p>
	<p>{data.orderConfirmation.shippingAddress.city}</p>

	{#if  data.orderConfirmation?.items?.length}
		<h2>Ostetut tuotteet:</h2>
	<ul>
		{#each data.orderConfirmation.items as product }
			<li>
				<p>{product?.title}</p>
				{product?.quantity} x {parseStripePrice(product?.price)} €
			</li>
		{/each}
	</ul>
	{/if}
	<p>Kokonaishinta: {parseStripePrice(data.orderConfirmation.priceTotal)} €</p>

{/if}
