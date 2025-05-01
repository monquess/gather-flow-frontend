import {
	Badge,
	Box,
	Button,
	Card,
	Center,
	Container,
	Divider,
	Flex,
	Group,
	Image,
	Loader,
	Stack,
	Text,
	Title,
} from '@mantine/core'
import { RichTextEditor } from '@mantine/tiptap'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FaArrowRightLong, FaMapLocationDot } from 'react-icons/fa6'
import { MdCalendarToday } from 'react-icons/md'
import { useNavigate, useParams } from 'react-router-dom'

import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
import { useQuery } from '@tanstack/react-query'

import Link from '@tiptap/extension-link'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

import dayjs from 'dayjs'
import { marked } from 'marked'

import CommentSection from '@/components/comment/comment-section'
import EventDeleteModal from '@/components/event/modal/event-delete-modal'
import { MotionCard } from '@/components/general'
import CarouselEvent from '@/components/general/carousel-event'
import Footer from '@/components/general/footer'
import MainHeader from '@/components/general/main-header'
import { useResponsive } from '@/hooks/use-responsive'
import { apiClient } from '@/shared/api/axios'
import { config } from '@/shared/config/config'
import { cleanMarkdown } from '@/shared/helpers/markdown'
import { useUserStore } from '@/shared/store/user-store'
import { Company, CompanyMember, Event, EventsResponse } from '@/shared/types'
import SocialShareButtons from '@/components/general/social-share-buttons'
import { EventMetaTags } from '@/components/event/event-meta-tags'

marked.setOptions({
	gfm: true,
	breaks: true,
})

