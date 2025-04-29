import '@/i18n'
import '@mantine/carousel/styles.css'
import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
import { Notifications } from '@mantine/notifications'
import '@mantine/notifications/styles.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Route, Routes } from 'react-router-dom'

import {
	CheckoutSuccessPage,
	CompaniesPage,
	CompanyCreatePage,
	CompanyPage,
	CompanyUpdatePage,
	EventCheckoutPage,
	EventCreatePage,
	EventPage,
	EventsPage,
	GoogleSuccessPage,
	Homepage,
	LandingPage,
	LoginPage,
	NotFound,
	RegisterPage,
	ResetPasswordPage,
	UserProfilePage,
	VerifyPage,
} from './pages'

import { theme } from './theme'

const queryClient = new QueryClient()

const routes = [
	{ path: '*', element: <NotFound /> },
	{ path: '/', element: <LandingPage /> },
	{ path: '/home', element: <Homepage /> },

	{ path: '/register', element: <RegisterPage /> },
	{ path: '/login', element: <LoginPage /> },
	{ path: '/google-success', element: <GoogleSuccessPage /> },
	{ path: '/reset-password', element: <ResetPasswordPage /> },
	{ path: '/verify', element: <VerifyPage /> },

	{ path: '/profile', element: <UserProfilePage /> },
	{ path: '/companies', element: <CompaniesPage /> },
	{ path: '/companies/:id', element: <CompanyPage /> },
	{ path: '/companies/create', element: <CompanyCreatePage /> },
	{ path: '/companies/:id/update', element: <CompanyUpdatePage /> },
	{ path: '/companies/:id/event/create', element: <EventCreatePage /> },

	{ path: '/events', element: <EventsPage /> },
	{ path: '/events/:id', element: <EventPage /> },
	{ path: '/events/:id/checkout', element: <EventCheckoutPage /> },
	{ path: '/checkout-success', element: <CheckoutSuccessPage /> },
]

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<MantineProvider theme={theme}>
				<Notifications zIndex={5000} />
				<Routes>
					{routes.map((route) => (
						<Route key={route.path} path={route.path} element={route.element} />
					))}
				</Routes>
			</MantineProvider>
		</QueryClientProvider>
	)
}

export default App
