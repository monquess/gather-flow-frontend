import { z } from 'zod'
import { image } from './image-schema'

export const avatarSchema = z.object({
	avatar: image,
})
