import { Button, Group, Stack, Text, ThemeIcon, Title } from '@mantine/core'
import React from 'react'
import { MdCheckCircle } from 'react-icons/md'
import { useNavigate, useParams } from 'react-router-dom'

import { MotionCard } from '@/components/general'
import Layout from '@/components/general/layout'

const ConnectSuccessPage: React.FC = () => {
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
					<Title order={2}>Connect Successful!</Title>
					<Text c="dimmed" ta="center">
						Thank you for connecting your Stripe account. You now have full
						access to all company features.
					</Text>
					<Group>
						<Button variant="light" onClick={() => navigate('/home')}>
							Home page
						</Button>
						<Button
							component="a"
							variant="filled"
							onClick={() => navigate(`/companies/${id}`)}
						>
							Go to company
						</Button>
					</Group>
				</Stack>
			</MotionCard>
		</Layout>
	)
}

export default ConnectSuccessPage
