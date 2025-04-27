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
	MultiSelect,
	NumberInput,
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
	const format = searchParams.getAll('format') || []
	const theme = searchParams.getAll('theme') || []
	const startDate = searchParams.get('startDate') || ''
	const endDate = searchParams.get('endDate') || ''
	const minPrice = searchParams.get('minPrice') || ''
	const maxPrice = searchParams.get('maxPrice') || ''
	const sort = searchParams.get('sort') || 'title'
	const order = searchParams.get('order') || 'desc'

	const [titleInput, setTitleInput] = useState(title)
	const [minPriceInput, setMinPriceInput] = useState<string | number>(minPrice)
	const [maxPriceInput, setMaxPriceInput] = useState<string | number>(maxPrice)
	const [formatInput, setFormatInput] = useState<string[]>(format)
	const [themeInput, setThemeInput] = useState<string[]>(theme)

	const [startDateInput, setStartDateInput] = useState<Date | null>(
		startDate ? new Date(startDate) : null
	)
	const [endDateInput, setEndDateInput] = useState<Date | null>(
		endDate ? new Date(endDate) : null
	)
	const [limitInput, setLimitInput] = useState(limit.toString())
	const [sortInput, setSortInput] = useState(sort.toString())
	const [orderInput, setOrderInput] = useState(order.toString())

	const fetchEvents = async (): Promise<EventsResponse> => {
		const params = new URLSearchParams({
			page: page.toString(),
			limit: limitInput,
		})

		if (title) params.set('query', title)
		if (startDate) params.set('startDate', startDate)
		if (endDate) params.set('endDate', endDate)
		if (minPrice) params.set('minPrice', minPrice)
		if (maxPrice) params.set('minPrice', maxPrice)
		if (sort) params.set('sort', sort)
		if (order) params.set('order', order)

		format.forEach((format) => {
			params.append('format', format)
		})

		theme.forEach((theme) => {
			params.append('theme', theme)
		})

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
										<MultiSelect
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
											hidePickedOptions
										/>
										<MultiSelect
											label="Theme"
											placeholder="Select theme"
											data={['BUSINESS', 'POLITICS', 'PSYCHOLOGY', 'OTHER']}
											value={themeInput}
											onChange={setThemeInput}
											clearable
											hidePickedOptions
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

									<Group grow>
										<NumberInput
											label="Min Price"
											value={minPriceInput}
											onChange={(value) => setMinPriceInput(value)}
											min={0}
											decimalScale={0}
										/>
										<NumberInput
											label="Max Price"
											value={maxPriceInput}
											onChange={(value) => setMaxPriceInput(value)}
											min={0}
											decimalScale={0}
										/>
									</Group>

									<Group align="flex-end">
										<Button
											onClick={() => {
												const params = new URLSearchParams()
												if (titleInput) params.set('query', titleInput)
												if (startDateInput)
													params.set('startDate', startDateInput.toISOString())
												if (endDateInput)
													params.set('endDate', endDateInput.toISOString())
												params.set('limit', limitInput)
												params.set('page', '1')
												if (minPriceInput)
													params.set('minPrice', minPriceInput.toString())
												if (maxPriceInput)
													params.set('minPrice', maxPriceInput.toString())

												formatInput.forEach((format) => {
													params.append('format', format)
												})

												themeInput.forEach((theme) => {
													params.append('theme', theme)
												})

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
								setFormatInput([])
								setThemeInput([])
								setStartDateInput(null)
								setEndDateInput(null)
								setLimitInput('15')
								setMinPriceInput('')
								setMaxPriceInput('')
								setSearchParams(new URLSearchParams())
							}}
						>
							Clear All Filters
						</Button>

						<Group grow>
							<Select
								data={[
									'title',
									'startDate',
									'endDate',
									'createdAt',
									'ticketPrice',
								]}
								value={sortInput}
								onChange={(value) => {
									if (value) {
										setSortInput(value)
										const params = new URLSearchParams(searchParams)
										params.set('sort', value)
										setSearchParams(params)
									}
								}}
								w="300px"
							/>
							<Select
								data={['asc', 'desc']}
								value={orderInput}
								onChange={(value) => {
									if (value) {
										setOrderInput(value)
										const params = new URLSearchParams(searchParams)
										params.set('order', value)
										setSearchParams(params)
									}
								}}
								w="30px"
							/>
							<Select
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
								w="5px"
							/>
						</Group>
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
