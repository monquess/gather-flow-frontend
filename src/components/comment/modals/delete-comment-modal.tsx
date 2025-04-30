import React from 'react'
import { Button, Group, Modal, Stack, Text } from '@mantine/core'
import { useMutation } from '@tanstack/react-query'

import { useResponsive } from '@/hooks/use-responsive'
import { ApiError, apiClient } from '@/shared/api/axios'
import { Comment } from '@/shared/types'
import { showNotification } from '@/shared/helpers/show-notification'

interface DeleteCommentModalProps {
	opened: boolean
	onClose: () => void
	onDelete: () => void
	comment: Comment
}

const DeleteCommentModal: React.FC<DeleteCommentModalProps> = ({
	opened,
	onClose,
	onDelete,
	comment,
}) => {
	const { isMobile } = useResponsive()

	const { mutate, isPending } = useMutation<void, ApiError>({
		mutationKey: ['delete-comment', comment.id],
		mutationFn: () => apiClient.delete(`comments/${comment.id}`),
		onSuccess: () => {
			onDelete()
			onClose()
			showNotification('Success', 'Comment deleted successfully', 'green')
		},
		onError: (error) => {
			showNotification('Comment deletion error', error.message, 'red')
		},
	})

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault()
		mutate()
	}

	return (
		<Modal
			opened={opened}
			onClose={onClose}
			title="Delete comment"
			size={isMobile ? 'sm' : 'md'}
			centered
			closeOnClickOutside={false}
			zIndex={1000}
		>
			<form onSubmit={handleSubmit}>
				<Stack pos="relative" gap="xs">
					<Text ta="justify" size={isMobile ? 'xs' : 'sm'} c="dimmed">
						Are you sure you want to delete this comment? This action cannot be
						undone.
					</Text>
					<Group justify="flex-end">
						<Button size="sm" variant="default" onClick={onClose}>
							Cancel
						</Button>
						<Button
							type="submit"
							variant="filled"
							color="red"
							loading={isPending}
						>
							Delete
						</Button>
					</Group>
				</Stack>
			</form>
		</Modal>
	)
}

export default DeleteCommentModal
