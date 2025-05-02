import {
	ActionIcon,
	Button,
	Card,
	Group,
	Modal,
	Rating,
	Stack,
	Text,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { motion } from 'framer-motion'
import React, { memo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MdDelete } from 'react-icons/md'
import { useParams } from 'react-router-dom'

import { useResponsive } from '@/hooks/use-responsive'
import { apiClient, ApiError } from '@/shared/api/axios'
import { showNotification } from '@/shared/helpers/show-notification'
import { useUserStore } from '@/shared/store/user-store'
import { Review } from '@/shared/types'

interface ReviewCardProps {
	review?: Review
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
	const { t } = useTranslation()
	const { isMobile } = useResponsive()
	const { user } = useUserStore()
	const [opened, setOpened] = useState(false)
	const client = useQueryClient()
	const { id } = useParams()

	const handleDeleteClick = async () => {
		try {
			await apiClient.delete(`/companies/${review?.companyId}/reviews`)
			showNotification(
				t('reviewCard.notifications.deleteSuccess.title'),
				t('reviewCard.notifications.deleteSuccess.message'),
				'green'
			)
			client.invalidateQueries({
				queryKey: ['companies', id],
			})
			client.invalidateQueries({
				queryKey: ['reviews', id],
			})
		} catch (error) {
			if (error instanceof ApiError && error.response) {
				showNotification(
					t('reviewCard.notifications.deleteError.title'),
					error.response.data.message,
					'red'
				)
			}
		} finally {
			setOpened(false)
		}
	}

	const form = useForm({
		mode: 'uncontrolled',
	})

	return (
		<>
			<Card withBorder shadow="xl" radius="md" padding="md">
				<motion.div
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, ease: 'easeOut' }}
					style={{ height: '100%' }}
				>
					<Group justify="space-between">
						<Rating
							defaultValue={review?.stars}
							fractions={10}
							size="lg"
							readOnly
						/>
						<Group gap="xs">
							<Text size="sm">
								{dayjs(review?.createdAt).format('DD MMM YYYY')}
							</Text>
							{user?.id === review?.author.id && (
								<ActionIcon
									variant="subtle"
									color="red"
									size="xs"
									onClick={() => setOpened(true)}
									title={t('reviewCard.actions.delete')}
								>
									<MdDelete />
								</ActionIcon>
							)}
						</Group>
					</Group>
					<Group justify="flex-end">
						<Text c="dimmed" size="xs">
							{review?.author.username}
						</Text>
					</Group>
					<Stack w="100%" h="100%" mt="sm">
						<Text size="md">{review?.comment}</Text>
					</Stack>
				</motion.div>
			</Card>
			<Modal
				opened={opened}
				onClose={() => setOpened(false)}
				title={t('reviewCard.modal.title')}
				size={isMobile ? 'sm' : 'md'}
				centered
				closeOnClickOutside={false}
				zIndex={1000}
			>
				<form onSubmit={form.onSubmit(handleDeleteClick)}>
					<Stack gap="sm">
						<Text>{t('reviewCard.modal.confirmation')}</Text>
						<Button type="submit">
							{t('reviewCard.actions.confirmDelete')}
						</Button>
					</Stack>
				</form>
			</Modal>
		</>
	)
}

export default memo(ReviewCard)
