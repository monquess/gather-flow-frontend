import { Center, Stack, Title } from '@mantine/core'
import React from 'react'
import { useTranslation } from 'react-i18next'

import CreateCompanyForm from '@/components/company/forms/create-company-form'
import { MotionCard } from '@/components/general'
import Layout from '@/components/general/layout'

const CompanyCreatePage: React.FC = () => {
	const { t } = useTranslation()
	return (
		<Layout>
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
							<Title order={2}>{t('createCompany.title')}</Title>
						</Center>
						<CreateCompanyForm />
					</Stack>
				</MotionCard>
			</Layout>
	)
}

export default React.memo(CompanyCreatePage)
