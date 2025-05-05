import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Center, Loader } from '@mantine/core'

import { apiClient } from '@/shared/api/axios'
import { showNotification } from '@/shared/helpers/show-notification'
import { useUserStore } from '@/shared/store/user-store'
import { User } from '@/shared/types'

const GoogleAuthSuccessPage: React.FC = () => {
	const [searchParams] = useSearchParams()
	const { user, updateToken, updateUser } = useUserStore()
	const navigate = useNavigate()

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const { data } = await apiClient.get<User>(`users/self`)
				updateUser(data)
			} catch {
				showNotification('Error', 'Error getting user information', 'red')
				navigate('/login')
			}
		}
		const token = searchParams.get('accessToken')

		if (token) {
			updateToken(token)
			fetchUser()
		}
	}, [navigate, searchParams, updateToken, updateUser])

	useEffect(() => {
		if (user) {
			navigate('/home')
		}
	}, [user, navigate])

	return (
		<Center h="100vh">
			<Loader />
		</Center>
	)
}

export default React.memo(GoogleAuthSuccessPage)
