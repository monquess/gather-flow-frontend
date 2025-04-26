import { Meta } from './events'

type User = {
	id: number
	avatar: string
	username: string
}

export type CompanyMember = {
	user: User
	role: string
	createdAt: string
}

export type CompanyItem = {
	id: number
	name: string
	description: string
	email: string
	location: string
	createdAt: string
	rating: number
	reviews: number
	users: CompanyMember[]
}

export type CompaniesResponse = {
	data: CompanyItem[]
	meta: Meta
}
