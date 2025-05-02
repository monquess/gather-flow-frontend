import { useUserStore } from '@/shared/store/user-store'
import { Button, Loader, Stack, Text } from '@mantine/core'
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useQueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface CheckoutElementProps {
	amount: number
	price: number
	discount?: number
}

const CheckoutElement: React.FC<CheckoutElementProps> = ({
	price,
	amount,
	discount = 0,
}) => {
	const { t } = useTranslation()
	const stripe = useStripe()
	const elements = useElements()
	const client = useQueryClient()
	const { user } = useUserStore()
	const [isLoading, setIsLoading] = useState(false)

	const finalPrice = (price * amount * (100 - discount)) / 100

	const handleSubmit = async () => {
		if (!stripe || !elements) {
			return
		}

		setIsLoading(true)

		const { error } = await stripe.confirmPayment({
			elements,
			confirmParams: {
				return_url: `${window.location.origin}/checkout-success`,
				receipt_email: user?.email,
			},
		})

		if (!error) {
			client.invalidateQueries({ queryKey: ['client-secret'] })
			client.invalidateQueries({ queryKey: ['payment-event'] })
		}

		setIsLoading(false)
	}

	return (
		<Stack gap="md">
			<PaymentElement
				id="payment-element"
				options={{
					layout: 'accordion',
					business: {
						name: 'GatherFlow',
					},
				}}
			/>
			<Button fullWidth disabled={isLoading} onClick={handleSubmit}>
				{isLoading ? (
					<Loader size="sm" />
				) : (
					<Text>
						{t('checkoutElement.payButton', { amount: finalPrice.toFixed(2) })}
					</Text>
				)}
			</Button>
		</Stack>
	)
}

export default CheckoutElement
