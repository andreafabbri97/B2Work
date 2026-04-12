'use client'

import React, { useEffect, useState } from 'react'
import { useFilter } from './context/FilterContext'
import { getCategories } from '@/lib/api'
import { Utensils, Home, PartyPopper, Truck, ShoppingBag, Wrench, GraduationCap, Heart, LayoutGrid } from 'lucide-react'

type Category = { id: number; slug: string; name: string }

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  'Ristorazione': Utensils,
  'Hospitality': Home,
  'Eventi': PartyPopper,
  'Logistica': Truck,
  'Retail': ShoppingBag,
  'Manutenzione': Wrench,
  'Formazione': GraduationCap,
  'Cura persona': Heart,
}

export default function CategoryList() {
  const [cats, setCats] = useState<Category[]>([])
  const { selectedCategory, setSelectedCategory } = useFilter()

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
    <div className="space-y-1">
      <button
        onClick={() => setSelectedCategory(null)}
        className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition ${
          !selectedCategory ? 'bg-primary text-white' : 'text-slate-700 hover:bg-slate-50'
        }`}
      >
        <LayoutGrid className="h-4 w-4" />
        Tutte le categorie
      </button>

      {cats.map((c) => {
        const IconComp = CATEGORY_ICONS[c.name] || LayoutGrid
        const isActive = selectedCategory === c.name
        return (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.name)}
            className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition ${
              isActive ? 'bg-primary text-white' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <IconComp className="h-4 w-4" />
            {c.name}
          </button>
        )
      })}
    </div>
  )
}