const EventPage: React.FC = () => {
	const { user } = useUserStore()
	const navigate = useNavigate()
	const { isMobile } = useResponsive()
	const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(
		null
	)
	const [isMapLoaded, setIsMapLoaded] = useState(false)
	const { id } = useParams()
	const { t } = useTranslation()

	const [deleteEvent, setDeleteEvent] = useState(false)
	const [admin, setAdmin] = useState(false)

	const fetchEvent = async (): Promise<Event> => {
		const { data } = await apiClient(`/events/${id}`)
		return data
	}

	const {
		data: event,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['event', id],
		queryFn: fetchEvent,
	})

	const editor = useEditor({
		extensions: [
			Link,
			StarterKit,
			Table.configure({
				resizable: true,
			}),
			TableRow,
			TableHeader,
			TableCell,
		],
		content: '',
		editable: false,
	})

	useEffect(() => {
		if (editor && event?.description) {
			const html = marked.parse(cleanMarkdown(event.description))
			editor.commands.setContent(html)
		}
	}, [editor, event?.description])

	const fetchEventFromCompany = async (): Promise<EventsResponse> => {
		const { data } = await apiClient(`/companies/${event?.company.id}/events`)
		return data
	}

	const {
		data: companyEvents,
		isLoading: isLoadingCompanyEvents,
		error: errorCompanyEvents,
	} = useQuery({
		queryKey: ['companyEvents', event?.company.id],
		queryFn: fetchEventFromCompany,
		enabled: !!event?.company?.id,
	})

	const fetchSimilarEvent = async (): Promise<Event[]> => {
		const { data } = await apiClient(`/events/${id}/similar`)
		return data
	}

	const {
		data: similarEvents,
		isLoading: isLoadingSimilarEvents,
		error: errorSimilarEvents,
	} = useQuery({
		queryKey: ['similarEvents', event?.id],
		queryFn: fetchSimilarEvent,
	})

	const handleApiLoaded = () => {
		setIsMapLoaded(true)
	}

	const fetchCompany = async (): Promise<Company> => {
		const { data } = await apiClient<Company>(`/companies/${event?.company.id}`)

		if (user && data?.users?.length) {
			const currentUser = data.users.find(
				(u: CompanyMember) => u.user.id === user.id
			)

			if (currentUser) {
				setAdmin(currentUser.role === 'ADMIN')
			} else {
				setAdmin(false)
			}
		}
		return data
	}

	useQuery({
		queryKey: ['companyData', event?.company.id],
		queryFn: fetchCompany,
	})

	useEffect(() => {
		if (event?.location && isMapLoaded && window.google?.maps?.Geocoder) {
			const geocoder = new window.google.maps.Geocoder()
			geocoder.geocode({ address: event.location }, (results, status) => {
				if (status === 'OK' && results && results[0]) {
					const location = results[0].geometry.location
					setMarker({
						lat: location.lat(),
						lng: location.lng(),
					})
				}
			})
		}
	}, [event?.location, isMapLoaded])

	if (!event || isLoading || isLoadingCompanyEvents || isLoadingSimilarEvents) {
		return (
			<Center h="100vh">
				<Loader />
			</Center>
		)
	}

	if (error || errorCompanyEvents || errorSimilarEvents) {
		return (
			<Center h="100vh">
				<Text c="red">{t('eventPage.errorLoadingEvent')}</Text>
			</Center>
		)
	}

	return (
		<Container size="xl" pt="md">
			<EventMetaTags event={event} />
			<MainHeader />

			<Flex gap="md" mt="xl" direction={isMobile ? 'column' : 'row'}>
				<Box flex={2} miw={0}>
					<MotionCard
						shadow="md"
						radius="xl"
						withBorder
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, ease: 'easeOut' }}
					>
						<Card.Section>
							<Image src={event?.poster} height={300} alt={event?.title} />
						</Card.Section>
						<Stack mt="md" gap="xs">
							<Title order={2} lineClamp={2}>
								{event?.title}
							</Title>

							<Group gap="sm" justify="space-between">
								<Group gap="xs" align="center">
									<MdCalendarToday size={18} />
									<Text size="sm">
										{dayjs(event?.startDate).format('DD MMM YYYY, HH:mm')}
									</Text>
								</Group>
								<Group gap="xs" align="center">
									<Badge variant="light" size="md">
										{event?.format}
									</Badge>
									<Badge variant="light" size="md">
										{event?.theme}
									</Badge>
								</Group>
							</Group>
						</Stack>
					</MotionCard>
				</Box>

				<Box flex={1} miw={280}>
					<MotionCard
						shadow="md"
						radius="xl"
						withBorder
						p="xl"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, ease: 'easeOut' }}
					>
						<Stack>
							<Title order={3}>Buy Ticket</Title>
							{event.ticketPrice > 0 ? (
								<Text fw={500}>{event.ticketPrice.toFixed(2)} USD</Text>
							) : (
								<Text fw={500}>FREE</Text>
							)}
							<Button
								fullWidth
								color="green"
								size="md"
								justify="space-between"
								leftSection={<span />}
								rightSection={<FaArrowRightLong size={20} />}
								onClick={() => navigate(`checkout`)}
								disabled={event.ticketsQuantity - event.ticketsSold === 0}
							>
								{event.ticketsQuantity - event.ticketsSold > 0 ? (
									<Text fw={500}>Buy now</Text>
								) : (
									<Text fw={500}>SOLD OUT</Text>
								)}
							</Button>
						</Stack>
					</MotionCard>
				</Box>
			</Flex>
			{admin ? (
				<>
					<Divider my="xl" label="Admin zone" labelPosition="center" />
					<Group>
						<Button onClick={() => navigate(`events/${id}/manage-promocode`)}>
							Manage code
						</Button>
						{event.status === 'DRAFT' ? (
							<>
								<Button onClick={() => navigate(`events/${id}/update`)}>
									Update event info
								</Button>
								<Button onClick={() => setDeleteEvent(true)}>
									Delete event
								</Button>
							</>
						) : null}
					</Group>
				</>
			) : null}
			<Divider
				my="xl"
				label={t('eventPage.aboutEvent')}
				labelPosition="center"
			/>
			<MotionCard
				shadow="md"
				radius="xl"
				withBorder
				p="xl"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, ease: 'easeOut' }}
			>
				<Stack>
					{event?.description && (
						<RichTextEditor
							editor={editor}
							styles={{
								root: {
									border: 'none',
								},
								content: {
									background: 'inherit',
								},
							}}
						>
							<RichTextEditor.Content />
						</RichTextEditor>
					)}

					<Divider my="md" />
					<Group align="center" gap="xs">
						<FaMapLocationDot size={16} />
						<Text fw={600}>{event?.location}</Text>
					</Group>

					{event?.location && (
						<Box
							mt="md"
							style={{
								height: '300px',
								overflow: 'hidden',
								borderRadius: '10px',
							}}
						>
							<LoadScript
								googleMapsApiKey={config.GOOGLE_API}
								onLoad={handleApiLoaded}
							>
								<GoogleMap
									mapContainerStyle={{ width: '100%', height: '100%' }}
									center={marker || { lat: 0, lng: 0 }}
									zoom={15}
								>
									{marker && <Marker position={marker} />}
								</GoogleMap>
							</LoadScript>
						</Box>
					)}
				</Stack>
			</MotionCard>

			<Divider
				my="xl"
				label={t('eventPage.moreFromCompany')}
				labelPosition="center"
			/>
			<MotionCard
				shadow="md"
				radius="xl"
				withBorder
				p="xl"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, ease: 'easeOut' }}
			>
				<CarouselEvent events={companyEvents?.data} delay={2000} />
			</MotionCard>

			<Divider my="xl" label={t('eventPage.seeMore')} labelPosition="center" />
			<MotionCard
				shadow="md"
				radius="xl"
				withBorder
				p="xl"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, ease: 'easeOut' }}
			>
				<CarouselEvent events={similarEvents} delay={3000} />
			</MotionCard>

			<MotionCard mt="xl">
				<SocialShareButtons
					url={`http://localhost:4200/events/${event.id}`}
					title={event.title}
				/>
			</MotionCard>

			<MotionCard mt="xl">
				<CommentSection event={event} />
			</MotionCard>

			<Footer />
			<EventDeleteModal
				opened={deleteEvent}
				onClose={() => setDeleteEvent(false)}
				event={event}
				companyId={event.company.id}
			/>
		</Container>
	)
}

export default React.memo(EventPage)
