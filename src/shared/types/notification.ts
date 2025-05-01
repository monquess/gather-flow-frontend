import { Entity } from './entity'
import { Paginated } from './pagination'

export type Notification = {
	userId: number
	message: string
	isRead: boolean
	type: string
} & Entity

export type NotificationsResponse = Paginated<Notification>
