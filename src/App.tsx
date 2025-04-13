import '@/i18n'
import LoginPage from '@/pages/auth/login-page'
import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import { Notifications } from '@mantine/notifications'
import '@mantine/notifications/styles.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Route, Routes } from 'react-router-dom'
import GoogleSuccessPage from './pages/auth/google-success-page'
import RegisterPage from './pages/auth/register-page'
import ResetPasswordPage from './pages/auth/reset-password-page'
import VerifyPage from './pages/auth/verify-account-page'
import Homepage from './pages/homepage'
import LandingPage from './pages/landing-page'
import NotFound from './pages/not-found-page'
import { theme } from './theme'

const queryClient = new QueryClient()

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<MantineProvider theme={theme}>
				<Notifications zIndex={5000} />
				<Routes>
					<Route path="/register" element={<RegisterPage />} />
					<Route path="/login" element={<LoginPage />} />
					<Route path="/google-success" element={<GoogleSuccessPage />} />
					<Route path="/reset-password" element={<ResetPasswordPage />} />
					<Route path="/verify" element={<VerifyPage />} />
					<Route path="/" element={<LandingPage />} />
					<Route path="*" element={<NotFound />} />
					<Route path="/home" element={<Homepage />} />
				</Routes>
			</MantineProvider>
		</QueryClientProvider>
	)
}

export default App
