import { useResponsive } from '@/hooks/use-responsive'
import { apiClient } from '@/shared/api/axios'
import { AttendeesResponse } from '@/shared/types'
import {
	Avatar,
	Card,
	Center,
	Group,
	Modal,
	Pagination,
	ScrollArea,
	Stack,
	Text,
} from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { memo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

interface AttendeesListModalProps {
	opened: boolean
	onClose: () => void
}

const AttendeesListModal: React.FC<AttendeesListModalProps> = ({
	opened,
	onClose,
}) => {
	const { id } = useParams()
	const { t } = useTranslation()
	const { isMobile } = useResponsive()
	const [page, setPage] = useState(1)

	const fetchAttendees = async (): Promise<AttendeesResponse> => {
		const { data } = await apiClient(`/events/${id}/attendees?${page}`)
		return data
	}

	const { data } = useQuery({
		queryKey: ['attendeeData', id, page],
		queryFn: fetchAttendees,
	})

	return (
		<Modal
			opened={opened}
			onClose={onClose}
			title="Visitors list"
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
					{data?.data.map((attendee) =>
						attendee.showAsAttendee ? (
							<Card key={attendee.id} withBorder radius="md" p="md">
								<Group justify="space-between">
									<Group>
										<Avatar radius="xl" src={attendee.avatar} />
										<Stack gap={0} justify="center">
											<Text fw={600}>{attendee.username}</Text>
										</Stack>
									</Group>
									<Text size="xs" c="dimmed">
										{t('companyPage.joined')}{' '}
										{dayjs(attendee.createdAt).format('DD MMM YYYY')}
									</Text>
								</Group>
							</Card>
						) : null
					)}
				</Stack>
				{data?.meta?.pageCount && data.meta.pageCount > 1 && (
					<Center mt="xl">
						<Pagination
							total={data.meta.pageCount || 1}
							value={page}
							onChange={(newPage) => {
								setPage(newPage)
							}}
							size="md"
							radius="xl"
						/>
					</Center>
				)}
			</ScrollArea.Autosize>
		</Modal>
	)
}

export default memo(AttendeesListModal)
