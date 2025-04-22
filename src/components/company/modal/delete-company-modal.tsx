import { useResponsive } from '@/hooks/use-responsive'
import { apiClient, ApiError } from '@/shared/api/axios'
import { showNotification } from '@/shared/helpers/show-notification'
import { CompanyItem } from '@/shared/types/companies'
import { Button, Flex, Modal, Stack, Text } from '@mantine/core'
import { useForm } from '@mantine/form'
import React, { useState } from 'react'
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
				'Company deletion',
				'The company has been successfully deleted.',
				'green'
			)
			onClose()
			navigate('/companies')
		} catch (error) {
			if (error instanceof ApiError && error.response) {
				showNotification('Company deletion error', error.message, 'red')
			}
		} finally {
			setLoading(false)
		}
	}
	return (
		<Modal
			opened={opened}
			onClose={onClose}
			title="Delete company"
			size={isMobile ? 'sm' : 'md'}
			centered
			closeOnClickOutside={false}
			zIndex={1000}
		>
			<form onSubmit={form.onSubmit(handleSubmit)}>
				<Stack pos="relative">
					<Text size={isMobile ? 'xs' : 'sm'} c="dimmed" ta="unset">
						Do you really want to delete "${company?.name}"? This action is
						irreversible.
					</Text>
					<Flex justify="space-between">
						<Button variant="outline" onClick={() => onClose()}>
							Cancel
						</Button>
						<Button
							type="submit"
							variant="filled"
							color="red"
							loading={loading}
						>
							Delete
						</Button>
					</Flex>
				</Stack>
			</form>
		</Modal>
	)
}

export default React.memo(DeleteCompanyModal)
