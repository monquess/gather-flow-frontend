import { Entity } from './entity'
import { User } from './user'

export type Comment = {
	content: string
	author: Pick<User, 'id' | 'username' | 'avatar'>
	updatedAt: string
	hasReplies: boolean
	parentId: number
} & Entity
