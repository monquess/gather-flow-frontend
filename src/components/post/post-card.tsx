import { Card, Flex, Group, Image, Stack, Text } from '@mantine/core'
import React, { memo, useState } from 'react'
import { CiHeart } from 'react-icons/ci'
import { FaHeart } from 'react-icons/fa6'
import { MdCalendarToday } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

import dayjs from 'dayjs'
import { motion } from 'framer-motion'

import { apiClient, ApiError } from '@/shared/api/axios'
import { showNotification } from '@/shared/helpers/show-notification'
import { Post } from '@/shared/types'
import { useTranslation } from 'react-i18next'

interface PostCardProps {
	post: Post
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const [likes, setLikes] = useState(post.likes)
	const [liked, setLiked] = useState(post.liked)

	const handleLikeClick = async () => {
		try {
			if (liked) {
				await apiClient.delete(`/posts/${post.id}/like`)
				setLikes(likes - 1)
				setLiked(false)
			} else {
				await apiClient.post(`/posts/${post.id}/like`)
				setLikes(likes + 1)
				setLiked(true)
			}
		} catch (error) {
			if (error instanceof ApiError && error.response) {
				showNotification(t('common.error'), error.message, 'red')
			}
		}
	}

	return (
		<Card withBorder shadow="xl" radius="md" padding="md">
			<motion.div
				whileHover={{ scale: 1.02 }}
				whileTap={{ scale: 0.98 }}
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, ease: 'easeOut' }}
				style={{ height: '100%' }}
			>
				<Card.Section>
					<Image
						src={post.poster}
						height={175}
						alt={post.title}
						radius="sm"
						style={{ objectFit: 'cover' }}
						onClick={() => navigate(`/news/${post.id}`)}
					/>
				</Card.Section>

				<Stack
					mt="md"
					justify="space-between"
					style={{ height: 'calc(100% - 200px)' }}
				>
					<Stack>
						<Text size="lg" fw={700} lineClamp={1} style={{ minHeight: 24 }}>
							{post.title}
						</Text>
						<Flex justify="space-between">
							<Group mt="xs" align="center" gap="xs">
								<MdCalendarToday size={16} />
								<Text size="sm" lineClamp={1}>
									{dayjs(post.createdAt).format('DD MMM YYYY')}
								</Text>
							</Group>
							<Group mt="xs" align="center" gap="xs" justify="center">
								{liked ? (
									<FaHeart color="red" size={18} onClick={handleLikeClick} />
								) : (
									<CiHeart size={18} onClick={handleLikeClick} />
								)}
								<Text size="sm">{likes}</Text>
							</Group>
						</Flex>
					</Stack>
				</Stack>
			</motion.div>
		</Card>
	)
}

export default memo(PostCard)
