import React from 'react'
import { useForm } from '@mantine/form'
import { Avatar, Button, Group, Stack, Text, Textarea } from '@mantine/core'

import { useUserStore } from '@/shared/store/user-store'
import { Event } from '@/shared/types/event'

interface CreateCommentFormProps {
	event: Event
}

const CommentList: React.FC<CreateCommentFormProps> = ({ event }) => {
	const { user } = useUserStore()

	const form = useForm({
		mode: 'controlled',
		// validate: zodResolver(createEventSchema),
		initialValues: {
			content: '',
		},
	})

	return (
		<Stack gap="sm">
			<Group justify="space-between">
				<Group gap="md">
					<Avatar src={user?.avatar} />
					<Text>@{user?.username}</Text>
				</Group>
			</Group>
			<Textarea
				label="Leave a comment"
				description="Leave a feedback or ask organizer a question about event"
				placeholder="Comment..."
			/>
			<Button style={{ justifySelf: 'flex-end' }}>Post comment</Button>
		</Stack>
	)
}

export default React.memo(CommentList)
