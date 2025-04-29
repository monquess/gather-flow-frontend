import React from 'react'
import {
	Center,
	Loader,
	useMantineColorScheme,
	useMantineTheme,
} from '@mantine/core'
import { useTranslation } from 'react-i18next'

import { Elements } from '@stripe/react-stripe-js'
import { loadStripe, StripeElementLocale } from '@stripe/stripe-js'
import { useQuery } from '@tanstack/react-query'

import { config } from '@/config/config'
import { theme } from '@/theme'
import { Event, Promocode } from '@/shared/types'
import { apiClient } from '@/shared/api/axios'

import CheckoutElement from './checkout-element'

const stripe = loadStripe(config.STRIPE_PUBLISHABLE_KEY)

interface EventCheckoutFormProps {
	quantity: number
	event: Event
	promocode?: Promocode
}

const EventCheckoutForm: React.FC<EventCheckoutFormProps> = ({
	event,
	quantity,
	promocode,
}) => {
	const { colors, primaryColor } = useMantineTheme()
	const { colorScheme } = useMantineColorScheme()
	const { i18n } = useTranslation()

	const colorPrimary = colors[primaryColor][4]
	const colorBackground = colorScheme === 'dark' ? colors.dark[6] : theme.white

	const { data: clientSecret, isLoading } = useQuery({
		queryKey: ['client-secret', event.id, quantity, promocode],
		queryFn: async () => {
			console.log(promocode)
			const { data } = await apiClient.post<{ clientSecret: string }>(
				`/events/${event.id}/tickets`,
				{ quantity, promocode: promocode?.code }
			)
			return data.clientSecret
		},
		enabled: event !== null,
	})

	if (!clientSecret || isLoading) {
		return (
			<Center py="xl">
				<Loader size="xl" />
			</Center>
		)
	}

	return (
		<Elements
			options={{
				clientSecret,
				appearance: {
					theme: colorScheme === 'dark' ? 'night' : 'stripe',
					variables: {
						colorPrimary,
						colorBackground,
					},
				},
				loader: 'auto',
				locale: i18n.language as StripeElementLocale,
			}}
			stripe={stripe}
		>
			<CheckoutElement
				price={event.ticketPrice}
				amount={quantity}
				discount={promocode?.discount}
			/>
		</Elements>
	)
}

export default React.memo(EventCheckoutForm)
