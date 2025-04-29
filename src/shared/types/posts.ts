import { Meta } from './events'

type Company = {
	id: number
	name: string
}

export type PostItem = {
	id: number
	company: Company
	title: string
	content: string
	poster: string
	likes: number
	liked: boolean
	createdAt: string
	updatedAt: string
}

export type PostsResponse = {
	meta: Meta
	data: PostItem[]
}
