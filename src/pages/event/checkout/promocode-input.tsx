import { Alert, Badge, Button, Group, TextInput } from '@mantine/core'
import { useMutation } from '@tanstack/react-query'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MdErrorOutline } from 'react-icons/md'

import { apiClient, ApiError } from '@/shared/api/axios'
import { Event } from '@/shared/types'

interface PromocodeInputProps {
	event: Event
	onSubmit: (promocode?: Promocode) => void
}

interface Promocode {
	code: string
	discount: number
	expirationDate: string
}

const PromocodeInput: React.FC<PromocodeInputProps> = ({ event, onSubmit }) => {
	const { t } = useTranslation()
	const [code, setCode] = useState('')
	const [message, setMessage] = useState('')
	const [success, setSuccess] = useState(false)

	const mutation = useMutation<Promocode, ApiError, string>({
		mutationFn: async (code: string) => {
			const { data } = await apiClient.get<Promocode>(
				`/events/${event.id}/promocodes/${code}`
			)
			return data
		},
		onSuccess: (data) => {
			if (new Date(data.expirationDate) < new Date()) {
				setSuccess(false)
				setMessage(t('promocodeInput.errors.expired'))
				onSubmit()
			} else {
				setSuccess(true)
				setMessage('')
				onSubmit(data)
			}
		},
		onError: (error) => {
			setSuccess(false)
			if (error.status === 404) {
				setMessage(t('promocodeInput.errors.notFound'))
			} else {
				setMessage(t('promocodeInput.errors.generic'))
			}
			onSubmit()
		},
	})

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		mutation.mutate(code)
	}

	return (
		<form onSubmit={handleSubmit}>
			<Group gap="sm" align="flex-end">
				<TextInput
					flex={1}
					label={t('promocodeInput.label')}
					placeholder={t('promocodeInput.placeholder')}
					value={code}
					disabled={mutation.isPending}
					onChange={({ currentTarget: { value } }) => {
						setCode(value.trim().toUpperCase())
					}}
				/>
				<Button
					type="submit"
					disabled={code.trim().length === 0 || mutation.isPending}
					loading={mutation.isPending}
				>
					{t('promocodeInput.submitButton')}
				</Button>
			</Group>
			{message ? (
				<Alert
					variant="light"
					title={message}
					color="red"
					mt="xs"
					icon={<MdErrorOutline />}
				>
					{t('promocodeInput.errorSuggestion')}
				</Alert>
			) : null}
			{success && mutation.data ? (
				<Badge mt="sm">{mutation.data.code}</Badge>
			) : null}
		</form>
	)
}

export default PromocodeInput
