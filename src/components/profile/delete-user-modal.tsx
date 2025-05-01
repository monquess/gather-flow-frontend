import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Flex, Modal, Stack, Text, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'

import { apiClient, ApiError } from '@/shared/api/axios'
import { showNotification } from '@/shared/helpers/show-notification'
import { useUserStore } from '@/shared/store/user-store'

import { useResponsive } from '@/hooks/use-responsive'
import { useTranslation } from 'react-i18next'

interface DeleteAccountModalProps {
	opened: boolean
	onClose: () => void
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
	opened,
	onClose,
}) => {
	const { t } = useTranslation()
	const { isMobile } = useResponsive()
	const { logout } = useUserStore()
	const navigate = useNavigate()
	const [loading, setLoading] = useState(false)

	const form = useForm({
		mode: 'uncontrolled',
	})

	const handleSubmit = async () => {
		try {
			setLoading(true)
			await apiClient.delete(`/users`)

			logout()
			showNotification(
				t('deleteAccount.accountDeletion'),
				t('deleteAccount.accountDeletionSuccess'),
				'green'
			)
			navigate('/login')
		} catch (error) {
			if (error instanceof ApiError && error.response) {
				showNotification(
					t('deleteAccount.accountDeletionError'),
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
			title={t('deleteAccount.title')}
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
						{t('deleteAccount.confirmationText')}
					</Text>
					<TextInput label={t('deleteAccount.reasonPrompt')} />
					<Flex justify="space-between">
						<Button variant="outline" onClick={() => onClose()}>
							{t('deleteAccount.cancel')}
						</Button>
						<Button
							type="submit"
							variant="filled"
							color="red"
							loading={loading}
						>
							{t('deleteAccount.delete')}
						</Button>
					</Flex>
				</Stack>
			</form>
		</Modal>
	)
}

export default React.memo(DeleteAccountModal)
