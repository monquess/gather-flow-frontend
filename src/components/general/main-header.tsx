import LanguageSwitcher from '@/components/buttons/language-switcher'
import ThemeSwitch from '@/components/buttons/theme-switch'
import { useResponsive } from '@/hooks/use-responsive'
import useUserStore from '@/shared/store/user-store'
import { Avatar, Button, Center, Group, Input, Menu, Text } from '@mantine/core'
import React from 'react'
import { useNavigate } from 'react-router'

const MainHeader: React.FC = () => {
	const { isMobile } = useResponsive()
	const { user } = useUserStore()
	const navigate = useNavigate()
	return (
		<>
			<header>
				<Group justify="space-between" mb="lg">
					<Group justify="space-between" w={isMobile ? '100%' : ''}>
						<Text fw={600} size="xl">
							Gather Flow
						</Text>
						{isMobile && (
							<Group>
								<ThemeSwitch />
								<LanguageSwitcher />
								<Avatar
									src={user?.avatar}
									onClick={() => navigate('/profile')}
								/>
							</Group>
						)}
					</Group>
					<Center>
						<Button variant="subtle" onClick={() => navigate('/home')}>
							Home
						</Button>
						<Button variant="subtle" onClick={() => navigate('/events')}>
							Events
						</Button>
						<Menu position="bottom" withArrow shadow="md">
							<Menu.Target>
								<Button variant="subtle">Companies</Button>
							</Menu.Target>
							<Menu.Dropdown>
								<Menu.Item onClick={() => navigate('/companies')}>
									All companies
								</Menu.Item>
								<Menu.Item onClick={() => navigate('/companies/create')}>
									Create company
								</Menu.Item>
							</Menu.Dropdown>
						</Menu>
					</Center>
					<Group w={isMobile ? '100%' : ''}>
						<Input placeholder="Search..." w={isMobile ? '100%' : ''} />
						{!isMobile && (
							<Group>
								<ThemeSwitch />
								<LanguageSwitcher />
								<Avatar
									src={user?.avatar}
									onClick={() => navigate('/profile')}
								/>
							</Group>
						)}
					</Group>
				</Group>
			</header>
		</>
	)
}

export default React.memo(MainHeader)
