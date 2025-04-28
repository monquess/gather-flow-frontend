import Footer from '@/components/general/footer'
import MainHeader from '@/components/general/main-header'
import { apiClient, ApiError } from '@/shared/api/axios'
import { showNotification } from '@/shared/helpers/show-notification'
import { PostItem } from '@/shared/types/posts'
import {
	Badge,
	Card,
	CardProps,
	Center,
	Container,
	Divider,
	Group,
	Image,
	Loader,
	Stack,
	Text,
	Title,
} from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { motion } from 'framer-motion'
import React, { forwardRef, memo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CiHeart } from 'react-icons/ci'
import { FaHeart } from 'react-icons/fa'
import { MdCalendarToday } from 'react-icons/md'
import { useParams } from 'react-router-dom'

const MotionCard = motion(
	forwardRef<HTMLDivElement, CardProps>((props, ref) => (
		<Card ref={ref} withBorder radius="md" shadow="md" p="md" {...props} />
	))
)

const PostPage: React.FC = () => {
	const { t } = useTranslation()
	const { id } = useParams()

	const fetchData = async (): Promise<PostItem> => {
		const { data } = await apiClient(`/posts/${id}`)
		return data
	}

	const {
		data: post,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['post', id],
		queryFn: fetchData,
	})

	const [likes, setLikes] = useState<number>(post?.likes ?? 0)
	const [liked, setLiked] = useState<boolean>(post?.liked ?? false)

	const handleLikeClick = async () => {
		if (!post) return
		try {
			if (liked) {
				await apiClient.delete(`/posts/${post.id}/like`)
				setLikes((prev) => prev - 1)
				setLiked(false)
			} else {
				await apiClient.post(`/posts/${post.id}/like`)
				setLikes((prev) => prev + 1)
				setLiked(true)
			}
		} catch (error) {
			if (error instanceof ApiError && error.response) {
				showNotification('Create like error', error.message, 'red')
			}
		}
	}

	if (isLoading) {
		return (
			<Center h="100vh">
				<Loader size="xl" />
			</Center>
		)
	}

	if (error || !post) {
		return (
			<Center h="100vh">
				<Text>{t('companiesPage.errorLoadingCompanies')}</Text>
			</Center>
		)
	}

	return (
		<Container size="xl" py="md" mih="100vh">
			<Stack gap="lg" h="100%">
				<MainHeader />

				<MotionCard
					radius="xl"
					withBorder
					shadow="lg"
					p="xl"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, ease: 'easeOut' }}
				>
					<Card.Section mb="md">
						<Image
							src={post.poster}
							height={400}
							alt={post.title}
							radius="xl"
							style={{ objectFit: 'fill' }}
						/>
					</Card.Section>

					<Stack gap="sm">
						<Group justify="space-between" align="center">
							<Title order={2}>{post.title}</Title>
							<Badge variant="light" radius="xl" size="lg">
								{post.company.name}
							</Badge>
						</Group>

						<Group mt="xs" align="center" gap="xs">
							<MdCalendarToday size={16} />
							<Text size="sm" c="dimmed">
								{dayjs(post.createdAt).format('DD MMM YYYY')}
							</Text>
						</Group>

						<Divider my="sm" />

						<Text size="md" style={{ whiteSpace: 'pre-wrap' }}>
							{post.content}
						</Text>

						<Group mt="md" align="center" gap="xs" justify="center">
							{liked ? (
								<FaHeart size={20} color="red" onClick={handleLikeClick} />
							) : (
								<CiHeart size={20} onClick={handleLikeClick} />
							)}
							<Text size="sm">{likes}</Text>
						</Group>
					</Stack>
				</MotionCard>

				<Footer />
			</Stack>
		</Container>
	)
}

export default memo(PostPage)
