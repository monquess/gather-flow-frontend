import LanguageSwitcher from '@/components/buttons/language-switcher'
import ThemeSwitch from '@/components/buttons/theme-switch'
import useUserStore from '@/shared/store/user-store'
import {
	Avatar,
	Button,
	Center,
	Group,
	Input,
	Popover,
	Text,
} from '@mantine/core'
import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import CreateCompanyModal from '../company/create-company-modal'

const MainHeader: React.FC = () => {
	const [createCompany, setCreateCompany] = useState(false)
	const { user } = useUserStore()
	const navigate = useNavigate()
	return (
		<>
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
						<Popover position="bottom" withArrow shadow="md">
							<Popover.Target>
								<Button variant="subtle">Companies</Button>
							</Popover.Target>
							<Popover.Dropdown>
								<Text size="sm" onClick={() => navigate('/companies')}>
									All companies
								</Text>
								<Text size="sm" onClick={() => setCreateCompany(true)}>
									Create company
								</Text>
							</Popover.Dropdown>
						</Popover>
					</Center>
					<Group>
						<Input placeholder="Search..." />
						<ThemeSwitch />
						<LanguageSwitcher />
						<Avatar src={user?.avatar} onClick={() => navigate('/profile')} />
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
