import { Center, Loader, Stack, Text, Title } from '@mantine/core'
import React from 'react'
import { useParams } from 'react-router-dom'

import UpdateEventForm from '@/components/event/forms/update-event-form'
import { MotionCard } from '@/components/general'
import Layout from '@/components/general/layout'
import { apiClient, ApiError } from '@/shared/api/axios'
import { Event } from '@/shared/types'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

const EventUpdatePage: React.FC = () => {
	const { id } = useParams()
	const { t } = useTranslation()

	const {
		data: event,
		isLoading,
		error,
	} = useQuery<Event, ApiError>({
		queryKey: ['event', id],
		queryFn: async () => {
			const { data } = await apiClient(`/events/${id}`)
			return data
		},
	})

	if (isLoading) {
		return (
			<Stack h="100vh" align="center">
				<Center>
					<Loader />
				</Center>
			</Stack>
		)
	}

	if (error || !event) {
		return (
			<Center h="100vh">
				<Text c="red">{error?.message}</Text>
			</Center>
		)
	}

	return (
		<Layout>
			<Title order={2}>{t('common.updateEvent')}</Title>
			<MotionCard
				withBorder
				radius="xl"
				p="xl"
				shadow="md"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{
					duration: 0.5,
					ease: 'easeOut',
				}}
			>
				<Stack gap="xl">
					<UpdateEventForm event={event} />
				</Stack>
			</MotionCard>
		</Layout>
	)
}

export default React.memo(EventUpdatePage)
