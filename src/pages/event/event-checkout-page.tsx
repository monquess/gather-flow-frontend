import React from 'react'
import { useParams } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'

import { config } from '@/config/config'
import { CheckoutProvider, PaymentElement } from '@stripe/react-stripe-js'
import { apiClient } from '@/shared/api/axios'

const stripe = loadStripe(config.STRIPE_PUBLISHABLE_KEY)

const EventCheckoutPage: React.FC = () => {
	const { id } = useParams()
	const fetchClientSecret = async () => {
		const { data } = await apiClient.post<{ client_secret: string }>(
			`/events/${id}/tickets`,
			{
				quantity: 1,
			}
		)
		return data.client_secret
	}

	return (
		<CheckoutProvider stripe={stripe} options={{ fetchClientSecret }}>
			<PaymentElement />
		</CheckoutProvider>
	)
}

export default EventCheckoutPage
