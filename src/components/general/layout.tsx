import { Container, Stack } from '@mantine/core'
import React from 'react'

import Footer from './footer'
import MainHeader from './main-header'

interface LayoutProps {
	children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
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
			<Stack gap="xl" style={{ flex: 1 }} justify="center">
				{children}
			</Stack>
			<Footer />
		</Container>
	)
}

export default Layout
