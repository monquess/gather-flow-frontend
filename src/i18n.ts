import i18n, { InitOptions } from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'

const options: InitOptions = {
	fallbackLng: 'en',
	debug: true,
	interpolation: {
		escapeValue: false,
	},
	backend: {
		loadPath: '/src/shared/locales/{{lng}}/translation.json',
	},
}

i18n.use(Backend).use(LanguageDetector).use(initReactI18next).init(options)

export default i18n
