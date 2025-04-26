import EventCard from '@/components/event/event-card'
import Footer from '@/components/general/footer'
import MainHeader from '@/components/general/main-header'
import { apiClient } from '@/shared/api/axios'
import { EventsResponse } from '@/shared/types/events'
import {
	Accordion,
	Box,
	Button,
	Center,
	Container,
	Group,
	Loader,
	Pagination,
	Select,
	SimpleGrid,
	Stack,
	Text,
	TextInput,
} from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'

const EventsPage: React.FC = () => {
	const [searchParams, setSearchParams] = useSearchParams()

	const page = Number(searchParams.get('page')) || 1
	const limit = Number(searchParams.get('limit')) || 15
	const title = searchParams.get('query') || ''
	const format = searchParams.get('format') || ''
	const theme = searchParams.get('theme') || ''
	const startDate = searchParams.get('startDate') || ''
	const endDate = searchParams.get('endDate') || ''

	const [titleInput, setTitleInput] = useState(title)
	const [formatInput, setFormatInput] = useState<string | null>(format || null)
	const [themeInput, setThemeInput] = useState<string | null>(theme || null)
	const [startDateInput, setStartDateInput] = useState<Date | null>(
		startDate ? new Date(startDate) : null
	)
	const [endDateInput, setEndDateInput] = useState<Date | null>(
		endDate ? new Date(endDate) : null
	)
	const [limitInput, setLimitInput] = useState(limit.toString())

	const fetchEvents = async (): Promise<EventsResponse> => {
		const params = new URLSearchParams({
			page: page.toString(),
			limit: limitInput,
		})

		if (title) params.set('query', title)
		if (format) params.set('format', format)
		if (theme) params.set('theme', theme)
		if (startDate) params.set('startDate', startDate)
		if (endDate) params.set('endDate', endDate)

		const { data } = await apiClient(`/events?${params.toString()}`)
		return data
	}

	const { data, isLoading, error } = useQuery({
		queryKey: ['events', searchParams.toString()],
		queryFn: fetchEvents,
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
		<Container size="xl" pt="md">
			<Stack justify="space-between">
				<MainHeader />

				<Stack mb="xl">
					<Accordion variant="contained">
						<Accordion.Item value="advanced">
							<Accordion.Control>Search & Filters</Accordion.Control>
							<Accordion.Panel>
								<Stack>
									<TextInput
										label="Event Title"
										placeholder="Search by title..."
										value={titleInput}
										onChange={(e) => setTitleInput(e.currentTarget.value)}
									/>

									<Group grow>
										<Select
											label="Format"
											placeholder="Select format"
											data={[
												'CONFERENCE',
												'LECTURE',
												'WORKSHOP',
												'FEST',
												'OTHER',
											]}
											value={formatInput}
											onChange={setFormatInput}
											clearable
										/>

										<Select
											label="Theme"
											placeholder="Select theme"
											data={['BUSINESS', 'POLITICS', 'PSYCHOLOGY', 'OTHER']}
											value={themeInput}
											onChange={setThemeInput}
											clearable
										/>
									</Group>
									<Group grow>
										<DatePickerInput
											label="Start Date"
											value={startDateInput}
											onChange={setStartDateInput}
										/>
										<DatePickerInput
											label="End Date"
											value={endDateInput}
											onChange={setEndDateInput}
										/>
									</Group>
									<Group align="flex-end">
										<Button
											onClick={() => {
												const params = new URLSearchParams()
												if (titleInput) params.set('query', titleInput)
												if (formatInput) params.set('format', formatInput)
												if (themeInput) params.set('theme', themeInput)
												if (startDateInput)
													params.set('startDate', startDateInput.toISOString())
												if (endDateInput)
													params.set('endDate', endDateInput.toISOString())
												params.set('limit', limitInput)
												params.set('page', '1')
												setSearchParams(params)
											}}
										>
											Filter
										</Button>
									</Group>
								</Stack>
							</Accordion.Panel>
						</Accordion.Item>
					</Accordion>

					<Group justify="space-between">
						<Button
							variant="light"
							onClick={() => {
								setTitleInput('')
								setFormatInput(null)
								setThemeInput(null)
								setStartDateInput(null)
								setEndDateInput(null)
								setLimitInput('15') // Reset limit
								setSearchParams(new URLSearchParams())
							}}
						>
							Clear All Filters
						</Button>
						<Select
							placeholder="Select Limit"
							data={['5', '15', '30']}
							value={limitInput}
							onChange={(value) => {
								if (value) {
									setLimitInput(value)
									const params = new URLSearchParams(searchParams)
									params.set('limit', value)
									setSearchParams(params)
								}
							}}
							w="75px"
						/>
					</Group>
				</Stack>

				<SimpleGrid
					cols={{ base: 1, sm: 2, md: 3 }}
					spacing="lg"
					verticalSpacing="xl"
				>
					{data?.data.map((event) => (
						<EventCard key={event.id} event={event} />
					))}
				</SimpleGrid>

				{data?.meta?.pageCount && data.meta.pageCount > 1 && (
					<Center mt="xl">
						<Pagination
							total={data.meta.pageCount || 1}
							value={page}
							onChange={(newPage) => {
								const newParams = new URLSearchParams(searchParams)
								newParams.set('page', newPage.toString())
								setSearchParams(newParams)
							}}
							size="md"
							radius="xl"
						/>
					</Center>
				)}
				<Box pt="lg">
					<Footer />
				</Box>
			</Stack>
		</Container>
	)
}

export default React.memo(EventsPage)
