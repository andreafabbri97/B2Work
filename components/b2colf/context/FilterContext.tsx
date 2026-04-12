'use client'

import React, { createContext, useContext, useState } from 'react'

type SortOption = 'recent' | 'price_asc' | 'price_desc' | 'rating'
type ActiveTab = 'gigs' | 'professionals'

type FilterContextType = {
  selectedCategory: string | null
  setSelectedCategory: (c: string | null) => void
  searchQuery: string
  setSearchQuery: (q: string) => void
  sortBy: SortOption
  setSortBy: (s: SortOption) => void
  activeTab: ActiveTab
  setActiveTab: (t: ActiveTab) => void
}

const FilterContext = createContext<FilterContextType | undefined>(undefined)

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('recent')
  const [activeTab, setActiveTab] = useState<ActiveTab>('gigs')

  return (
    <FilterContext.Provider value={{ selectedCategory, setSelectedCategory, searchQuery, setSearchQuery, sortBy, setSortBy, activeTab, setActiveTab }}>
      {children}
    </FilterContext.Provider>
  )
}

export function useFilter() {
  const ctx = useContext(FilterContext)
  if (!ctx) throw new Error('useFilter must be used within FilterProvider')
  return ctx
}
