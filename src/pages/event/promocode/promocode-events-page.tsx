import {
	Badge,
	Box,
	Center,
	Checkbox,
	Divider,
	Group,
	Loader,
	Stack,
	Text,
	Title,
} from '@mantine/core'
import React, { memo } from 'react'

import dayjs from 'dayjs'

import { MotionCard } from '@/components/general'
import Layout from '@/components/general/layout'
import { apiClient } from '@/shared/api/axios'
import { Event, Promocode, PromocodeResponse } from '@/shared/types'
import { useForm } from '@mantine/form'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import CreatePromocodeInput from '../../../components/event/create-promocode-input'

const PromocodesEventPage: React.FC = () => {
	const { t } = useTranslation()
	const { id } = useParams()

	const fetchPromocode = async (): Promise<PromocodeResponse[]> => {
		const { data } = await apiClient(`/events/${id}/promocodes`)
		return data
	}

	const fetchEvent = async (): Promise<Event> => {
		const { data } = await apiClient(`/events/${id}`)
		return data
	}

	const { data, refetch } = useQuery({
		queryKey: ['promocodes', id],
		queryFn: fetchPromocode,
	})

	const { data: event } = useQuery({
		queryKey: ['event'],
		queryFn: fetchEvent,
	})

	const form = useForm({
		mode: 'controlled',
		initialValues: {
			promocodes: [] as Promocode[],
		},
	})

	if (!data || !event)
		return (
			<Layout>
				<Center>
					<Loader />
				</Center>
			</Layout>
		)

	return (
		<Layout>
			<Title>{t('common.promocode', { event: event.title })}</Title>
			<MotionCard
				shadow="md"
				radius="xl"
				withBorder
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, ease: 'easeOut' }}
			>
				<Stack justify="space-between">
					<CreatePromocodeInput
						promocodes={form.getValues().promocodes}
						minDate={new Date(event.startDate)}
						onAdd={async (promocode) => {
							await apiClient.post(`/events/${id}/promocodes`, promocode)
							refetch()
						}}
					/>
					{data.length > 0 && <Divider />}
					{data.length > 0 && (
						<Stack gap="xs">
							{data.map((promocode) => (
								<Group
									key={`${promocode.id}-${promocode.isActive}`}
									style={{ borderRadius: 8 }}
									justify="space-between"
									align="center"
								>
									<Box flex={1}>
										<Badge variant="light" color="blue" size="lg" w={140}>
											{promocode.code}
										</Badge>
									</Box>
									<Text flex={1} fw={500} c="green">
										{promocode.discount}%
									</Text>
									<Text flex={1} w={200} c="dimmed">
										{dayjs(promocode.expirationDate).format(
											'DD MMM YYYY, HH:mm'
										)}
									</Text>
									<Checkbox
										disabled={promocode.isActive === false}
										indeterminate={promocode.isActive === false}
										checked={promocode.isActive}
										size="md"
										onClick={async () => {
											await apiClient.patch(
												`/events/${id}/promocodes/${promocode.id}`,
												{
													isActive: false,
												}
											)
											refetch()
										}}
									/>
								</Group>
							))}
						</Stack>
					)}
				</Stack>
			</MotionCard>
		</Layout>
	)
}

export default memo(PromocodesEventPage)
