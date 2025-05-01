import Footer from '@/components/general/footer'
import MainHeader from '@/components/general/main-header'
import { apiClient, ApiError } from '@/shared/api/axios'
import { cleanMarkdown } from '@/shared/helpers/markdown'
import { showNotification } from '@/shared/helpers/show-notification'
import { PostItem } from '@/shared/types/post'
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
import { RichTextEditor } from '@mantine/tiptap'
import { useQuery } from '@tanstack/react-query'
import Link from '@tiptap/extension-link'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import dayjs from 'dayjs'
import { motion } from 'framer-motion'
import { marked } from 'marked'
import React, { forwardRef, memo, useEffect, useState } from 'react'
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

marked.setOptions({
	gfm: true,
	breaks: true,
})

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

	const editor = useEditor({
		extensions: [
			Link,
			StarterKit,
			Table.configure({
				resizable: true,
			}),
			TableRow,
			TableHeader,
			TableCell,
		],
		content: '',
		editable: false,
	})

	useEffect(() => {
		if (editor && post?.content) {
			const html = marked.parse(cleanMarkdown(post.content))
			editor.commands.setContent(html)
		}
	}, [editor, post?.content])

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
		<Container
			size="xl"
			py="md"
			style={{
				display: 'flex',
				flexDirection: 'column',
				minHeight: '100vh',
			}}
		>
			<MainHeader />
			<Stack gap="lg" style={{ flex: 1 }}>
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

						<RichTextEditor
							editor={editor}
							styles={{
								root: {
									border: 'none',
								},
								content: {
									background: 'inherit',
								},
							}}
						>
							<RichTextEditor.Content />
						</RichTextEditor>

						<Group mt="md" align="center" gap="xs" justify="center">
							{liked ? (
								<FaHeart size={28} color="red" onClick={handleLikeClick} />
							) : (
								<CiHeart size={28} onClick={handleLikeClick} />
							)}
							<Text size="xl">{likes}</Text>
						</Group>
					</Stack>
				</MotionCard>
			</Stack>
			<Footer />
		</Container>
	)
}

export default memo(PostPage)
