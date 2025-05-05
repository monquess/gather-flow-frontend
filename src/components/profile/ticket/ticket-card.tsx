import {
	ActionIcon,
	Button,
	Divider,
	Group,
	Stack,
	Text,
	Tooltip,
} from '@mantine/core'
import { useMutation } from '@tanstack/react-query'
import dayjs from 'dayjs'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { FaDownload, FaLongArrowAltRight } from 'react-icons/fa'

import { MotionCard } from '@/components/general'
import { apiClient, ApiError } from '@/shared/api/axios'
import { showNotification } from '@/shared/helpers/show-notification'
import { Ticket } from '@/shared/types'

interface PdfResponse {
	filename: string
	content: string
}

interface TicketCardProps {
	ticket: Ticket
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket }) => {
	const { t } = useTranslation()
	const { mutate, isPending } = useMutation<PdfResponse, ApiError>({
		mutationKey: ['ticket-pdf', ticket.id],
		mutationFn: async () => {
			const { data } = await apiClient.get<PdfResponse>(
				`tickets/${ticket.id}/pdf`
			)
			return data
		},
		onError: (error) => {
			showNotification(
				t('ticketCard.notifications.error.title'),
				error.message,
				'red'
			)
		},
		onSuccess: ({ content, filename }) => {
			const link = document.createElement('a')
			link.href = `data:application/pdf;base64,${content}`
			link.download = filename
			document.body.appendChild(link)
			link.click()
			link.remove()
		},
	})

	return (
		<MotionCard
			whileHover={{ scale: 1.01 }}
			whileTap={{ scale: 0.98 }}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, ease: 'easeOut' }}
			shadow="sm"
			radius="md"
			withBorder
			p="md"
			style={{ height: '100%' }}
		>
			<Stack gap="xs">
				<Group justify="space-between" align="center">
					<Text fw={600} size="lg">
						{ticket.ticketCode}
					</Text>

					<Tooltip label={t('ticketCard.actions.download')} withArrow>
						<ActionIcon
							variant="default"
							size="lg"
							loading={isPending}
							disabled={isPending}
							onClick={() => mutate()}
						>
							<FaDownload />
						</ActionIcon>
					</Tooltip>
				</Group>

				<Divider />

				<Group justify="space-between">
					<Group>
						<Stack gap={0}>
							<Text size="xs" c="dimmed">
								{t('ticketCard.fields.purchaseDate')}
							</Text>
							<Text size="sm">
								{dayjs(ticket.purchaseDate).format('DD MMM YYYY, HH:mm')}
							</Text>
						</Stack>

						<Stack gap={0} align="start" style={{ justifySelf: 'flex-end' }}>
							<Text size="xs" c="dimmed">
								{t('ticketCard.fields.finalPrice')}
							</Text>
							<Text size="sm">${Number(ticket.finalPrice).toFixed(2)}</Text>
						</Stack>
					</Group>
					<Button
						component="a"
						variant="transparent"
						p={0}
						href={`http://localhost:4200/events/${ticket.eventId}`}
						rightSection={<FaLongArrowAltRight />}
					>
						{t('ticketCard.actions.viewEvent')}
					</Button>
				</Group>
			</Stack>
		</MotionCard>
	)
}

export default React.memo(TicketCard)
