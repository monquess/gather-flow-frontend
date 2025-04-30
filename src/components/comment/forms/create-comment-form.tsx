import React from 'react'
import { useForm, zodResolver } from '@mantine/form'
import {
	Avatar,
	Button,
	Group,
	Stack,
	Text,
	Textarea,
	Title,
} from '@mantine/core'

import { useUserStore } from '@/shared/store/user-store'
import { Event } from '@/shared/types/event'
import { CreateCommentBody, createCommentSchema } from '@/shared/validations'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient, ApiError } from '@/shared/api/axios'
import { showNotification } from '@/shared/helpers/show-notification'

const postEventComment = async (id: number, body: CreateCommentBody) => {
	const { data } = await apiClient.post<Comment>(`events/${id}/comments`, body)
	return data
}

interface CreateCommentFormProps {
	event: Event
}

const CreateCommentForm: React.FC<CreateCommentFormProps> = ({ event }) => {
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
			showNotification('Comment post error', error.message, 'red')
		},
		onSuccess: () => {
			form.reset()
			client.invalidateQueries({
				queryKey: ['comments', event.id],
			})
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
							label={<Title order={4}>✏️ Leave a comment</Title>}
							description={
								<Text fz="sm" ta="justify" lh={1} my={5}>
									Give a feedback or ask organizer a question about event
								</Text>
							}
							placeholder="Comment..."
							size="md"
							minRows={2}
							{...form.getInputProps('content')}
						/>
						<Button
							type="submit"
							style={{ justifySelf: 'flex-end' }}
							loading={isPending}
						>
							Post comment
						</Button>
					</Stack>
				</Stack>
			</Group>
		</form>
	)
}

export default CreateCommentForm
