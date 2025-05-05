import { Button, Group, Modal, Stack, Text } from '@mantine/core'
import { useMutation } from '@tanstack/react-query'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { useResponsive } from '@/hooks/use-responsive'
import { ApiError, apiClient } from '@/shared/api/axios'
import { showNotification } from '@/shared/helpers/show-notification'
import { Comment } from '@/shared/types'

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
	const { t } = useTranslation()
	const { isMobile } = useResponsive()

	const { mutate, isPending } = useMutation<void, ApiError>({
		mutationKey: ['delete-comment', comment.id],
		mutationFn: () => apiClient.delete(`comments/${comment.id}`),
		onSuccess: () => {
			onDelete()
			onClose()
			showNotification(t('deleteComment.success'), '', 'green')
		},
		onError: (error) => {
			showNotification(t('deleteComment.error'), error.message, 'red')
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
			title={t('deleteComment.title')}
			size={isMobile ? 'sm' : 'md'}
			centered
			closeOnClickOutside={false}
			zIndex={1000}
		>
			<form onSubmit={handleSubmit}>
				<Stack pos="relative" gap="xs">
					<Text ta="justify" size={isMobile ? 'xs' : 'sm'} c="dimmed">
						{t('deleteComment.description')}
					</Text>
					<Group justify="flex-end">
						<Button size="sm" variant="default" onClick={onClose}>
							{t('deleteComment.cancel')}
						</Button>
						<Button
							type="submit"
							variant="filled"
							color="red"
							loading={isPending}
						>
							{t('deleteComment.submit')}
						</Button>
					</Group>
				</Stack>
			</form>
		</Modal>
	)
}

export default DeleteCommentModal
