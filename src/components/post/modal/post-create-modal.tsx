import { memo, useState } from 'react'
import {
	Button,
	FileInput,
	Modal,
	Stack,
	TextInput,
	Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { IoImageOutline } from 'react-icons/io5'

import MarkdownEditor from '@/components/editor/markdown-editor'
import { useResponsive } from '@/hooks/use-responsive'
import { apiClient, ApiError } from '@/shared/api/axios'
import { showNotification } from '@/shared/helpers/show-notification'
import { Company } from '@/shared/types'

interface PostCreateModalProps {
	company?: Company
	opened: boolean
	onClose: () => void
}

const PostCreateModal: React.FC<PostCreateModalProps> = ({
	opened,
	onClose,
	company,
}) => {
	const [loading, setLoading] = useState(false)
	const { isMobile } = useResponsive()

	const form = useForm({
		mode: 'uncontrolled',
		initialValues: {
			title: '',
			content: '',
			poster: null as File | null,
		},
	})

	const handleSubmit = async () => {
		try {
			await apiClient.post(
				`/companies/${company?.id}/posts`,
				form.getValues(),
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				}
			)
		} catch (error) {
			if (error instanceof ApiError && error.response) {
				showNotification('Create news error', error.message, 'red')
			}
		} finally {
			form.reset()
			setLoading(false)
			onClose()
		}
	}

	return (
		<Modal
			opened={opened}
			onClose={onClose}
			title={<Title order={5}>Create news</Title>}
			size={isMobile ? 'sm' : 'xl'}
			centered
			closeOnClickOutside={false}
			zIndex={1000}
		>
			<form onSubmit={form.onSubmit(handleSubmit)}>
				<Stack gap="xs">
					<TextInput
						label="Title"
						placeholder="Enter news title"
						size={isMobile ? 'sm' : 'md'}
						key={form.key('title')}
						{...form.getInputProps('title')}
					/>
					<MarkdownEditor
						value={form.values.content}
						placeholder="News content"
						onChange={(value) => form.setFieldValue('content', value)}
					/>
					<FileInput
						label="Upload poster"
						placeholder="Choose file"
						leftSection={<IoImageOutline />}
						accept="image/png,image/jpeg,image/jpg,image/webp"
						clearable
						key={form.key('poster')}
						{...form.getInputProps('poster')}
					/>
					<Button type="submit" variant="outline" loading={loading}>
						Create news
					</Button>
				</Stack>
			</form>
		</Modal>
	)
}

export default memo(PostCreateModal)
