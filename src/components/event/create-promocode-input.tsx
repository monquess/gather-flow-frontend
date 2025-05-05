import { ActionIcon, Flex, NumberInput, Stack, TextInput } from '@mantine/core'
import { DateTimePicker } from '@mantine/dates'
import { useForm, zodResolver } from '@mantine/form'
import React from 'react'
import { useTranslation } from 'react-i18next'
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
	const { t } = useTranslation()
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
				form.setFieldError(
					'code',
					t('promocodeInput.errors.codeExists', { code })
				)
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
					label={t('promocodeInput.fields.code')}
					flex={1}
					maxLength={20}
					key={form.key('code')}
					{...form.getInputProps('code')}
					onChange={({ currentTarget }) => {
						form.setFieldValue('code', currentTarget.value.toLocaleUpperCase())
					}}
				/>
				<NumberInput
					label={t('promocodeInput.fields.discount')}
					suffix="%"
					min={1}
					max={99}
					flex={1}
					key={form.key('discount')}
					{...form.getInputProps('discount')}
				/>
				<DateTimePicker
					label={t('promocodeInput.fields.expiration')}
					placeholder={t('promocodeInput.fields.expirationPlaceholder')}
					minDate={minDate}
					flex={1}
					{...form.getInputProps('expirationDate')}
				/>
				<ActionIcon
					size="lg"
					onClick={handleAddClick}
					title={t('promocodeInput.actions.add')}
				>
					<MdAdd />
				</ActionIcon>
			</Flex>
		</Stack>
	)
}

export default React.memo(CreatePromocodeInput)
