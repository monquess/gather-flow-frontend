import React from 'react'
import { Button, Group, Stack, Text, Textarea } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'

import { TiArrowForward } from 'react-icons/ti'
import { useMutation } from '@tanstack/react-query'

import { Comment } from '@/shared/types'
import { ApiError, apiClient } from '@/shared/api/axios'
import { createCommentSchema } from '@/shared/validations'
import { showNotification } from '@/shared/helpers/show-notification'

interface CommentReplyFormProps {
	comment: Comment
	onClose: () => void
	onCreate: (comment: Comment) => void
}

const CommentReplyForm: React.FC<CommentReplyFormProps> = ({
	comment,
	onClose,
	onCreate,
}) => {
	const form = useForm({
		mode: 'controlled',
		validate: zodResolver(createCommentSchema),
		initialValues: {
			content: '',
		},
	})

	const { mutate, isPending } = useMutation<Comment, ApiError>({
		mutationKey: ['reply-comment', comment.id],
		mutationFn: async () => {
			const { data } = await apiClient.post<Comment>(
				`/comments/${comment.id}/replies`,
				form.getValues()
			)
			return data
		},
		onSuccess: (data) => {
			form.reset()
			onCreate(data)
			onClose()
		},
		onError: (error) => {
			showNotification('Comment replying error', error.message, 'red')
		},
	})

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault()
		if (!form.validate().hasErrors) {
			mutate()
		}
	}

	return (
		<Stack gap="sm" flex={1}>
			<form onSubmit={handleSubmit}>
				<Stack gap="sm">
					<Textarea
						autosize
						label={
							<Group gap="xs" align="center">
								<TiArrowForward size={16} />
								<Text fz="sm">{comment.author.username}</Text>
							</Group>
						}
						placeholder="Comment..."
						size="md"
						{...form.getInputProps('content')}
					/>
					<Group gap="xs" justify="flex-end">
						<Button
							size="xs"
							variant="default"
							disabled={isPending}
							onClick={onClose}
						>
							Cancel
						</Button>
						<Button
							size="xs"
							type="submit"
							loading={isPending}
							disabled={isPending}
						>
							Reply
						</Button>
					</Group>
				</Stack>
			</form>
		</Stack>
	)
}

export default CommentReplyForm
