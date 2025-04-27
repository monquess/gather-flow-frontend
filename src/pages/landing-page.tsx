import {
	Box,
	Button,
	Container,
	Grid,
	Group,
	Image,
	Stack,
	Text,
	Title,
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { motion, useAnimation, useInView } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const Reveal = ({
	children,
	delay = 0,
}: {
	children: React.ReactNode
	delay?: number
}) => {
	const ref = useRef(null)
	const isInView = useInView(ref, { once: true })
	const controls = useAnimation()

	useEffect(() => {
		if (isInView) {
			controls.start('visible')
		}
	}, [isInView, controls])

	return (
		<motion.div
			ref={ref}
			initial="hidden"
			animate={controls}
			variants={{
				hidden: { opacity: 0, y: 60 },
				visible: {
					opacity: 1,
					y: 0,
					transition: { duration: 0.8, delay, ease: 'easeOut' },
				},
			}}
		>
			{children}
		</motion.div>
	)
}

const LandingPage: React.FC = () => {
	const navigate = useNavigate()
	const isMobile = useMediaQuery('(max-width: 768px)')

	const backgroundBlobs = [
		{
			top: '-150px',
			left: '-100px',
			bg: 'radial-gradient(circle, #c7d2fe, transparent)',
		},
		{
			bottom: '-150px',
			right: '-100px',
			bg: 'radial-gradient(circle, #fcd34d, transparent)',
		},
	]

	return (
		<Box bg="white" pos="relative">
			{backgroundBlobs.map((blob, idx) => (
				<Box
					key={idx}
					style={{
						position: 'fixed',
						width: '400px',
						height: '400px',
						borderRadius: '50%',
						background: blob.bg,
						filter: 'blur(120px)',
						zIndex: -1,
						...blob,
					}}
				/>
			))}

			<Box mih="100vh" style={{ display: 'flex', alignItems: 'center' }}>
				<Container size="lg">
					<Stack align="center" ta="center">
						<Reveal>
							<Title order={1} size={isMobile ? 36 : 56}>
								Discover{' '}
								<Text span c="blue">
									Events
								</Text>{' '}
								and{' '}
								<Text span c="blue">
									People
								</Text>
							</Title>
						</Reveal>
						<Reveal delay={0.2}>
							<Text size="lg" c="dimmed" maw={600}>
								A new way to connect with like-minded people at events you care
								about.
							</Text>
						</Reveal>
						<Reveal delay={0.4}>
							<Group>
								<Button size="md" radius="xl" onClick={() => navigate('/home')}>
									Get Started
								</Button>
								<Button variant="outline" size="md" radius="xl">
									Learn More
								</Button>
							</Group>
						</Reveal>
					</Stack>
				</Container>
			</Box>

			{[
				{
					title: 'Create or Join Exciting Events',
					description:
						'From local meetups to international conferences — stay engaged and connected.',
					image:
						'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1000&q=80',
					reverse: false,
				},
				{
					title: 'Build Your Network',
					description:
						'Message, collaborate, and plan together before events even begin.',
					image:
						'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=1000&q=80',
					reverse: true,
				},
				{
					title: 'Smart Event Tracking',
					description:
						'Get calendar sync, reminders, and real-time updates for every event.',
					image:
						'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1000&q=80',
					reverse: false,
				},
			].map((section, index) => (
				<Box
					key={index}
					py={80}
					style={{ background: index % 2 ? '#f9fafb' : '#fff' }}
				>
					<Container size="lg">
						<Grid
							gutter="xl"
							align="center"
							justify="center"
							style={{ flexDirection: section.reverse ? 'row-reverse' : 'row' }}
						>
							<Grid.Col span={12}>
								<Reveal delay={0.1}>
									<Title order={2} mb="sm">
										{section.title}
									</Title>
									<Text size="lg" c="dimmed">
										{section.description}
									</Text>
								</Reveal>
							</Grid.Col>
							<Grid.Col span={12}>
								<Reveal delay={0.3}>
									<Image
										src={section.image}
										alt={section.title}
										radius="lg"
										style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
									/>
								</Reveal>
							</Grid.Col>
						</Grid>
					</Container>
				</Box>
			))}

			<Box py={100} ta="center">
				<Reveal>
					<Title order={3}>Ready to Join the Movement?</Title>
					<Text c="dimmed" mb="md">
						Sign up now and explore what’s happening around you.
					</Text>
					<Button size="md" radius="xl" onClick={() => navigate('/login')}>
						Join Now
					</Button>
				</Reveal>
			</Box>
		</Box>
	)
}

export default LandingPage
