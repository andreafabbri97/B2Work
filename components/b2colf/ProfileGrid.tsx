'use client'

import React, { useEffect, useState } from 'react'
import ProfileCard from './ProfileCard'
import { ProfileCardSkeleton } from './ui/Skeleton'
import { useFilter } from './context/FilterContext'
import { Users } from 'lucide-react'
import type { Profile } from '@/lib/types'
import { getProfiles } from '@/lib/api'

export default function ProfileGrid() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)

  const { selectedCategory, searchQuery, sortBy } = useFilter()

  useEffect(() => {
    async function fetchProfiles() {
      setLoading(true)
      try {
        const data = await getProfiles()
        const mapped = data.map((p: any) => ({ ...p, role: p.role || p.category }))
        setProfiles(mapped)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProfiles()
  }, [])

  if (loading) return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1,2,3].map(i => <ProfileCardSkeleton key={i} />)}
    </div>
  )

  let filtered = selectedCategory ? profiles.filter((p) => p.role === selectedCategory) : profiles

  if (searchQuery) {
    const q = searchQuery.toLowerCase()
    filtered = filtered.filter((p) =>
      p.full_name?.toLowerCase().includes(q) ||
      p.city?.toLowerCase().includes(q) ||
      p.bio?.toLowerCase().includes(q) ||
      p.role?.toLowerCase().includes(q)
    )
  }

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'rating') return (b.rating_avg || 0) - (a.rating_avg || 0)
    return 0
  })

  if (!sorted.length) return (
    <div className="text-center py-16">
      <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
        <Users className="h-7 w-7 text-slate-400" />
      </div>
      <p className="font-semibold text-slate-700 text-lg">Nessun professionista trovato</p>
      <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">Prova a modificare i filtri o la ricerca per trovare i professionisti che cerchi.</p>
    </div>
  )

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {sorted.map((p) => (
        <ProfileCard key={p.id} {...p} />
      ))}
    </div>
  )
}
