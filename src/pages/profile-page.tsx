import {
	ActionIcon,
	Avatar,
	Badge,
	Box,
	Button,
	Container,
	Flex,
	Group,
	Paper,
	Stack,
	Text,
	Title,
} from '@mantine/core'
import dayjs from 'dayjs'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BsBell } from 'react-icons/bs'
import { CiLogout } from 'react-icons/ci'
import { GoTrash } from 'react-icons/go'
import { useNavigate } from 'react-router-dom'

import Footer from '@/components/general/footer'
import Layout from '@/components/general/layout'
import MainHeader from '@/components/general/main-header'
import NotificationsModal from '@/components/notifications/modal/notifications-modal'
import CompanySection from '@/components/profile/company/company-section'
import DeleteUserModal from '@/components/profile/modal/delete-user-modal'
import UpdateAvatarModal from '@/components/profile/modal/update-avatar-modal'
import UpdateUserModal from '@/components/profile/modal/update-user-modal'
import TicketSection from '@/components/profile/ticket/ticket-section'
import { useUserStore } from '@/shared/store/user-store'
import { IoMdImages } from 'react-icons/io'
import { MdModeEdit } from 'react-icons/md'

const UserProfilePage: React.FC = () => {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const { user, logout } = useUserStore()
	const [updateModal, setUpdateModal] = useState(false)
	const [deleteModal, setDeleteModal] = useState(false)
	const [avatarModal, setAvatarModal] = useState(false)
	const [notification, setNotification] = useState(false)

	if (!user) {
		return (
			<Layout>
				<Paper shadow="md" radius="md" p="lg" withBorder>
					<Stack align="center">
						<Title order={3}>{t('profile.notLoggedIn.title')}</Title>
						<Text c="dimmed">{t('profile.notLoggedIn.message')}</Text>
						<Group grow>
							<Button onClick={() => navigate(-1)}>
								{t('profile.buttons.goBack')}
							</Button>
							<Button onClick={() => navigate('/')}>
								{t('profile.buttons.login')}
							</Button>
						</Group>
					</Stack>
				</Paper>
			</Layout>
		)
	}

	const handleLogout = () => {
		logout()
		navigate('/')
	}

	return (
		<Container
			size="xl"
			pt="md"
			style={{
				display: 'flex',
				flexDirection: 'column',
				minHeight: '100vh',
			}}
		>
			<MainHeader />
			<Stack flex={1}>
				<Paper shadow="md" radius="md" p="lg" withBorder>
					<Flex
						direction={{ base: 'column', sm: 'row' }}
						justify="space-between"
						align={{ base: 'flex-start', sm: 'flex-start' }}
					>
						<Flex
							direction={{ base: 'column', sm: 'row' }}
							align={{ base: 'center', sm: 'flex-start' }}
							gap="lg"
						>
							<Box pos="relative" w={100} h={100}>
								<Avatar src={user.avatar} size={100} radius="xl" />

								<ActionIcon
									variant="filled"
									size="sm"
									pos="absolute"
									bottom={0}
									right={-2}
									radius="xl"
									aria-label={t('profile.actions.editAvatar')}
									onClick={() => setAvatarModal(true)}
								>
									<IoMdImages size={14} />
								</ActionIcon>
							</Box>
							<Stack>
								<Title order={2}>{user.username}</Title>

								<Group gap="xs">
									<Text size="sm" c="dimmed">
										{user.email}
									</Text>
									{user.verified && (
										<Badge color="green" variant="light">
											{user.showAsAttendee
												? t('profile.visibility.public')
												: t('profile.visibility.private')}
										</Badge>
									)}
								</Group>

								<Group gap="xs">
									<Text size="xs" c="dimmed">
										{t('profile.joinedDate')}:{' '}
										{dayjs(user.createdAt).format('DD MMM YYYY')}
									</Text>
									<Text size="xs" c="dimmed">
										{t('profile.lastUpdated')}:{' '}
										{dayjs(user.updatedAt).format('DD MMM YYYY')}
									</Text>
								</Group>
							</Stack>
						</Flex>

						<Flex
							gap="md"
							mt={{ base: 'md', sm: 0 }}
							ml={{ base: 0, sm: 'auto' }}
						>
							<ActionIcon
								variant="outline"
								onClick={() => setNotification(true)}
								title={t('profile.actions.notifications')}
							>
								<BsBell size={14} />
							</ActionIcon>
							<ActionIcon
								variant="outline"
								onClick={() => setUpdateModal(true)}
								title={t('profile.actions.editProfile')}
							>
								<MdModeEdit size={14} />
							</ActionIcon>
							<ActionIcon
								variant="outline"
								onClick={() => setDeleteModal(true)}
								title={t('profile.actions.deleteAccount')}
							>
								<GoTrash size={14} />
							</ActionIcon>
							<ActionIcon
								variant="outline"
								onClick={handleLogout}
								title={t('profile.actions.logout')}
							>
								<CiLogout size={14} />
							</ActionIcon>
						</Flex>
					</Flex>
					<UpdateUserModal
						opened={updateModal}
						onClose={() => setUpdateModal(false)}
					/>
					<DeleteUserModal
						opened={deleteModal}
						onClose={() => setDeleteModal(false)}
					/>
					<UpdateAvatarModal
						opened={avatarModal}
						onClose={() => setAvatarModal(false)}
					/>
					<NotificationsModal
						opened={notification}
						onClose={() => setNotification(false)}
					/>
				</Paper>

				<Title order={3}>{t('profile.sections.companies')}</Title>
				<CompanySection />

				<Title order={3}>{t('profile.sections.tickets')}</Title>
				<TicketSection />
			</Stack>
			<Footer />
		</Container>
	)
}

export default UserProfilePage
