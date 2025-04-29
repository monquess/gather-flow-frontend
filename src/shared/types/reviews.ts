type Author = {
	id: number
	username: string
	avatar: string
}

export type Meta = {
	page: number
	limit: number
	count: number
	pageCount: number
	prev: number | null
	next: number | null
}

export type ReviewItem = {
	id: number
	companyId: number
	author: Author
	stars: number
	comment: string
	createdAt: string
	updatedAt: string
}

export type ReviewsResponse = {
	data: ReviewItem[]
	meta: Meta
}
