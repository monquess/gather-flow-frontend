import {
	Alert,
	Center,
	Loader,
	Pagination,
	Stack,
	Text,
	Title,
} from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MdErrorOutline } from 'react-icons/md'

import { ApiError, apiClient } from '@/shared/api/axios'
import { Comment, Event, Paginated } from '@/shared/types'
import CommentCard from './comment-card'

const fetchEventComment = async (
	id: number,
	page: number,
	limit: number
): Promise<Paginated<Comment>> => {
	const options = {
		params: {
			page,
			limit,
		},
	}
	const { data } = await apiClient.get<Paginated<Comment>>(
		`events/${id}/comments`,
		options
	)
	return data
}

interface CommentListProps {
	event: Event
}

const CommentList: React.FC<CommentListProps> = ({ event }) => {
	const { t } = useTranslation()
	const [page, setPage] = useState(1)

	const {
		data: comments,
		isLoading,
		error,
	} = useQuery<Paginated<Comment>, ApiError>({
		queryKey: ['comments', event.id, page],
		queryFn: async () => {
			return fetchEventComment(event.id, page, 15)
		},
	})

	if (isLoading) {
		return (
			<Center py="xl">
				<Loader size="xl" />
				<Text ml="md">{t('commentList.loading')}</Text>
			</Center>
		)
	}

	if (error || !comments) {
		return (
			<Alert
				variant="light"
				title={t('commentList.errorTitle')}
				color="red"
				mt="xs"
				icon={<MdErrorOutline />}
			>
				{error?.message}
			</Alert>
		)
	}

	return (
		<Stack pl="lg">
			<Title order={4}>
				{t('commentList.title', { count: comments.meta.count })}
			</Title>
			{comments.data.map((comment) => (
				<CommentCard
					key={comment.id}
					comment={comment}
					event={event}
					isReply={false}
				/>
			))}
			{comments.data.length > 0 && (
				<Pagination
					total={comments.meta.pageCount || 1}
					value={page}
					onChange={(newPage) => {
						setPage(newPage)
					}}
					size="md"
					radius="xl"
				/>
			)}
		</Stack>
	)
}

export default React.memo(CommentList)
