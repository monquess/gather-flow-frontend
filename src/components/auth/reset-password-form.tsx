import { config } from '@/shared/config/config'
import { useResponsive } from '@/hooks/use-responsive'
import { showNotification } from '@/shared/helpers/show-notification'
import { emailSchema } from '@/shared/validations'
import { Button, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import axios, { AxiosError } from 'axios'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import ResetPasswordModal from './modals/reset-password-modal'

const PasswordResetForm: React.FC = () => {
	const navigate = useNavigate()
	const { isMobile } = useResponsive()
	const { t } = useTranslation()
	const [verificationModalOpened, setVerificationModalOpened] =
		React.useState(false)
	const [registeredEmail, setRegisteredEmail] = React.useState('')
	const [loading, setLoading] = useState<boolean>(false)

	const form = useForm({
		mode: 'uncontrolled',
		validate: zodResolver(emailSchema),
		initialValues: {
			email: '',
		},
	})

	const handleSubmit = async (values: typeof form.values) => {
		try {
			setLoading(true)
			await axios.post(`${config.API_BASE_URL}/auth/forgot-password`, {
				email: values.email,
			})
			setRegisteredEmail(values.email)
			setVerificationModalOpened(true)
			form.reset()
			showNotification(
				t('passwordReset.notificationTitle'),
				t('passwordReset.emailSent', { email: values.email }),
				'green'
			)
		} catch (error) {
			if (error instanceof AxiosError && error.response) {
				showNotification(
					t('passwordReset.resetError'),
					error.response.data.message,
					'red'
				)
			}
		} finally {
			setLoading(false)
		}
	}

	const handleSend = async (token: string, password: string) => {
		try {
			await axios.post(`${config.API_BASE_URL}/auth/reset-password`, {
				token,
				email: registeredEmail,
				password,
			})
			navigate('/login')
			showNotification(
				t('passwordReset.resetSuccess'),
				t('passwordReset.resetSuccess'),
				'green'
			)
		} catch (error) {
			if (error instanceof AxiosError && error.response) {
				showNotification(
					t('passwordReset.resetError'),
					error.response.data.message,
					'red'
				)
			}
		}
	}

	return (
		<>
			<form onSubmit={form.onSubmit(handleSubmit)}>
				<TextInput
					mt="md"
					size={isMobile ? 'sm' : 'md'}
					key={form.key('email')}
					{...form.getInputProps('email')}
					label={t('passwordReset.emailLabel')}
				/>
				<Button
					type="submit"
					fullWidth
					mt={isMobile ? 'md' : 'lg'}
					size={isMobile ? 'sm' : 'md'}
					loading={loading}
				>
					{t('passwordReset.submitButton')}
				</Button>
			</form>
			<ResetPasswordModal
				opened={verificationModalOpened}
				onClose={() => setVerificationModalOpened(false)}
				email={registeredEmail}
				onSend={handleSend}
			/>
		</>
	)
}

export default React.memo(PasswordResetForm)
