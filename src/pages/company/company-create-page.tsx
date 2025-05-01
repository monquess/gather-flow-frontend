import React from 'react'
import { Container, Stack, Title } from '@mantine/core'
import { useTranslation } from 'react-i18next'

import CreateCompanyForm from '@/components/company/forms/create-company-form'
import Footer from '@/components/general/footer'
import MainHeader from '@/components/general/main-header'
import { MotionCard } from '@/components/general'

const CompanyCreatePage: React.FC = () => {
	const { t } = useTranslation()

	return (
		<Container size="xl" pt="md">
			<Stack gap="xl" justify="space-between">
				<MainHeader />
				<Title order={2}>{t('createCompany.title')}</Title>
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
						<CreateCompanyForm />
					</Stack>
				</MotionCard>
				<Footer />
			</Stack>
		</Container>
	)
}

export default React.memo(CompanyCreatePage)
