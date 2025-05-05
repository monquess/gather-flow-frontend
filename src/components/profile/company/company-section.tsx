import {
	Center,
	Loader,
	Pagination,
	Paper,
	SimpleGrid,
	Stack,
	Text,
} from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import CompanyCard from '@/components/company/company-card'
import { apiClient, ApiError } from '@/shared/api/axios'
import { useUserStore } from '@/shared/store/user-store'
import { Company, Paginated } from '@/shared/types'

const CompanySection: React.FC = () => {
	const { t } = useTranslation()
	const { user } = useUserStore()
	const [page, setPage] = useState(1)

	const {
		data: companies,
		isLoading,
		error,
	} = useQuery<Paginated<Company>, ApiError>({
		queryKey: ['user-companies', page],
		queryFn: async () => {
			const { data } = await apiClient.get<Paginated<Company>>('companies', {
				params: {
					userId: user?.id,
					page: page,
					limit: 5,
				},
			})
			return data
		},
		enabled: !!user,
	})

	if (isLoading) {
		return (
			<Center>
				<Loader />
			</Center>
		)
	}

	if (error || !companies) {
		return (
			<Center h="100vh">
				<Text c="red">
					{error?.message || t('companySection.errors.loadError')}
				</Text>
			</Center>
		)
	}

	return (
		<Paper shadow="md" radius="md" p="lg" withBorder mih="15vh">
			<Stack>
				{companies.meta.count > 0 ? (
					<>
						<SimpleGrid
							cols={{ base: 1, sm: 2, md: 3 }}
							spacing="lg"
							verticalSpacing="xl"
						>
							{companies.data.map((company) => (
								<CompanyCard key={company.id} company={company} />
							))}
						</SimpleGrid>
						{companies.meta.pageCount > 1 && (
							<Pagination
								total={companies.meta.pageCount}
								value={page}
								onChange={setPage}
								size="md"
								radius="xl"
							/>
						)}
					</>
				) : (
					<Center>
						<Text c="gray" size="md">
							{t('companySection.emptyState')}
						</Text>
					</Center>
				)}
			</Stack>
		</Paper>
	)
}

export default React.memo(CompanySection)
