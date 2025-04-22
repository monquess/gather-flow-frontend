import LanguageSwitcher from '@/components/buttons/language-switcher'
import ThemeSwitch from '@/components/buttons/theme-switch'
import { useResponsive } from '@/hooks/use-responsive'
import useUserStore from '@/shared/store/user-store'
import { Avatar, Button, Center, Group, Input, Menu, Text } from '@mantine/core'
import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import CreateCompanyModal from '../company/modal/create-company-modal'

const MainHeader: React.FC = () => {
	const { isMobile } = useResponsive()
	const [createCompany, setCreateCompany] = useState(false)
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
								<Menu.Item onClick={() => setCreateCompany(true)}>
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
			<CreateCompanyModal
				opened={createCompany}
				onClose={() => setCreateCompany(false)}
			/>
		</>
	)
}

export default React.memo(MainHeader)
