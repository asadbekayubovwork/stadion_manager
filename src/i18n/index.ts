import { createI18n } from 'vue-i18n'
import uz from './locales/uz'
import ru from './locales/ru'
import en from './locales/en'

const savedLang = localStorage.getItem('sm_lang') || 'uz'

export const i18n = createI18n({
  legacy: false,
  locale: savedLang,
  fallbackLocale: 'uz',
  messages: { uz, ru, en },
})

export default i18n
