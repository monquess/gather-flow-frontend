import { Company } from './company'
import { Entity } from './entity'
import { Paginated } from './pagination'

export type Event = {
	company: Pick<Company, 'id' | 'name'>
	title: string
	description: string
	format: string
	theme: string
	location: string
	ticketPrice: number
	ticketsQuantity: number
	ticketsSold: number
	poster: string
	visitorsVisibility: string
	startDate: string
	endDate: string
	publishDate: string
} & Entity

export type EventsResponse = Paginated<Event>
