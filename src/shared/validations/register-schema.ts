import { z } from 'zod'

export const registerSchema = z
	.object({
		fullname: z
			.string()
			.nonempty()
			.min(3, { message: 'Must be 3 or more characters long' }),
		email: z.string().nonempty().email({ message: 'Invalid email address' }),
		password: z
			.string()
			.min(8, { message: 'Password must be at least 8 characters long' })
			.max(64, { message: 'Password must be at most 64 characters long' })
			.regex(/[a-z]/, {
				message: 'Password must contain at least one lowercase letter',
			})
			.regex(/[A-Z]/, {
				message: 'Password must contain at least one uppercase letter',
			})
			.regex(/[0-9]/, { message: 'Password must contain at least one number' })
			.regex(/[^a-zA-Z0-9]/, {
				message: 'Password must contain at least one special character',
			}),
		confirmPassword: z
			.string()
			.min(8, { message: 'Must be 8 or more characters long' }),
	})
	.superRefine(({ password, confirmPassword }, ctx) => {
		if (confirmPassword !== password) {
			ctx.addIssue({
				message: 'Passwords do not match',
				path: ['confirmPassword'],
				code: 'custom',
			})
		}
	})
