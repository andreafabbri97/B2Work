import it from './it.json'
import en from './en.json'

export type Locale = 'it' | 'en'

const translations: Record<Locale, Record<string, string>> = { it, en }

export function t(locale: Locale, key: string): string {
  return translations[locale]?.[key] ?? translations.it?.[key] ?? key
}
