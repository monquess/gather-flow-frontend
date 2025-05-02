import { Avatar, Button, Group, Stack, Textarea, Title } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { apiClient, ApiError } from '@/shared/api/axios'
import { showNotification } from '@/shared/helpers/show-notification'
import { useUserStore } from '@/shared/store/user-store'
import { Event } from '@/shared/types/event'
import { CreateCommentBody, createCommentSchema } from '@/shared/validations'
import { useMutation, useQueryClient } from '@tanstack/react-query'

interface UpdateCommentFormProps {
	event: Event
}

const postEventComment = async (id: number, body: CreateCommentBody) => {
	const { data } = await apiClient.post<Comment>(`events/${id}/comments`, body)
	return data
}

const UpdateCommentForm: React.FC<UpdateCommentFormProps> = ({ event }) => {
	const { t } = useTranslation()
	const { user } = useUserStore()
	const client = useQueryClient()

	const form = useForm({
		mode: 'controlled',
		validate: zodResolver(createCommentSchema),
		initialValues: {
			content: '',
		},
	})

	const { mutate, isPending } = useMutation<Comment, ApiError>({
		mutationKey: ['create-comment', event.id],
		mutationFn: async () => {
			return postEventComment(event.id, form.getValues())
		},
		onError: (error) => {
			showNotification(t('commentForm.error'), error.message, 'red')
		},
		onSuccess: () => {
			form.reset()
			client.invalidateQueries({
				queryKey: ['comments', event.id],
			})
			showNotification(t('commentForm.success'), '', 'green')
		},
	})

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault()
		if (!form.validate().hasErrors) {
			mutate()
		}
	}

	return (
		<form onSubmit={handleSubmit}>
			<Group align="flex-start">
				<Avatar size="lg" src={user?.avatar} mt="0.25rem" />
				<Stack gap="sm" flex={1}>
					<Stack gap="sm">
						<Textarea
							autosize
							label={<Title order={4}>{t('commentForm.title')}</Title>}
							description={t('commentForm.description')}
							placeholder={t('commentForm.placeholder')}
							size="md"
							{...form.getInputProps('content')}
						/>
						<Button
							type="submit"
							style={{ justifySelf: 'flex-end' }}
							loading={isPending}
						>
							{t('commentForm.submit')}
						</Button>
					</Stack>
				</Stack>
			</Group>
		</form>
	)
}

export default React.memo(UpdateCommentForm)
