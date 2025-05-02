import {
	ActionIcon,
	Badge,
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
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FaMapLocationDot } from 'react-icons/fa6'
import { HiOutlineTicket } from 'react-icons/hi2'
import { IoIosSearch, IoMdImages } from 'react-icons/io'
import { MdCalendarToday, MdDelete, MdDiscount } from 'react-icons/md'
import { useNavigate, useParams } from 'react-router-dom'

import MarkdownEditor from '@/components/editor/markdown-editor'
import { useResponsive } from '@/hooks/use-responsive'
import { apiClient, ApiError } from '@/shared/api/axios'
import { config } from '@/shared/config/config'
import { showNotification } from '@/shared/helpers/show-notification'
import { Event, Promocode } from '@/shared/types'
import { createEventSchema } from '@/shared/validations'

import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

import CreatePromocodeInput from '../create-promocode-input'

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

const CreateEventForm: React.FC = () => {
	const { t } = useTranslation()
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
			startDate: dayjs(new Date())
				.add(dayjs.duration({ days: 7 }))
				.toDate(),
			endDate: dayjs(new Date())
				.add(dayjs.duration({ days: 7, hours: 1 }))
				.toDate(),
			publishDate: null as Date | null,
			poster: undefined,
			promocodes: [] as Promocode[],
			notifyOnAttendee: false,
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

		if (!form.validate().hasErrors) {
			try {
				const { startDate, endDate, publishDate, ...values } = form.getValues()
				const body = {
					...values,
					startDate: startDate?.toISOString(),
					endDate: endDate?.toISOString(),
					publishDate: publishDate?.toISOString(),
				}

				const { data } = await apiClient.post<Event>(
					`/companies/${companyId}/events`,
					body,
					{
						headers: {
							'Content-Type': 'multipart/form-data',
						},
					}
				)

				navigate(`/events/${data.id}`)
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
							alt={t('eventForm.poster.label')}
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
								<Tooltip label={t('eventForm.poster.tooltip')} withArrow>
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
					label={t('eventForm.fields.title')}
					placeholder={t('eventForm.fields.titlePlaceholder')}
					size={isMobile ? 'sm' : 'md'}
					key={form.key('title')}
					{...form.getInputProps('title')}
				/>

				<Flex gap="xs" direction={isMobile ? 'column' : 'row'}>
					<Select
						label={t('eventForm.fields.format')}
						placeholder={t('eventForm.fields.formatPlaceholder')}
						data={['CONFERENCE', 'LECTURE', 'WORKSHOP', 'FEST', 'OTHER']}
						key={form.key('format')}
						{...form.getInputProps('format')}
						clearable
						flex={1}
					/>
					<Select
						label={t('eventForm.fields.theme')}
						placeholder={t('eventForm.fields.themePlaceholder')}
						data={['BUSINESS', 'POLITICS', 'PSYCHOLOGY', 'OTHER']}
						key={form.key('theme')}
						{...form.getInputProps('theme')}
						clearable
						flex={1}
					/>
				</Flex>

				<MarkdownEditor
					value={form.values.description}
					placeholder={t('eventForm.fields.descriptionPlaceholder')}
					onChange={(value) => form.setFieldValue('description', value)}
				/>

				<Radio.Group
					label={t('eventForm.fields.visitorsVisibility.label')}
					description={t('eventForm.fields.visitorsVisibility.description')}
					value={form.values.visitorsVisibility}
					error={form.errors.visitorsVisibility}
					onChange={(value) => {
						form.setFieldValue('visitorsVisibility', value)
					}}
				>
					<Group mt="xs">
						<Radio
							value="EVERYONE"
							label={t('eventForm.fields.visitorsVisibility.options.EVERYONE')}
						/>
						<Radio
							value="VISITOR"
							label={t('eventForm.fields.visitorsVisibility.options.VISITOR')}
						/>
					</Group>
				</Radio.Group>

				<Divider
					mt="xs"
					labelPosition="left"
					label={
						<>
							<FaMapLocationDot size={16} />
							<Text ml={5}>{t('eventForm.fields.location.label')}</Text>
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
							placeholder={t('eventForm.fields.location.searchPlaceholder')}
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
							<Text ml={5}>{t('eventForm.fields.tickets.label')}</Text>
						</>
					}
				/>
				<Flex direction={isMobile ? 'column' : 'row'} gap="sm">
					<NumberInput
						label={t('eventForm.fields.tickets.price')}
						placeholder={t('eventForm.fields.tickets.pricePlaceholder')}
						size={isMobile ? 'sm' : 'md'}
						key={form.key('ticketPrice')}
						min={0}
						suffix="$"
						{...form.getInputProps('ticketPrice')}
						flex={1}
					/>
					<NumberInput
						label={t('eventForm.fields.tickets.quantity')}
						placeholder={t('eventForm.fields.tickets.quantityPlaceholder')}
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
							<Text ml={5}>{t('eventForm.fields.date.label')}</Text>
						</>
					}
				/>
				<Flex direction={isMobile ? 'column' : 'row'} gap="sm">
					<DateTimePicker
						label={t('eventForm.fields.date.start')}
						placeholder={t('eventForm.fields.date.startPlaceholder')}
						minDate={dayjs()
							.add(dayjs.duration({ days: 1 }))
							.toDate()}
						size={isMobile ? 'sm' : 'md'}
						key={form.key('startDate')}
						{...form.getInputProps('startDate')}
						flex={1}
					/>
					<DateTimePicker
						label={t('eventForm.fields.date.end')}
						placeholder={t('eventForm.fields.date.endPlaceholder')}
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
					label={t('eventForm.fields.publish.later')}
				/>
				{isPublishLater && (
					<DateTimePicker
						label={t('eventForm.fields.publish.date')}
						placeholder={t('eventForm.fields.publish.datePlaceholder')}
						minDate={new Date()}
						maxDate={dayjs(new Date(form.values.startDate))
							.subtract(dayjs.duration({ days: 1 }))
							.toDate()}
						size={isMobile ? 'sm' : 'md'}
						key={form.key('publishDate')}
						{...form.getInputProps('publishDate')}
					/>
				)}

				<Divider
					mt="xs"
					labelPosition="left"
					label={
						<>
							<MdDiscount size={18} />
							<Text ml={5}>{t('eventForm.fields.promocodes.label')}</Text>
						</>
					}
				/>
				<Text size="sm" c="dimmed">
					{t('eventForm.fields.promocodes.description')}
				</Text>
				<CreatePromocodeInput
					promocodes={form.getValues().promocodes}
					minDate={new Date(form.values.startDate)}
					onAdd={(promocode) => {
						form.setFieldValue('promocodes', (prev) => [...prev, promocode])
					}}
				/>
				{form.getValues().promocodes.length > 0 && <Divider />}
				{form.values.promocodes.length > 0 && (
					<Stack gap="xs">
						{form.values.promocodes.map((promocode, index) => (
							<Group
								key={index}
								style={{ borderRadius: 8 }}
								justify="space-between"
								align="center"
							>
								<Box flex={1}>
									<Badge variant="light" color="blue" size="lg" w={140}>
										{promocode.code}
									</Badge>
								</Box>
								<Text flex={1} fw={500} c="green">
									{promocode.discount}%
								</Text>
								<Text flex={1} w={200} c="dimmed">
									{dayjs(promocode.expirationDate).format('DD MMM YYYY, HH:mm')}
								</Text>
								<ActionIcon
									size="lg"
									color="red"
									onClick={() =>
										form.setFieldValue(
											'promocodes',
											form.values.promocodes.filter((_, i) => i !== index)
										)
									}
								>
									<MdDelete />
								</ActionIcon>
							</Group>
						))}
					</Stack>
				)}

				<Checkbox
					size="md"
					mt="md"
					radius="md"
					label={t('eventForm.fields.notifications.notifyOnAttendee')}
					description={t('eventForm.fields.notifications.notifyDescription')}
					key={form.key('notifyOnAttendee')}
					{...form.getInputProps('notifyOnAttendee')}
				/>

				<Group justify="flex-end" mt="md">
					<Button
						variant="outline"
						size={isMobile ? 'sm' : 'md'}
						onClick={() => navigate(-1)}
					>
						{t('eventForm.actions.cancel')}
					</Button>
					<Button type="submit" size={isMobile ? 'sm' : 'md'}>
						{t('eventForm.actions.submit')}
					</Button>
				</Group>
			</Stack>
		</form>
	)
}

export default React.memo(CreateEventForm)
