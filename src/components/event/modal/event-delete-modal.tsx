import { Button, Flex, Modal, Stack, Text } from '@mantine/core'
import { useForm } from '@mantine/form'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useTranslation } from 'react-i18next'

import { useResponsive } from '@/hooks/use-responsive'
import { apiClient, ApiError } from '@/shared/api/axios'
import { showNotification } from '@/shared/helpers/show-notification'
import { Event } from '@/shared/types'

interface DeleteEventModalProps {
	opened: boolean
	onClose: () => void
	event?: Event
	companyId?: number
}

const DeleteEventModal: React.FC<DeleteEventModalProps> = ({
	opened,
	onClose,
	companyId,
	event,
}) => {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const { isMobile } = useResponsive()
	const [loading, setLoading] = useState(false)

	const form = useForm({
		mode: 'uncontrolled',
	})

	const handleSubmit = async () => {
		try {
			setLoading(true)
			await apiClient.delete(`/companies/${companyId}/events/${event?.id}`)
			showNotification(
				t('deleteCompany.successTitle'),
				t('deleteCompany.successMessage'),
				'green'
			)
			onClose()
			navigate(-1)
		} catch (error) {
			if (error instanceof ApiError && error.response) {
				showNotification(t('deleteCompany.errorTitle'), error.message, 'red')
			}
		} finally {
			setLoading(false)
		}
	}

	return (
		<Modal
			opened={opened}
			onClose={onClose}
			title={t('deleteCompany.modalTitle')}
			size={isMobile ? 'sm' : 'md'}
			centered
			closeOnClickOutside={false}
			zIndex={1000}
		>
			<form onSubmit={form.onSubmit(handleSubmit)}>
				<Stack pos="relative">
					<Text size={isMobile ? 'xs' : 'sm'} c="dimmed" ta="unset">
						{t('deleteCompany.confirmationMessage', { company: event?.title })}
					</Text>
					<Flex justify="space-between">
						<Button variant="outline" onClick={onClose}>
							{t('common.cancel')}
						</Button>
						<Button
							type="submit"
							variant="filled"
							color="red"
							loading={loading}
						>
							{t('common.delete')}
						</Button>
					</Flex>
				</Stack>
			</form>
		</Modal>
	)
}

export default React.memo(DeleteEventModal)
