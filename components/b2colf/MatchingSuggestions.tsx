'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Sparkles, MapPin, Star, Euro, ArrowRight } from 'lucide-react'
import Badge from '@/components/b2colf/ui/Badge'
import type { Profile, Gig } from '@/lib/types'
import { getMatchingGigs, getProfiles } from '@/lib/api'

type Props = {
  type: 'professionals' | 'gigs'
  role?: string
  category?: string
  city?: string
  limit?: number
  title?: string
}

export default function MatchingSuggestions({ type, role, category, city, limit = 6, title }: Props) {
  const [items, setItems] = useState<(Profile | Gig)[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMatches() {
      try {
        const params = new URLSearchParams({ type, limit: String(limit) })
        if (role) params.set('role', role)
        if (category) params.set('category', category)
        if (city) params.set('city', city)

        // Try to get user location
        if (navigator.geolocation) {
          try {
            const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
              navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 3000 })
            )
            params.set('lat', String(pos.coords.latitude))
            params.set('lng', String(pos.coords.longitude))
          } catch {
            // Geolocation not available, continue without it
          }
        }

        if (type === 'gigs') {
          const data = await getMatchingGigs({ category, city })
          setItems(data)
        } else {
          const data = await getProfiles({ city, role })
          setItems(data.slice(0, limit))
        }
      } catch (err) {
        console.error('Errore caricamento suggerimenti:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchMatches()
  }, [type, role, category, city, limit])

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
        ))}
      </div>
    )
  }

  if (items.length === 0) return null

  const defaultTitle = type === 'professionals' ? 'Professionisti consigliati' : 'Annunci consigliati per te'

  return (
    <div>
      <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-accent" />
        {title || defaultTitle}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((item) => {
          if (type === 'professionals') {
            const p = item as Profile & { distance_km?: number }
            return (
              <Link
                key={p.id}
                href={`/profile/${p.id}`}
                className="border border-slate-100 dark:border-slate-700 rounded-xl p-4 hover:shadow-soft transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-100 to-primary-300 flex items-center justify-center text-primary font-semibold text-sm flex-shrink-0">
                    {p.avatar_url ? (
                      <img src={p.avatar_url} alt={p.full_name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      p.full_name?.charAt(0)?.toUpperCase() || '?'
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-slate-900 dark:text-slate-100 text-sm truncate group-hover:text-primary transition">{p.full_name}</div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      {p.role && <Badge variant="secondary">{p.role}</Badge>}
                      {p.city && <span className="flex items-center gap-0.5"><MapPin className="h-3 w-3" />{p.city}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-2 text-xs">
                  {p.rating_avg > 0 && (
                    <span className="flex items-center gap-0.5 text-accent font-medium">
                      <Star className="h-3 w-3 fill-accent" />{p.rating_avg.toFixed(1)}
                    </span>
                  )}
                  {p.hourly_rate && (
                    <span className="flex items-center gap-0.5 text-primary font-medium">
                      <Euro className="h-3 w-3" />{p.hourly_rate}/h
                    </span>
                  )}
                  {p.distance_km !== undefined && p.distance_km !== null && (
                    <span className="text-slate-400">{p.distance_km} km</span>
                  )}
                </div>
              </Link>
            )
          }

          const g = item as Gig & { distance_km?: number }
          return (
            <Link
              key={g.id}
              href={`/gigs/${g.id}`}
              className="border border-slate-100 rounded-xl p-4 hover:shadow-soft transition group"
            >
              <h4 className="font-medium text-slate-900 dark:text-slate-100 text-sm truncate group-hover:text-primary transition">{g.title}</h4>
              <div className="flex items-center gap-2 mt-1">
                {g.category && <Badge variant="primary">{g.category}</Badge>}
                {g.location && <span className="text-xs text-slate-500 flex items-center gap-0.5"><MapPin className="h-3 w-3" />{g.location}</span>}
              </div>
              <div className="flex items-center justify-between mt-2">
                {g.price && <span className="text-sm font-bold text-primary flex items-center"><Euro className="h-3.5 w-3.5" />{g.price}</span>}
                {g.distance_km !== undefined && g.distance_km !== null && (
                  <span className="text-xs text-slate-400">{g.distance_km} km</span>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
