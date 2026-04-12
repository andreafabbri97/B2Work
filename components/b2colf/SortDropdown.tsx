'use client'

import React from 'react'
import { useFilter } from './context/FilterContext'
import { ArrowUpDown } from 'lucide-react'

export default function SortDropdown() {
  const { sortBy, setSortBy } = useFilter()

  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="h-4 w-4 text-slate-400" />
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value as any)}
        className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
      >
        <option value="recent">Più recenti</option>
        <option value="price_asc">Prezzo crescente</option>
        <option value="price_desc">Prezzo decrescente</option>
        <option value="rating">Rating più alto</option>
      </select>
    </div>
  )
}
