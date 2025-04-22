import { config } from '@/config/config'
import { useResponsive } from '@/hooks/use-responsive'
import { apiClient } from '@/shared/api/axios'
import { showNotification } from '@/shared/helpers/show-notification'
import { createCompanySchema } from '@/shared/validations/create-company'
import { Button, Modal, Stack, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
import { AxiosError } from 'axios'
import React, { useState } from 'react'

interface CreateCompanyModalProps {
	opened: boolean
	onClose: () => void
}

const containerStyle = {
	width: '100%',
	height: '300px',
}

const CreateCompanyModal: React.FC<CreateCompanyModalProps> = ({
	opened,
	onClose,
}) => {
	const { isMobile } = useResponsive()

	const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(
		null
	)

	const form = useForm({
		mode: 'uncontrolled',
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

	const handleSubmit = async (e: { preventDefault: () => void }) => {
		e.preventDefault()
		form.validate()
		try {
			await apiClient.post('/companies', form.getValues())
		} catch (error) {
			if (error instanceof AxiosError && error.response) {
				showNotification('Error', error.response.data.message, 'red')
			}
		} finally {
			onClose()
		}
	}

	return (
		<Modal
			opened={opened}
			onClose={onClose}
			size={isMobile ? 'sm' : 'md'}
			centered
			closeOnClickOutside={false}
			closeOnEscape={false}
			transitionProps={{
				transition: 'fade',
				duration: 600,
				timingFunction: 'linear',
			}}
			title="Create company"
		>
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

					<TextInput
						label="Location"
						mt="md"
						size={isMobile ? 'sm' : 'md'}
						key={form.key('location')}
						{...form.getInputProps('location')}
						readOnly
					/>

					<div style={{ marginTop: '16px' }}>
						<LoadScript googleMapsApiKey={config.GOOGLE_API}>
							<GoogleMap
								mapContainerStyle={containerStyle}
								center={marker || { lat: -33.860664, lng: 151.208138 }}
								zoom={marker ? 14 : 10}
								onClick={handleMapClick}
							>
								{marker && <Marker position={marker} />}
							</GoogleMap>
						</LoadScript>
					</div>
					<Button type="submit">Create</Button>
				</Stack>
			</form>
		</Modal>
	)
}

export default React.memo(CreateCompanyModal)
