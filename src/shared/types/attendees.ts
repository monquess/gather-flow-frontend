import { Entity } from './entity'
import { Paginated } from './pagination'

export type Attendees = {
	username: string
	email: string
	verified: boolean
	avatar: string
	showAsAttendee: true
	updatedAt: string
} & Entity

export type AttendeesResponse = Paginated<Attendees>
