import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
	ActionIcon,
	Box,
	Button,
	Checkbox,
	Divider,
	FileButton,
	Flex,
	Group,
	Image,
	NumberInput,
	Radio,
	Select,
	Stack,
	Text,
	TextInput,
	Tooltip,
} from '@mantine/core'
import { DateTimePicker } from '@mantine/dates'
import { useForm, zodResolver } from '@mantine/form'
import {
	Autocomplete,
	GoogleMap,
	Libraries,
	LoadScript,
	Marker,
} from '@react-google-maps/api'
import { HiOutlineTicket } from 'react-icons/hi2'
import { MdCalendarToday } from 'react-icons/md'
import { FaMapLocationDot } from 'react-icons/fa6'
import { IoIosSearch, IoMdImages } from 'react-icons/io'

import MarkdownEditor from '@/components/editor/markdown-editor'
import { config } from '@/shared/config/config'
import { useResponsive } from '@/hooks/use-responsive'
import { apiClient, ApiError } from '@/shared/api/axios'
import { showNotification } from '@/shared/helpers/show-notification'
import { Event } from '@/shared/types'
import { createEventSchema } from '@/shared/validations'

import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

dayjs.extend(duration)

const containerStyle = {
	width: '100%',
	height: '300px',
	borderRadius: '8px',
	overflow: 'hidden',
}

const mapLibraries: Libraries = ['places']

const getPosterUrl = (file?: File): string => {
	return file ? URL.createObjectURL(file) : config.DEFAULT_POSTER_URL
}

interface UpdateEventFormProps {
	event: Event
}

