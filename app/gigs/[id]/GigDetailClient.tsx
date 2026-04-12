'use client'

import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Calendar, Clock, Euro, Briefcase, ArrowLeft, Tag, Heart } from 'lucide-react'
import Badge from '@/components/b2colf/ui/Badge'
import Dialog from '@/components/b2colf/ui/Dialog'
import Input from '@/components/b2colf/ui/Input'
import Label from '@/components/b2colf/ui/Label'
import { useToast } from '@/components/b2colf/context/ToastContext'
import type { Gig } from '@/lib/types'
import { getGigById, getGigs } from '@/lib/api'

export default function GigDetailClient() {
  const params = useParams()
  const [gig, setGig] = useState<Gig | null>(null)
  const [related, setRelated] = useState<Gig[]>([])
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const applyDateRef = useRef<HTMLInputElement>(null)
  const { showToast } = useToast()

  useEffect(() => {
    async function fetchGig() {
      try {
        const found = await getGigById(params.id as string)
        if (!found) { setGig(null); return }
        setGig(found)

        // Fetch related gigs (same category) separately
        if (found.category) {
          const allGigs = await getGigs({ category: found.category })
          setRelated(allGigs.filter((g) => g.id !== found.id).slice(0, 3))
        }
      } catch (err) {
        console.error('Errore caricamento annuncio:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchGig()
  }, [params.id])

  async function submitApplication() {
    if (!gig) return
    try {
      const date = applyDateRef.current?.value
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gig_id: gig.id, date: date ? new Date(date).toISOString() : undefined, total_price: gig.price }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Errore nella candidatura')
      setApplying(false)
      showToast('Candidatura inviata con successo!', 'success')
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Errore sconosciuto', 'error')
    }
  }

  if (loading) return (
    <div className="max-w-3xl mx-auto animate-pulse space-y-4 py-8">
      <div className="h-8 bg-slate-200 rounded w-2/3" />
      <div className="h-4 bg-slate-200 rounded w-1/3" />
      <div className="h-40 bg-slate-200 rounded" />
    </div>
  )

  if (!gig) return (
    <div className="text-center py-16">
      <p className="text-xl font-semibold text-slate-700">Annuncio non trovato</p>
      <Link href="/discovery" className="mt-4 inline-block text-primary hover:underline">Torna alla ricerca</Link>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/discovery" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-primary transition mb-6">
        <ArrowLeft className="h-4 w-4" />
        Torna alla ricerca
      </Link>

      <div className="bg-white border border-slate-100 rounded-2xl p-6 sm:p-8">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{gig.title}</h1>
            <div className="flex items-center gap-2 mt-2">
              {gig.category && <Badge variant="primary">{gig.category}</Badge>}
              {gig.role && <Badge variant="secondary">{gig.role}</Badge>}
              {gig.status && <Badge variant={gig.status === 'OPEN' ? 'success' : 'default'}>{gig.status}</Badge>}
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary flex items-center">
              <Euro className="h-6 w-6" />{gig.price}
            </div>
            {gig.duration_hours && <div className="text-sm text-slate-500">per {gig.duration_hours} ore</div>}
          </div>
        </div>

        {gig.description && (
          <div className="mt-6">
            <h2 className="font-semibold text-slate-800 mb-2">Descrizione</h2>
            <p className="text-slate-600 leading-relaxed">{gig.description}</p>
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {gig.location && (
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <div className="text-xs text-slate-500">Luogo</div>
                <div className="font-medium text-slate-800">{gig.location}</div>
              </div>
            </div>
          )}
          {gig.date && (
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <div className="text-xs text-slate-500">Data</div>
                <div className="font-medium text-slate-800">{new Date(gig.date).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
              </div>
            </div>
          )}
          {gig.duration_hours && (
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <div className="text-xs text-slate-500">Durata</div>
                <div className="font-medium text-slate-800">{gig.duration_hours} ore</div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex gap-3">
          <button
            onClick={() => setApplying(true)}
            className="flex-1 sm:flex-none px-8 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-600 transition text-center"
          >
            Candidati ora
          </button>
        </div>
      </div>

      {/* Related gigs */}
      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Annunci simili</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {related.map((g) => (
              <Link key={g.id} href={`/gigs/${g.id}`} className="border border-slate-100 rounded-xl p-4 hover:shadow-soft transition">
                <h3 className="font-semibold text-slate-900">{g.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  {g.category && <Badge variant="primary">{g.category}</Badge>}
                </div>
                <div className="mt-2 text-lg font-bold text-primary flex items-center"><Euro className="h-4 w-4" />{g.price}</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {applying && (
        <Dialog open={true} onOpenChange={() => setApplying(false)} title={`Candidati per: ${gig.title}`}>
          <p className="text-sm text-slate-500">Prezzo indicativo: &euro;{gig.price}</p>
          <div className="mt-4 space-y-2">
            <Label>Data (scegli se necessario)</Label>
            <Input type="datetime-local" ref={applyDateRef} />
          </div>
          <div className="mt-4 flex gap-2 justify-end">
            <button className="px-4 py-1.5 border border-slate-200 rounded-lg text-sm" onClick={() => setApplying(false)}>Annulla</button>
            <button className="px-4 py-1.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition" onClick={submitApplication}>
              Invia candidatura
            </button>
          </div>
        </Dialog>
      )}
    </div>
  )
}
