import {
	ActionIcon,
	Badge,
	Card,
	Flex,
	Group,
	Rating,
	Stack,
	Text,
} from '@mantine/core'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

import dayjs from 'dayjs'
import { motion } from 'framer-motion'

import { Company } from '@/shared/types/company'
import { GoTrash } from 'react-icons/go'
import { GrUpdate } from 'react-icons/gr'
import DeleteCompanyModal from './modal/delete-company-modal'

interface CompanyCardProps {
	company: Company
	delay?: number
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company, delay }) => {
	const location = useLocation()
	const { t } = useTranslation()
	const navigate = useNavigate()
	const [deleteCompany, setDeleteCompany] = useState(false)

	return (
		<Card
			withBorder
			shadow="xl"
			radius="md"
			padding="md"
			h={250}
			onClick={() => {
				if (!deleteCompany) {
					navigate(`/companies/${company.id}`)
				}
			}}
			style={{ overflow: 'hidden', cursor: 'pointer' }}
		>
			<motion.div
				whileHover={{ scale: 1.02 }}
				whileTap={{ scale: 0.98 }}
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, ease: 'easeOut', delay }}
				style={{ height: '100%' }}
			>
				<Stack justify="space-between" h="100%">
					<Flex justify="space-between">
						<Text size="lg" fw={600} lineClamp={1} mih="24px">
							{company.name}
						</Text>
						{location.pathname === '/profile' ? (
							<Group>
								<ActionIcon
									variant="outline"
									onClick={(e) => {
										e.stopPropagation()
										navigate(`/companies/${company?.id}/update`)
									}}
								>
									<GrUpdate size={14} />
								</ActionIcon>
								<ActionIcon
									variant="outline"
									onClick={(e) => {
										e.stopPropagation()
										setDeleteCompany(true)
									}}
								>
									<GoTrash size={14} />
								</ActionIcon>
							</Group>
						) : null}
					</Flex>

					<Text size="sm" c="dimmed" lineClamp={2} mih="36px">
						{company.description}
					</Text>

					<Stack gap="xs" mt="auto">
						<Text size="sm" lineClamp={1}>
							{company.email}
						</Text>
						<Badge variant="light">
							{company?.location?.split(',').pop()?.trim()}
						</Badge>
					</Stack>

					<Flex justify="space-between" align="center">
						<Text size="xs" c="gray">
							{t('companyCard.createdAt', {
								date: dayjs(company.createdAt).format('DD MMM YYYY'),
							})}
						</Text>
						<Group gap={0}>
							<Rating
								defaultValue={company.rating}
								fractions={10}
								size="xs"
								readOnly
							/>
							<Text size="sm" c="dimmed" ml="2">
								({company.reviews})
							</Text>
						</Group>
					</Flex>
				</Stack>
			</motion.div>
			<DeleteCompanyModal
				opened={deleteCompany}
				onClose={() => {
					setDeleteCompany(false)
				}}
				company={company}
			/>
		</Card>
	)
}

export default React.memo(CompanyCard)
