'use client'

import React, { useEffect, useState } from 'react'
import { useFilter } from './context/FilterContext'
import { useLanguage } from './context/LanguageContext'
import { getCategories } from '@/lib/api'

type Category = { id: number; slug: string; name: string }

export default function MobileCategoryFilter() {
  const [cats, setCats] = useState<Category[]>([])
  const { selectedCategory, setSelectedCategory } = useFilter()
  const { t } = useLanguage()

  useEffect(() => {
    async function fetchCats() {
      try {
        const data = await getCategories()
        setCats(data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchCats()
  }, [])

  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
      <button
        onClick={() => setSelectedCategory(null)}
        className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition ${
          !selectedCategory
            ? 'bg-primary text-white shadow-sm'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
        }`}
      >
        {t('categories.all')}
      </button>
      {cats.map((c) => (
        <button
          key={c.id}
          onClick={() => setSelectedCategory(selectedCategory === c.name ? null : c.name)}
          className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition ${
            selectedCategory === c.name
              ? 'bg-primary text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          {c.name}
        </button>
      ))}
    </div>
  )
}
