import React from 'react'
import { ActionIcon, Flex, NumberInput, Stack, TextInput } from '@mantine/core'
import { DateTimePicker } from '@mantine/dates'
import { useForm, zodResolver } from '@mantine/form'
import { MdAdd } from 'react-icons/md'

import { Promocode } from '@/shared/types'
import { createPromocodeSchema } from '@/shared/validations'

interface CreatePromocodeInputProps {
	promocodes: Promocode[]
	onAdd: (promocode: Promocode) => void
	minDate: Date
}

const CreatePromocodeInput: React.FC<CreatePromocodeInputProps> = ({
	promocodes,
	onAdd,
	minDate,
}) => {
	const form = useForm({
		mode: 'controlled',
		validate: zodResolver(createPromocodeSchema),
		initialValues: {
			code: '',
			discount: 1,
			expirationDate: new Date(minDate),
		},
	})

	const handleAddClick = () => {
		if (!form.validate().hasErrors) {
			const { code, expirationDate } = form.getValues()

			if (promocodes.some((promo) => promo.code === code)) {
				form.setFieldError('code', `Promocode ${code} already exists`)
			} else {
				onAdd({
					...form.getValues(),
					expirationDate: expirationDate.toISOString(),
				})
			}
		}
	}

	return (
		<Stack>
			<Flex gap="xs" align="flex-end">
				<TextInput
					label="Code"
					flex={1}
					maxLength={20}
					key={form.key('code')}
					{...form.getInputProps('code')}
					onChange={({ currentTarget }) => {
						form.setFieldValue('code', currentTarget.value.toLocaleUpperCase())
					}}
				/>
				<NumberInput
					label="Discount"
					suffix="%"
					min={1}
					max={99}
					flex={1}
					key={form.key('discount')}
					{...form.getInputProps('discount')}
				/>
				<DateTimePicker
					label="Expriration"
					placeholder="Choose when promocode expires"
					minDate={minDate}
					flex={1}
					{...form.getInputProps('expirationDate')}
				/>
				<ActionIcon size="lg" onClick={handleAddClick}>
					<MdAdd />
				</ActionIcon>
			</Flex>
		</Stack>
	)
}

export default CreatePromocodeInput
