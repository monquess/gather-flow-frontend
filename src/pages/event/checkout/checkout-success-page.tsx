import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Title, Text, Button, Group, Stack, ThemeIcon } from '@mantine/core'
import { MdCheckCircle } from 'react-icons/md'

import Layout from '@/components/general/layout'
import { MotionCard } from '@/components/general'

const CheckoutSuccessPage: React.FC = () => {
	const navigate = useNavigate()

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
					<Title order={2}>Payment Successful!</Title>
					<Text c="dimmed" ta="center">
						Thank you for your purchase. You can view your tickets in your email
						or in your profile.
					</Text>
					<Group>
						<Button variant="light" onClick={() => navigate('/home')}>
							Home page
						</Button>
						<Button
							component="a"
							variant="filled"
							onClick={() => navigate('/profile#tickets')}
						>
							Go to Profile
						</Button>
					</Group>
				</Stack>
			</MotionCard>
		</Layout>
	)
}

export default CheckoutSuccessPage
