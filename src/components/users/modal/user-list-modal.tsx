import { useResponsive } from '@/hooks/use-responsive'
import { CompanyMember } from '@/shared/types/companies'
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

interface UserListModalProps {
	opened: boolean
	onClose: () => void
	members: CompanyMember[] | undefined
}

const UserListModal: React.FC<UserListModalProps> = ({
	opened,
	onClose,
	members,
}) => {
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
										<Text size="xs" c="dimmed">
											{member.role}
										</Text>
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
