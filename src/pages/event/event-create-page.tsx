import React from 'react'
import { Stack, Title } from '@mantine/core'
import { useTranslation } from 'react-i18next'

import CreateEventForm from '@/components/event/forms/create-event-form'

import { MotionCard } from '@/components/general'
import Layout from '@/components/general/layout'

const EventCreatePage: React.FC = () => {
	const { t } = useTranslation()

	return (
		<Layout>
			<Title order={2}>{t('createEvent.title')}</Title>
			<MotionCard
				withBorder
				radius="xl"
				p="xl"
				shadow="md"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, ease: 'easeOut' }}
			>
				<Stack gap="xl">
					<CreateEventForm />
				</Stack>
			</MotionCard>
		</Layout>
	)
}

export default React.memo(EventCreatePage)
