import {
	Button,
	Group,
	Modal,
	Rating,
	Stack,
	Text,
	TextInput,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useQueryClient } from '@tanstack/react-query'
import React, { memo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { useResponsive } from '@/hooks/use-responsive'
import { apiClient, ApiError } from '@/shared/api/axios'
import { showNotification } from '@/shared/helpers/show-notification'
import { Company } from '@/shared/types'

interface ReviewCreateModalProps {
	company?: Company
	opened: boolean
	onClose: () => void
}

const ReviewCreateModal: React.FC<ReviewCreateModalProps> = ({
	opened,
	onClose,
	company,
}) => {
	const { t } = useTranslation()
	const { id } = useParams()
	const client = useQueryClient()
	const [value, setValue] = useState(0)
	const [loading, setLoading] = useState(false)
	const { isMobile } = useResponsive()

	const form = useForm({
		mode: 'uncontrolled',
		initialValues: {
			comment: '',
		},
	})

	const handleSubmit = async () => {
		setLoading(true)
		try {
			await apiClient.post(`/companies/${company?.id}/reviews`, {
				...form.getValues(),
				stars: value,
			})
			showNotification(
				t('reviewCreateModal.notifications.success.title'),
				t('reviewCreateModal.notifications.success.message'),
				'green'
			)
			client.invalidateQueries({
				queryKey: ['companies', id],
			})
			client.invalidateQueries({
				queryKey: ['reviews', id],
			})
		} catch (error) {
			if (error instanceof ApiError && error.response) {
				showNotification(
					t('reviewCreateModal.notifications.error.title'),
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
			title={t('reviewCreateModal.title')}
			size={isMobile ? 'sm' : 'md'}
			centered
			closeOnClickOutside={false}
			zIndex={1000}
		>
			<form onSubmit={form.onSubmit(handleSubmit)}>
				<Stack gap="xs">
					<TextInput
						label={t('reviewCreateModal.fields.comment.label')}
						placeholder={t('reviewCreateModal.fields.comment.placeholder')}
						size={isMobile ? 'sm' : 'md'}
						key={form.key('comment')}
						{...form.getInputProps('comment')}
					/>
					<Group grow>
						<Text>{t('reviewCreateModal.fields.rating.label')}</Text>
						<Rating fractions={1} value={value} onChange={setValue} size="lg" />
					</Group>

					<Button type="submit" variant="outline" loading={loading}>
						{t('reviewCreateModal.actions.submit')}
					</Button>
				</Stack>
			</form>
		</Modal>
	)
}

export default memo(ReviewCreateModal)
