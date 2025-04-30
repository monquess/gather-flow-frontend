import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import {
	Avatar,
	Button,
	Center,
	Flex,
	Group,
	Input,
	Menu,
	Text,
} from '@mantine/core'
import { CiSearch } from 'react-icons/ci'
import { useTranslation } from 'react-i18next'

import LanguageSwitcher from '@/components/buttons/language-switcher'
import ThemeSwitch from '@/components/buttons/theme-switch'
import { useResponsive } from '@/hooks/use-responsive'
import { useUserStore } from '@/shared/store/user-store'

import FindEventModal from './find-event-modal'

const MainHeader: React.FC = () => {
	const { pathname } = useLocation()
	const { t } = useTranslation()
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

	const isActive = (path: string) => pathname === path

	return (
		<>
			<header>
				<Flex
					direction={isMobile ? 'column' : 'row'}
					gap="sm"
					justify="space-between"
					mb="lg"
				>
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
						<Group>
							<Button
								variant={isActive('/home') ? 'outline' : 'subtle'}
								onClick={() => navigate('/home')}
							>
								{t('mainHeader.home')}
							</Button>
							<Button
								variant={isActive('/events') ? 'outline' : 'subtle'}
								onClick={() => navigate('/events')}
							>
								{t('mainHeader.events')}
							</Button>
							<Menu position="bottom" withArrow shadow="md">
								<Menu.Target>
									<Button
										variant={isActive('/companies') ? 'outline' : 'subtle'}
									>
										{t('mainHeader.companies')}
									</Button>
								</Menu.Target>
								<Menu.Dropdown>
									<Menu.Item onClick={() => navigate('/companies')}>
										{t('mainHeader.allCompanies')}
									</Menu.Item>
									<Menu.Item onClick={() => navigate('/companies/create')}>
										{t('mainHeader.createCompany')}
									</Menu.Item>
								</Menu.Dropdown>
							</Menu>
						</Group>
					</Center>
					<Group w={isMobile ? '100%' : ''}>
						<Input
							placeholder={
								isMobile
									? t('mainHeader.searchMobile')
									: t('mainHeader.searchDesktop')
							}
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
				</Flex>
			</header>
			<FindEventModal opened={isOpen} onClose={() => setIsOpen(false)} />
		</>
	)
}

export default React.memo(MainHeader)
