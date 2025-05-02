import { Button, Divider, Stack, Text } from '@mantine/core'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { useUserStore } from '@/shared/store/user-store'
import { Event } from '@/shared/types/event'
import CommentList from './comment-list'

import { useNavigate } from 'react-router-dom'
import { MotionCard } from '../general'
import CreateCommentForm from './forms/create-comment-form'

interface CommentSectionProps {
	event: Event
}

const CommentSection: React.FC<CommentSectionProps> = ({ event }) => {
	const { t } = useTranslation()
	const { user } = useUserStore()
	const navigate = useNavigate()

	const handleLoginRedirect = () => {
		navigate('/login')
	}

	return (
		<MotionCard>
			<Stack gap="xl">
				{user ? (
					<CreateCommentForm event={event} />
				) : (
					<Stack align="center" gap="sm">
						<Text c="dimmed">{t('commentSection.loginPrompt')}</Text>
						<Button variant="outline" onClick={handleLoginRedirect}>
							{t('login.submit')}
						</Button>
					</Stack>
				)}
				<Divider my="md" />
				<CommentList event={event} />
			</Stack>
		</MotionCard>
	)
}

export default CommentSection
