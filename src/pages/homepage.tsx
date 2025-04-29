import React, { useRef } from 'react'

import {
	Box,
	Center,
	Container,
	Divider,
	Flex,
	Group,
	Loader,
	Stack,
	Text,
	Title,
} from '@mantine/core'
import { Carousel } from '@mantine/carousel'
import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useTranslation } from 'react-i18next'
import Autoplay from 'embla-carousel-autoplay'

import CompanyCard from '@/components/company/company-card'
import CarouselEvent from '@/components/general/carousel-event'
import Footer from '@/components/general/footer'
import MainHeader from '@/components/general/main-header'
import { useResponsive } from '@/hooks/use-responsive'
import { apiClient } from '@/shared/api/axios'
import { CompaniesResponse } from '@/shared/types/companies'
import { EventsResponse } from '@/shared/types/events'

import classes from '@/shared/styles/slider.module.css'

const Homepage: React.FC = () => {
	const { isMobile } = useResponsive()
	const autoplayCompanies = useRef(Autoplay({ delay: 2400 }))
	const { t } = useTranslation()

	const { data: eventsData, isLoading: isLoadingEvents } = useQuery({
		queryKey: ['homepage-events'],
		queryFn: async (): Promise<EventsResponse> => {
			const { data } = await apiClient('/events', {
				params: {
					page: 1,
					limit: 30,
					format: ['CONFERENCE', 'LECTURE', 'OTHER'],
				},
			})
			return data
		},
	})

	const { data: eventsUpcomingData, isLoading: isLoadingUpcomingEvents } =
		useQuery<EventsResponse, AxiosError>({
			queryKey: ['homepage-events'],
			queryFn: async (): Promise<EventsResponse> => {
				const endDate = new Date(
					new Date().getTime() + 7 * 24 * 60 * 60 * 1000
				).toISOString()

				const { data } = await apiClient('/events', {
					params: {
						page: 1,
						limit: 30,
						startDate: new Date().toISOString(),
						endDate,
					},
				})

				return data
			},
			throwOnError: (error) => {
				return (error.response?.status ?? 0) >= 500
			},
		})

	const { data: companiesData, isLoading: isLoadingCompanies } = useQuery({
		queryKey: ['homepage-companies'],
		queryFn: async (): Promise<CompaniesResponse> => {
			const { data } = await apiClient('/companies', {
				params: {
					page: 1,
					limit: 10,
				},
			})
			return data
		},
	})

	if (isLoadingEvents || isLoadingCompanies || isLoadingUpcomingEvents) {
		return (
			<Center h="100vh">
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
		<Container size="xl" pt="md" h="100vh">
			<Stack justify="space-between" h="100%">
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
					{t('homepage.welcomeMessage')}
				</Text>

				<Title order={3} mt="xl" mb="xs">
					{t('homepage.popularCompanies')}
				</Title>
				{(companiesData?.data?.length ?? 0) < 4 && !isMobile ? (
					<Flex gap="md" direction="row" wrap="nowrap">
						{companiesData?.data.map((company) => (
							<Box key={company.id} style={{ flex: '0 0 25%' }}>
								<CompanyCard company={company} />
							</Box>
						))}
					</Flex>
				) : (
					<Carousel
						slideSize={isMobile ? '100%' : '25%'}
						slideGap="md"
						loop={(companiesData?.data?.length ?? 0) > 4}
						withControls={(companiesData?.data?.length ?? 0) > 4}
						align="start"
						draggable
						classNames={classes}
						plugins={[autoplayCompanies.current]}
						onMouseEnter={() => autoplayCompanies.current.stop()}
						onMouseLeave={() => autoplayCompanies.current.play()}
					>
						{companiesData?.data.map((company) => (
							<Carousel.Slide key={company.id}>
								<CompanyCard company={company} />
							</Carousel.Slide>
						))}
					</Carousel>
				)}

				<Title order={3} mb="xs" mt="lg">
					{t('homepage.comingSoon')}
				</Title>
				{eventsUpcomingData?.data.length ? (
					<CarouselEvent delay={2000} events={eventsUpcomingData.data} />
				) : (
					<Text>{t('homepage.noUpcomingEvents')}</Text>
				)}

				<Title order={3} mb="xs" mt="lg">
					{t('homepage.conferences')}
				</Title>
				{eventCategories.conference?.length ? (
					<CarouselEvent delay={2300} events={eventCategories.conference} />
				) : (
					<Text>{t('homepage.noConferenceEvents')}</Text>
				)}

				<Group>
					<Title order={3} mb="xs" mt="lg">
						{t('homepage.lectures')}
					</Title>
					<Divider />
				</Group>

				{eventCategories.lecture?.length ? (
					<CarouselEvent delay={1900} events={eventCategories.lecture} />
				) : (
					<Text>{t('homepage.noLectureEvents')}</Text>
				)}

				<Title order={3} mb="xs" mt="lg">
					{t('homepage.otherEvents')}
				</Title>
				{eventCategories.other?.length ? (
					<CarouselEvent delay={2600} events={eventCategories.other} />
				) : (
					<Text>{t('homepage.noOtherEvents')}</Text>
				)}

				<Footer />
			</Stack>
		</Container>
	)
}

export default React.memo(Homepage)
