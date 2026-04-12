'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { t as translate, type Locale } from '@/lib/i18n'

type LanguageContextType = {
  locale: Locale
  toggleLocale: () => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType>({
  locale: 'it',
  toggleLocale: () => {},
  t: (key: string) => key,
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>('it')

  useEffect(() => {
    const stored = localStorage.getItem('b2work-lang') as Locale | null
    if (stored === 'en' || stored === 'it') setLocale(stored)
  }, [])

  useEffect(() => {
    document.documentElement.lang = locale
    localStorage.setItem('b2work-lang', locale)
  }, [locale])

  const toggleLocale = useCallback(() => {
    setLocale((prev) => (prev === 'it' ? 'en' : 'it'))
  }, [])

  const tFn = useCallback((key: string) => translate(locale, key), [locale])

  return (
    <LanguageContext.Provider value={{ locale, toggleLocale, t: tFn }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)
export const useT = () => useContext(LanguageContext).t
