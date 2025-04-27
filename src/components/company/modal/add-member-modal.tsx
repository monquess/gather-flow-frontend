import { Button, Modal, MultiSelect, Stack } from '@mantine/core'
import { debounce } from 'lodash'
import { memo, useCallback, useEffect, useState } from 'react'

import { useResponsive } from '@/hooks/use-responsive'
import { apiClient, ApiError } from '@/shared/api/axios'
import { showNotification } from '@/shared/helpers/show-notification'
import { User } from '@/shared/store/user-store'
import { CompanyItem } from '@/shared/types/companies'
import { useTranslation } from 'react-i18next'

interface AddMemberModalProps {
	opened: boolean
	onClose: () => void
	company: CompanyItem | undefined
}

const AddMemberModal: React.FC<AddMemberModalProps> = ({
	opened,
	onClose,
	company,
}) => {
	const { t } = useTranslation()
	const { isMobile } = useResponsive()
	const [data, setData] = useState<User[]>([])
	const [search, setSearch] = useState('')
	const [selectedUser, setSelectedUser] = useState<string[]>([])
	const [loading, setLoading] = useState(false)

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const fetchUsers = useCallback(
		debounce(async (query: string) => {
			if (!query.trim()) {
				setData([])
			} else {
				const response = await apiClient.get<User[]>('/users', {
					params: { email: query },
				})
				setData(response.data)
			}
		}, 500),
		[]
	)

	useEffect(() => {
		fetchUsers(search)
	}, [search, fetchUsers])

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault()
		try {
			setLoading(true)
			const response = await Promise.all(
				selectedUser.map((user) =>
					apiClient.get<User[]>('/users', { params: { email: user } })
				)
			)
			const users = response.flatMap((res) => res.data)

			await Promise.all(
				users.map(({ id }) =>
					apiClient.post(`/companies/${company?.id}/users/${id}`)
				)
			)

			showNotification(
				t('addMember.successTitle'),
				t('addMember.successMessage'),
				'green'
			)
			onClose()
		} catch (error) {
			if (error instanceof ApiError && error.response) {
				showNotification(t('addMember.errorTitle'), error.message, 'red')
			}
		} finally {
			setLoading(false)
		}
	}

	return (
		<Modal
			opened={opened}
			onClose={onClose}
			title={t('addMember.modalTitle')}
			size={isMobile ? 'sm' : 'md'}
			centered
			closeOnClickOutside={false}
			zIndex={1000}
		>
			<form onSubmit={handleSubmit}>
				<Stack pos="relative">
					<MultiSelect
						data-autofocus
						label={t('addMember.selectLabel')}
						placeholder={t('addMember.selectPlaceholder')}
						searchable
						clearable
						value={selectedUser}
						onSearchChange={setSearch}
						onChange={setSelectedUser}
						data={data.map((user) => ({
							value: user.email,
							label: user.email,
						}))}
						styles={{ dropdown: { zIndex: 1100 } }}
						hidePickedOptions
					/>
					<Button type="submit" loading={loading} variant="outline">
						{t('addMember.inviteButton')}
					</Button>
				</Stack>
			</form>
		</Modal>
	)
}

export default memo(AddMemberModal)
