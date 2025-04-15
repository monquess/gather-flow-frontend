import { Meta } from './events'

export type CompanyItem = {
	id: number
	name: string
	description: string
	email: string
	location: string
	createdAt: string
}

export type CompaniesResponse = {
	data: CompanyItem[]
	meta: Meta
}
