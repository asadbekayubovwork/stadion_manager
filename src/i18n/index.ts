import { createI18n } from 'vue-i18n'
import uz from './locales/uz'
import uzCyrl from './locales/uz-cyrl'
import ru from './locales/ru'

export const SUPPORTED_LOCALES = ['uz', 'uz-cyrl', 'ru'] as const
export type AppLocale = (typeof SUPPORTED_LOCALES)[number]

const stored = localStorage.getItem('sm_lang')
const savedLang: AppLocale = (SUPPORTED_LOCALES as readonly string[]).includes(stored ?? '')
  ? (stored as AppLocale)
  : 'uz'

export const i18n = createI18n({
  legacy: false,
  locale: savedLang,
  fallbackLocale: 'uz',
  messages: { uz, 'uz-cyrl': uzCyrl, ru },
})

export default i18n
