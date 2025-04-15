import LanguageSwitcher from '@/components/buttons/language-switcher'
import ThemeSwitch from '@/components/buttons/theme-switch'
import CompanyCard from '@/components/company/company-card'
import { apiClient } from '@/shared/api/axios'
import { CompaniesResponse } from '@/shared/types/companies'
import {
	Avatar,
	Button,
	Center,
	Container,
	Group,
	Input,
	Loader,
	Pagination,
	SimpleGrid,
	Text,
} from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import { useNavigate } from 'react-router'

const CompaniesPage: React.FC = () => {
	const [page, setPage] = useState(1)
	const navigate = useNavigate()

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
			<header>
				<Group justify="space-between" mb="md">
					<Text fw={600} size="xl">
						Gather Flow
					</Text>
					<Center>
						<Button variant="subtle" onClick={() => navigate('/home')}>
							Home
						</Button>
						<Button variant="transparent" onClick={() => navigate('/events')}>
							Events
						</Button>
						<Button
							variant="transparent"
							onClick={() => navigate('/companies')}
						>
							Companies
						</Button>
					</Center>
					<Group>
						<Input placeholder="Search events..." />
						<ThemeSwitch />
						<LanguageSwitcher />
						<Avatar />
					</Group>
				</Group>
			</header>

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
