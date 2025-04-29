import AddMemberModal from '@/components/company/modal/add-member-modal'
import DeleteCompanyModal from '@/components/company/modal/delete-company-modal'
import CarouselEvent from '@/components/general/carousel-event'
import Footer from '@/components/general/footer'
import MainHeader from '@/components/general/main-header'
import PostCreateModal from '@/components/post/modal/post-create-modal'
import PostCard from '@/components/post/post-card'
import ReviewCreateModal from '@/components/review/modal/review-create-modal'
import ReviewCard from '@/components/review/review-card'
import UserListModal from '@/components/users/modal/user-list-modal'
import { config } from '@/config/config'
import { useResponsive } from '@/hooks/use-responsive'
import { apiClient } from '@/shared/api/axios'
import useUserStore from '@/shared/store/user-store'
import classes from '@/shared/styles/slider.module.css'
import { CompanyItem, CompanyMember } from '@/shared/types/companies'
import { EventsResponse } from '@/shared/types/events'
import { PostsResponse } from '@/shared/types/posts'
import { ReviewsResponse } from '@/shared/types/reviews'
import { Carousel } from '@mantine/carousel'
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
	Pagination,
	SimpleGrid,
	Stack,
	Text,
	Title,
} from '@mantine/core'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
import { useQuery } from '@tanstack/react-query'
import Autoplay from 'embla-carousel-autoplay'
import { motion } from 'framer-motion'
import { forwardRef, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CiEdit } from 'react-icons/ci'
import { FaMapLocationDot } from 'react-icons/fa6'
import { GoTrash } from 'react-icons/go'
import { GrUpdate } from 'react-icons/gr'
import { IoMdAdd } from 'react-icons/io'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

const MotionCard = motion(
	forwardRef<HTMLDivElement, CardProps>((props, ref) => (
		<Card ref={ref} {...props} />
	))
)

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

	const fetchCompany = async (): Promise<CompanyItem> => {
		const { data } = await apiClient(`/companies/${id}`)
		return data
	}

	const fetchCompanyEvents = async (): Promise<EventsResponse> => {
		const { data } = await apiClient(`/companies/${id}/events`)
		return data
	}

	const fetchCompanyPosts = async (): Promise<PostsResponse> => {
		const { data } = await apiClient(`/companies/${id}/posts`)
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
								transition={{ duration: 0.5, ease: 'easeOut' }}
							>
								<Grid justify="space-between" align="center">
									<Flex align="center" justify="center">
										<Title order={3}>{t('companyPage.companyMembers')} </Title>
										<Text
											c="dimmed"
											ml={2}
											size="xs"
											onClick={() => setMembersOpened(true)}
										>
											({t('companyPage.seeMore')})
										</Text>
									</Flex>
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
								<Stack gap="sm" my="md">
									<Avatar.Group spacing="sm">
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
												+{data.users.length - 5}
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
									<Grid justify="space-between" align="center">
										<Flex align="center" justify="center">
											<Title order={3}>{t('companyPage.newsTitle')}</Title>
											{postData?.data.length ? (
												<Text
													c="dimmed"
													ml={2}
													size="xs"
													onClick={() =>
														navigate(`/companies/${data?.id}/posts`)
													}
												>
													({t('companyPage.seeMore')})
												</Text>
											) : (
												<Text />
											)}
										</Flex>
										{admin && (
											<Button
												size={isMobile ? 'xs' : 'sm'}
												leftSection={<IoMdAdd />}
												onClick={() => setCreateNewsOpened(true)}
											>
												{t('companyPage.addMember')}
											</Button>
										)}
									</Grid>
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
						<Grid justify="space-between" align="center">
							<Flex align="flex-end" justify="center">
								<Title order={1} fw={700}>
									{data?.rating}
								</Title>
								<Text size="sm" c="dimmed" fw={500} ml="2">
									out of 5({reviewsData?.meta.count})
								</Text>
							</Flex>
							<Button
								size={isMobile ? 'xs' : 'sm'}
								leftSection={<CiEdit size={20} />}
								onClick={() => setCreateReviewOpened(true)}
								variant="transparent"
							>
								{t('companyPage.createReview')}
							</Button>
						</Grid>
						<SimpleGrid
							cols={{ base: 1, sm: 2, md: 3 }}
							spacing="lg"
							verticalSpacing="xl"
							mt="xl"
						>
							{reviewsData?.data.map((review) => (
								<ReviewCard review={review} />
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
