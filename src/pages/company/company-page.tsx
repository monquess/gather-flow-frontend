import CarouselEvent from '@/components/general/carousel-event'
import MainHeader from '@/components/general/main-header'
import { config } from '@/config/config'
import { apiClient } from '@/shared/api/axios'
import { CompanyItem } from '@/shared/types/companies'
import { EventsResponse } from '@/shared/types/events'
import {
	Box,
	Card,
	Center,
	Container,
	Divider,
	Group,
	Loader,
	Stack,
	Text,
	Title,
} from '@mantine/core'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const MotionCard = motion.div

const CompanyPage: React.FC = () => {
	const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(
		null
	)
	const [isMapLoaded, setIsMapLoaded] = useState(false)
	const { id } = useParams()

	const fetchCompany = async (): Promise<CompanyItem> => {
		const { data } = await apiClient(`/companies/${id}`)
		return data
	}

	const fetchCompanyEvents = async (): Promise<EventsResponse> => {
		const { data } = await apiClient(`/events?companyId=${id}&limit=30`)
		return data
	}

	const { data, isLoading, error } = useQuery({
		queryKey: ['companies', id],
		queryFn: fetchCompany,
	})

	const {
		data: eventData,
		isLoading: isLoadingEvents,
		error: eventError,
	} = useQuery({
		queryKey: ['events', id],
		queryFn: fetchCompanyEvents,
	})

	const handleApiLoaded = () => {
		setIsMapLoaded(true)
	}

	useEffect(() => {
		if (data?.location && isMapLoaded && window.google?.maps?.Geocoder) {
			const geocoder = new window.google.maps.Geocoder()
			geocoder.geocode({ address: data.location }, (results, status) => {
				if (status === 'OK' && results && results[0]) {
					const location = results[0].geometry.location
					setMarker({
						lat: location.lat(),
						lng: location.lng(),
					})
				}
			})
		}
	}, [data?.location, isMapLoaded])

	if (isLoading) {
		return (
			<Center>
				<Loader />
			</Center>
		)
	}

	if (error) {
		return (
			<Center>
				<Text>Error loading company</Text>
			</Center>
		)
	}

	return (
		<Container size="md" py="xl">
			<MainHeader />
			<MotionCard
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
			>
				<Card shadow="md" padding="lg" radius="lg" withBorder>
					<Stack>
						<Title order={2}>{data?.name}</Title>
						<Text size="sm" c="dimmed">
							{data?.email}
						</Text>
						<Text mt="sm">{data?.description}</Text>
						<Text mt="sm" fw={500}>
							{data?.location}
						</Text>
						{data?.location && (
							<Box mt="md" style={{ height: 300 }}>
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
				</Card>
			</MotionCard>
			<Divider my="xl" label="Company Events" labelPosition="center" />
			<Group grow align="stretch">
				<MotionCard
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3, duration: 0.5 }}
				>
					<Card withBorder radius="md" padding="md" shadow="sm">
						<Title order={4} pb="md">
							Upcoming Event
						</Title>
						{isLoadingEvents ? (
							<Center>
								<Loader size="sm" />
							</Center>
						) : eventError ? (
							<Text c="dimmed">Error loading events</Text>
						) : eventData?.data.length ? (
							<CarouselEvent events={eventData?.data} />
						) : (
							<Text>No upcoming events at the moment.</Text>
						)}
					</Card>
				</MotionCard>
			</Group>
		</Container>
	)
}

export default CompanyPage
