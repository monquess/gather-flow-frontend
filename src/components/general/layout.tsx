import React from 'react'
import { Container, Stack } from '@mantine/core'

import MainHeader from './main-header'
import Footer from './footer'

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
			<Stack gap="xl" style={{ flex: 1 }} justify="center">
				<MainHeader />
				{children}
				<Footer />
			</Stack>
		</Container>
	)
}

export default Layout
