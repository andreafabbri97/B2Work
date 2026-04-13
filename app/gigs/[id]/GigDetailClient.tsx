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
import { useLanguage } from '@/components/b2colf/context/LanguageContext'
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
  const { t } = useLanguage()

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
      if (!res.ok) throw new Error(data?.error || t('gigs.apply_error'))
      setApplying(false)
      showToast(t('gigs.apply_success'), 'success')
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : t('common.unknown_error'), 'error')
    }
  }

  if (loading) return (
    <div className="max-w-3xl mx-auto animate-pulse space-y-4 py-8">
      <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
      <div className="h-40 bg-slate-200 dark:bg-slate-700 rounded" />
    </div>
  )

  if (!gig) return (
    <div className="text-center py-16">
      <p className="text-xl font-semibold text-slate-700 dark:text-slate-300">{t('gigs.not_found')}</p>
      <Link href="/discovery" className="mt-4 inline-block text-primary hover:underline">{t('gigs.back')}</Link>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/discovery" className="inline-flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 hover:text-primary transition mb-6">
        <ArrowLeft className="h-4 w-4" />
        {t('gigs.back')}
      </Link>

      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl p-6 sm:p-8">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">{gig.title}</h1>
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
            {gig.duration_hours && <div className="text-sm text-slate-500 dark:text-slate-400">{t('common.per')} {gig.duration_hours} {t('gigs.hours')}</div>}
          </div>
        </div>

        {gig.description && (
          <div className="mt-6">
            <h2 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">{t('gigs.description')}</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{gig.description}</p>
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {gig.location && (
            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{t('gigs.location')}</div>
                <div className="font-medium text-slate-800 dark:text-slate-200">{gig.location}</div>
              </div>
            </div>
          )}
          {gig.date && (
            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{t('gigs.date')}</div>
                <div className="font-medium text-slate-800 dark:text-slate-200">{new Date(gig.date).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
              </div>
            </div>
          )}
          {gig.duration_hours && (
            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{t('gigs.duration')}</div>
                <div className="font-medium text-slate-800 dark:text-slate-200">{gig.duration_hours} {t('gigs.hours')}</div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex gap-3">
          <button
            onClick={() => setApplying(true)}
            className="flex-1 sm:flex-none px-8 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-600 transition text-center"
          >
            {t('gigs.apply_now')}
          </button>
        </div>
      </div>

      {/* Related gigs */}
      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">{t('gigs.related')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {related.map((g) => (
              <Link key={g.id} href={`/gigs/${g.id}`} className="border border-slate-100 dark:border-slate-700 rounded-xl p-4 hover:shadow-soft transition">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">{g.title}</h3>
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
        <Dialog open={true} onOpenChange={() => setApplying(false)} title={`${t('gigs.apply_for')}: ${gig.title}`}>
          <p className="text-sm text-slate-500 dark:text-slate-400">{t('gigs.price_hint')}: &euro;{gig.price}</p>
          <div className="mt-4 space-y-2">
            <Label>{t('gigs.date_label')}</Label>
            <Input type="datetime-local" ref={applyDateRef} />
          </div>
          <div className="mt-4 flex gap-2 justify-end">
            <button className="px-4 py-1.5 border border-slate-200 dark:border-slate-600 rounded-lg text-sm" onClick={() => setApplying(false)}>{t('gigs.cancel')}</button>
            <button className="px-4 py-1.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition" onClick={submitApplication}>
              {t('gigs.submit_apply')}
            </button>
          </div>
        </Dialog>
      )}
    </div>
  )
}
