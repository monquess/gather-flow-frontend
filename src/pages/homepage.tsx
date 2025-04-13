import LanguageSwitcher from '@/components/buttons/language-switcher'
import ThemeSwitch from '@/components/buttons/theme-switch'
import EventCard from '@/components/events/event-card'
import { apiClient } from '@/shared/api/axios'
import { EventsResponse } from '@/shared/types/events'
import {
	Avatar,
	Center,
	Container,
	Group,
	Input,
	Loader,
	Pagination,
	SimpleGrid,
	Text,
} from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'

const Homepage: React.FC = () => {
	const [page, setPage] = useState(1)

	const fetchEvents = async (page: number): Promise<EventsResponse> => {
		const { data } = await apiClient(`/events?page=${page}&limit=15`)
		return data
	}

	const { data, isLoading, error } = useQuery({
		queryKey: ['events', page],
		queryFn: () => fetchEvents(page),
	})

	if (isLoading)
		return (
			<Center>
				<Loader />
			</Center>
		)
	if (error)
		return (
			<Center>
				<Text>Error loading events</Text>
			</Center>
		)

	return (
		<Container size="xl" py="md">
			<header>
				<Group justify="space-between" mb="md">
					<Text fw={600} size="xl">
						Gather Flow
					</Text>
					<Group>
						<Input placeholder="Search events..." />
						<ThemeSwitch />
						<LanguageSwitcher />
						<Avatar />
					</Group>
				</Group>
			</header>

			<SimpleGrid
				cols={{ base: 1, sm: 2, md: 3 }}
				spacing="lg"
				verticalSpacing="xl"
			>
				{data?.data.map((event) => (
					<EventCard key={event.id} event={event} />
				))}
			</SimpleGrid>

			<Center mt="xl" p="center">
				<Pagination
					total={data?.meta.pageCount || 1}
					value={page}
					onChange={setPage}
					size="md"
					radius="xl"
				/>
			</Center>
		</Container>
	)
}

export default React.memo(Homepage)
