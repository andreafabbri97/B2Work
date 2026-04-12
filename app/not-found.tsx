'use client'

import Link from 'next/link'
import { Home, Search } from 'lucide-react'
import { useLanguage } from '@/components/b2colf/context/LanguageContext'

export default function NotFound() {
  const { t } = useLanguage()

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="text-8xl font-extrabold text-primary-200 select-none">404</div>
      <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-slate-100">{t('notfound.title')}</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400 max-w-md">
        {t('notfound.desc')}
      </p>
      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-600 transition"
        >
          <Home className="h-4 w-4" />
          {t('notfound.home')}
        </Link>
        <Link
          href="/discovery"
          className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
        >
          <Search className="h-4 w-4" />
          {t('notfound.search')}
        </Link>
      </div>
    </div>
  )
}
