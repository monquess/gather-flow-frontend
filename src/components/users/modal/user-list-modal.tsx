import { useResponsive } from '@/hooks/use-responsive'
import { useUserStore } from '@/shared/store/user-store'
import { CompanyMember } from '@/shared/types'
import {
	Avatar,
	Card,
	Group,
	Modal,
	ScrollArea,
	Stack,
	Text,
} from '@mantine/core'
import dayjs from 'dayjs'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import EditRoleSelect from '../edit-role-select'

interface UserListModalProps {
	opened: boolean
	onClose: () => void
	members: CompanyMember[] | undefined
	admin: boolean
}

const UserListModal: React.FC<UserListModalProps> = ({
	opened,
	onClose,
	members,
	admin,
}) => {
	const { user } = useUserStore()
	const { t } = useTranslation()
	const { isMobile } = useResponsive()
	return (
		<Modal
			opened={opened}
			onClose={onClose}
			title={t('companyPage.companyMembers')}
			size={isMobile ? 'sm' : 'md'}
			centered
			closeOnClickOutside={false}
			zIndex={1000}
		>
			<ScrollArea.Autosize
				mah={325}
				scrollbarSize={8}
				offsetScrollbars
				type="hover"
			>
				<Stack gap="xs">
					{members?.map((member) => (
						<Card key={member.user.id} withBorder radius="md" p="md">
							<Group justify="space-between">
								<Group>
									<Avatar radius="xl" src={member.user.avatar} />
									<Stack gap={0} justify="center">
										<Text fw={600}>{member.user.username}</Text>
										{admin && member.user.id !== user.id ? (
											<EditRoleSelect member={member} />
										) : (
											<Text size="xs" c="dimmed">
												{member.role}
											</Text>
										)}
									</Stack>
								</Group>
								<Text size="xs" c="dimmed">
									{t('companyPage.joined')}{' '}
									{dayjs(member.createdAt).format('DD MMM YYYY')}
								</Text>
							</Group>
						</Card>
					))}
				</Stack>
			</ScrollArea.Autosize>
		</Modal>
	)
}

export default memo(UserListModal)
