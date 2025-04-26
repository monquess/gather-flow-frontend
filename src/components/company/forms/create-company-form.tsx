import { config } from '@/config/config'
import { useResponsive } from '@/hooks/use-responsive'
import { apiClient } from '@/shared/api/axios'
import { showNotification } from '@/shared/helpers/show-notification'
import { CompanyItem } from '@/shared/types/companies'
import { createCompanySchema } from '@/shared/validations/create-company'
import { Button, Group, Stack, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import {
	Autocomplete,
	GoogleMap,
	LoadScript,
	Marker,
} from '@react-google-maps/api'
import { AxiosError } from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const containerStyle = {
	width: '100%',
	height: '300px',
}

const CreateCompanyForm: React.FC = () => {
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
		validate: zodResolver(createCompanySchema),
		initialValues: {
			name: '',
			description: '',
			email: '',
			location: '',
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

	const handleSubmit = async (e: { preventDefault: () => void }) => {
		e.preventDefault()
		form.validate()
		try {
			const res = await apiClient.post<CompanyItem>(
				'/companies',
				form.getValues()
			)
			navigate(`/companies/${res.data.id}`)
		} catch (error) {
			if (error instanceof AxiosError && error.response) {
				showNotification('Error', error.response.data.message, 'red')
			}
		}
	}

	return (
		<form onSubmit={handleSubmit}>
			<Stack gap="xs">
				<TextInput
					label="Name"
					mt="md"
					size={isMobile ? 'sm' : 'md'}
					key={form.key('name')}
					{...form.getInputProps('name')}
				/>
				<TextInput
					label="Description"
					mt="md"
					size={isMobile ? 'sm' : 'md'}
					key={form.key('description')}
					{...form.getInputProps('description')}
				/>
				<TextInput
					label="Email"
					mt="md"
					size={isMobile ? 'sm' : 'md'}
					key={form.key('email')}
					{...form.getInputProps('email')}
				/>

				<LoadScript googleMapsApiKey={config.GOOGLE_API} libraries={['places']}>
					<Autocomplete
						key={autoKey}
						onLoad={onLoadAutocomplete}
						onPlaceChanged={onPlaceChanged}
					>
						<TextInput
							label="Location"
							mt="md"
							size={isMobile ? 'sm' : 'md'}
							value={form.values.location}
							onChange={(e) => handleLocationChange(e.currentTarget.value)}
							error={form.errors.location}
						/>
					</Autocomplete>

					<div
						style={{
							marginTop: '16px',
							overflow: 'hidden',
							borderRadius: '10px',
						}}
					>
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

				<Group justify="flex-end" mt="md">
					<Button variant="outline" onClick={() => navigate(`/home`)}>
						Cancel
					</Button>
					<Button type="submit">Create</Button>
				</Group>
			</Stack>
		</form>
	)
}

export default React.memo(CreateCompanyForm)
