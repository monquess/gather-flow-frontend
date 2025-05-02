import { ApiError, apiClient } from '@/shared/api/axios'
import { showNotification } from '@/shared/helpers/show-notification'
import { Comment } from '@/shared/types'
import { createCommentSchema } from '@/shared/validations'
import { Button, Group, Stack, Text, Textarea } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { useMutation } from '@tanstack/react-query'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { TiArrowForward } from 'react-icons/ti'

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
	const { t } = useTranslation()
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
			showNotification(t('commentReply.success'), '', 'green')
		},
		onError: (error) => {
			showNotification(t('commentReply.error'), error.message, 'red')
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
								<Text fz="sm">
									{t('commentReply.title', {
										username: comment.author.username,
									})}
								</Text>
							</Group>
						}
						placeholder={t('commentReply.placeholder')}
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
							{t('commentReply.cancel')}
						</Button>
						<Button
							size="xs"
							type="submit"
							loading={isPending}
							disabled={isPending}
						>
							{t('commentReply.submit')}
						</Button>
					</Group>
				</Stack>
			</form>
		</Stack>
	)
}

export default CommentReplyForm
