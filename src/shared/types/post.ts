import { Company } from './company'
import { Paginated } from './pagination'

export type Post = {
	id: number
	company: Pick<Company, 'id' | 'name'>
	title: string
	content: string
	poster: string
	likes: number
	liked: boolean
	createdAt: string
	updatedAt: string
}

export type PostsResponse = Paginated<Post>
