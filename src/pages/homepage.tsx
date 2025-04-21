import CompanyCard from '@/components/company/company-card'
import CarouselEvent from '@/components/general/carousel-event'
import Footer from '@/components/general/footer'
import MainHeader from '@/components/general/main-header'
import { apiClient } from '@/shared/api/axios'
import classes from '@/shared/styles/slider.module.css'
import { CompaniesResponse } from '@/shared/types/companies'
import { EventsResponse } from '@/shared/types/events'
import { Carousel } from '@mantine/carousel'
import { Center, Container, Loader, Text, Title } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import Autoplay from 'embla-carousel-autoplay'
import React, { useRef } from 'react'

const Homepage: React.FC = () => {
	const autoplayCompanies = useRef(Autoplay({ delay: 2400 }))

	const { data: eventsData, isLoading: isLoadingEvents } = useQuery({
		queryKey: ['homepage-events'],
		queryFn: async (): Promise<EventsResponse> => {
			const { data } = await apiClient(
				`/events?page=1&limit=30&formats=CONFERENCE,LECTURE,OTHER`
			)
			return data
		},
	})

	const { data: eventsUpcomingData, isLoading: isLoadingUpcomingEvents } =
		useQuery({
			queryKey: ['homepage-events'],
			queryFn: async (): Promise<EventsResponse> => {
				const now = new Date()
				const startDate = now.toISOString()
				const endDate = new Date(
					now.getTime() + 7 * 24 * 60 * 60 * 1000
				).toISOString()

				const { data } = await apiClient(
					`/events?page=1&limit=30&startDate=${startDate}&endDate=${endDate}`
				)
				return data
			},
		})

	const { data: companiesData, isLoading: isLoadingCompanies } = useQuery({
		queryKey: ['homepage-companies'],
		queryFn: async (): Promise<CompaniesResponse> => {
			const { data } = await apiClient('/companies?page=1&limit=10')
			return data
		},
	})

	if (isLoadingEvents || isLoadingCompanies || isLoadingUpcomingEvents) {
		return (
			<Center py="xl">
				<Loader size="xl" />
			</Center>
		)
	}

	const eventCategories = {
		conference: eventsData?.data.filter(
			(event) => event.format === 'CONFERENCE'
		),
		lecture: eventsData?.data.filter((event) => event.format === 'LECTURE'),
		other: eventsData?.data.filter((event) => event.format === 'OTHER'),
	}

	return (
		<Container size="xl" py="md">
			<MainHeader />

			<Text
				size="lg"
				mb="xl"
				style={{
					fontWeight: 600,
					fontSize: '1.2rem',
					lineHeight: '1.6',
					color: 'linear-gradient(135deg, #6c5ce7, #00b894)',
					backgroundClip: 'text',
					textFillColor: 'transparent',
					textShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
					padding: '0 15px',
					maxWidth: '700px',
					margin: '0 auto',
					letterSpacing: '0.5px',
				}}
			>
				Welcome to our platform! Here you'll find the most relevant and exciting
				events, as well as get to know popular companies that are driving
				innovation. Join us and don't miss the chance to be at the heart of the
				most important happenings!
			</Text>

			<Title order={3} mt="xl" mb="xs">
				Popular Companies
			</Title>
			<Carousel
				slideSize="33.333333%"
				slideGap="md"
				loop
				withControls
				align="start"
				draggable
				classNames={classes}
				plugins={[autoplayCompanies.current]}
				onMouseEnter={autoplayCompanies.current.stop}
				onMouseLeave={autoplayCompanies.current.reset}
			>
				{companiesData?.data.map((company) => (
					<Carousel.Slide key={company.id}>
						<CompanyCard company={company} />
					</Carousel.Slide>
				))}
			</Carousel>

			<Title order={3} mb="xs" mt="lg">
				Coming Soon
			</Title>
			{eventsUpcomingData?.data.length ? (
				<CarouselEvent events={eventsUpcomingData.data} />
			) : (
				<Text>No upcoming events at the moment.</Text>
			)}

			<Title order={3} mb="xs" mt="lg">
				Conferences
			</Title>
			{eventCategories.conference?.length ? (
				<CarouselEvent events={eventCategories.conference} />
			) : (
				<Text>No conference events available.</Text>
			)}

			<Title order={3} mb="xs" mt="lg">
				Lectures
			</Title>
			{eventCategories.lecture?.length ? (
				<CarouselEvent events={eventCategories.lecture} />
			) : (
				<Text>No lecture events available.</Text>
			)}

			<Title order={3} mb="xs" mt="lg">
				Other Events
			</Title>
			{eventCategories.other?.length ? (
				<CarouselEvent events={eventCategories.other} />
			) : (
				<Text>No other events available.</Text>
			)}

			<Footer />
		</Container>
	)
}

export default React.memo(Homepage)
