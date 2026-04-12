'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Badge from '@/components/b2colf/ui/Badge'
import { GigCardSkeleton } from '@/components/b2colf/ui/Skeleton'
import { MapPin, Calendar, Clock, Euro, Search, PlusCircle, ArrowUpDown, Briefcase } from 'lucide-react'
import type { Gig } from '@/lib/types'

type SortOption = 'recent' | 'price_asc' | 'price_desc'

export default function GigsIndexPage() {
  const [gigs, setGigs] = useState<Gig[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('recent')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    async function fetchGigs() {
      try {
        const res = await fetch('/api/gigs')
        const data = await res.json()
        setGigs(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchGigs()
  }, [])

  let filtered = gigs
  if (statusFilter !== 'all') {
    filtered = filtered.filter((g) => g.status === statusFilter)
  }
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

  const sorted = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case 'price_asc': return (a.price || 0) - (b.price || 0)
      case 'price_desc': return (b.price || 0) - (a.price || 0)
      default: return 0
    }
  })

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Tutti gli annunci</h1>
          <p className="text-slate-500 mt-1">Sfoglia tutte le opportunità di lavoro disponibili</p>
        </div>
        <Link
          href="/gigs/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary-600 transition"
        >
          <PlusCircle className="h-4 w-4" />
          Pubblica annuncio
        </Link>
      </div>

      {/* Filters bar */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cerca per titolo, ruolo, città..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
          />
        </div>
        <div className="flex gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="all">Tutti gli stati</option>
            <option value="OPEN">Aperti</option>
            <option value="CLOSED">Chiusi</option>
          </select>
          <div className="flex items-center gap-1.5 border border-slate-200 rounded-xl px-3 py-2.5">
            <ArrowUpDown className="h-4 w-4 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="text-sm bg-transparent focus:outline-none"
            >
              <option value="recent">Più recenti</option>
              <option value="price_asc">Prezzo crescente</option>
              <option value="price_desc">Prezzo decrescente</option>
            </select>
          </div>
        </div>
      </div>

      <div className="text-sm text-slate-500 mb-4">{sorted.length} annunci trovati</div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => <GigCardSkeleton key={i} />)}
        </div>
      ) : sorted.length === 0 ? (
        <div className="text-center py-16">
          <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <Briefcase className="h-7 w-7 text-slate-400" />
          </div>
          <p className="font-semibold text-slate-700 text-lg">Nessun annuncio trovato</p>
          <p className="text-sm text-slate-500 mt-2">Prova a modificare la ricerca o i filtri.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {sorted.map((g) => (
            <Link key={g.id} href={`/gigs/${g.id}`} className="block border border-slate-100 rounded-xl p-5 hover:shadow-soft transition group">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 group-hover:text-primary transition">{g.title}</h3>
                  <div className="flex items-center gap-2 mt-1.5">
                    {g.category && <Badge variant="primary">{g.category}</Badge>}
                    {g.role && <Badge variant="outline">{g.role}</Badge>}
                    {g.status && <Badge variant={g.status === 'OPEN' ? 'success' : 'default'}>{g.status === 'OPEN' ? 'Aperto' : 'Chiuso'}</Badge>}
                  </div>
                </div>
                {g.price != null && (
                  <span className="text-xl font-bold text-primary flex items-center">
                    <Euro className="h-4 w-4" />{g.price}
                  </span>
                )}
              </div>

              {g.description && <p className="mt-2 text-sm text-slate-600 line-clamp-2">{g.description}</p>}

              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                {g.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{g.location}</span>}
                {g.date && <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(g.date).toLocaleDateString('it-IT')}</span>}
                {g.duration_hours && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{g.duration_hours}h</span>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
