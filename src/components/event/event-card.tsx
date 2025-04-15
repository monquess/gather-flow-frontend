import { EventItem } from '@/shared/types/events'
import { Badge, Card, Group, Image, Stack, Text } from '@mantine/core'
import dayjs from 'dayjs'
import { motion } from 'framer-motion'
import React from 'react'

interface EventCardProps {
	event: EventItem
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
	return (
		<Card withBorder shadow="xl" radius="md" padding="md">
			<motion.div
				whileHover={{ scale: 1.02 }}
				whileTap={{ scale: 0.98 }}
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, ease: 'easeOut' }}
			>
				<Card.Section>
					<Image
						src={event.poster}
						height={200}
						alt={event.title}
						radius="sm"
					/>
				</Card.Section>

				<Stack mt="md">
					<Group p="apart">
						<Text size="lg" w={700} lineClamp={1}>
							{event.title}
						</Text>
						<Badge variant="light" size="sm">
							{event.format}
						</Badge>
					</Group>

					<Text size="sm" c="dimmed" lineClamp={2}>
						{event.description}
					</Text>

					<Group mt="xs" align="center">
						{/* <IconCalendarEvent size={16} stroke={1.5} /> */}
						<Text size="xs">
							{dayjs(event.startDate).format('DD MMM YYYY')}
						</Text>
					</Group>

					<Group mt="sm">
						<Text size="sm" fw={500}>
							{event.location}
						</Text>
						<Badge variant="filled">${event.ticketPrice}</Badge>
					</Group>
				</Stack>
			</motion.div>
		</Card>
	)
}

export default React.memo(EventCard)
