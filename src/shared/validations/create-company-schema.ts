import { z } from 'zod'

export const createCompanySchema = z.object({
	name: z
		.string()
		.nonempty()
		.min(3, { message: 'Must be 3 or more characters long' }),
	description: z.string().nonempty(),
	email: z.string().nonempty().email({ message: 'Invalid email address' }),
	location: z.string().nonempty(),
})
