import { Meta } from './events'

export type CompanyMember = {
	userId: number
	companyId: number
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
	users: CompanyMember[]
}

export type CompaniesResponse = {
	data: CompanyItem[]
	meta: Meta
}
