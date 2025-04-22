import CompanyCard from '@/components/company/company-card'
import MainHeader from '@/components/general/main-header'
import { apiClient } from '@/shared/api/axios'
import { CompaniesResponse } from '@/shared/types/companies'
import {
	Center,
	Container,
	Group,
	Loader,
	Pagination,
	Select,
	SimpleGrid,
	Text,
	TextInput,
} from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

const CompaniesPage: React.FC = () => {
	const [searchParams, setSearchParams] = useSearchParams()

	const page = Number(searchParams.get('page')) || 1
	const limit = Number(searchParams.get('limit')) || 15
	const name = searchParams.get('name') || ''

	const [limitInput, setLimitInput] = useState(limit.toString())
	const [nameInput, setNameInput] = useState(name)

	const fetchCompanies = async (): Promise<CompaniesResponse> => {
		const params = new URLSearchParams({
			page: page.toString(),
			limit: limitInput,
		})

		if (name) params.set('name', name)

		const { data } = await apiClient(`/companies?${params.toString()}`)
		return data
	}

	const { data, isLoading, error } = useQuery({
		queryKey: ['companies', searchParams.toString()],
		queryFn: fetchCompanies,
	})

	useEffect(() => {
		const timeout = setTimeout(() => {
			const params = new URLSearchParams(searchParams)
			params.set('name', nameInput)
			params.set('page', '1')
			setSearchParams(params)
		}, 1000)

		return () => clearTimeout(timeout)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [nameInput])

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
			<Group justify="space-between" pb="md">
				<TextInput
					placeholder="Search by name..."
					value={nameInput}
					onChange={(e) => setNameInput(e.currentTarget.value)}
				/>
				<Select
					placeholder="Select Limit"
					data={['5', '15', '30']}
					value={limitInput}
					onChange={(value) => {
						if (value) {
							setLimitInput(value)
							const params = new URLSearchParams(searchParams)
							params.set('limit', value)
							setSearchParams(params)
						}
					}}
					w="75px"
				/>
			</Group>
			<SimpleGrid
				cols={{ base: 1, sm: 2, md: 3 }}
				spacing="lg"
				verticalSpacing="xl"
			>
				{data?.data.map((company) => (
					<CompanyCard key={company.id} company={company} />
				))}
			</SimpleGrid>
			{data?.meta?.pageCount && data.meta.pageCount > 1 && (
				<Center mt="xl" p="center">
					<Pagination
						total={data?.meta.pageCount || 1}
						value={page}
						onChange={(newPage) => {
							const newParams = new URLSearchParams(searchParams)
							newParams.set('page', newPage.toString())
							setSearchParams(newParams)
						}}
						size="md"
						radius="xl"
					/>
				</Center>
			)}
		</Container>
	)
}

export default React.memo(CompaniesPage)
