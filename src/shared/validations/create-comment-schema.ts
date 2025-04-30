import { z } from 'zod'

export const createCommentSchema = z.object({
	content: z
		.string()
		.nonempty({ message: 'Comment must not be empty' })
		.max(500, { message: 'Comment must not be more than 500 characters long' }),
})

export type CreateCommentBody = z.infer<typeof createCommentSchema>
