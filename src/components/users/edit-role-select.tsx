import { Select } from '@mantine/core'
import { capitalize } from 'lodash'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { apiClient, ApiError } from '@/shared/api/axios'
import { MemberRole } from '@/shared/enum/member-role-enum'
import { showNotification } from '@/shared/helpers/show-notification'
import { CompanyMember } from '@/shared/types'
import { useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'

interface EditRolePopoverProps {
	member: CompanyMember
}

const EditRoleSelect: React.FC<EditRolePopoverProps> = ({ member }) => {
	const { t } = useTranslation()
	const client = useQueryClient()
	const [role, setRole] = useState<MemberRole>(member.role)
	const { id } = useParams()

	const onChange = async (value: string | null) => {
		try {
			const { data } = await apiClient.patch<CompanyMember>(
				`companies/${id}/users/${member.user.id}/role`,
				{
					role: value?.toLocaleUpperCase(),
				}
			)

			setRole(data.role)
			showNotification(
				t('editRoleSelect.notifications.success.title'),
				t('editRoleSelect.notifications.success.message', {
					username: member.user.username,
				}),
				'green'
			)
			client.invalidateQueries({
				queryKey: ['companies', id],
			})
		} catch (error) {
			if (error instanceof ApiError && error.response) {
				showNotification(
					t('editRoleSelect.notifications.error.title'),
					error.message,
					'red'
				)
			}
		}
	}

	return (
		<Select
			size="xs"
			value={role}
			onChange={onChange}
			data={Object.entries(MemberRole).map(([key, value]) => ({
				value: key,
				label: capitalize(value),
			}))}
			styles={{ dropdown: { zIndex: 1200 } }}
		/>
	)
}

export default React.memo(EditRoleSelect)
