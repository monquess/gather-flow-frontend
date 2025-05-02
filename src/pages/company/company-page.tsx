import { Carousel } from '@mantine/carousel'
import {
	ActionIcon,
	Avatar,
	Box,
	Button,
	Center,
	Container,
	Divider,
	Flex,
	Group,
	Loader,
	Pagination,
	Paper,
	SimpleGrid,
	Stack,
	Text,
	Title,
	UnstyledButton,
} from '@mantine/core'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

import { CiEdit } from 'react-icons/ci'
import { FaRegBell } from 'react-icons/fa'
import { FaBell, FaMapLocationDot } from 'react-icons/fa6'
import { GoTrash } from 'react-icons/go'
import { IoMdAdd } from 'react-icons/io'

import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import AddMemberModal from '@/components/company/modal/add-member-modal'
import DeleteCompanyModal from '@/components/company/modal/delete-company-modal'
import { MotionCard } from '@/components/general'
import CarouselEvent from '@/components/general/carousel-event'
import Footer from '@/components/general/footer'
import MainHeader from '@/components/general/main-header'
import PostCreateModal from '@/components/post/modal/post-create-modal'
import PostCard from '@/components/post/post-card'
import ReviewCreateModal from '@/components/review/modal/review-create-modal'
import ReviewCard from '@/components/review/review-card'
import UserListModal from '@/components/users/modal/user-list-modal'
import { useResponsive } from '@/hooks/use-responsive'
import { apiClient, ApiError } from '@/shared/api/axios'
import { config } from '@/shared/config/config'
import { useUserStore } from '@/shared/store/user-store'
import {
	Company,
	CompanyMember,
	CompanySubscriptions,
	EventsResponse,
	PostsResponse,
} from '@/shared/types'
import { ReviewsResponse } from '@/shared/types/review'
import Autoplay from 'embla-carousel-autoplay'

import { showNotification } from '@/shared/helpers/show-notification'
import classes from '@/shared/styles/slider.module.css'
import { MdModeEdit } from 'react-icons/md'

