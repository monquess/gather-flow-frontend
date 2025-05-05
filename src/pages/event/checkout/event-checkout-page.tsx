import {
	Badge,
	Box,
	Button,
	Card,
	Center,
	Divider,
	Group,
	Image,
	Loader,
	NumberInput,
	Stack,
	Stepper,
	Text,
} from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IoCardOutline, IoTicketOutline } from 'react-icons/io5'
import { MdCalendarToday } from 'react-icons/md'
import { useParams } from 'react-router-dom'

import Layout from '@/components/general/layout'
import { MotionCard } from '@/components/general/motion-card'
import { useResponsive } from '@/hooks/use-responsive'
import { apiClient } from '@/shared/api/axios'
import { Event } from '@/shared/types'

import EventCheckoutForm from './event-checkout-form'
import PromocodeInput from './promocode-input'

interface Promocode {
	code: string
	discount: number
	expirationDate: string
}

const EventCheckoutPage: React.FC = () => {
	const { t } = useTranslation()
	const { id } = useParams()
	const { isMobile } = useResponsive()
	const [body, setBody] = useState<{ quantity: number; promocode?: Promocode }>(
		{
			quantity: 1,
		}
	)
	const [step, setStep] = useState(0)

	const getTotalPrice = (
		price: number,
		quantity: number,
		promocode?: Promocode
	) => {
		const discount = promocode?.discount ?? 0
		return ((price * quantity * (100 - discount)) / 100).toFixed(2)
	}

	const {
		data: event,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['payment-event', id],
		queryFn: async (): Promise<Event> => {
			const { data } = await apiClient<Event>(`/events/${id}`)
			return data
		},
	})

	if (isLoading) {
		return (
			<Layout>
				<Center py="xl">
					<Loader size="xl" />
				</Center>
			</Layout>
		)
	}

	if (error || !event) {
		return <div>{t('eventCheckoutPage.errors.loadError')}</div>
	}

	return (
		<Layout>
			<MotionCard
				style={{ alignSelf: 'center' }}
				withBorder
				radius="xl"
				p="xl"
				shadow="md"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, ease: 'easeOut' }}
				w={isMobile ? '100%' : '75%'}
			>
				<Stepper active={step} onStepClick={setStep}>
					<Stepper.Step
						icon={<IoTicketOutline size={18} />}
						label={t('eventCheckoutPage.steps.tickets.label')}
						description={t('eventCheckoutPage.steps.tickets.description')}
					>
						<Group gap="md" align="stretch">
							<Card withBorder shadow="none" radius="md" padding="md" miw="40%">
								<Card.Section>
									<Image
										src={event.poster}
										height={200}
										alt={event.title}
										radius="sm"
										style={{ objectFit: 'cover' }}
									/>
								</Card.Section>
								<Stack mt="md" justify="space-between">
									<Stack>
										<Text
											size="lg"
											fw={700}
											lineClamp={1}
											style={{ minHeight: 24 }}
										>
											{event.title}
										</Text>
									</Stack>
									<Stack>
										<Badge variant="light" size="sm">
											{event.format}
										</Badge>
										<Group
											mt="xs"
											align="center"
											justify="space-between"
											gap="xs"
										>
											<Group mt="xs" align="center" gap="xs">
												<MdCalendarToday size={16} />
												<Text size="xs" lineClamp={1}>
													{dayjs(event.startDate).format('DD MMM YYYY, HH:mm')}
												</Text>
											</Group>
											<Text size="sm" fw={500} lineClamp={1}>
												{event?.location?.split(',').pop()?.trim()}
											</Text>
										</Group>
									</Stack>
								</Stack>
							</Card>
							<Stack gap="md" flex={1}>
								<Group justify="space-between" h="100%" p={0}>
									<Text size="sm" ta="justify" mt={0}>
										{t('eventCheckoutPage.ticketSelection.description')}
									</Text>
									<Group gap="sm">
										<IoTicketOutline />
										<Text size="sm">
											{t('eventCheckoutPage.ticketSelection.ticketLabel')}
										</Text>
									</Group>
									<Group gap="xs">
										<Text fw={500}>${event.ticketPrice}</Text>
										<Text fw={500}>×</Text>
										<NumberInput
											w={45}
											variant="unstyled"
											value={body.quantity}
											clampBehavior="strict"
											allowNegative={false}
											min={1}
											max={event.ticketsQuantity - event.ticketsSold}
											onChange={(value) => {
												setBody((prev) => ({
													...prev,
													quantity: Number(value),
												}))
											}}
											fw={500}
											styles={{
												input: {
													padding: 0,
													fontSize: '1rem',
													display: 'inline-block',
													verticalAlign: 'middle',
												},
											}}
										/>
									</Group>
								</Group>
								<PromocodeInput
									event={event}
									onSubmit={(promocode) =>
										setBody((prev) => ({ ...prev, promocode }))
									}
								/>
								<Divider />
								<Group justify="space-between">
									<Group>
										<Text fw={700}>{t('eventCheckoutPage.total')}</Text>
										{body.promocode && (
											<Badge color="green">{`-${body.promocode.discount}%`}</Badge>
										)}
									</Group>
									<Group gap="md">
										{body.promocode && (
											<Text td="line-through">
												{`$${(event.ticketPrice * body.quantity).toFixed(2)}`}
											</Text>
										)}
										<Text c={body.promocode ? 'green' : undefined}>
											{`$${getTotalPrice(
												event.ticketPrice,
												body.quantity,
												body.promocode
											)}`}
										</Text>
									</Group>
								</Group>
							</Stack>
						</Group>
					</Stepper.Step>
					<Stepper.Step
						icon={<IoCardOutline size={18} />}
						label={t('eventCheckoutPage.steps.payment.label')}
						description={t('eventCheckoutPage.steps.payment.description')}
					>
						<EventCheckoutForm
							event={event}
							quantity={body.quantity}
							promocode={body.promocode}
						/>
					</Stepper.Step>
				</Stepper>
				<Group justify="space-between" mt="xl">
					{step !== 0 && (
						<Button
							variant="default"
							onClick={() => {
								setStep((prev) => (prev > 0 ? prev - 1 : prev))
							}}
						>
							{t('eventCheckoutPage.buttons.back')}
						</Button>
					)}
					<Box flex={1} />
					{step !== 1 && (
						<Button
							onClick={() => {
								setStep((prev) => (prev < 3 ? prev + 1 : prev))
							}}
							justify="flex-end"
						>
							{t('eventCheckoutPage.buttons.continue')}
						</Button>
					)}
				</Group>
			</MotionCard>
		</Layout>
	)
}

export default React.memo(EventCheckoutPage)
