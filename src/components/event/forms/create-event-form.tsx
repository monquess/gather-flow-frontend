import { config } from '@/config/config'
import { useResponsive } from '@/hooks/use-responsive'
import { apiClient } from '@/shared/api/axios'
import { showNotification } from '@/shared/helpers/show-notification'
import { EventItem } from '@/shared/types/events'
import { createEventSchema } from '@/shared/validations/create-event'
import {
	Button,
	FileInput,
	Group,
	Image,
	NumberInput,
	Select,
	Stack,
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
import { AxiosError } from 'axios'
import React, { useState } from 'react'
import { IoImageOutline } from 'react-icons/io5'
import { useNavigate, useParams } from 'react-router-dom'

const containerStyle = {
	width: '100%',
	height: '300px',
	borderRadius: '8px',
	overflow: 'hidden',
}

const CreateEventForm: React.FC = () => {
	const { id: companyId } = useParams()
	const [autoKey, setAutoKey] = useState(0)
	const navigate = useNavigate()
	const { isMobile } = useResponsive()

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
			publishDate: '',
			poster: '',
		},
	})

	const handleMapClick = (e: google.maps.MapMouseEvent) => {
		const lat = e.latLng?.lat()
		const lng = e.latLng?.lng()

		if (lat && lng) {
			const geocoder = new window.google.maps.Geocoder()
			geocoder.geocode({ location: { lat, lng } }, (results, status) => {
				if (status === 'OK' && results && results[0]) {
					const address = results[0].formatted_address
					setMarker({ lat, lng })
					form.setFieldValue('location', address)
				}
			})
		}
	}

	const onLoadAutocomplete = (auto: google.maps.places.Autocomplete) => {
		setAutocomplete(auto)
	}

	const onPlaceChanged = () => {
		if (autocomplete !== null) {
			const place = autocomplete.getPlace()
			const lat = place.geometry?.location?.lat()
			const lng = place.geometry?.location?.lng()

			if (lat && lng && place.formatted_address) {
				form.setFieldValue('location', place.formatted_address)
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
			const res = await apiClient.post<EventItem>(
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
			if (error instanceof AxiosError && error.response) {
				showNotification('Error', error.response.data.message, 'red')
			}
		}
	}

	return (
		<form onSubmit={handleSubmit}>
			<Stack gap="sm">
				<TextInput
					label="Title"
					placeholder="Enter event title"
					mt="md"
					size={isMobile ? 'sm' : 'md'}
					key={form.key('title')}
					{...form.getInputProps('title')}
				/>
				<TextInput
					label="Description"
					placeholder="Briefly describe the event"
					mt="md"
					size={isMobile ? 'sm' : 'md'}
					key={form.key('description')}
					{...form.getInputProps('description')}
				/>
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

				<LoadScript googleMapsApiKey={config.GOOGLE_API} libraries={['places']}>
					<Autocomplete
						key={autoKey}
						onLoad={onLoadAutocomplete}
						onPlaceChanged={onPlaceChanged}
					>
						<TextInput
							label="Location"
							placeholder="Search for a venue"
							mt="md"
							size={isMobile ? 'sm' : 'md'}
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

				<Group grow>
					<NumberInput
						label="Ticket Price ($)"
						placeholder="Set ticket price"
						mt="md"
						size={isMobile ? 'sm' : 'md'}
						key={form.key('ticketPrice')}
						min={0}
						{...form.getInputProps('ticketPrice')}
					/>
					<NumberInput
						label="Ticket Quantity"
						placeholder="How many tickets?"
						mt="md"
						size={isMobile ? 'sm' : 'md'}
						key={form.key('ticketsQuantity')}
						min={0}
						decimalScale={0}
						{...form.getInputProps('ticketsQuantity')}
					/>
				</Group>

				<DateTimePicker
					label="Start Date & Time"
					placeholder="Select event start date and time"
					mt="md"
					size={isMobile ? 'sm' : 'md'}
					key={form.key('startDate')}
					{...form.getInputProps('startDate')}
				/>
				<DateTimePicker
					label="End Date & Time"
					placeholder="Select event end date and time"
					mt="md"
					size={isMobile ? 'sm' : 'md'}
					key={form.key('endDate')}
					{...form.getInputProps('endDate')}
				/>
				<DateTimePicker
					label="Publish Date"
					placeholder="Choose when to publish"
					mt="md"
					size={isMobile ? 'sm' : 'md'}
					key={form.key('publishDate')}
					{...form.getInputProps('publishDate')}
				/>

				<FileInput
					label="Poster"
					placeholder="Upload image"
					leftSection={<IoImageOutline />}
					accept="image/png,image/jpeg,image/jpg,image/webp"
					clearable
					key={form.key('poster')}
					{...form.getInputProps('poster')}
				/>

				<Image src={form.getValues().poster}></Image>

				<Group justify="flex-end" mt="md">
					<Button
						variant="outline"
						size={isMobile ? 'sm' : 'md'}
						onClick={() => navigate(`/home`)}
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
