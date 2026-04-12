'use client'

import React, { useEffect, useState } from 'react'
import { useFilter } from './context/FilterContext'

type Category = { id: number; slug: string; name: string }

export default function MobileCategoryFilter() {
  const [cats, setCats] = useState<Category[]>([])
  const { selectedCategory, setSelectedCategory } = useFilter()

  useEffect(() => {
    async function fetchCats() {
      try {
        const res = await fetch('/api/categories')
        const data = await res.json()
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
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
        }`}
      >
        Tutte
      </button>
      {cats.map((c) => (
        <button
          key={c.id}
          onClick={() => setSelectedCategory(selectedCategory === c.name ? null : c.name)}
          className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition ${
            selectedCategory === c.name
              ? 'bg-primary text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          {c.name}
        </button>
      ))}
    </div>
  )
}
