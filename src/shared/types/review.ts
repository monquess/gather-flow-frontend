import { User } from './user'
import { Paginated } from './pagination'

export type Review = {
	id: number
	companyId: number
	author: Pick<User, 'id' | 'username' | 'avatar'>
	stars: number
	comment: string
	createdAt: string
	updatedAt: string
}

export type ReviewsResponse = Paginated<Review>
