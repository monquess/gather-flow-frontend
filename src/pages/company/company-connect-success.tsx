import { Button, Group, Stack, Text, ThemeIcon, Title } from '@mantine/core'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { MdCheckCircle } from 'react-icons/md'
import { useNavigate, useParams } from 'react-router-dom'

import { MotionCard } from '@/components/general'
import Layout from '@/components/general/layout'

const ConnectSuccessPage: React.FC = () => {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const { id } = useParams()

	return (
		<Layout>
			<MotionCard
				shadow="lg"
				radius="xl"
				withBorder
				p="xl"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, ease: 'easeOut' }}
			>
				<Stack align="center" gap="md">
					<ThemeIcon color="green" size={80} radius="xl">
						<MdCheckCircle size={48} />
					</ThemeIcon>
					<Title order={2}>{t('connectSuccessPage.title')}</Title>
					<Text c="dimmed" ta="center">
						{t('connectSuccessPage.description')}
					</Text>
					<Group>
						<Button variant="light" onClick={() => navigate('/home')}>
							{t('connectSuccessPage.buttons.home')}
						</Button>
						<Button
							variant="filled"
							onClick={() => navigate(`/companies/${id}`)}
						>
							{t('connectSuccessPage.buttons.company')}
						</Button>
					</Group>
				</Stack>
			</MotionCard>
		</Layout>
	)
}

export default ConnectSuccessPage
