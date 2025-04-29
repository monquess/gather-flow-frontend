import AddMemberModal from '@/components/company/modal/add-member-modal'
import DeleteCompanyModal from '@/components/company/modal/delete-company-modal'
import CarouselEvent from '@/components/general/carousel-event'
import Footer from '@/components/general/footer'
import MainHeader from '@/components/general/main-header'
import { config } from '@/config/config'
import { useResponsive } from '@/hooks/use-responsive'
import { apiClient } from '@/shared/api/axios'
import useUserStore from '@/shared/store/user-store'
import { CompanyItem, CompanyMember } from '@/shared/types/company'
import { EventsResponse } from '@/shared/types/event'
import {
	ActionIcon,
	Avatar,
	Box,
	Button,
	Card,
	CardProps,
	Center,
	Container,
	Divider,
	Flex,
	Grid,
	Group,
	Loader,
	ScrollArea,
	Stack,
	Text,
	Title,
} from '@mantine/core'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { motion } from 'framer-motion'
import { forwardRef, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { GoTrash } from 'react-icons/go'
import { GrUpdate } from 'react-icons/gr'
import { IoMdAdd } from 'react-icons/io'
import { useNavigate, useParams } from 'react-router-dom'

const MotionCard = motion.create(
	forwardRef<HTMLDivElement, CardProps>((props, ref) => (
		<Card ref={ref} {...props} />
	))
)

const CompanyPage: React.FC = () => {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const [admin, setAdmin] = useState(false)
	const { user } = useUserStore()
	const { isMobile } = useResponsive()
	const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(
		null
	)
	const [inviteMembers, setInviteMembers] = useState(false)
	const [deleteCompany, setDeleteCompany] = useState(false)
	const [isMapLoaded, setIsMapLoaded] = useState(false)
	const { id } = useParams()

	const fetchCompany = async (): Promise<CompanyItem> => {
		const { data } = await apiClient(`/companies/${id}`)
		return data
	}

	const fetchCompanyEvents = async (): Promise<EventsResponse> => {
		const { data } = await apiClient(`/companies/${id}/events`)
		return data
	}

	const { data, isLoading, error } = useQuery({
		queryKey: ['companies', id],
		queryFn: fetchCompany,
	})

	const {
		data: eventData,
		isLoading: isLoadingEvents,
		error: eventError,
	} = useQuery({
		queryKey: ['events', id],
		queryFn: fetchCompanyEvents,
	})

	const handleApiLoaded = () => {
		setIsMapLoaded(true)
	}

	useEffect(() => {
		if (user && data?.users?.length) {
			const currentUser = data.users.find(
				(u: CompanyMember) => u.user.id === user.id
			)

			if (currentUser) {
				setAdmin(currentUser.role === 'ADMIN')
			} else {
				setAdmin(false)
			}
		}
	}, [user, data])

	useEffect(() => {
		if (data?.location && isMapLoaded && window.google?.maps?.Geocoder) {
			const geocoder = new window.google.maps.Geocoder()
			geocoder.geocode({ address: data.location }, (results, status) => {
				if (status === 'OK' && results && results[0]) {
					const location = results[0].geometry.location
					setMarker({
						lat: location.lat(),
						lng: location.lng(),
					})
				}
			})
		}
	}, [data?.location, isMapLoaded])

	if (isLoading) {
		return (
			<Center h="100vh">
				<Loader />
			</Center>
		)
	}

	if (error) {
		return (
			<Center h="100vh">
				<Text>{t('companyPage.errorLoadingCompany')}</Text>
			</Center>
		)
	}

	return (
		<Container size="xl" pt="md">
			<Stack justify="space-between">
				<MainHeader />
				<Flex gap="md" direction={isMobile ? 'column' : 'row'}>
					<Box flex={1}>
						<MotionCard
							shadow="lg"
							radius="xl"
							withBorder
							p="xl"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, ease: 'easeOut' }}
						>
							<Stack>
								<Grid justify="space-between" align="center">
									<Title order={1}>{data?.name}</Title>
									{admin && (
										<Flex
											gap="md"
											mt={{ base: 'md', sm: 0 }}
											ml={{ base: 0, sm: 'auto' }}
										>
											<ActionIcon
												variant="outline"
												onClick={() =>
													navigate(`/companies/${data?.id}/update`)
												}
											>
												<GrUpdate size={14} />
											</ActionIcon>
											<ActionIcon
												variant="outline"
												onClick={() => setDeleteCompany(true)}
											>
												<GoTrash size={14} />
											</ActionIcon>
										</Flex>
									)}
								</Grid>
								<Text size="sm" c="dimmed">
									{data?.email}
								</Text>
								<Text>{data?.description}</Text>
								<Text fw={500}>
									{t('companyPage.companyLocation')}: {data?.location}
								</Text>
								{data?.location && (
									<Box
										mt="md"
										style={{
											height: '300px',
											marginTop: '16px',
											overflow: 'hidden',
											borderRadius: '10px',
										}}
									>
										<LoadScript
											googleMapsApiKey={config.GOOGLE_API}
											onLoad={handleApiLoaded}
										>
											<GoogleMap
												mapContainerStyle={{ width: '100%', height: '100%' }}
												center={marker || { lat: 0, lng: 0 }}
												zoom={15}
											>
												{marker && <Marker position={marker} />}
											</GoogleMap>
										</LoadScript>
									</Box>
								)}
							</Stack>
						</MotionCard>
					</Box>
					<Box flex={1}>
						<Group grow align="stretch">
							<MotionCard
								withBorder
								radius="lg"
								p="xl"
								shadow="sm"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, ease: 'easeOut' }}
							>
								<Grid justify="space-between" align="center">
									<Title order={3}>{t('companyPage.companyMembers')}</Title>
									{admin && (
										<Button
											size={isMobile ? 'xs' : 'sm'}
											leftSection={<IoMdAdd />}
											onClick={() => setInviteMembers(true)}
										>
											{t('companyPage.addMember')}
										</Button>
									)}
								</Grid>
								<ScrollArea h={300} mt="md" p={0}>
									<Stack gap="sm">
										{data?.users.map((member) => (
											<Card key={member.user.id} withBorder radius="md" p="md">
												<Group justify="space-between">
													<Group>
														<Avatar radius="xl" src={member.user.avatar} />
														<Stack gap={0} justify="center">
															<Text fw={600}>{member.user.username}</Text>
															<Text size="xs" c="dimmed">
																{member.role}
															</Text>
														</Stack>
													</Group>
													<Text size="xs" c="dimmed">
														{t('companyPage.joined')}{' '}
														{dayjs(member.createdAt).format('DD MMM YYYY')}
													</Text>
												</Group>
											</Card>
										))}
									</Stack>
								</ScrollArea>
							</MotionCard>
						</Group>
					</Box>
				</Flex>
				<Divider
					my="xl"
					label={t('companyPage.companyEvents')}
					labelPosition="center"
				/>
				<Group grow align="stretch">
					<MotionCard
						withBorder
						radius="lg"
						p="xl"
						shadow="sm"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, ease: 'easeOut' }}
					>
						<Grid justify="space-between" align="center">
							<Title order={3}>{t('companyPage.companyEvents')}</Title>
							{admin && (
								<Button
									size={isMobile ? 'xs' : 'sm'}
									leftSection={<IoMdAdd />}
									onClick={() =>
										navigate(`/companies/${data?.id}/event/create`)
									}
								>
									{t('companyPage.createEvent')}
								</Button>
							)}
						</Grid>
						<Box mt="md">
							{isLoadingEvents ? (
								<Center>
									<Loader size="sm" />
								</Center>
							) : eventError ? (
								<Text c="red">{t('companyPage.loadingEvents')}</Text>
							) : eventData?.data.length ? (
								<CarouselEvent events={eventData?.data} delay={2000} />
							) : (
								<Text c="dimmed">{t('companyPage.noEventsAvailable')}</Text>
							)}
						</Box>
					</MotionCard>
				</Group>
				<Footer />
			</Stack>
			<AddMemberModal
				opened={inviteMembers}
				onClose={() => setInviteMembers(false)}
				company={data}
			/>
			<DeleteCompanyModal
				opened={deleteCompany}
				onClose={() => setDeleteCompany(false)}
				company={data}
			/>
		</Container>
	)
}

export default CompanyPage
