import CompanyCard from '@/components/company/company-card'
import MainHeader from '@/components/general/main-header'
import { apiClient } from '@/shared/api/axios'
import { CompaniesResponse } from '@/shared/types/companies'
import {
	Center,
	Container,
	Loader,
	Pagination,
	SimpleGrid,
	Text,
} from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'

const CompaniesPage: React.FC = () => {
	const [page, setPage] = useState(1)

	const fetchEvents = async (page: number): Promise<CompaniesResponse> => {
		const { data } = await apiClient(`/companies?page=${page}&limit=21`)
		return data
	}

	const { data, isLoading, error } = useQuery({
		queryKey: ['companies', page],
		queryFn: () => fetchEvents(page),
	})

	if (isLoading)
		return (
			<Center>
				<Loader />
			</Center>
		)
	if (error)
		return (
			<Center>
				<Text>Error loading companies</Text>
			</Center>
		)

	return (
		<Container size="xl" py="md">
			<MainHeader />

			<SimpleGrid
				cols={{ base: 1, sm: 2, md: 3 }}
				spacing="lg"
				verticalSpacing="xl"
			>
				{data?.data.map((company) => (
					<CompanyCard key={company.id} company={company} />
				))}
			</SimpleGrid>
			{data?.meta.pageCount !== 1 && (
				<Center mt="xl" p="center">
					<Pagination
						total={data?.meta.pageCount || 1}
						value={page}
						onChange={setPage}
						size="md"
						radius="xl"
					/>
				</Center>
			)}
		</Container>
	)
}

export default React.memo(CompaniesPage)