const CompanyPage: React.FC = () => {
	const { t } = useTranslation()
	const [searchParams, setSearchParams] = useSearchParams()
	const page = Number(searchParams.get('page')) || 1
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
	const [isMembersOpened, setMembersOpened] = useState(false)
	const [isCreateNewsOpened, setCreateNewsOpened] = useState(false)
	const [isCreateReviewOpened, setCreateReviewOpened] = useState(false)
	const { id } = useParams()
	const autoplay = useRef(Autoplay({ delay: 3000 }))

	const [subscribed, setSubscribed] = useState(false)
	const [connectedStripe, isConnectedStripe] = useState(false)

	const fetchCompany = async (): Promise<Company> => {
		const { data } = await apiClient<Company>(`/companies/${id}`)

		if (data.stripeAccountId !== null) isConnectedStripe(true)

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
		return data
	}

	const fetchCompanyEvents = async (): Promise<EventsResponse> => {
		const { data } = await apiClient<EventsResponse>(`/companies/${id}/events`)
		return data
	}

	const fetchCompanyPosts = async (): Promise<PostsResponse> => {
		const { data } = await apiClient(`/companies/${id}/posts?limit=5`)
		return data
	}

	const fetchCompanyReviews = async (): Promise<ReviewsResponse> => {
		const params = new URLSearchParams({
			page: page.toString(),
		})
		const { data } = await apiClient(
			`/companies/${id}/reviews?${params.toString}`
		)
		return data
	}

	const fetchIsSubscribed = async (): Promise<CompanySubscriptions> => {
		const { data } = await apiClient(
			`/company-subscriptions?userId=${user?.id}&companyId=${id}`
		)

		if (data.length > 0) {
			setSubscribed(true)
		}

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

	const {
		data: postData,
		isLoading: isLoadingPosts,
		error: postError,
	} = useQuery({
		queryKey: ['posts', id],
		queryFn: fetchCompanyPosts,
	})

	const { data: reviewsData } = useQuery({
		queryKey: ['reviews', id],
		queryFn: fetchCompanyReviews,
	})

	useQuery({
		queryKey: ['subscription'],
		queryFn: fetchIsSubscribed,
	})

	const handleApiLoaded = () => {
		setIsMapLoaded(true)
	}

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

	const handleStripeRedirect = async () => {
		try {
			const response = await apiClient.get(`/payments/connect-stripe/${id}`)
			window.open(response.data.url, '_blank')
		} catch (error) {
			if (error instanceof ApiError && error.response) {
				showNotification(t('common.error'), error.response.data.message, 'red')
			}
		}
	}

	if (!reviewsData || isLoading) {
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
		<Container
			size="xl"
			pt="md"
			style={{
				display: 'flex',
				flexDirection: 'column',
				minHeight: '100vh',
			}}
		>
			<MainHeader />
			{connectedStripe ? null : admin ? (
				<Button color="red" my="md" onClick={handleStripeRedirect}>
					{t('companyPage.stripeAccount')}
				</Button>
			) : null}
			<Stack gap="md" style={{ flex: 1 }}>
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
								<Group justify="space-between" align="center">
									<Title order={1}>{data?.name}</Title>
									<Flex
										gap="md"
										mt={{ base: 'md', sm: 0 }}
										ml={{ base: 0, sm: 'auto' }}
									>
										{admin && (
											<Group>
												<ActionIcon
													variant="outline"
													onClick={() =>
														navigate(`/companies/${data?.id}/update`)
													}
												>
													<MdModeEdit size={14} />
												</ActionIcon>
												<ActionIcon
													variant="outline"
													onClick={() => setDeleteCompany(true)}
												>
													<GoTrash size={14} />
												</ActionIcon>
											</Group>
										)}
										{user ? (
											subscribed ? (
												<ActionIcon
													variant="outline"
													onClick={async () => {
														setSubscribed(false)
														await apiClient.delete(
															`/company-subscriptions/${id}`
														)
													}}
												>
													<FaBell size={16} />
												</ActionIcon>
											) : (
												<ActionIcon
													variant="outline"
													onClick={async () => {
														setSubscribed(true)
														await apiClient.post(`/company-subscriptions`, {
															companyId: id,
														})
													}}
												>
													<FaRegBell size={14} />
												</ActionIcon>
											)
										) : null}
									</Flex>
								</Group>
								<Text size="sm" c="dimmed">
									{data?.email}
								</Text>
								<Text>{data?.description}</Text>
								<Group align="center" gap="xs">
									<FaMapLocationDot size={16} />
									<Text fw={500}>{data?.location}</Text>
								</Group>
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
						<Stack h="100%">
							<MotionCard
								withBorder
								radius="lg"
								px="xl"
								py="lg"
								shadow="sm"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{
									duration: 0.5,
									ease: 'easeOut',
								}}
							>
								<Group justify="space-between" align="center">
									<Flex align="center" justify="center">
										<Title order={3}>{t('companyPage.companyMembers')}</Title>
									</Flex>
									{admin && (
										<Button
											size={isMobile ? 'xs' : 'sm'}
											rightSection={<IoMdAdd />}
											onClick={() => setInviteMembers(true)}
										>
											{t('companyPage.addMember')}
										</Button>
									)}
								</Group>
								<Stack gap="sm" mt="xs" mb="lg">
									<Avatar.Group
										spacing="sm"
										style={{
											cursor: 'pointer',
										}}
										onClick={() => setMembersOpened(true)}
									>
										{data?.users.slice(0, 5).map((member) => (
											<Avatar
												key={member.user.id}
												src={member.user.avatar}
												alt={member.user.username}
												radius="xl"
												size="md"
											/>
										))}
										{data?.users && data?.users.length > 5 && (
											<Avatar size="md" radius="xl">
												{data.users.length - 5}
											</Avatar>
										)}
									</Avatar.Group>
								</Stack>
							</MotionCard>
							<MotionCard
								withBorder
								radius="lg"
								px="xl"
								pt="lg"
								pb="md"
								shadow="sm"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, ease: 'easeOut' }}
								h="100%"
							>
								<Stack gap="md" h="100%">
									<Group justify="space-between" align="center">
										<Flex align="center" justify="center">
											<Title order={3}>{t('companyPage.newsTitle')}</Title>
											{postData?.data.length ? (
												<UnstyledButton
													c="dimmed"
													ml={2}
													fz="xs"
													onClick={() =>
														navigate(`/companies/${data?.id}/posts`)
													}
												>
													({t('companyPage.seeMore')})
												</UnstyledButton>
											) : (
												<Text />
											)}
										</Flex>
										{admin && (
											<Button
												size={isMobile ? 'xs' : 'sm'}
												rightSection={<IoMdAdd />}
												onClick={() => setCreateNewsOpened(true)}
											>
												{t('companyPage.addMember')}
											</Button>
										)}
									</Group>
									{isLoadingPosts && (
										<Center h="100%">
											<Loader size="sm" />
										</Center>
									)}
									{postError && (
										<Center h="100%">
											<Text>Error loading news</Text>
										</Center>
									)}
									{postData?.data?.length ? (
										<Carousel
											pt="md"
											slideSize="100%"
											slideGap="md"
											loop
											withControls
											align="start"
											draggable
											classNames={classes}
											plugins={[autoplay.current]}
											onMouseEnter={() => autoplay.current.stop()}
											onMouseLeave={() => autoplay.current.play()}
										>
											{postData.data.map((post) => (
												<Carousel.Slide key={post.id}>
													<PostCard post={post} />
												</Carousel.Slide>
											))}
										</Carousel>
									) : (
										<Center h="100%">
											<Text c="dimmed">No news available</Text>
										</Center>
									)}
								</Stack>
							</MotionCard>
						</Stack>
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
						<Group
							justify={connectedStripe && admin ? 'space-between' : 'flex-end'}
							align="center"
						>
							{admin && connectedStripe ? (
								<Button
									size={isMobile ? 'xs' : 'sm'}
									rightSection={<IoMdAdd />}
									onClick={() => navigate(`/companies/${id}/event/create`)}
								>
									{t('companyPage.createEvent')}
								</Button>
							) : null}
							{eventData?.data.length ? (
								<UnstyledButton
									c="dimmed"
									ml={2}
									size="md"
									onClick={() => {
										navigate(`/companies/${id}/events`)
									}}
								>
									{t('companyPage.seeMore')}
								</UnstyledButton>
							) : null}
						</Group>
						<Box mt="md">
							{isLoadingEvents ? (
								<Center h="100%">
									<Loader size="sm" />
								</Center>
							) : eventError ? (
								<Text c="red">{t('companyPage.loadingEvents')}</Text>
							) : eventData?.data.length ? (
								<CarouselEvent events={eventData?.data} delay={2000} />
							) : (
								<Center h="100%">
									<Text c="dimmed">{t('companyPage.noEventsAvailable')}</Text>
								</Center>
							)}
						</Box>
					</MotionCard>
				</Group>
				<Divider
					my="xl"
					label={t('companyPage.reviews')}
					labelPosition="center"
				/>
				<Group grow align="stretch">
					<MotionCard
						shadow="lg"
						radius="xl"
						withBorder
						p="xl"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, ease: 'easeOut' }}
					>
						<Group justify="space-between">
							<Paper bg="inherit" withBorder px="sm" py="0">
								{reviewsData?.data.length > 0 ? (
									<Flex align="flex-end" justify="center">
										<Title order={1} fw={700}>
											{data?.rating.toFixed(1)}
										</Title>
										<Text size="sm" c="dimmed" fw={500} ml="2">
											out of 5 ({reviewsData?.meta.count})
										</Text>
									</Flex>
								) : (
									<Text size="md" c="dimmed" fw={500} ml="2">
										No reviews
									</Text>
								)}
							</Paper>
							<Button
								size={isMobile ? 'xs' : 'sm'}
								leftSection={<CiEdit size={20} />}
								onClick={() => setCreateReviewOpened(true)}
								variant="transparent"
							>
								{t('companyPage.createReview')}
							</Button>
						</Group>
						<SimpleGrid
							cols={{ base: 1, sm: 2, md: 3 }}
							spacing="lg"
							verticalSpacing="xl"
							mt="xl"
						>
							{reviewsData?.data.map((review) => (
								<ReviewCard
									review={review}
									key={`${review.id}-${review.stars}`}
								/>
							))}
						</SimpleGrid>
						{reviewsData?.meta.pageCount ? (
							reviewsData?.meta.pageCount > 1 ? (
								<Center mt="xl" p="center">
									<Pagination
										total={reviewsData?.meta.pageCount || 1}
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
							) : (
								<Text />
							)
						) : (
							<Text />
						)}
					</MotionCard>
				</Group>
			</Stack>
			<Footer />
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
			<PostCreateModal
				opened={isCreateNewsOpened}
				onClose={() => setCreateNewsOpened(false)}
				company={data}
			/>
			<UserListModal
				opened={isMembersOpened}
				onClose={() => setMembersOpened(false)}
				members={data?.users}
				admin={admin}
			/>
			<ReviewCreateModal
				opened={isCreateReviewOpened}
				onClose={() => setCreateReviewOpened(false)}
				company={data}
			/>
		</Container>
	)
}

export default CompanyPage
