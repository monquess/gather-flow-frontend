import '@/i18n'
import LoginPage from '@/pages/auth/login-page'
import '@mantine/carousel/styles.css'
import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
import { Notifications } from '@mantine/notifications'
import '@mantine/notifications/styles.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Route, Routes } from 'react-router-dom'
import GoogleSuccessPage from './pages/auth/google-success-page'
import RegisterPage from './pages/auth/register-page'
import ResetPasswordPage from './pages/auth/reset-password-page'
import VerifyPage from './pages/auth/verify-account-page'
import CompaniesPage from './pages/company/companies-page'
import CompanyCreatePage from './pages/company/company-create-page'
import CompanyPage from './pages/company/company-page'
import CompanyUpdatePage from './pages/company/company-update-page'
import EventPage from './pages/event/event-page'
import EventsPage from './pages/event/events-page'
import Homepage from './pages/homepage'
import LandingPage from './pages/landing-page'
import NotFound from './pages/not-found-page'
import UserProfilePage from './pages/profile-page'
import { theme } from './theme'

const queryClient = new QueryClient()

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<MantineProvider theme={theme}>
				<Notifications zIndex={5000} />
				<Routes>
					<Route path="/" element={<LandingPage />} />
					<Route path="*" element={<NotFound />} />
					<Route path="/home" element={<Homepage />} />

					<Route path="/register" element={<RegisterPage />} />
					<Route path="/login" element={<LoginPage />} />
					<Route path="/google-success" element={<GoogleSuccessPage />} />
					<Route path="/reset-password" element={<ResetPasswordPage />} />
					<Route path="/verify" element={<VerifyPage />} />

					<Route path="/profile" element={<UserProfilePage />} />
					<Route path="/companies" element={<CompaniesPage />} />
					<Route path="/companies/:id" element={<CompanyPage />} />
					<Route path="/companies/create" element={<CompanyCreatePage />} />
					<Route path="/companies/:id/update" element={<CompanyUpdatePage />} />

					<Route path="/events" element={<EventsPage />} />
					<Route path="/events/:id" element={<EventPage />} />
				</Routes>
			</MantineProvider>
		</QueryClientProvider>
	)
}

export default App
