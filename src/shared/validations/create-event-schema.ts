import { z } from 'zod'
import { image } from './image-schema'

export const createEventSchema = z
	.object({
		title: z.string().nonempty({ message: 'Title must not be empty' }),
		description: z.string().nonempty(),
		format: z.string().nonempty({ message: 'Select format' }),
		theme: z.string().nonempty({ message: 'Select theme' }),
		location: z.string().nonempty({ message: 'Location must be provided' }),
		ticketPrice: z.number().min(0),
		ticketsQuantity: z.number().int().min(0),
		poster: image,
		visitorsVisibility: z.string().nonempty(),
		notifyOnAttendee: z.boolean(),
		startDate: z.date({ message: 'Provide start date' }),
		endDate: z.date({ message: 'Provide end date' }),
		publishDate: z
			.date({ message: 'Provide date of publication' })
			.nullable()
			.optional(),
	})
	.refine((data) => !data.publishDate || data.startDate > data.publishDate, {
		path: ['startDate'],
	})
	.refine((data) => data.endDate > data.startDate, {
		path: ['endDate'],
	})
