'use client'

import React from 'react'
import { useFilter } from './context/FilterContext'
import { ArrowUpDown } from 'lucide-react'
import { useLanguage } from './context/LanguageContext'

export default function SortDropdown() {
  const { sortBy, setSortBy } = useFilter()
  const { t } = useLanguage()

  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="h-4 w-4 text-slate-400" />
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value as any)}
        className="text-sm border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-1.5 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20"
      >
        <option value="recent">{t('sort.recent')}</option>
        <option value="price_asc">{t('sort.price_asc')}</option>
        <option value="price_desc">{t('sort.price_desc')}</option>
        <option value="rating">{t('sort.rating')}</option>
      </select>
    </div>
  )
}
