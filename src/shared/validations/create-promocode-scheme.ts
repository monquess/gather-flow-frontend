import { z } from 'zod'

export const createPromocodeSchema = z.object({
	code: z.string().nonempty({ message: 'Promocode must not be empty' }),
	expirationDate: z.date(),
	discount: z
		.number()
		.min(1, { message: 'Minimum value is 1%' })
		.max(99, { message: 'Minimum value is 1%' }),
})

export type CreatePromocodeBody = z.infer<typeof createPromocodeSchema>
