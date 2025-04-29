import { useResponsive } from '@/hooks/use-responsive'
import { apiClient } from '@/shared/api/axios'
import { showNotification } from '@/shared/helpers/show-notification'
import useUserStore from '@/shared/store/user-store'
import { ReviewItem } from '@/shared/types/reviews'
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
import { AxiosError } from 'axios'
import dayjs from 'dayjs'
import { motion } from 'framer-motion'
import React, { memo, useState } from 'react'
import { MdDelete } from 'react-icons/md'

interface ReviewCardProps {
	review: ReviewItem | undefined
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
	const { isMobile } = useResponsive()
	const { user } = useUserStore()
	const [opened, setOpened] = useState(false)

	const handleDeleteClick = async () => {
		try {
			await apiClient.delete(`/companies/${review?.companyId}/reviews`)
			showNotification('Delete review', 'Delete review succesfully', 'green')
		} catch (error) {
			if (error instanceof AxiosError && error.response) {
				showNotification('Delete review', error.response.data.message, 'red')
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
				title="Delete review"
				size={isMobile ? 'sm' : 'md'}
				centered
				closeOnClickOutside={false}
				zIndex={1000}
			>
				<form onSubmit={form.onSubmit(handleDeleteClick)}>
					<Stack gap="sm">
						<Text>Are you sure to delete your review?</Text>
						<Button type="submit">Delete</Button>
					</Stack>
				</form>
			</Modal>
		</>
	)
}

export default memo(ReviewCard)
