import React from 'react'
import { Divider, Stack } from '@mantine/core'

import { Event } from '@/shared/types/event'
import CommentList from './comment-list'
import { useUserStore } from '@/shared/store/user-store'

import { MotionCard } from '../general'
import CreateCommentForm from './forms/create-comment-form'

interface CommentSectionProps {
	event: Event
}

const CommentSection: React.FC<CommentSectionProps> = ({ event }) => {
	const { user } = useUserStore()

	return (
		<MotionCard>
			<Stack gap="xl">
				{user && <CreateCommentForm event={event} />}
				<Divider my="md" />
				<CommentList event={event} />
			</Stack>
		</MotionCard>
	)
}

export default CommentSection
