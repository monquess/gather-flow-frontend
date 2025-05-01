import { MemberRole } from '../enum/member-role-enum'
import { Entity } from './entity'
import { Paginated } from './pagination'
import { User } from './user'

export type CompanyMember = {
	user: Pick<User, 'id' | 'username' | 'avatar'>
	role: MemberRole
	createdAt: string
}

export type Company = {
	id: number
	name: string
	description: string
	email: string
	location: string
	rating: number
	reviews: number
	users: CompanyMember[]
	createdAt: string
	stripeAccountId: string
} & Entity

export type CompaniesResponse = Paginated<Company>
