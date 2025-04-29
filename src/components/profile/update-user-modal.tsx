import React, { useState } from 'react'
import { Button, Modal, Stack, Text, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { useTranslation } from 'react-i18next'

import { apiClient, ApiError } from '@/shared/api/axios'
import { showNotification } from '@/shared/helpers/show-notification'
import { useUserStore } from '@/shared/store/user-store'
import { updateUserSchema } from '@/shared/validations'

import { useResponsive } from '@/hooks/use-responsive'
import { User } from '@/shared/types'

interface updateUserModalProps {
	opened: boolean
	onClose: () => void
}

const UpdateUserModal: React.FC<updateUserModalProps> = ({
	opened,
	onClose,
}) => {
	const { t } = useTranslation()
	const { isMobile } = useResponsive()
	const { user, updateUser } = useUserStore()
	const [loading, setLoading] = useState(false)

	const form = useForm({
		mode: 'uncontrolled',
		initialValues: {
			username: user?.username,
			email: user?.email,
		},
		validate: zodResolver(updateUserSchema),
	})

	const handleSubmit = async (values: typeof form.values) => {
		try {
			setLoading(true)
			const { data } = await apiClient.patch<User>(`/users/${user?.id}`, values)
			updateUser(data)
			showNotification(
				t('updateUser.title'),
				t('updateUser.accountUpdateSuccess'),
				'green'
			)
			onClose()
		} catch (error) {
			if (error instanceof ApiError && error.response) {
				showNotification(
					t('updateUser.accountUpdateError'),
					error.message,
					'red'
				)
			}
		} finally {
			setLoading(false)
		}
	}

	return (
		<Modal
			opened={opened}
			onClose={onClose}
			title={t('updateUser.title')}
			size={isMobile ? 'sm' : 'md'}
			centered
			closeOnClickOutside={false}
			zIndex={1000}
			transitionProps={{
				transition: 'fade',
				duration: 600,
				timingFunction: 'linear',
			}}
		>
			<form onSubmit={form.onSubmit(handleSubmit)}>
				<Stack pos="relative">
					<Text size={isMobile ? 'xs' : 'sm'} c="dimmed" ta="unset">
						{t('updateUser.confirmationText')}
					</Text>
					<TextInput
						label={t('updateUser.usernameLabel')}
						key={form.key('username')}
						{...form.getInputProps('username')}
					></TextInput>
					<TextInput
						label={t('updateUser.emailLabel')}
						key={form.key('email')}
						{...form.getInputProps('email')}
					></TextInput>
					<Button type="submit" variant="outline" loading={loading}>
						{t('updateUser.saveChangesButton')}
					</Button>
				</Stack>
			</form>
		</Modal>
	)
}

export default React.memo(UpdateUserModal)
