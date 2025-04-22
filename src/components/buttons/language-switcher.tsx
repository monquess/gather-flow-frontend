import { Button, Group, Menu } from '@mantine/core'
import { useTranslation } from 'react-i18next'

const LanguageSwitcher: React.FC = () => {
	const { i18n } = useTranslation()

	const changeLanguage = (lng: string) => {
		i18n.changeLanguage(lng)
	}

	const currentLang = i18n.language.toUpperCase()

	return (
		<Group p="right">
			<Menu shadow="md" width={150}>
				<Menu.Target>
					<Button variant="outline">{currentLang}</Button>
				</Menu.Target>

				<Menu.Dropdown>
					<Menu.Item onClick={() => changeLanguage('en')}>English</Menu.Item>
					<Menu.Item onClick={() => changeLanguage('pl')}>Polski</Menu.Item>
					<Menu.Item onClick={() => changeLanguage('ua')}>Українська</Menu.Item>
				</Menu.Dropdown>
			</Menu>
		</Group>
	)
}

export default LanguageSwitcher
