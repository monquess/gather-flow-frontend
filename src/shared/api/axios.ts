import { config } from '@/config/config'
import axios, { AxiosError } from 'axios'
import useUserStore from '../store/user-store'

export const apiClient = axios.create({
	baseURL: config.API_BASE_URL,
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json',
		'Accept-Timezone': Intl.DateTimeFormat().resolvedOptions().timeZone,
	},
})

export type ApiError = AxiosError
export const ApiError = AxiosError

apiClient.interceptors.request.use(
	(config) => {
		const accessToken = useUserStore.getState().accessToken

		if (accessToken) {
			config.headers.Authorization = `Bearer ${accessToken}`
		}
		return config
	},
	(error) => {
		return Promise.reject(error)
	}
)

apiClient.interceptors.response.use(
	(response) => {
		return response
	},
	async (error) => {
		const originalRequest = error.config

		if (error.response.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true

			try {
				const {
					data: { accessToken },
				} = await axios.post<{ accessToken: string }>(
					`${config.API_BASE_URL}/auth/refresh`,
					{},
					{ withCredentials: true }
				)

				useUserStore.getState().updateToken(accessToken)
				originalRequest.headers.Authorization = `Bearer ${accessToken}`

				return axios(originalRequest)
			} catch {
				useUserStore.getState().logout()
				window.location.href = '/login'
			}
		}

		return Promise.reject(error)
	}
)
