import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'

i18n
	.use(Backend)
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		fallbackLng: 'en',
		debug: true,
		interpolation: {
			escapeValue: false,
		},
		backend: {
			loadPath: '/src/shared/language/{{lng}}/translation.json',
		},
	})

export default i18n

// import i18n from 'i18next'
// import LanguageDetector from 'i18next-browser-languagedetector'
// import { initReactI18next } from 'react-i18next'
// import en from './src/shared/language/en/translation.json'
// import pl from './src/shared/language/pl/translation.json'
// import ua from './src/shared/language/ua/translation.json'

// i18n
// 	.use(LanguageDetector)
// 	.use(initReactI18next)
// 	.init({
// 		lng: 'en',
// 		fallbackLng: 'en',
// 		debug: true,
// 		interpolation: {
// 			escapeValue: false,
// 		},
// 		resources: {
// 			en: {
// 				translation: en,
// 			},
// 			ua: {
// 				translation: ua,
// 			},
// 			pl: {
// 				translation: pl,
// 			},
// 		},
// 	})

// export default i18n
