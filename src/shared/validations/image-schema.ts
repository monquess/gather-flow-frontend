import { z } from 'zod'

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ACCEPTED_IMAGE_TYPES = [
	'image/jpeg',
	'image/jpg',
	'image/png',
	'image/webp',
]

export const image = z
	.any()
	.optional()
	.refine((file) => !file || (file && file.size <= MAX_FILE_SIZE))
	.refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type))
