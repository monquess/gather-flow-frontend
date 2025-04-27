import { ActionIcon, Group, Stack, Text } from '@mantine/core'
import React from 'react'

import {
	FaCalendarAlt,
	FaGithub,
	FaInstagram,
	FaTwitter,
	FaYoutube,
} from 'react-icons/fa'

import { useResponsive } from '@/hooks/use-responsive'

const Footer: React.FC = React.memo(() => {
	const { isMobile } = useResponsive()
	//const mobileHeight = useMediaQuery('(max-height: 720px)')
	const year = new Date().getFullYear()

	return (
		<Group
			//pos={mobileHeight ? 'relative' : 'fixed'}
			//bottom={0}
			w="100%"
			py="md"
			px="sm"
			justify="center"
			align="center"
			style={{ borderTop: '1px solid #ddd' }}
		>
			{isMobile ? (
				<Stack align="center">
					<Group>
						<FaCalendarAlt size={16} />
						<Text fw={500}>Monquees Calendar © {year}</Text>
					</Group>
					<Group>
						<ActionIcon size="lg" color="gray" variant="subtle">
							<FaTwitter size={18} />
						</ActionIcon>
						<ActionIcon size="lg" color="gray" variant="subtle">
							<FaYoutube size={18} />
						</ActionIcon>
						<ActionIcon size="lg" color="gray" variant="subtle">
							<FaInstagram size={18} />
						</ActionIcon>
					</Group>
				</Stack>
			) : (
				<Group w="100%" px="md" justify="space-between">
					<Group>
						<FaCalendarAlt size={20} />
						<Text fw={500}>Gather Flow © {year}</Text>
					</Group>

					<Group>
						<a
							href="https://github.com/monquess"
							target="_blank"
							rel="noopener noreferrer"
						>
							<ActionIcon size="lg" color="gray" variant="subtle">
								<FaGithub size={24} />
							</ActionIcon>
						</a>

						<a
							href="https://www.youtube.com/@Андрей-в9ы4с"
							target="_blank"
							rel="noopener noreferrer"
						>
							<ActionIcon size="lg" color="gray" variant="subtle">
								<FaYoutube size={24} />
							</ActionIcon>
						</a>

						<a
							href="https://www.instagram.com/batushka11/profilecard/?igsh=MWcyaTZqb3RheW1iZA=="
							target="_blank"
							rel="noopener noreferrer"
						>
							<ActionIcon size="lg" color="gray" variant="subtle">
								<FaInstagram size={24} />
							</ActionIcon>
						</a>
					</Group>
				</Group>
			)}
		</Group>
	)
})

export default Footer