const UpdateEventForm: React.FC<UpdateEventFormProps> = ({ event }) => {
	const navigate = useNavigate()
	const { isMobile } = useResponsive()

	const [autoKey, setAutoKey] = useState(0)
	const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(
		null
	)
	const [autocomplete, setAutocomplete] =
		useState<google.maps.places.Autocomplete | null>(null)

	const form = useForm({
		mode: 'controlled',
		validate: zodResolver(createEventSchema),
		initialValues: {
			title: event.title,
			description: event.description,
			format: event.format,
			theme: event.theme,
			location: event.location,
			ticketPrice: event.ticketPrice,
			ticketsQuantity: event.ticketsQuantity,
			visitorsVisibility: event.visitorsVisibility,
			startDate: new Date(event.startDate),
			endDate: new Date(event.endDate),
			publishDate: event.publishDate ? new Date(event.publishDate) : null,
			poster: undefined,
			notifyOnAttendee: event.notifyOnAttendee,
		},
	})
	const [isPublishLater, setIsPublishLater] = useState(
		event.publishDate !== null
	)

	const handleMapClick = (e: google.maps.MapMouseEvent) => {
		const lat = e.latLng?.lat()
		const lng = e.latLng?.lng()

		if (lat && lng) {
			const geocoder = new window.google.maps.Geocoder()
			geocoder.geocode({ location: { lat, lng } }, (results, status) => {
				if (status === 'OK' && results && results[0]) {
					setMarker({ lat, lng })
					form.setFieldValue('location', results[0].formatted_address)
				}
			})
		}
	}

	const onLoadAutocomplete = (auto: google.maps.places.Autocomplete) => {
		setAutocomplete(auto)
	}

	const onPlaceChanged = () => {
		if (autocomplete !== null) {
			const { geometry, formatted_address } = autocomplete.getPlace()
			const lat = geometry?.location?.lat()
			const lng = geometry?.location?.lng()

			if (lat && lng && formatted_address) {
				form.setFieldValue('location', formatted_address)
				setMarker({ lat, lng })
			}
		}
	}

	const handleLocationChange = (value: string) => {
		form.setFieldValue('location', value)
		if (value === '') {
			setAutoKey((prev) => prev + 1)
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!form.validate().hasErrors) {
			try {
				const { startDate, endDate, publishDate, ...values } = form.getValues()
				const body = {
					...values,
					startDate: startDate?.toISOString(),
					endDate: endDate?.toISOString(),
					publishDate: publishDate?.toISOString(),
				}

				await apiClient.patch(
					`/companies/${event.company.id}/events/${event.id}`,
					body,
					{
						headers: {
							'Content-Type': 'multipart/form-data',
						},
					}
				)

				navigate(`/events/${event.id}`)
			} catch (error) {
				if (error instanceof ApiError && error.response) {
					showNotification('Error', error.response.data.message, 'red')
				}
			}
		}
	}

	return (
		<form onSubmit={handleSubmit}>
			<Stack gap="sm">
				<Box w="100%" h="300px">
					<Box pos="relative" w="100%" h="100%" mb="md">
						<Image
							src={getPosterUrl(form.values.poster)}
							alt="Poster preview"
							width="100%"
							height="100%"
							style={{ objectFit: 'cover', borderRadius: '8px' }}
						/>

						<FileButton
							key={form.key('poster')}
							{...form.getInputProps('poster')}
							accept="image/png,image/jpeg,image/jpg,image/webp"
						>
							{(props) => (
								<Tooltip label="Upload poster" withArrow>
									<ActionIcon
										{...props}
										variant="outline"
										size="lg"
										style={{
											position: 'absolute',
											right: 12,
											bottom: 12,
											zIndex: 2,
										}}
									>
										<IoMdImages size={20} />
									</ActionIcon>
								</Tooltip>
							)}
						</FileButton>
					</Box>
				</Box>

				<TextInput
					mt="lg"
					label="Title"
					placeholder="Enter event title"
					size={isMobile ? 'sm' : 'md'}
					key={form.key('title')}
					{...form.getInputProps('title')}
				/>

				<Flex gap="xs" direction={isMobile ? 'column' : 'row'}>
					<Select
						label="Format"
						placeholder="Choose event format"
						data={['CONFERENCE', 'LECTURE', 'WORKSHOP', 'FEST', 'OTHER']}
						key={form.key('format')}
						{...form.getInputProps('format')}
						clearable
						flex={1}
					/>
					<Select
						label="Theme"
						placeholder="Select a theme"
						data={['BUSINESS', 'POLITICS', 'PSYCHOLOGY', 'OTHER']}
						key={form.key('theme')}
						{...form.getInputProps('theme')}
						clearable
						flex={1}
					/>
				</Flex>

				<MarkdownEditor
					value={form.values.description}
					placeholder="Describe the event"
					onChange={(value) => form.setFieldValue('description', value)}
				/>

				<Radio.Group
					label="Visitors visibility"
					description="Choose who can see the participants of the future event"
					value={form.values.visitorsVisibility}
					error={form.errors.visitorsVisibility}
					onChange={(value) => {
						form.setFieldValue('visitorsVisibility', value)
					}}
				>
					<Group mt="xs">
						<Radio value="EVERYONE" label="Everyone" />
						<Radio value="VISITOR" label="Participants" />
					</Group>
				</Radio.Group>

				<Divider
					mt="xs"
					labelPosition="left"
					label={
						<>
							<FaMapLocationDot size={16} />
							<Text ml={5}>Location</Text>
						</>
					}
				/>
				<LoadScript
					googleMapsApiKey={config.GOOGLE_API}
					libraries={mapLibraries}
				>
					<Autocomplete
						key={autoKey}
						onLoad={onLoadAutocomplete}
						onPlaceChanged={onPlaceChanged}
					>
						<TextInput
							placeholder="Search for a venue"
							size={isMobile ? 'sm' : 'md'}
							leftSection={<IoIosSearch />}
							value={form.values.location}
							onChange={(e) => handleLocationChange(e.currentTarget.value)}
							error={form.errors.location}
						/>
					</Autocomplete>

					<div style={{ marginTop: '16px' }}>
						<GoogleMap
							mapContainerStyle={containerStyle}
							center={marker || { lat: -33.860664, lng: 151.208138 }}
							zoom={marker ? 14 : 10}
							onClick={handleMapClick}
						>
							{marker && <Marker position={marker} />}
						</GoogleMap>
					</div>
				</LoadScript>

				<Divider
					mt="xs"
					labelPosition="left"
					label={
						<>
							<HiOutlineTicket size={20} />
							<Text ml={5}>Tickets</Text>
						</>
					}
				/>
				<Flex direction={isMobile ? 'column' : 'row'} gap="sm">
					<NumberInput
						label="Price"
						placeholder="Set ticket price"
						size={isMobile ? 'sm' : 'md'}
						key={form.key('ticketPrice')}
						min={0}
						suffix="$"
						{...form.getInputProps('ticketPrice')}
						flex={1}
					/>
					<NumberInput
						label="Quantity"
						placeholder="How many tickets?"
						size={isMobile ? 'sm' : 'md'}
						key={form.key('ticketsQuantity')}
						min={0}
						decimalScale={0}
						{...form.getInputProps('ticketsQuantity')}
						flex={1}
					/>
				</Flex>

				<Divider
					mt="xs"
					labelPosition="left"
					label={
						<>
							<MdCalendarToday size={16} />
							<Text ml={5}>Date</Text>
						</>
					}
				/>
				<Flex direction={isMobile ? 'column' : 'row'} gap="sm">
					<DateTimePicker
						label="Start"
						placeholder="Select event start date and time"
						minDate={dayjs()
							.add(dayjs.duration({ days: 1 }))
							.toDate()}
						size={isMobile ? 'sm' : 'md'}
						key={form.key('startDate')}
						{...form.getInputProps('startDate')}
						flex={1}
					/>
					<DateTimePicker
						label="End"
						placeholder="Select event end date and time"
						minDate={dayjs(new Date(form.values.startDate))
							.add(dayjs.duration({ hours: 1 }))
							.toDate()}
						size={isMobile ? 'sm' : 'md'}
						key={form.key('endDate')}
						{...form.getInputProps('endDate')}
						flex={1}
					/>
				</Flex>

				<Checkbox
					checked={isPublishLater}
					onChange={() => {
						if (isPublishLater) {
							form.setFieldValue('publishDate', null)
						}
						setIsPublishLater((prev) => !prev)
					}}
					label="Publish later"
				/>
				{isPublishLater && (
					<DateTimePicker
						label="Publish date"
						placeholder="Choose when to publish"
						minDate={new Date()}
						maxDate={dayjs(new Date(form.values.startDate))
							.subtract(dayjs.duration({ days: 1 }))
							.toDate()}
						size={isMobile ? 'sm' : 'md'}
						key={form.key('publishDate')}
						{...form.getInputProps('publishDate')}
					/>
				)}

				<Checkbox
					size="md"
					mt="md"
					radius="md"
					label="Notify on new attendees"
					description="You'll receive an email when a new attendee joins"
					key={form.key('notifyOnAttendee')}
					{...form.getInputProps('notifyOnAttendee')}
				/>

				<Group justify="flex-end" mt="md">
					<Button
						variant="outline"
						size={isMobile ? 'sm' : 'md'}
						onClick={() => navigate(-1)}
					>
						Cancel
					</Button>
					<Button type="submit" size={isMobile ? 'sm' : 'md'}>
						Update
					</Button>
				</Group>
			</Stack>
		</form>
	)
}

export default React.memo(UpdateEventForm)
