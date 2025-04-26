import { z } from 'zod'

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ACCEPTED_IMAGE_TYPES = [
	'image/jpeg',
	'image/jpg',
	'image/png',
	'image/webp',
]

export const createEventSchema = z
	.object({
		title: z.string().nonempty(),
		description: z.string().nonempty(),
		format: z.string().nonempty(),
		theme: z.string().nonempty(),
		location: z.string().nonempty(),
		ticketPrice: z.number().min(0),
		ticketsQuantity: z.number().int().min(0),
		poster: z
			.any()
			.optional()
			.refine((file) => !file || (file && file.size <= MAX_FILE_SIZE))
			.refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type)),
		visitorVisibility: z.string().nonempty(),
		startDate: z.date(),
		endDate: z.date(),
		publishDate: z.date(),
	})
	.refine((data) => data.startDate > data.publishDate, {
		path: ['startDate'],
	})
	.refine((data) => data.endDate > data.startDate, {
		path: ['endDate'],
	})
