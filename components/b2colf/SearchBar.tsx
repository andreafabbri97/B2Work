'use client'

import React, { useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'
import { useFilter } from './context/FilterContext'
import { useLanguage } from './context/LanguageContext'

export default function SearchBar() {
  const { searchQuery, setSearchQuery } = useFilter()
  const { t } = useLanguage()
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  const handleChange = (value: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => setSearchQuery(value), 300)
  }

  useEffect(() => {
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [])

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
      <input
        ref={inputRef}
        defaultValue={searchQuery}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={t('search.placeholder')}
        className="w-full rounded-xl border border-slate-200 dark:border-slate-600 pl-10 pr-10 py-2.5 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
      />
      {searchQuery && (
        <button
          onClick={() => { setSearchQuery(''); if (inputRef.current) inputRef.current.value = '' }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
