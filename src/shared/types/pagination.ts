export type PaginationMeta = {
	page: number
	limit: number
	count: number
	pageCount: number
	prev: number | null
	next: number | null
}

export type Paginated<T> = {
	data: T[]
	meta: PaginationMeta
}
