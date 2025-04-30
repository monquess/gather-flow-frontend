import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
	Box,
	Button,
	Checkbox,
	Divider,
	FileInput,
	Group,
	Image,
	NumberInput,
	Select,
	Stack,
	Text,
	TextInput,
} from '@mantine/core'
import { DateTimePicker } from '@mantine/dates'
import { useForm, zodResolver } from '@mantine/form'
import {
	Autocomplete,
	GoogleMap,
	LoadScript,
	Marker,
} from '@react-google-maps/api'
import { IoImageOutline } from 'react-icons/io5'
import { HiOutlineTicket } from 'react-icons/hi2'
import { MdCalendarToday } from 'react-icons/md'
import { FaMapLocationDot } from 'react-icons/fa6'
import { IoIosSearch } from 'react-icons/io'

import MarkdownEditor from '@/components/editor/markdown-editor'
import { config } from '@/shared/config/config'
import { useResponsive } from '@/hooks/use-responsive'
import { apiClient, ApiError } from '@/shared/api/axios'
import { showNotification } from '@/shared/helpers/show-notification'
import { Event } from '@/shared/types/event'
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

const CreateEventForm: React.FC = () => {
	const { id: companyId } = useParams()
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
			title: '',
			description: '',
			format: '',
			theme: '',
			location: '',
			ticketPrice: '',
			ticketsQuantity: '',
			visitorsVisibility: 'EVERYONE',
			startDate: '',
			endDate: '',
			poster: null as File | null,
		},
	})
	const [isPublishLater, setIsPublishLater] = useState(false)

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
		form.validate()

		try {
			const res = await apiClient.post<Event>(
				`/companies/${companyId}/events`,
				form.getValues(),
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				}
			)
			navigate(`/events/${res.data.id}`)
		} catch (error) {
			if (error instanceof ApiError && error.response) {
				showNotification('Error', error.response.data.message, 'red')
			}
		}
	}

	const getPosterUrl = (file: File | null): string => {
		return file ? URL.createObjectURL(file) : config.DEFAULT_POSTER_URL
	}

	return (
		<form onSubmit={handleSubmit}>
			<Stack gap="sm">
				<Box w="100%" h="300px">
					<Image
						src={getPosterUrl(form.values.poster)}
						alt="Poster preview"
						width="100%"
						height="100%"
						style={{ objectFit: 'cover' }}
					/>
				</Box>
				<FileInput
					label="Poster"
					placeholder="Upload image"
					leftSection={<IoImageOutline />}
					accept="image/png,image/jpeg,image/jpg,image/webp"
					clearable
					key={form.key('poster')}
					{...form.getInputProps('poster')}
				/>
				<TextInput
					label="Title"
					placeholder="Enter event title"
					size={isMobile ? 'sm' : 'md'}
					key={form.key('title')}
					{...form.getInputProps('title')}
				/>

				<Group grow>
					<Select
						label="Format"
						placeholder="Choose event format"
						data={['CONFERENCE', 'LECTURE', 'WORKSHOP', 'FEST', 'OTHER']}
						key={form.key('format')}
						{...form.getInputProps('format')}
						clearable
					/>
					<Select
						label="Theme"
						placeholder="Select a theme"
						data={['BUSINESS', 'POLITICS', 'PSYCHOLOGY', 'OTHER']}
						key={form.key('theme')}
						{...form.getInputProps('theme')}
						clearable
					/>
				</Group>

				<MarkdownEditor
					value={form.values.description}
					placeholder="Describe the event"
					onChange={(value) => form.setFieldValue('description', value)}
				/>

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
				<LoadScript googleMapsApiKey={config.GOOGLE_API} libraries={['places']}>
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
				<Group grow>
					<NumberInput
						label="Price, USD"
						placeholder="Set ticket price"
						size={isMobile ? 'sm' : 'md'}
						key={form.key('ticketPrice')}
						min={0}
						{...form.getInputProps('ticketPrice')}
					/>
					<NumberInput
						label="Quantity"
						placeholder="How many tickets?"
						size={isMobile ? 'sm' : 'md'}
						key={form.key('ticketsQuantity')}
						min={0}
						decimalScale={0}
						{...form.getInputProps('ticketsQuantity')}
					/>
				</Group>

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
				<Group grow>
					<DateTimePicker
						label="Start"
						placeholder="Select event start date and time"
						minDate={dayjs()
							.add(dayjs.duration({ hours: 1 }))
							.toDate()}
						size={isMobile ? 'sm' : 'md'}
						key={form.key('startDate')}
						{...form.getInputProps('startDate')}
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
					/>
				</Group>

				<Checkbox
					checked={isPublishLater}
					onChange={() => setIsPublishLater((prev) => !prev)}
					label="Publish later"
				/>
				{isPublishLater && (
					<DateTimePicker
						label="Publish date"
						placeholder="Choose when to publish"
						minDate={dayjs(new Date(form.values.startDate))
							.add(dayjs.duration({ days: 1 }))
							.toDate()}
						size={isMobile ? 'sm' : 'md'}
						key={form.key('publishDate')}
						{...form.getInputProps('publishDate')}
					/>
				)}

				<Group justify="flex-end" mt="md">
					<Button
						variant="outline"
						size={isMobile ? 'sm' : 'md'}
						onClick={() => navigate(-1)}
					>
						Cancel
					</Button>
					<Button type="submit" size={isMobile ? 'sm' : 'md'}>
						Create Event
					</Button>
				</Group>
			</Stack>
		</form>
	)
}

export default React.memo(CreateEventForm)
