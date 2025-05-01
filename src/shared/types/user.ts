import { Entity } from './entity'

export type User = {
	username: string
	email: string
	verified: boolean
	avatar: string
	updatedAt: string
	showAsAttendee: boolean
} & Entity
