import {
	Button,
	FileInput,
	Modal,
	Stack,
	TextInput,
	Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useQueryClient } from '@tanstack/react-query'
import { memo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IoImageOutline } from 'react-icons/io5'
import { useParams } from 'react-router-dom'

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
	const { t } = useTranslation()
	const { id } = useParams()
	const client = useQueryClient()
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
		setLoading(true)
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
			client.invalidateQueries({
				queryKey: ['posts', id],
			})
			showNotification(
				t('postCreateModal.notifications.success.title'),
				t('postCreateModal.notifications.success.message'),
				'green'
			)
		} catch (error) {
			if (error instanceof ApiError && error.response) {
				showNotification(
					t('postCreateModal.notifications.error.title'),
					error.message,
					'red'
				)
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
			title={<Title order={5}>{t('postCreateModal.title')}</Title>}
			size={isMobile ? 'sm' : 'xl'}
			centered
			closeOnClickOutside={false}
			zIndex={1000}
		>
			<form onSubmit={form.onSubmit(handleSubmit)}>
				<Stack gap="xs">
					<TextInput
						label={t('postCreateModal.fields.title.label')}
						placeholder={t('postCreateModal.fields.title.placeholder')}
						size={isMobile ? 'sm' : 'md'}
						key={form.key('title')}
						{...form.getInputProps('title')}
					/>
					<MarkdownEditor
						value={form.values.content}
						placeholder={t('postCreateModal.fields.content.placeholder')}
						onChange={(value) => form.setFieldValue('content', value)}
					/>
					<FileInput
						label={t('postCreateModal.fields.poster.label')}
						placeholder={t('postCreateModal.fields.poster.placeholder')}
						leftSection={<IoImageOutline />}
						accept="image/png,image/jpeg,image/jpg,image/webp"
						clearable
						key={form.key('poster')}
						{...form.getInputProps('poster')}
					/>
					<Button type="submit" variant="outline" loading={loading}>
						{t('postCreateModal.actions.submit')}
					</Button>
				</Stack>
			</form>
		</Modal>
	)
}

export default memo(PostCreateModal)
