export type Meta = {
	page: number
	limit: number
	itemCount: number
	pageCount: number
	prev: number | null
	next: number | null
}

export type EventItem = {
	id: number
	companyId: number
	title: string
	description: string
	format: string
	theme: string
	location: string
	ticketPrice: number
	ticketsQuantity: number
	poster: string
	visitorsVisibility: string
	startDate: string
	endDate: string
	publishDate: string
	createdAt: string
}

export type EventsResponse = {
	data: EventItem[]
	meta: Meta
}
