import { config } from '@/shared/config/config'
import { useResponsive } from '@/hooks/use-responsive'
import { verifyCodeSchema } from '@/shared/validations'
import {
	Button,
	Group,
	LoadingOverlay,
	Modal,
	PinInput,
	Stack,
	Text,
} from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import axios, { AxiosError } from 'axios'
import React from 'react'
import { useTranslation } from 'react-i18next'

interface VerificationCodeModalProps {
	opened: boolean
	onClose: () => void
	email: string
	onVerify: (code: string) => Promise<void>
}

const VerificationCodeModal: React.FC<VerificationCodeModalProps> = ({
	opened,
	onClose,
	email,
	onVerify,
}) => {
	const { isMobile } = useResponsive()
	const { t } = useTranslation()
	const [loading, setLoading] = React.useState(false)
	const [loadingResend, setLoadingResend] = React.useState(false)
	const [loadingVerify, setLoadingVerify] = React.useState(false)

	const form = useForm({
		mode: 'uncontrolled',
		initialValues: {
			code: '',
		},
		validate: zodResolver(verifyCodeSchema),
	})

	const handleSubmit = async (values: { code: string }) => {
		try {
			setLoadingVerify(true)
			setLoading(true)
			await onVerify(values.code)
			form.reset()
		} catch {
			form.setFieldError('code', t('verificationCodeModal.invalidCode'))
		} finally {
			setLoading(false)
			setLoadingVerify(false)
		}
	}

	const resendCode = async () => {
		try {
			setLoadingResend(true)
			await axios.post(`${config.API_BASE_URL}/auth/send-verification`, {
				email,
			})
			notifications.show({
				title: t('verificationCodeModal.resendCode'),
				message: t('verificationCodeModal.resendSuccess'),
				withCloseButton: true,
				autoClose: 5000,
				color: 'green',
			})
		} catch (error) {
			if (error instanceof AxiosError && error.response) {
				notifications.show({
					title: t('verificationCodeModal.resendCode'),
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
			title={t('verificationCodeModal.title')}
			size={isMobile ? 'sm' : 'md'}
			centered
			withCloseButton={false}
			closeOnClickOutside={false}
			closeOnEscape={false}
			transitionProps={{
				transition: 'fade',
				duration: 600,
				timingFunction: 'linear',
			}}
		>
			<form onSubmit={form.onSubmit(handleSubmit)}>
				<Stack pos="relative">
					<LoadingOverlay visible={loading} />
					<Text size={isMobile ? 'xs' : 'sm'} c="dimmed" ta="unset">
						{t('verificationCodeModal.message', { email })}
					</Text>

					<PinInput
						length={6}
						size={isMobile ? 'md' : 'lg'}
						{...form.getInputProps('code')}
						inputMode="text"
						mx="auto"
					/>
					<Group mt="md" justify="space-between">
						<Button
							size={isMobile ? 'sm' : 'md'}
							onClick={resendCode}
							color="#666"
							loading={loadingResend}
						>
							{t('verificationCodeModal.resendCode')}
						</Button>
						<Button
							type="submit"
							size={isMobile ? 'sm' : 'md'}
							loading={loadingVerify}
						>
							{t('verificationCodeModal.verify')}
						</Button>
					</Group>
				</Stack>
			</form>
		</Modal>
	)
}

export default React.memo(VerificationCodeModal)
