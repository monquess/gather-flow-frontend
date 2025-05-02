import { Box, Paper, Text, Title } from '@mantine/core'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { FaArrowLeft } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

import VerifyAccountForm from '@/components/auth/verify-account-form'
import Footer from '@/components/general/footer'
import Header from '@/components/general/header'

import { useResponsive } from '@/hooks/use-responsive'

const VerifyPage: React.FC = () => {
	const { isMobile } = useResponsive()
	const navigate = useNavigate()
	const { t } = useTranslation()

	return (
		<Box
			h="100vh"
			style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
		>
			<Header isLandingPage={false} />
			<Box
				style={{
					flex: 1,
					justifyContent: 'center',
					alignItems: 'center',
				}}
				display="flex"
				h="100vh"
				p={isMobile ? 'xs' : 'md'}
				m={isMobile ? 'lg' : '0'}
			>
				<Paper
					p={isMobile ? 'md' : 'xl'}
					m={isMobile ? 'lg' : '0'}
					w="100%"
					maw={{
						base: '100%',
						xs: '400px',
					}}
					bd="1px solid #ccc"
					radius={25}
				>
					<FaArrowLeft
						size={isMobile ? 14 : 20}
						onClick={() => navigate('/login')}
					/>
					<Title order={1} ta="center" size={isMobile ? 'h2' : 'h1'}>
						{t('authPages.verifyAccount.title')}
					</Title>
					<Text size={isMobile ? 'xs' : 'sm'} mt="xs" c="dimmed">
						{t('authPages.verifyAccount.text')}
					</Text>
					<VerifyAccountForm />
				</Paper>
			</Box>
			<Footer />
		</Box>
	)
}

export default React.memo(VerifyPage)
