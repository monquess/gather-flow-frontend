import {
	ActionIcon,
	Box,
	Button,
	Group,
	Menu,
	Text,
	useMantineColorScheme,
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { FaBars } from 'react-icons/fa'

import { useResponsive } from '@/hooks/use-responsive'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '../buttons/language-switcher'
import ThemeSwitch from '../buttons/theme-switch'

interface Props {
	isLandingPage: boolean
}

const Header: React.FC<Props> = React.memo(({ isLandingPage }) => {
	const { isMobile } = useResponsive()
	const isMobileSmall = useMediaQuery('(max-width: 320px)')
	const mobileHeight = useMediaQuery('(max-height: 720px)')
	const { colorScheme } = useMantineColorScheme()
	const navigate = useNavigate()
	const { t } = useTranslation()

	return (
		<Box
			pos={mobileHeight ? 'relative' : 'fixed'}
			w="100%"
			bg={colorScheme === 'dark' ? 'dark.8' : 'brand.2'}
			c="white"
			bd="0 1px solid #393E46"
			mt={isMobile ? (mobileHeight ? '0' : '-20') : '0'}
		>
			<header>
				<Group justify="space-between" p="md">
					<Group>
						{isMobileSmall ? (
							<Text fw={500}>
								Gather <br />
								Flow
							</Text>
						) : (
							<Text fw={500} onClick={() => navigate('/')}>
								Gather Flow
							</Text>
						)}
					</Group>

					{isMobile ? (
						<Group justify="space-between">
							<LanguageSwitcher />
							<ThemeSwitch />
							{!isLandingPage && (
								<Menu shadow="md" width={200} position="bottom-end">
									<Menu.Target>
										<ActionIcon
											variant="subtle"
											aria-label="Open menu"
											c="white"
										>
											<FaBars size={20} />
										</ActionIcon>
									</Menu.Target>
									<Menu.Dropdown>
										<Menu.Item>
											<Button
												fullWidth
												variant="filled"
												onClick={() => navigate('/verify')}
											>
												{t('header.verify')}
											</Button>
										</Menu.Item>
									</Menu.Dropdown>
								</Menu>
							)}
						</Group>
					) : (
						<Group gap="sm">
							{!isLandingPage && (
								<Button variant="filled" onClick={() => navigate('/verify')}>
									{t('header.verify')}
								</Button>
							)}
							<LanguageSwitcher />
							<ThemeSwitch />
						</Group>
					)}
				</Group>
			</header>
		</Box>
	)
})

export default Header
