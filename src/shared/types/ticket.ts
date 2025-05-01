import { Entity } from './entity'

export type Ticket = {
	userId: number
	eventId: number
	ticketCode: string
	promocodeUsed: string
	finalPrice: number
	purchaseDate: string
} & Entity
