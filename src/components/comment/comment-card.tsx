import React, { useState } from 'react'
import {
	ActionIcon,
	Avatar,
	Box,
	Button,
	Card,
	Center,
	Group,
	Loader,
	Menu,
	Stack,
	Text,
	Textarea,
} from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { HiOutlineDotsHorizontal } from 'react-icons/hi'
import { MdOutlineDelete, MdOutlineEdit } from 'react-icons/md'
import { GoCommentDiscussion } from 'react-icons/go'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'

import { Comment } from '@/shared/types/comment'
import { apiClient, ApiError } from '@/shared/api/axios'
import { showNotification } from '@/shared/helpers/show-notification'
import { createCommentSchema } from '@/shared/validations'
import { useUserStore } from '@/shared/store/user-store'
import DeleteCommentModal from './modals/delete-comment-modal'
import CommentReplyForm from './forms/comment-reply-form'
import { Event, Paginated } from '@/shared/types'

interface CommentCardProps {
	comment: Comment
	event: Event
	isReply: boolean
}

const CommentCard: React.FC<CommentCardProps> = ({
	comment,
	event,
	isReply,
}) => {
	const client = useQueryClient()
	const { user } = useUserStore()

	const [isEditing, setIsEditing] = useState(false)
	const [isReplying, setIsReplying] = useState(false)
	const [showReplies, setShowReplies] = useState(false)
	const [opened, setOpened] = useState(false)

	const { data: replies, isLoading: isRepliesLoading } = useQuery<
		Paginated<Comment>,
		ApiError
	>({
		queryKey: ['comment-replies', comment.id],
		queryFn: async () => {
			const { data } = await apiClient(`/comments/${comment.id}/replies`, {})
			return data
		},
		enabled: showReplies,
	})

	const form = useForm({
		mode: 'controlled',
		validate: zodResolver(createCommentSchema),
		initialValues: {
			content: comment.content,
		},
	})

	const updateMutation = useMutation<Comment, ApiError>({
		mutationKey: ['update-comment', comment.id],
		mutationFn: async () => {
			const { data } = await apiClient.patch<Comment>(
				`comments/${comment.id}`,
				form.getValues()
			)
			return data
		},
		onSuccess: (data) => {
			form.setInitialValues({ content: data.content })
			form.reset()
			client.invalidateQueries({ queryKey: ['comments', event.id] })
			showNotification('Success', 'Comment updated successfully', 'green')
			setIsEditing(false)
		},
		onError: (error) => {
			showNotification('Comment updating error', error.message, 'red')
		},
	})

	const handleEditClick = () => {
		form.setValues({ content: comment.content })
		setIsEditing(true)
	}

	const handleEditSubmit = (event: React.FormEvent) => {
		event.preventDefault()
		if (!form.validate().hasErrors) {
			updateMutation.mutate()
		}
	}

	const handleReplyCreate = (newComment: Comment) => {
		client.setQueryData<Paginated<Comment>>(['comments', event.id], (old) => {
			if (!old) {
				return {
					data: [newComment],
					meta: {
						total: 1,
						page: 1,
						limit: 15,
						count: 1,
						pageCount: 1,
						prev: null,
						next: null,
					},
				}
			}

			return {
				...old,
				data: [newComment, ...old.data],
			}
		})
		setShowReplies(true)
	}

	const toggleReplies = () => {
		setShowReplies((prev) => !prev)
	}

	return (
		<Card shadow="sm" radius="md" p="md" withBorder>
			<Group align="flex-start" gap="md" wrap="nowrap">
				<Avatar size="md" src={comment.author.avatar} />

				<Stack gap={4} flex={1}>
					<Group justify="space-between">
						<Text fw={500}>{comment.author.username}</Text>
						<Group gap="xs" c="dimmed">
							<Text size="sm">
								{dayjs(comment.createdAt).format('DD MMM YYYY, HH:mm')}
							</Text>

							{comment.author.id === user?.id && !isEditing && (
								<Menu shadow="md">
									<Menu.Target>
										<ActionIcon variant="subtle">
											<HiOutlineDotsHorizontal size={14} />
										</ActionIcon>
									</Menu.Target>
									<Menu.Dropdown>
										<Menu.Item
											leftSection={<MdOutlineEdit size={14} />}
											onClick={handleEditClick}
										>
											Edit
										</Menu.Item>
										<Menu.Item
											color="red"
											leftSection={<MdOutlineDelete size={14} />}
											onClick={() => setOpened(true)}
										>
											Delete
										</Menu.Item>
									</Menu.Dropdown>
								</Menu>
							)}
						</Group>
					</Group>

					{isEditing ? (
						<form onSubmit={handleEditSubmit}>
							<Stack gap="xs">
								<Textarea
									placeholder="Comment..."
									size="sm"
									autosize
									minRows={2}
									{...form.getInputProps('content')}
								/>
								<Group gap="xs" justify="flex-end">
									<Button
										size="xs"
										variant="default"
										onClick={() => setIsEditing(false)}
									>
										Cancel
									</Button>
									<Button
										size="xs"
										type="submit"
										loading={updateMutation.isPending}
									>
										Save
									</Button>
								</Group>
							</Stack>
						</form>
					) : (
						<Text size="sm" mt="xs">
							{comment.content}
						</Text>
					)}

					<Group mt="xs" w="100%">
						{comment.hasReplies && !isReplying && (
							<Button
								variant="transparent"
								p={0}
								size="xs"
								onClick={toggleReplies}
								rightSection={<GoCommentDiscussion />}
							>
								{showReplies ? 'Hide replies' : 'Show replies'}
							</Button>
						)}
						<Box flex={1} />
						{!isReplying && !isEditing && (
							<Button
								variant="transparent"
								size="xs"
								onClick={() => setIsReplying(true)}
							>
								Reply
							</Button>
						)}
					</Group>

					{showReplies && (
						<Stack gap="xs" mt="xs">
							{isRepliesLoading && (
								<Center>
									<Loader />
								</Center>
							)}
							{replies?.data?.map((reply) => (
								<Box key={reply.id}>
									<CommentCard comment={reply} event={event} isReply={true} />
								</Box>
							))}
						</Stack>
					)}

					{isReplying && (
						<CommentReplyForm
							comment={comment}
							onClose={() => setIsReplying(false)}
							onCreate={handleReplyCreate}
						/>
					)}
				</Stack>
			</Group>

			<DeleteCommentModal
				opened={opened}
				onClose={() => setOpened(false)}
				onDelete={() => {
					if (isReply) {
						client.invalidateQueries({
							queryKey: ['comment-replies', comment.parentId],
						})
					} else {
						client.invalidateQueries({ queryKey: ['comments', event.id] })
					}
				}}
				comment={comment}
			/>
		</Card>
	)
}

export default React.memo(CommentCard)
