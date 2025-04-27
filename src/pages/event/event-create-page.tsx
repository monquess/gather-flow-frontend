import { Card, CardProps, Container, Stack, Title } from '@mantine/core'
import { motion } from 'framer-motion'
import React, { forwardRef } from 'react'

import CreateEventForm from '@/components/event/forms/create-event-form'
import Footer from '@/components/general/footer'
import MainHeader from '@/components/general/main-header'
import { useTranslation } from 'react-i18next'

const MotionCard = motion(
	forwardRef<HTMLDivElement, CardProps>((props, ref) => (
		<Card ref={ref} {...props} />
	))
)

const EventCreatePage: React.FC = () => {
	const { t } = useTranslation()
	return (
		<Container size="xl" pt="md">
			<Stack gap="xl" justify="space-between">
				<MainHeader />
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
						<Title order={2}>{t('createEvent.title')}</Title>
						<CreateEventForm />
					</Stack>
				</MotionCard>
				<Footer />
			</Stack>
		</Container>
	)
}

export default React.memo(EventCreatePage)
