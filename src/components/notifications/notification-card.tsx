import { apiClient } from '@/shared/api/axios'
import { useUserStore } from '@/shared/store/user-store'
import { Notification } from '@/shared/types/notification'
import { ActionIcon, Badge, Flex, Group, Stack, Text } from '@mantine/core'
import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import React, { memo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { GoTrash } from 'react-icons/go'
import { MotionCard } from '../general'

interface NotificationCardProps {
	notification: Notification
}

const NotificationCard: React.FC<NotificationCardProps> = ({
	notification,
}) => {
	const { t } = useTranslation()
	const { user } = useUserStore()
	const client = useQueryClient()
	const [isRead, setIsRead] = useState(notification.isRead)

	return (
		<MotionCard
			withBorder
			shadow="lg"
			p="sm"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, ease: 'easeOut' }}
		>
			<Stack gap="xs">
				<Flex justify="space-between">
					<Text>{t(`notificationTypes.${notification.type}`)}</Text>
					<Group>
						{isRead ? (
							<Badge color="green" w={125}>
								{t('notificationCard.status.read')}
							</Badge>
						) : (
							<Badge
								color="red"
								w={125}
								style={{ cursor: 'pointer' }}
								onClick={async () => {
									setIsRead(true)
									await apiClient.patch(
										`/notifications/${notification.id}/read`
									)
									client.invalidateQueries({
										queryKey: ['notifications', user?.id],
									})
								}}
							>
								{t('notificationCard.status.unread')}
							</Badge>
						)}
						<ActionIcon
							variant="outline"
							title={t('notificationCard.actions.delete')}
							onClick={async () => {
								await apiClient.delete(`/notifications/${notification.id}`)
								await client.invalidateQueries({
									queryKey: ['notifications', user?.id],
								})
							}}
						>
							<GoTrash size={14} />
						</ActionIcon>
					</Group>
				</Flex>
				<Text my="md">{notification.message}</Text>
				<Flex justify="end">
					<Text>
						{dayjs(notification.createdAt).format('DD MMM YYYY, HH:mm')}
					</Text>
				</Flex>
			</Stack>
		</MotionCard>
	)
}

export default memo(NotificationCard)
