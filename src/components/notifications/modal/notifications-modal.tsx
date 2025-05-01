import { useResponsive } from '@/hooks/use-responsive'
import { apiClient } from '@/shared/api/axios'
import { useUserStore } from '@/shared/store/user-store'
import { NotificationsResponse } from '@/shared/types/notification'
import { Flex, Modal, ScrollArea, Stack, Text } from '@mantine/core'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import React, { memo } from 'react'
import NotificationCard from '../notification-card'

interface NotificationModalProps {
	opened: boolean
	onClose: () => void
}

const NotificationModal: React.FC<NotificationModalProps> = ({
	opened,
	onClose,
}) => {
	const client = useQueryClient()
	const { user } = useUserStore()
	const { isMobile } = useResponsive()

	const fetchData = async (): Promise<NotificationsResponse> => {
		const { data } = await apiClient(`/notifications`)
		return data
	}

	const { data } = useQuery<NotificationsResponse>({
		queryKey: ['notifications', user?.id],
		queryFn: fetchData,
		enabled: opened,
	})

	const handleSubmit = async () => {
		const ids = data?.data.map((e) => e.id).join(',')
		await apiClient.patch(`/notifications/read?ids=${ids}`)
		await client.invalidateQueries({
			queryKey: ['notifications', user?.id],
		})
	}

	return (
		<Modal
			opened={opened}
			onClose={onClose}
			title="Notifications"
			size={isMobile ? 'sm' : 'md'}
			centered
			closeOnClickOutside={false}
			zIndex={1000}
		>
			<ScrollArea.Autosize mah={500}>
				{data && data?.data.length > 0 ? (
					<Flex justify="end">
						<Text variant="outline" mb="xs" onClick={handleSubmit}>
							Read all
						</Text>
					</Flex>
				) : null}
				<Stack gap="xs">
					{data?.data.map((notification) => (
						<NotificationCard
							notification={notification}
							key={notification.id}
						/>
					))}
				</Stack>
			</ScrollArea.Autosize>
		</Modal>
	)
}

export default memo(NotificationModal)
