import LanguageSwitcher from '@/components/buttons/language-switcher'
import ThemeSwitch from '@/components/buttons/theme-switch'
import CompanyCard from '@/components/company/company-card'
import EventCard from '@/components/event/event-card'
import { apiClient } from '@/shared/api/axios'
import classes from '@/shared/styles/slider.module.css'
import { CompaniesResponse } from '@/shared/types/companies'
import { EventsResponse } from '@/shared/types/events'
import { Carousel } from '@mantine/carousel'
import {
	Avatar,
	Button,
	Center,
	Container,
	Group,
	Input,
	Loader,
	Text,
	Title,
} from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import Autoplay from 'embla-carousel-autoplay'
import React, { useRef } from 'react'
import { useNavigate } from 'react-router'

const Homepage: React.FC = () => {
	const autoplayCompanies = useRef(Autoplay({ delay: 2400 }))
	const autoplayEvents = useRef(Autoplay({ delay: 2000 }))
	const navigate = useNavigate()

	const { data: eventsData, isLoading: isLoadingEvents } = useQuery({
		queryKey: ['homepage-events'],
		queryFn: async (): Promise<EventsResponse> => {
			const { data } = await apiClient('/events?page=1&limit=10')
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

	if (isLoadingEvents || isLoadingCompanies) {
		return (
			<Center py="xl">
				<Loader />
			</Center>
		)
	}

	return (
		<Container size="xl" py="md">
			<header>
				<Group justify="space-between" mb="lg">
					<Text fw={600} size="xl">
						Gather Flow
					</Text>
					<Center>
						<Button variant="subtle" onClick={() => navigate('/home')}>
							Home
						</Button>
						<Button variant="subtle" onClick={() => navigate('/events')}>
							Events
						</Button>
						<Button variant="subtle" onClick={() => navigate('/companies')}>
							Companies
						</Button>
					</Center>
					<Group>
						<Input placeholder="Search..." />
						<ThemeSwitch />
						<LanguageSwitcher />
						<Avatar />
					</Group>
				</Group>
			</header>

			<Title order={3} mb="xs">
				Trending Events
			</Title>
			<Carousel
				slideSize="100%"
				slideGap="md"
				loop
				withControls
				align="start"
				draggable
				plugins={[autoplayEvents.current]}
				onMouseEnter={autoplayEvents.current.stop}
				onMouseLeave={autoplayEvents.current.reset}
				classNames={classes}
			>
				{eventsData?.data.map((event) => (
					<Carousel.Slide key={event.id}>
						<EventCard event={event} />
					</Carousel.Slide>
				))}
			</Carousel>

			<Title order={3} mt="xl" mb="xs">
				Popular Companies
			</Title>
			<Carousel
				slideSize="100%"
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
		</Container>
	)
}

export default React.memo(Homepage)
