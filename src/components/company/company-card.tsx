import { CompanyItem } from '@/shared/types/companies'
import { Badge, Card, Group, Stack, Text } from '@mantine/core'
import dayjs from 'dayjs'
import { motion } from 'framer-motion'
import React from 'react'

interface CompanyCardProps {
	company: CompanyItem
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company }) => {
	return (
		<Card withBorder shadow="xl" radius="md" padding="md">
			<motion.div
				whileHover={{ scale: 1.02 }}
				whileTap={{ scale: 0.98 }}
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, ease: 'easeOut' }}
			>
				<Stack mt="md">
					<Text size="lg" fw={600} lineClamp={1}>
						{company.name}
					</Text>

					<Text size="sm" c="dimmed" lineClamp={2}>
						{company.description}
					</Text>

					<Group mt="xs">
						<Text size="sm">{company.email}</Text>
						<Badge variant="light">{company.location}</Badge>
					</Group>

					<Text size="xs" c="gray">
						Created on: {dayjs(company.createdAt).format('DD MMM YYYY')}
					</Text>
				</Stack>
			</motion.div>
		</Card>
	)
}

export default React.memo(CompanyCard)
