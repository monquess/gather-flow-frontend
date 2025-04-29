import React, { useState } from 'react'
import { Alert, Badge, Button, Group, Loader, TextInput } from '@mantine/core'
import { MdErrorOutline } from 'react-icons/md'
import { useMutation } from '@tanstack/react-query'

import { apiClient, ApiError } from '@/shared/api/axios'
import { Event } from '@/shared/types/event'

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
				setMessage('Promocode expired')
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
				setMessage('Promocode not found')
			} else {
				setMessage('Something went wrong')
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
					label="Have a promocode? Use it!"
					placeholder="Enter code here..."
					value={code}
					disabled={mutation.isPending}
					onChange={({ currentTarget: { value } }) => {
						setCode(value.trim().toUpperCase())
					}}
				/>
				<Button
					type="submit"
					disabled={code.trim().length === 0 || mutation.isPending}
				>
					{mutation.isPending ? <Loader size="sm" /> : '>'}
				</Button>
			</Group>
			{message ? (
				<Alert
					variant="light"
					title={message}
					color="red"
					mt="xs"
					icon={<MdErrorOutline />}
					withCloseButton
				>
					Please, try another one.
				</Alert>
			) : null}
			{success ? <Badge mt="sm">{mutation.data?.code}</Badge> : null}
		</form>
	)
}

export default PromocodeInput
