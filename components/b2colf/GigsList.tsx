'use client'

import React, { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { useFilter } from './context/FilterContext'
import { useToast } from './context/ToastContext'
import { useFavorites } from './context/FavoritesContext'
import { useLanguage } from './context/LanguageContext'
import Dialog from './ui/Dialog'
import Input from './ui/Input'
import Label from './ui/Label'
import Badge from './ui/Badge'
import { GigCardSkeleton } from './ui/Skeleton'
import { MapPin, Clock, Calendar, Heart, Euro, Search, PlusCircle } from 'lucide-react'
import type { Gig } from '@/lib/types'
import { getGigs } from '@/lib/api'

const ITEMS_PER_PAGE = 6

export default function GigsList() {
  const [gigs, setGigs] = useState<Gig[]>([])
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState<Gig | null>(null)
  const [page, setPage] = useState(1)
  const applyDateRef = useRef<HTMLInputElement>(null)
  const { selectedCategory, searchQuery, sortBy } = useFilter()
  const { showToast } = useToast()
  const { toggleFavorite, isFavorite } = useFavorites()
  const { t } = useLanguage()

  useEffect(() => {
    async function fetchGigs() {
      setLoading(true)
      try {
        const data = await getGigs()
        setGigs(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchGigs()
  }, [])

  // Reset page when filters change
  useEffect(() => { setPage(1) }, [selectedCategory, searchQuery, sortBy])

  // Filter
  let filtered = gigs
  if (selectedCategory) filtered = filtered.filter((g) => g.category === selectedCategory)
  if (searchQuery) {
    const q = searchQuery.toLowerCase()
    filtered = filtered.filter((g) =>
      g.title.toLowerCase().includes(q) ||
      g.description?.toLowerCase().includes(q) ||
      g.category?.toLowerCase().includes(q) ||
      g.role?.toLowerCase().includes(q) ||
      g.location?.toLowerCase().includes(q)
    )
  }

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case 'price_asc': return (a.price || 0) - (b.price || 0)
      case 'price_desc': return (b.price || 0) - (a.price || 0)
      default: return 0
    }
  })

  // Pagination
  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE)
  const paginated = sorted.slice(0, page * ITEMS_PER_PAGE)

  async function submitApplication(payload: { host_id?: string; colf_id?: string; gig_id: string; date?: string; total_price?: number }) {
    try {
      const res = await fetch('/api/bookings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || t('gigs.apply_error'))
      setApplying(null)
      showToast(t('gigs.apply_success'), 'success')
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : t('common.unknown_error'), 'error')
    }
  }

  if (loading) return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {[1,2,3,4].map(i => <GigCardSkeleton key={i} />)}
    </div>
  )

  return (
    <>
      <div className="text-sm text-slate-500 dark:text-slate-400 mb-3">{sorted.length} {t('gigs.found')}</div>

      {!sorted.length ? (
        <div className="text-center py-16">
          <div className="mx-auto w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <Search className="h-7 w-7 text-slate-400" />
          </div>
          <p className="font-semibold text-slate-700 dark:text-slate-300 text-lg">{t('gigs.empty_title')}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto">{t('gigs.empty_desc')}</p>
          <Link href="/gigs/new" className="inline-flex items-center gap-2 mt-4 px-5 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition">
            <PlusCircle className="h-4 w-4" /> {t('gigs.publish')}
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {paginated.map((g) => (
              <article key={g.id} className="border border-slate-100 dark:border-slate-700 rounded-xl p-4 hover:shadow-soft transition group">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Link href={`/gigs/${g.id}`} className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-primary transition">
                      {g.title}
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      {g.category && <Badge variant="primary">{g.category}</Badge>}
                      {g.role && <Badge variant="outline">{g.role}</Badge>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleFavorite(g.id)} className="p-1 hover:bg-slate-50 dark:hover:bg-slate-800 rounded transition">
                      <Heart className={`h-4 w-4 ${isFavorite(g.id) ? 'fill-danger text-danger' : 'text-slate-300'}`} />
                    </button>
                    <span className="text-lg font-bold text-primary flex items-center">
                      <Euro className="h-4 w-4" />{g.price}
                    </span>
                  </div>
                </div>

                {g.description && <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{g.description}</p>}

                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                  {g.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{g.location}</span>}
                  {g.date && <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(g.date).toLocaleDateString('it-IT')}</span>}
                  {g.duration_hours && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{g.duration_hours}h</span>}
                </div>

                <div className="mt-3 flex justify-end">
                  <button onClick={() => setApplying(g)} className="text-sm rounded-lg bg-primary hover:bg-primary-600 px-4 py-1.5 text-white transition font-medium">
                    {t('gigs.apply')}
                  </button>
                </div>
              </article>
            ))}
          </div>

          {page < totalPages && (
            <div className="mt-6 text-center">
              <button onClick={() => setPage(p => p + 1)} className="px-6 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                {t('gigs.load_more')}
              </button>
            </div>
          )}
        </>
      )}

      {applying && (
        <Dialog open={true} onOpenChange={() => setApplying(null)} title={`${t('gigs.apply_for')}: ${applying.title}`}>
          <p className="text-sm text-slate-500 dark:text-slate-400">{t('gigs.price_hint')}: &euro;{applying.price}</p>

          <div className="mt-4 space-y-2">
            <Label>{t('gigs.date_label')}</Label>
            <Input type="datetime-local" ref={applyDateRef} />
          </div>

          <div className="mt-4 flex gap-2 justify-end">
            <button className="px-4 py-1.5 border border-slate-200 dark:border-slate-600 rounded-lg text-sm" onClick={() => setApplying(null)}>{t('gigs.cancel')}</button>
            <button className="px-4 py-1.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition" onClick={() => {
              const date = applyDateRef.current?.value
              submitApplication({ gig_id: applying.id, date: date ? new Date(date).toISOString() : undefined, total_price: applying.price })
            }}>{t('gigs.submit_apply')}</button>
          </div>
        </Dialog>
      )}
    </>
  )
}
