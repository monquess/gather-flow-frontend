import { Badge, Card, Group, Image, Stack, Text } from '@mantine/core'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { MdCalendarToday } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

import dayjs from 'dayjs'
import { motion } from 'framer-motion'

import { Event } from '@/shared/types'

interface EventCardProps {
	event: Event
	delay?: number
}

const EventCard: React.FC<EventCardProps> = ({ event, delay }) => {
	const { t } = useTranslation()
	const navigate = useNavigate()

	return (
		<Card
			withBorder
			radius="md"
			padding="md"
			h={425}
			onClick={() => navigate(`/events/${event.id}`)}
		>
			<motion.div
				whileHover={{ scale: 1.02 }}
				whileTap={{ scale: 0.98 }}
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				style={{
					height: '100%',
				}}
				transition={{
					duration: 0.5,
					ease: 'easeOut',
					delay,
				}}
			>
				<Card.Section>
					<Image
						src={event.poster}
						height={200}
						alt={event.title}
						radius="sm"
						style={{
							objectFit: 'cover',
							filter: event.status === 'DRAFT' ? 'blur(2px)' : 'none',
						}}
					/>
				</Card.Section>

				<Stack
					mt="md"
					justify="space-between"
					style={{ height: 'calc(100% - 200px)' }}
				>
					<Stack>
						<Text size="lg" fw={700} lineClamp={1} style={{ minHeight: 24 }}>
							{event.title}
						</Text>
					</Stack>

					<Stack>
						<Group gap="xs" align="center">
							<Badge variant="light" size="sm">
								{t(`eventsPage.formats.${event.format}`)}
							</Badge>
							<Badge variant="light" size="sm">
								{t(`eventsPage.themes.${event.theme}`)}
							</Badge>
						</Group>
						<Group mt="xs" align="center" gap="xs">
							<MdCalendarToday size={16} />
							<Text size="xs" lineClamp={1}>
								{event.status === 'DRAFT'
									? dayjs(event.publishDate).format('DD MMM YYYY, HH:mm')
									: dayjs(event.startDate).format('DD MMM YYYY, HH:mm')}
							</Text>
						</Group>

						<Group mt="sm" justify="space-between" wrap="nowrap">
							<Text size="sm" fw={500} lineClamp={1}>
								{event?.location?.split(',').pop()?.trim()}
							</Text>
							<Group gap="0">
								{event.status === 'DRAFT' ? (
									<Badge variant="outline" mr="xs">
										{t('common.draft')}
									</Badge>
								) : null}
								{event.ticketPrice === 0 ? (
									<Badge variant="filled" color="green">
										{t('common.free')}
									</Badge>
								) : (
									<Badge variant="filled" color="blue">
										${event.ticketPrice.toFixed(2)}
									</Badge>
								)}
							</Group>
						</Group>
					</Stack>
				</Stack>
			</motion.div>
		</Card>
	)
}

export default React.memo(EventCard)
