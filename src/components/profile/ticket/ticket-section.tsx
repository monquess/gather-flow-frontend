import React, { useEffect, useState } from 'react'
import { Center, Loader, Pagination, Paper, Stack, Text } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'

import { apiClient, ApiError } from '@/shared/api/axios'
import { Paginated } from '@/shared/types'
import { Ticket } from '@/shared/types/ticket'

import TicketCard from './ticket-card'

const TicketSection: React.FC = () => {
	const [page, setPage] = useState(1)

	const {
		data: tickets,
		isLoading,
		error,
	} = useQuery<Paginated<Ticket>, ApiError>({
		queryKey: ['tickets', page],
		queryFn: async () => {
			const { data } = await apiClient.get<Paginated<Ticket>>('tickets', {
				params: {
					page,
					limit: 5,
				},
			})
			return data
		},
	})

	useEffect(() => {
		console.log(tickets)
	}, [tickets])

	if (isLoading) {
		return (
			<Center>
				<Loader />
			</Center>
		)
	}

	if (error || !tickets) {
		return (
			<Center h="100vh">
				<Text c="red">{error?.message}</Text>
			</Center>
		)
	}

	return (
		<Paper shadow="md" radius="md" p="lg" withBorder mih="15vh">
			<Stack>
				{tickets.meta.count > 0 ? (
					<Stack gap="xs">
						{tickets.data.map((ticket) => (
							<TicketCard key={ticket.id} ticket={ticket} />
						))}
						{tickets.meta.pageCount > 1 && (
							<Pagination
								total={tickets.meta.pageCount}
								value={page}
								onChange={(newPage) => {
									setPage(newPage)
								}}
								size="md"
								radius="xl"
							/>
						)}
					</Stack>
				) : (
					<Center>
						<Text c="gray" size="md">
							You haven’t purchased any event tickets yet.
						</Text>
					</Center>
				)}
			</Stack>
		</Paper>
	)
}

export default React.memo(TicketSection)
