import React, { useState } from 'react'
import { Button, FileInput, Modal, Stack, Text } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'

import { IoImageOutline } from 'react-icons/io5'
import { useTranslation } from 'react-i18next'

import { apiClient, ApiError } from '@/shared/api/axios'
import { showNotification } from '@/shared/helpers/show-notification'
import { useUserStore } from '@/shared/store/user-store'
import { avatarSchema } from '@/shared/validations'
import { User } from '@/shared/types'
import { useResponsive } from '@/hooks/use-responsive'

interface UploadAvatarModalProps {
	opened: boolean
	onClose: () => void
}

const UploadAvatarModal: React.FC<UploadAvatarModalProps> = ({
	opened,
	onClose,
}) => {
	const { t } = useTranslation()
	const { isMobile } = useResponsive()
	const { updateUser } = useUserStore()
	const [loading, setLoading] = useState(false)

	const form = useForm({
		mode: 'uncontrolled',
		initialValues: {
			avatar: null as File | null,
		},
		validate: zodResolver(avatarSchema),
	})

	const handleSubmit = async (values: typeof form.values) => {
		try {
			setLoading(true)
			const formData = new FormData()

			if (values.avatar) {
				formData.append('avatar', values.avatar)
			}

			const { data } = await apiClient.patch<User>(`/users/avatar`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			})

			showNotification(
				t('uploadAvatar.title'),
				t('uploadAvatar.avatarUploadSuccess'),
				'green'
			)
			updateUser(data)
			onClose()
		} catch (error) {
			if (error instanceof ApiError && error.response) {
				showNotification(
					t('uploadAvatar.avatarUploadError'),
					error.message,
					'red'
				)
			}
		} finally {
			form.reset()
			setLoading(false)
		}
	}

	return (
		<Modal
			opened={opened}
			onClose={onClose}
			title={t('uploadAvatar.title')}
			size={isMobile ? 'sm' : 'md'}
			centered
			closeOnClickOutside={false}
			zIndex={1000}
		>
			<form onSubmit={form.onSubmit(handleSubmit)}>
				<Stack pos="relative">
					<Text size={isMobile ? 'xs' : 'sm'} c="dimmed" ta="unset">
						{t('uploadAvatar.confirmationText')}
					</Text>
					<FileInput
						label={t('uploadAvatar.fileInputLabel')}
						placeholder={t('uploadAvatar.fileInputPlaceholder')}
						leftSection={<IoImageOutline />}
						accept="image/png,image/jpeg,image/jpg,image/webp"
						clearable
						key={form.key('avatar')}
						{...form.getInputProps('avatar')}
					/>
					<Button type="submit" variant="outline" loading={loading}>
						{t('uploadAvatar.uploadAvatarButton')}
					</Button>
				</Stack>
			</form>
		</Modal>
	)
}

export default React.memo(UploadAvatarModal)
