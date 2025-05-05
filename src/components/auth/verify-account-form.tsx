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
import VerificationCodeModal from './modals/verify-code-modal'

const VerifyAccountForm: React.FC = () => {
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
			await axios.post(`${config.API_BASE_URL}/auth/send-verification`, {
				email: values.email,
			})
			setRegisteredEmail(values.email)
			setVerificationModalOpened(true)
			form.reset()
			showNotification(
				t('verifyAccount.verificationSent'),
				t('verifyAccount.verificationSent'),
				'green'
			)
		} catch (error) {
			if (error instanceof AxiosError && error.response) {
				showNotification(
					t('verifyAccount.verificationError'),
					error.response.data.message,
					'red'
				)
			}
		} finally {
			setLoading(false)
		}
	}

	const handleVerify = async (token: string) => {
		try {
			await axios.post(`${config.API_BASE_URL}/auth/verify-email`, {
				token,
				email: registeredEmail,
			})
			navigate('/login')
			showNotification(
				t('verifyAccount.verificationSuccess'),
				t('verifyAccount.verificationSuccess'),
				'green'
			)
		} catch (error) {
			if (error instanceof AxiosError && error.response) {
				showNotification(
					t('verifyAccount.verificationError'),
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
					label={t('verifyAccount.emailLabel')}
				/>
				<Button
					type="submit"
					fullWidth
					mt={isMobile ? 'md' : 'lg'}
					size={isMobile ? 'sm' : 'md'}
					loading={loading}
				>
					{t('verifyAccount.submitButton')}
				</Button>
			</form>
			<VerificationCodeModal
				opened={verificationModalOpened}
				onClose={() => setVerificationModalOpened(false)}
				email={registeredEmail}
				onVerify={handleVerify}
			/>
		</>
	)
}

export default React.memo(VerifyAccountForm)
