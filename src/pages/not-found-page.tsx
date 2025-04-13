import { Button, Container, Group, Text, Title } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

const NotFound: React.FC = () => {
	const { t } = useTranslation()

	return (
		<Container size="lg" style={{ textAlign: 'center', paddingTop: '50px' }}>
			<Title order={1} size={50} c="red">
				{t('notFound.title')}
			</Title>
			<Text size="lg" c="dimmed">
				{t('notFound.message')}
			</Text>
			<Group mt="lg" justify="center">
				<Button component={Link} to="/" variant="filled">
					{t('notFound.goHome')}
				</Button>
			</Group>
		</Container>
	)
}

export default NotFound
