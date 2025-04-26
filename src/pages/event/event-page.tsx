import CarouselEvent from '@/components/general/carousel-event'
import Footer from '@/components/general/footer'
import MainHeader from '@/components/general/main-header'
import { config } from '@/config/config'
import { apiClient } from '@/shared/api/axios'
import { EventItem } from '@/shared/types/events'
import {
	Badge,
	Box,
	Button,
	Card,
	CardProps,
	Center,
	Container,
	Divider,
	Flex,
	Group,
	Image,
	Loader,
	Stack,
	Text,
	TextInput,
	Title,
} from '@mantine/core'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { motion } from 'framer-motion'
import React, { forwardRef, useEffect, useState } from 'react'
import { MdCalendarToday } from 'react-icons/md'
import { useParams } from 'react-router-dom'

const MotionCard = motion(
	forwardRef<HTMLDivElement, CardProps>((props, ref) => (
		<Card ref={ref} withBorder radius="md" shadow="md" p="md" {...props} />
	))
)

const EventPage: React.FC = () => {
	const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(
		null
	)
	const [isMapLoaded, setIsMapLoaded] = useState(false)
	const { id } = useParams()

	const fetchEvent = async (): Promise<EventItem> => {
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

	const fetchEventFromCompany = async (): Promise<EventItem[]> => {
		const { data } = await apiClient(`/companies/${event?.company.id}/events`)
		return data
	}

	const {
		data: companyEvents,
		isLoading: isLoadingCompanyEvents,
		error: errorCompanyEvents,
	} = useQuery({
		queryKey: ['companyEvents', event?.id],
		queryFn: fetchEventFromCompany,
		enabled: !!event?.company.id,
	})

	const fetchSimilarEvent = async (): Promise<EventItem[]> => {
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

	if (error || errorCompanyEvents || errorSimilarEvents) {
		return (
			<Center h="100vh">
				<Text c="red">Error loading event</Text>
			</Center>
		)
	}

	return (
		<Container size="xl" pt="md">
			<MainHeader />

			<Flex gap="md" mt="xl" wrap="wrap">
				<Box flex={2} miw={0}>
					<MotionCard
						shadow="lg"
						radius="xl"
						withBorder
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, ease: 'easeOut' }}
					>
						<Card.Section>
							<Image
								src={event?.poster}
								height={300}
								alt={event?.title}
								style={{ objectFit: 'cover' }}
							/>
						</Card.Section>
						<Stack mt="md" gap="xs">
							<Title order={2} lineClamp={2}>
								{event?.title}
							</Title>

							<Group mt="xs" gap="sm">
								<Badge variant="light" size="md">
									{event?.format}
								</Badge>
								<Group gap="xs" align="center">
									<MdCalendarToday size={18} />
									<Text size="sm">
										{dayjs(event?.startDate).format('DD MMM YYYY')}
									</Text>
								</Group>
							</Group>
						</Stack>
					</MotionCard>
				</Box>

				<Box flex={1} miw={280}>
					<MotionCard
						shadow="lg"
						radius="xl"
						withBorder
						p="xl"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, ease: 'easeOut' }}
					>
						<Stack>
							<Title order={3}>Buy Ticket</Title>
							<Text fw={500}>Price: $200</Text>

							<TextInput label="Promocode" placeholder="Enter your code" />

							<Button fullWidth color="green" mt="sm" size="md">
								Buy Now
							</Button>
						</Stack>
					</MotionCard>
				</Box>
			</Flex>

			<Divider my="xl" label="About Event" labelPosition="center" />

			<MotionCard
				shadow="lg"
				radius="xl"
				withBorder
				p="xl"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, ease: 'easeOut' }}
			>
				<Stack>
					<Text size="sm" c="dimmed">
						{event?.description}
					</Text>

					<Divider my="md" />

					<Text fw={600}>Location: {event?.location}</Text>

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

			<Divider my="xl" label="More from this company" labelPosition="center" />

			<MotionCard
				shadow="lg"
				radius="xl"
				withBorder
				p="xl"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, ease: 'easeOut' }}
			>
				<CarouselEvent events={companyEvents} delay={2000} />
			</MotionCard>

			<Divider my="xl" label="Similar events" labelPosition="center" />

			<MotionCard
				shadow="lg"
				radius="xl"
				withBorder
				p="xl"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, ease: 'easeOut' }}
			>
				<CarouselEvent events={similarEvents} delay={3000} />
			</MotionCard>

			<Footer />
		</Container>
	)
}

export default React.memo(EventPage)
