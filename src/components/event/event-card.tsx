import { EventItem } from '@/shared/types/events'
import { Badge, Card, Group, Image, Stack, Text } from '@mantine/core'
import dayjs from 'dayjs'
import { motion } from 'framer-motion'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { MdCalendarToday } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

interface EventCardProps {
	event: EventItem
}

// const truncateText = (text: string, maxLength: number) => {
// 	if (!text) return ''
// 	return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
// }

const EventCard: React.FC<EventCardProps> = ({ event }) => {
	const { t } = useTranslation()
	const navigate = useNavigate()

	return (
		<Card
			withBorder
			shadow="xl"
			radius="md"
			padding="md"
			h={475}
			onClick={() => navigate(`/events/${event.id}`)}
		>
			<motion.div
				whileHover={{ scale: 1.02 }}
				whileTap={{ scale: 0.98 }}
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, ease: 'easeOut' }}
				style={{ height: '100%' }}
			>
				<Card.Section>
					<Image
						src={event.poster}
						height={200}
						alt={event.title}
						radius="sm"
						style={{ objectFit: 'cover' }}
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

						<Text
							size="sm"
							c="dimmed"
							lineClamp={2}
							mt={4}
							style={{ minHeight: 36 }}
						>
							{event.description}
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
								{dayjs(event.startDate).format('DD MMM YYYY, HH:mm')}
							</Text>
						</Group>

						<Group mt="sm" justify="space-between" wrap="nowrap">
							<Text size="sm" fw={500} lineClamp={1}>
								{event?.location?.split(',').pop()?.trim()}
							</Text>
							<Badge variant="filled" color="blue">
								${event.ticketPrice.toFixed(2)}
							</Badge>
						</Group>
					</Stack>
				</Stack>
			</motion.div>
		</Card>
	)
}

export default React.memo(EventCard)
