import {
	Box,
	BoxProps,
	Button,
	Container,
	Group,
	Overlay,
	Text,
	Title,
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { motion } from 'framer-motion'
import { ElementType } from 'react'
import { useNavigate } from 'react-router-dom'

const MotionBox = motion.create<BoxProps>(Box as ElementType)

const GatherFlowLanding: React.FC = () => {
	const navigate = useNavigate()
	const isMobile = useMediaQuery('(max-width: 768px)')

	return (
		<Box
			pos="relative"
			w="100%"
			h="100vh"
			bg="black"
			style={{ overflow: 'hidden' }}
		>
			{[
				{ top: '-100px', left: '-100px', color: '#6366f1' },
				{ bottom: '-100px', right: '-100px', color: '#ec4899' },
				{ top: '20%', right: '30%', color: '#14b8a6' },
			].map((blob, idx) => (
				<MotionBox
					key={idx}
					style={{
						position: 'absolute',
						width: '600px',
						height: '600px',
						background: blob.color,
						borderRadius: '50%',
						filter: 'blur(180px)',
						opacity: 0.4,
						...blob,
					}}
					initial={{ scale: 0.8, opacity: 0, rotate: 0 }}
					animate={{
						scale: [0.9, 1.1, 0.9],
						rotate: [0, 10, -10, 0],
						opacity: [0, 0.4, 0],
					}}
					transition={{
						duration: 8,
						repeat: Infinity,
						ease: 'easeInOut',
					}}
				/>
			))}

			<Overlay blur={8} center style={{ zIndex: 1, pointerEvents: 'none' }} />

			<Container size="lg" h="100%" style={{ position: 'relative', zIndex: 2 }}>
				<Group
					justify="center"
					h="100%"
					align="center"
					style={{ textAlign: 'center' }}
					dir="column"
					gap={isMobile ? 'lg' : 'xl'}
				>
					<motion.div
						initial={{ opacity: 0, y: 40 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 1 }}
					>
						<Title order={1} size={isMobile ? 36 : 64} c="brand.5">
							<Text
								inherit
								variant="gradient"
								gradient={{ from: 'brand.4', to: 'brand.6', deg: 45 }}
							>
								Gather Flow
							</Text>
						</Title>
					</motion.div>

					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.4, duration: 1 }}
					>
						<Text size="lg" c="neutral.6" maw={620}>
							Your portal to unforgettable experiences. Discover events, meet
							people, and never miss a moment.
						</Text>
					</motion.div>

					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.8, duration: 1 }}
					>
						<Text size="sm" c="neutral.5" maw={500} mt="sm">
							Whether you're planning, exploring, or connecting — Gather Flow
							brings everything together in one smooth, vibrant platform.
						</Text>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 1.2, duration: 1 }}
					>
						<Group mt="xl">
							<Button
								size="lg"
								radius="xl"
								gradient={{ from: 'brand.4', to: 'brand.6' }}
								variant="gradient"
								onClick={() => navigate('/home')}
							>
								Explore Events
							</Button>
							<Button
								size="lg"
								radius="xl"
								variant="outline"
								color="neutral.7"
								onClick={() => navigate('/login')}
							>
								Log In
							</Button>
						</Group>
					</motion.div>
				</Group>
			</Container>
		</Box>
	)
}

export default GatherFlowLanding
