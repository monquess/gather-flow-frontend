import { Box, Container, Paper, Title } from '@mantine/core'
import React from 'react'

import RegisterForm from '@/components/auth/register-form'
import Footer from '@/components/general/footer'
import Header from '@/components/general/header'

import { useResponsive } from '@/hooks/use-responsive'
import { useTranslation } from 'react-i18next'

const RegisterPage: React.FC = () => {
	const { isMobile } = useResponsive()
	const { t } = useTranslation()

	return (
		<Paper h="100vh">
			<Header isLandingPage={false} />
			<Box
				style={{
					justifyContent: 'center',
					alignItems: 'center',
				}}
				display="flex"
				h="100vh"
				p={isMobile ? 'xs' : 'md'}
				m={isMobile ? 'lg' : '0'}
			>
				<Container
					p={isMobile ? 'md' : 'xl'}
					m={isMobile ? 'lg' : '0'}
					w="100%"
					maw={{
						base: '100%',
						xs: '400px',
					}}
					style={(theme) => ({
						borderRadius: isMobile ? 15 : 25,
						border: '1px solid #ccc',
						boxShadow: theme.shadows.sm,
					})}
				>
					<Title order={1} mb="md" ta="center" size={isMobile ? 'h2' : 'h1'}>
						{t('authPages.register')}
					</Title>
					<RegisterForm />
				</Container>
			</Box>
			<Footer />
		</Paper>
	)
}

export default React.memo(RegisterPage)
