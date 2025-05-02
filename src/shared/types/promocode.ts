import { Entity } from './entity'

export type Promocode = {
	code: string
	discount: number
	expirationDate: string
}

export type PromocodeResponse = {
	eventId: number
	code: string
	discount: number
	expirationDate: string
	isActive: boolean
} & Entity
