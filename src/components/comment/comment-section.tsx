import React from 'react'
import { Stack } from '@mantine/core'

import { Event } from '@/shared/types/event'
import { MotionCard } from '../general'
import CreateCommentForm from './create-comment-form'

interface CommentSectionProps {
	event: Event
}

const CommentSection: React.FC<CommentSectionProps> = ({ event }) => {
	return (
		<MotionCard>
			<Stack gap="md">
				<CreateCommentForm event={event}></CreateCommentForm>
			</Stack>
		</MotionCard>
	)
}

export default CommentSection
