import React, { useState } from 'react'
import { BsBell, BsPencil } from 'react-icons/bs'
import { CiLogout } from 'react-icons/ci'
import { GoTrash } from 'react-icons/go'
import { GrUpdate } from 'react-icons/gr'
import { useNavigate } from 'react-router-dom'

import {
	ActionIcon,
	Avatar,
	Badge,
	Box,
	Container,
	Flex,
	Group,
	Paper,
	Stack,
	Text,
	Title,
} from '@mantine/core'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'

import Footer from '@/components/general/footer'
import MainHeader from '@/components/general/main-header'
import NotificationsModal from '@/components/notifications/modal/notifications-modal'
import DeleteUserModal from '@/components/profile/modal/delete-user-modal'
import UpdateAvatarModal from '@/components/profile/modal/update-avatar-modal'
import UpdateUserModal from '@/components/profile/modal/update-user-modal'
import TicketSection from '@/components/profile/ticket/ticket-section'
import { useUserStore } from '@/shared/store/user-store'
import CompanySection from '@/components/profile/company/company-section'

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
			<Container size="sm" py="md">
				<Paper shadow="md" radius="md" p="lg" withBorder>
					<Stack align="center">
						<Title order={3}>You are not logged in</Title>
						<Text c="dimmed">Please log in to view your profile.</Text>
					</Stack>
				</Paper>
			</Container>
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
									aria-label="Edit avatar"
									onClick={() => setAvatarModal(true)}
								>
									<BsPencil size={14} />
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
												? t('profile.public')
												: t('profile.private')}
										</Badge>
									)}
								</Group>

								<Group gap="xs">
									<Text size="xs" c="dimmed">
										{t('profile.joined')}:{' '}
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
							>
								<BsBell size={14} />
							</ActionIcon>
							<ActionIcon
								variant="outline"
								onClick={() => setUpdateModal(true)}
							>
								<GrUpdate size={14} />
							</ActionIcon>
							<ActionIcon
								variant="outline"
								onClick={() => setDeleteModal(true)}
							>
								<GoTrash size={14} />
							</ActionIcon>
							<ActionIcon variant="outline" onClick={handleLogout}>
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

				<Title order={3}>Companies</Title>
				<CompanySection />

				<Title order={3}>Tickets</Title>
				<TicketSection />
			</Stack>
			<Footer />
		</Container>
	)
}

export default UserProfilePage
