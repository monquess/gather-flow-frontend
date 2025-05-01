import { Select } from '@mantine/core'
import React, { useState } from 'react'

import { capitalize } from 'lodash'

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
				'Change role',
				`Role for ${member.user.username} changed successfully`,
				'green'
			)
			client.invalidateQueries({
				queryKey: ['companies', id],
			})
		} catch (error) {
			if (error instanceof ApiError && error.response) {
				showNotification('Change role error', error.message, 'red')
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
