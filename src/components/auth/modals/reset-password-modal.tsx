// ResetPasswordModal.tsx
import { config } from '@/config/config'
import { useResponsive } from '@/hooks/use-responsive'
import { resetPasswordSchema } from '@/shared/validations'
import {
	Button,
	Group,
	LoadingOverlay,
	Modal,
	PasswordInput,
	PinInput,
	Stack,
	Text,
} from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import axios, { AxiosError } from 'axios'
import React from 'react'
import { useTranslation } from 'react-i18next'

interface ResetPasswordModalProps {
	opened: boolean
	onClose: () => void
	email: string
	onSend: (token: string, password: string) => Promise<void>
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
	opened,
	onClose,
	email,
	onSend,
}) => {
	const { isMobile } = useResponsive()
	const { t } = useTranslation()
	const [loading, setLoading] = React.useState(false)
	const [loadingResend, setLoadingResend] = React.useState(false)
	const [loadingPasswordReset, setLoadingPasswordReset] = React.useState(false)

	const form = useForm({
		initialValues: {
			code: '',
			password: '',
			confirmPassword: '',
		},
		validate: zodResolver(resetPasswordSchema),
	})

	const handleSubmit = async (values: typeof form.values) => {
		try {
			setLoadingPasswordReset(true)
			setLoading(true)
			await onSend(values.code, values.password)
			form.reset()
		} catch {
			form.setFieldError('code', t('resetPasswordModal.resendError'))
		} finally {
			setLoading(false)
			setLoadingPasswordReset(false)
		}
	}

	const resendCode = async () => {
		try {
			setLoadingResend(true)
			await axios.post(`${config.API_BASE_URL}/auth/forgot-password`, {
				email,
			})
			form.reset()
			notifications.show({
				title: t('resetPasswordModal.resendCode'),
				message: t('resetPasswordModal.resendSuccess'),
				withCloseButton: true,
				autoClose: 5000,
				color: 'green',
			})
		} catch (error) {
			if (error instanceof AxiosError && error.response) {
				notifications.show({
					title: t('resetPasswordModal.resendCode'),
					message: error.response.data.message,
					withCloseButton: true,
					autoClose: 5000,
					color: 'red',
				})
			}
		} finally {
			setLoadingResend(false)
		}
	}

	return (
		<Modal
			opened={opened}
			onClose={onClose}
			title={t('resetPasswordModal.title')}
			size={isMobile ? 'sm' : 'md'}
			centered
			closeOnClickOutside={false}
			closeOnEscape={false}
		>
			<form onSubmit={form.onSubmit(handleSubmit)}>
				<Stack pos="relative">
					<LoadingOverlay visible={loading} />
					<Text size={isMobile ? 'xs' : 'sm'} c="dimmed" ta="unset">
						{t('resetPasswordModal.message', { email })}
					</Text>

					<PinInput
						length={6}
						size={isMobile ? 'md' : 'lg'}
						{...form.getInputProps('code')}
						inputMode="text"
						mx="auto"
					/>
					<PasswordInput
						label={t('resetPasswordModal.passwordLabel')}
						required
						mt="xs"
						size={isMobile ? 'sm' : 'md'}
						key={form.key('password')}
						{...form.getInputProps('password')}
					/>
					<PasswordInput
						label={t('resetPasswordModal.confirmPasswordLabel')}
						required
						mt="xs"
						size={isMobile ? 'sm' : 'md'}
						key={form.key('confirmPassword')}
						{...form.getInputProps('confirmPassword')}
					/>
					<Group mt="md" justify="space-between">
						<Button
							size={isMobile ? 'sm' : 'md'}
							onClick={resendCode}
							color="#666"
							loading={loadingResend}
						>
							{t('resetPasswordModal.resendCode')}
						</Button>
						<Button
							type="submit"
							size={isMobile ? 'sm' : 'md'}
							loading={loadingPasswordReset}
						>
							{t('resetPasswordModal.changePassword')}
						</Button>
					</Group>
				</Stack>
			</form>
		</Modal>
	)
}

export default React.memo(ResetPasswordModal)
