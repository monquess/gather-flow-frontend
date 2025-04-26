import LanguageSwitcher from '@/components/buttons/language-switcher'
import ThemeSwitch from '@/components/buttons/theme-switch'
import { useResponsive } from '@/hooks/use-responsive'
import useUserStore from '@/shared/store/user-store'
import { Avatar, Button, Center, Group, Input, Menu, Text } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { CiSearch } from 'react-icons/ci'
import { useNavigate } from 'react-router'
import FindEventModal from './find-event-modal'

const MainHeader: React.FC = () => {
	const { isMobile } = useResponsive()
	const { user } = useUserStore()
	const navigate = useNavigate()
	const [isOpen, setIsOpen] = useState(false)

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.ctrlKey && event.key === 'k') {
				event.preventDefault()
				setIsOpen((prev) => !prev)
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => {
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [])

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
						<Input
							placeholder="Search..."
							leftSection={<CiSearch />}
							w={isMobile ? '100%' : ''}
							onClick={() => setIsOpen(true)}
							readOnly
							styles={{
								input: {
									borderColor: 'grey',
								},
							}}
						/>
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
			<FindEventModal opened={isOpen} onClose={() => setIsOpen(false)} />
		</>
	)
}

export default React.memo(MainHeader)
