import { memo, useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
	Card,
	Divider,
	Group,
	Modal,
	ScrollArea,
	Text,
	TextInput,
} from '@mantine/core'
import { CiSearch } from 'react-icons/ci'
import { useTranslation } from 'react-i18next'

import { motion } from 'framer-motion'
import { debounce } from 'lodash'

import { useResponsive } from '@/hooks/use-responsive'
import { apiClient } from '@/shared/api/axios'
import {
	Event,
	Company,
	EventsResponse,
	CompaniesResponse,
} from '@/shared/types'

interface FindEventModalProps {
	opened: boolean
	onClose: () => void
}

const FindEventModal: React.FC<FindEventModalProps> = ({ opened, onClose }) => {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const { isMobile } = useResponsive()
	const [events, setEvents] = useState<Event[]>([])
	const [companies, setCompanies] = useState<Company[]>([])
	const [search, setSearch] = useState<string>('')

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const fetch = useCallback(
		debounce(async (query: string) => {
			if (!query.trim()) {
				setCompanies([])
				setEvents([])
			} else {
				const responseEvents = await apiClient.get<EventsResponse>('/events', {
					params: { query: query },
				})
				const responseCompanies = await apiClient.get<CompaniesResponse>(
					'/companies',
					{
						params: { name: query },
					}
				)
				setEvents(responseEvents.data.data)
				setCompanies(responseCompanies.data.data)
			}
		}, 500),
		[]
	)

	useEffect(() => {
		fetch(search)
	}, [search, fetch])

	return (
		<Modal.Root
			opened={opened}
			onClose={() => {
				onClose()
				setCompanies([])
				setEvents([])
			}}
			size={isMobile ? 'sm' : 'md'}
			zIndex={1000}
			transitionProps={{
				transition: 'fade',
				duration: 600,
				timingFunction: 'linear',
			}}
		>
			<Modal.Overlay />
			<Modal.Content>
				<Modal.Header>
					<TextInput
						variant="unstyled"
						w="100%"
						leftSection={<CiSearch size={20} />}
						onChange={(e) => setSearch(e.currentTarget.value)}
					/>
				</Modal.Header>
				<Modal.Body>
					<ScrollArea.Autosize
						mah="45vh"
						scrollbarSize={8}
						offsetScrollbars
						type="hover"
					>
						{events.length > 0 && (
							<>
								<Divider
									label={t('findModal.event')}
									labelPosition="left"
									my="sm"
								/>
								<Group dir="row" gap="sm">
									{events.map((event) => (
										<Card
											key={event.id}
											shadow="sm"
											padding="md"
											radius="md"
											withBorder
											w="100%"
											onClick={() => navigate(`/events/${event.id}`)}
										>
											<motion.div
												whileHover={{ scale: 1.03 }}
												whileTap={{ scale: 0.98 }}
												initial={{ opacity: 0, y: 20 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ duration: 0.5, ease: 'easeOut' }}
												style={{ height: '100%' }}
											>
												<Text fw={600} size="lg" mb="xs">
													{event.title}
												</Text>
												<Text size="sm" c="dimmed" lineClamp={2}>
													{event.description}
												</Text>
											</motion.div>
										</Card>
									))}
								</Group>
							</>
						)}

						{companies.length > 0 && (
							<>
								<Divider
									label={t('findModal.company')}
									labelPosition="left"
									my="sm"
								/>
								<Group dir="row" gap="sm">
									{companies.map((company) => (
										<Card
											key={company.id}
											shadow="sm"
											padding="md"
											radius="md"
											withBorder
											w="100%"
											onClick={() => navigate(`/companies/${company.id}`)}
										>
											<motion.div
												whileHover={{ scale: 1.03 }}
												whileTap={{ scale: 0.98 }}
												initial={{ opacity: 0, y: 20 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ duration: 0.5, ease: 'easeOut' }}
												style={{ height: '100%' }}
											>
												<Text fw={600} size="lg" mb="xs">
													{company.name}
												</Text>
												<Text size="sm" c="dimmed" lineClamp={2}>
													{company.description}
												</Text>
											</motion.div>
										</Card>
									))}
								</Group>
							</>
						)}
					</ScrollArea.Autosize>
				</Modal.Body>
			</Modal.Content>
		</Modal.Root>
	)
}

export default memo(FindEventModal)
