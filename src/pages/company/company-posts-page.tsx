import Footer from '@/components/general/footer'
import MainHeader from '@/components/general/main-header'
import PostCard from '@/components/post/post-card'
import { apiClient } from '@/shared/api/axios'
import { PostsResponse } from '@/shared/types/posts'
import {
	Box,
	Center,
	Container,
	Group,
	Loader,
	Pagination,
	Select,
	SimpleGrid,
	Stack,
	Text,
} from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import React, { memo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, useSearchParams } from 'react-router-dom'

const CompanyPostsPage: React.FC = () => {
	const { id } = useParams()
	const { t } = useTranslation()
	const [searchParams, setSearchParams] = useSearchParams()
	const limit = Number(searchParams.get('limit')) || 15
	const page = Number(searchParams.get('page')) || 1
	const [limitInput, setLimitInput] = useState(limit.toString())
	const sort = searchParams.get('sort') || 'createdAt'
	const order = searchParams.get('order') || 'desc'
	const [sortInput, setSortInput] = useState(sort.toString())
	const [orderInput, setOrderInput] = useState(order.toString())

	const dataSort = [
		{ value: 'title', label: t('eventsPage.sorts.title') },
		{ value: 'createdAt', label: t('eventsPage.sorts.createdAt') },
		{ value: 'likes', label: t('eventsPage.sorts.likes') },
	]

	const dataOrder = [
		{ value: 'asc', label: 'ASC' },
		{ value: 'desc', label: 'DESC' },
	]

	const fetchData = async (): Promise<PostsResponse> => {
		const params = new URLSearchParams({
			page: page.toString(),
			limit: limitInput,
		})

		if (sort) params.set('sort', sort)
		if (order) params.set('order', order)

		const { data } = await apiClient(
			`/companies/${id}/posts?${params.toString()}`
		)
		return data
	}

	const { data, isLoading, error } = useQuery({
		queryKey: ['posts', searchParams.toString()],
		queryFn: fetchData,
	})

	if (isLoading)
		return (
			<Center h="100vh">
				<Loader />
			</Center>
		)
	if (error)
		return (
			<Center h="100vh">
				<Text>{t('companiesPage.errorLoadingCompanies')}</Text>
			</Center>
		)

	return (
		<Container size="xl" pt="md">
			<Stack justify="space-between">
				<MainHeader />
				<Group justify="end" gap="xs" pb="md">
					<Select
						data={dataSort}
						value={sortInput}
						onChange={(value) => {
							if (value) {
								setSortInput(value)
								const params = new URLSearchParams(searchParams)
								params.set('sort', value)
								setSearchParams(params)
							}
						}}
					/>
					<Select
						data={dataOrder}
						value={orderInput}
						onChange={(value) => {
							if (value) {
								setOrderInput(value)
								const params = new URLSearchParams(searchParams)
								params.set('order', value)
								setSearchParams(params)
							}
						}}
						w="100px"
					/>
					<Select
						placeholder={t('companiesPage.selectLimit')}
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
						w="75px"
					/>
				</Group>
				<SimpleGrid
					cols={{ base: 1, sm: 2, md: 3 }}
					spacing="lg"
					verticalSpacing="xl"
				>
					{data?.data.map((post) => (
						<PostCard key={post.id} post={post} />
					))}
				</SimpleGrid>
				{data?.meta?.pageCount && data.meta.pageCount > 1 && (
					<Center mt="xl" p="center">
						<Pagination
							total={data?.meta.pageCount || 1}
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

export default memo(CompanyPostsPage)
