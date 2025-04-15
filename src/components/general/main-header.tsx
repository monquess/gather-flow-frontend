import LanguageSwitcher from '@/components/buttons/language-switcher'
import ThemeSwitch from '@/components/buttons/theme-switch'
import useUserStore from '@/shared/store/user-store'
import { Avatar, Button, Center, Group, Input, Text } from '@mantine/core'
import React from 'react'
import { useNavigate } from 'react-router'

const MainHeader: React.FC = () => {
	const { user } = useUserStore()
	const navigate = useNavigate()
	return (
		<header>
			<Group justify="space-between" mb="lg">
				<Text fw={600} size="xl">
					Gather Flow
				</Text>
				<Center>
					<Button variant="subtle" onClick={() => navigate('/home')}>
						Home
					</Button>
					<Button variant="subtle" onClick={() => navigate('/events')}>
						Events
					</Button>
					<Button variant="subtle" onClick={() => navigate('/companies')}>
						Companies
					</Button>
				</Center>
				<Group>
					<Input placeholder="Search..." />
					<ThemeSwitch />
					<LanguageSwitcher />
					<Avatar src={user?.avatar} onClick={() => navigate('/profile')} />
				</Group>
			</Group>
		</header>
	)
}

export default React.memo(MainHeader)
