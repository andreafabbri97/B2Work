'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Star, ArrowLeft, CheckCircle, MessageSquare, Briefcase, Calendar, Euro, Clock, Award, Shield } from 'lucide-react'
import Badge from '@/components/b2colf/ui/Badge'
import ReviewCard from '@/components/b2colf/ReviewCard'
import { useAuth } from '@/components/b2colf/context/AuthContext'
import { useToast } from '@/components/b2colf/context/ToastContext'
import { useLanguage } from '@/components/b2colf/context/LanguageContext'
import type { Profile, Gig, Review } from '@/lib/types'
import { getProfileById, getGigs, getReviews } from '@/lib/api'

type Tab = 'about' | 'gigs' | 'reviews'

const DAYS_IT: Record<string, string> = {
  mon: 'Lunedi', tue: 'Martedi', wed: 'Mercoledi', thu: 'Giovedi',
  fri: 'Venerdi', sat: 'Sabato', sun: 'Domenica',
}

export default function ProfileClient() {
  const params = useParams()
  const router = useRouter()
  const { user, supabase } = useAuth()
  const { showToast } = useToast()
  const { t } = useLanguage()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [gigs, setGigs] = useState<Gig[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<Tab>('about')
  const [contacting, setContacting] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        const [found, allGigs, reviewsData] = await Promise.all([
          getProfileById(params.id as string),
          getGigs(),
          getReviews(params.id as string),
        ])

        if (!found) { setProfile(null); return }
        setProfile(found)
        setGigs(allGigs.filter((g) => g.poster_id === params.id).slice(0, 6))
        setReviews(reviewsData)
      } catch (err) {
        console.error('Errore caricamento profilo:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [params.id])

  async function handleContact() {
    if (!user) {
      router.push('/auth/signin')
      return
    }
    if (!supabase || !profile) return

    setContacting(true)
    try {
      // Find or create conversation
      const { data: existing } = await supabase
        .from('conversations')
        .select('id')
        .or(
          `and(participant_1.eq.${user.id},participant_2.eq.${profile.id}),and(participant_1.eq.${profile.id},participant_2.eq.${user.id})`
        )
        .limit(1)
        .single()

      if (existing) {
        router.push('/messages')
      } else {
        await supabase.from('conversations').insert({
          participant_1: user.id,
          participant_2: profile.id,
        })
        router.push('/messages')
      }
    } catch (err) {
      console.error('Errore apertura chat:', err)
      showToast('Errore nell\'apertura della chat', 'error')
    } finally {
      setContacting(false)
    }
  }

  if (loading) return (
    <div className="max-w-2xl mx-auto animate-pulse space-y-4 py-8">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 bg-slate-200 dark:bg-slate-700 rounded-2xl" />
        <div className="space-y-2 flex-1">
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
        </div>
      </div>
      <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-xl" />
      <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded-xl" />
    </div>
  )

  if (!profile) return (
    <div className="text-center py-16">
      <div className="mx-auto w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
        <Briefcase className="h-7 w-7 text-slate-400" />
      </div>
      <p className="text-xl font-semibold text-slate-700 dark:text-slate-300">{t('profiles.not_found')}</p>
      <Link href="/discovery" className="mt-4 inline-block text-primary hover:underline">{t('profiles.back')}</Link>
    </div>
  )

  const TABS: { key: Tab; label: string; count?: number }[] = [
    { key: 'about', label: t('profiles.tab_about') },
    { key: 'gigs', label: t('profiles.tab_gigs'), count: gigs.length },
    { key: 'reviews', label: t('profiles.tab_reviews'), count: reviews.length },
  ]

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/discovery" className="inline-flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 hover:text-primary transition mb-6">
        <ArrowLeft className="h-4 w-4" />
        {t('profiles.back')}
      </Link>

      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/30 dark:to-secondary-900/30 px-6 sm:px-8 pt-8 pb-12" />

        <div className="px-6 sm:px-8 -mt-10 pb-8">
          {/* Avatar + info */}
          <div className="flex items-end gap-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-200 to-primary-400 flex items-center justify-center text-white font-bold text-2xl shadow-soft-lg border-4 border-white dark:border-slate-900 overflow-hidden">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" />
              ) : (
                profile.full_name?.charAt(0)?.toUpperCase() || '?'
              )}
            </div>
            <div className="flex-1 min-w-0 pb-1">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                {profile.full_name}
                {profile.verified && <CheckCircle className="h-5 w-5 text-primary fill-primary-100" />}
              </h1>
              <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                {profile.role && <Badge variant="secondary">{profile.role}</Badge>}
                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{profile.city}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-accent-50 dark:bg-accent-900/30 px-3 py-1.5 rounded-lg">
              <Star className="h-5 w-5 text-accent fill-accent" />
              <span className="font-bold text-slate-800 dark:text-slate-200">{profile.rating_avg?.toFixed(1) || 'N/A'}</span>
            </div>
          </div>

          {/* Quick stats */}
          <div className="mt-4 flex flex-wrap gap-2">
            {profile.hourly_rate && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-50 dark:bg-primary-900/30 rounded-full text-sm text-primary-700 dark:text-primary-300 font-medium">
                <Euro className="h-3.5 w-3.5" />{profile.hourly_rate}/h
              </span>
            )}
            {profile.response_time_hours && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-success-50 dark:bg-success-900/30 rounded-full text-sm text-success-600 dark:text-success-400 font-medium">
                <Clock className="h-3.5 w-3.5" />{t('profiles.responds_in')}{profile.response_time_hours}h
              </span>
            )}
            {profile.verified && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-50 dark:bg-primary-900/30 rounded-full text-sm text-primary-700 dark:text-primary-300 font-medium">
                <Shield className="h-3.5 w-3.5" />{t('profiles.verified')}
              </span>
            )}
            {reviews.length > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent-50 dark:bg-accent-900/30 rounded-full text-sm text-accent-600 dark:text-accent-400 font-medium">
                <Star className="h-3.5 w-3.5" />{reviews.length} {t('profiles.reviews_count')}
              </span>
            )}
            {profile.created_at && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-sm text-slate-600 dark:text-slate-400">
                <Calendar className="h-3.5 w-3.5" />
                {t('profiles.member_since')} {new Date(profile.created_at).toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })}
              </span>
            )}
          </div>

          {/* Certificates */}
          {profile.certificates && profile.certificates.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {profile.certificates.map((cert) => (
                <span key={cert} className="inline-flex items-center gap-1 px-2.5 py-1 bg-secondary-50 dark:bg-secondary-900/30 rounded-lg text-xs text-secondary-700 dark:text-secondary-300 font-medium">
                  <Award className="h-3 w-3" />{cert}
                </span>
              ))}
            </div>
          )}

          {/* Tabs */}
          <div className="mt-6 flex border-b border-slate-200 dark:border-slate-600">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition -mb-px ${
                  activeTab === tab.key
                    ? 'border-primary text-primary'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-full text-[10px]">{tab.count}</span>
                )}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="mt-6">
            {activeTab === 'about' && (
              <div className="space-y-6">
                {profile.bio && (
                  <div>
                    <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">{t('profiles.bio')}</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{profile.bio}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {profile.city && (
                    <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                      <MapPin className="h-5 w-5 text-primary" />
                      <div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{t('profiles.city')}</div>
                        <div className="font-medium text-slate-800 dark:text-slate-200">{profile.city}</div>
                      </div>
                    </div>
                  )}
                  {profile.role && (
                    <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                      <Briefcase className="h-5 w-5 text-primary" />
                      <div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{t('profiles.role')}</div>
                        <div className="font-medium text-slate-800 dark:text-slate-200">{profile.role}</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Availability */}
                {profile.availability && Object.keys(profile.availability).length > 0 && (
                  <div>
                    <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-3">{t('profiles.availability')}</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {Object.entries(profile.availability).map(([day, slots]) => (
                        <div key={day} className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl">
                          <div className="text-xs font-medium text-slate-700 dark:text-slate-300">{DAYS_IT[day] || day}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {Array.isArray(slots) ? slots.join(', ') : String(slots)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'gigs' && (
              <div>
                {gigs.length > 0 ? (
                  <div className="space-y-3">
                    {gigs.map((g) => (
                      <Link key={g.id} href={`/gigs/${g.id}`} className="block p-4 border border-slate-100 dark:border-slate-700 rounded-xl hover:shadow-soft transition">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-slate-900 dark:text-slate-100">{g.title}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              {g.category && <Badge variant="primary">{g.category}</Badge>}
                              {g.location && <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1"><MapPin className="h-3 w-3" />{g.location}</span>}
                            </div>
                          </div>
                          {g.price && <span className="text-lg font-bold text-primary flex items-center"><Euro className="h-4 w-4" />{g.price}</span>}
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                    <Briefcase className="h-8 w-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                    <p className="font-medium">{t('profiles.no_gigs')}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-3">
                {reviews.length > 0 ? (
                  reviews.map((r) => <ReviewCard key={r.id} review={r} />)
                ) : (
                  <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                    <Star className="h-8 w-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                    <p className="font-medium">{t('profiles.no_reviews')}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Contact CTA */}
          {user?.id !== profile.id && (
            <div className="mt-8 flex gap-3">
              <button
                onClick={handleContact}
                disabled={contacting}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-600 transition disabled:opacity-50"
              >
                <MessageSquare className="h-4 w-4" />
                {contacting ? t('profiles.contacting') : t('profiles.contact')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
