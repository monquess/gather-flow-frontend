import React, { useEffect, useState } from 'react'
import { MdCalendarToday } from 'react-icons/md'
import { useNavigate, useParams } from 'react-router-dom'

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
import { Link, RichTextEditor } from '@mantine/tiptap'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
import { FaArrowRightLong } from 'react-icons/fa6'
import { useQuery } from '@tanstack/react-query'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import dayjs from 'dayjs'

import { MotionCard } from '@/components/general'
import CarouselEvent from '@/components/general/carousel-event'
import Footer from '@/components/general/footer'
import { useTranslation } from 'react-i18next'
import MainHeader from '@/components/general/main-header'
import { config } from '@/config/config'
import { useResponsive } from '@/hooks/use-responsive'
import { apiClient } from '@/shared/api/axios'
import { Event, EventsResponse } from '@/shared/types'
import CommentSection from '@/components/comment/comment-section'

const EventPage: React.FC = () => {
	const { isMobile } = useResponsive()
	const navigate = useNavigate()
	const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(
		null
	)
	const [isMapLoaded, setIsMapLoaded] = useState(false)
	const { id } = useParams()
	const { t } = useTranslation()

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
		extensions: [Link, StarterKit],
		content: event?.description || '',
		editable: false,
	})

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

	if (isLoading || isLoadingCompanyEvents || isLoadingSimilarEvents) {
		return (
			<Center h="100vh">
				<Loader />
			</Center>
		)
	}

	if (!event || error || errorCompanyEvents || errorSimilarEvents) {
		return (
			<Center h="100vh">
				<Text c="red">{t('eventPage.errorLoadingEvent')}</Text>
			</Center>
		)
	}

	return (
		<Container size="xl" pt="md">
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
								<Badge variant="light" size="md">
									{event?.format}
								</Badge>
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
							<Title order={3}>{t('eventPage.buyTicket')}</Title>
							<Text fw={500}>{event.ticketPrice.toFixed(2)} USD</Text>

							<Button
								fullWidth
								color="green"
								mt="sm"
								size="md"
								justify="space-between"
								leftSection={<span />}
								rightSection={<FaArrowRightLong />}
								onClick={() => navigate('checkout')}
							>
								{t('eventPage.buyNow')}
							</Button>
						</Stack>
					</MotionCard>
				</Box>
			</Flex>

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
						<RichTextEditor editor={editor}>
							<RichTextEditor.Content />
						</RichTextEditor>
					)}
					<Text size="sm" c="dimmed">
						{event?.description}
					</Text>

					<Divider my="md" />

					<Text fw={600}>
						{t('eventPage.location')}: {event?.location}
					</Text>

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
				<CommentSection event={event} />
			</MotionCard>

			<Footer />
		</Container>
	)
}

export default React.memo(EventPage)
