import React from 'react'
import { useParams } from 'react-router-dom'
import { Center, Container, Loader, Stack, Text, Title } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import UpdateCompanyForm from '@/components/company/forms/update-company-form'
import Footer from '@/components/general/footer'
import MainHeader from '@/components/general/main-header'
import { MotionCard } from '@/components/general'
import { apiClient } from '@/shared/api/axios'
import { Company } from '@/shared/types'

const CompanyUpdatePage: React.FC = () => {
	const { t } = useTranslation()
	const { id } = useParams()

	const fetchCompany = async (): Promise<Company> => {
		const { data } = await apiClient<Company>(`/companies/${id}`)
		return data
	}

	const { data, isLoading, error } = useQuery({
		queryKey: ['companies', id],
		queryFn: fetchCompany,
	})

	if (isLoading || error) {
		return (
			<Container size="md" py="xl">
				<Stack align="center" justify="center" h="50vh">
					{isLoading ? (
						<Loader size="lg" />
					) : (
						<Text c="red">{t('updateCompany.errorLoad')}</Text>
					)}
				</Stack>
			</Container>
		)
	}

	return (
		<Container size="xl" pt="md">
			<Stack gap="xl" justify="space-between">
				<MainHeader />
				<MotionCard
					withBorder
					radius="xl"
					p="xl"
					shadow="md"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, ease: 'easeOut' }}
				>
					<Stack gap="xl">
						<Center>
							<Title order={2}>
								{t('updateCompany.title')}{' '}
								<Text span inherit fw={700} c="blue.6">
									"{data?.name}"
								</Text>{' '}
								{t('updateCompany.info')}
							</Title>
						</Center>
						<UpdateCompanyForm company={data} />
					</Stack>
				</MotionCard>
				<Footer />
			</Stack>
		</Container>
	)
}

export default React.memo(CompanyUpdatePage)
