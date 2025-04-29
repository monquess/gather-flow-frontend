import { useResponsive } from '@/hooks/use-responsive'
import { apiClient, ApiError } from '@/shared/api/axios'
import { showNotification } from '@/shared/helpers/show-notification'
import { CompanyItem } from '@/shared/types/company'
import { Button, Flex, Modal, Stack, Text } from '@mantine/core'
import { useForm } from '@mantine/form'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

interface DeleteCompanyModalProps {
	opened: boolean
	onClose: () => void
	company: CompanyItem | undefined
}

const DeleteCompanyModal: React.FC<DeleteCompanyModalProps> = ({
	opened,
	onClose,
	company,
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
			await apiClient.delete(`/companies/${company?.id}`)
			showNotification(
				t('deleteCompany.successTitle'),
				t('deleteCompany.successMessage'),
				'green'
			)
			onClose()
			navigate('/companies')
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
						{t('deleteCompany.confirmationMessage', { company: company?.name })}
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

export default React.memo(DeleteCompanyModal)
