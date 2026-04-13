'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/components/b2colf/context/AuthContext'
import { useRouter } from 'next/navigation'
import Badge from '@/components/b2colf/ui/Badge'
import { StatCardSkeleton } from '@/components/b2colf/ui/Skeleton'
import MatchingSuggestions from '@/components/b2colf/MatchingSuggestions'
import { FileText, Send, Star, CheckCircle, MapPin, Briefcase, PenSquare, PlusCircle, LogOut, User, MessageSquare, Award, Info } from 'lucide-react'
import type { Profile, Booking, Gig } from '@/lib/types'
import { useLanguage } from '@/components/b2colf/context/LanguageContext'

const STATUS_BADGE_VARIANTS: Record<string, 'success' | 'accent' | 'danger' | 'default'> = {
  PENDING: 'accent',
  CONFIRMED: 'success',
  PAID: 'success',
  CANCELLED: 'danger',
}

const STATUS_LABEL_KEYS: Record<string, string> = {
  PENDING: 'dashboard.status_pending',
  CONFIRMED: 'dashboard.status_confirmed',
  PAID: 'dashboard.status_paid',
  CANCELLED: 'dashboard.status_cancelled',
}

type Tab = 'activities' | 'my_gigs' | 'applications'

export default function DashboardPage() {
  const { user, supabase, signOut, isDemo, demoProfile } = useAuth()
  const router = useRouter()
  const { t } = useLanguage()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [myGigs, setMyGigs] = useState<Gig[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<Tab>('activities')
  const [unreadMessages, setUnreadMessages] = useState(0)

  useEffect(() => {
    if (!user) {
      router.push('/auth/signin')
      return
    }

    async function fetchData() {
      if (!user) { setLoading(false); return }

      // In demo mode, use the demo profile directly
      if (isDemo && demoProfile) {
        setProfile({
          id: demoProfile.id,
          email: demoProfile.email,
          full_name: demoProfile.full_name,
          role: demoProfile.role,
          bio: demoProfile.bio,
          avatar_url: demoProfile.avatar_url,
          city: demoProfile.city,
          rating_avg: demoProfile.rating_avg,
          verified: demoProfile.verified,
          certificates: ['HACCP', 'Sicurezza sul lavoro'],
        })
        setBookings([])
        setMyGigs([])
        setLoading(false)
        return
      }

      if (!supabase) { setLoading(false); return }
      try {
        const [profileRes, bookingsRes, gigsRes] = await Promise.all([
          supabase.from('profiles').select('*').eq('id', user.id).single(),
          supabase.from('bookings').select('*').or(`host_id.eq.${user.id},colf_id.eq.${user.id}`),
          supabase.from('gigs').select('*').eq('poster_id', user.id),
        ])
        setProfile(profileRes.data as Profile | null)
        setBookings((bookingsRes.data as Booking[]) || [])
        setMyGigs((gigsRes.data as Gig[]) || [])

        // Count unread messages
        const { count } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .neq('sender_id', user.id)
          .is('read_at', null)

        setUnreadMessages(count || 0)
      } catch (err) {
        console.error('Errore caricamento dashboard:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user, supabase, router])

  if (!user) return null

  const completedJobs = bookings.filter(b => b.status === 'PAID').length
  const stats = [
    { icon: <FileText className="h-5 w-5 text-primary" />, label: t('dashboard.stat_gigs_published'), value: myGigs.length },
    { icon: <Send className="h-5 w-5 text-secondary" />, label: t('dashboard.stat_applications_sent'), value: bookings.filter(b => b.colf_id === user.id).length },
    { icon: <Star className="h-5 w-5 text-accent" />, label: t('dashboard.stat_avg_rating'), value: profile?.rating_avg?.toFixed(1) || '-' },
    { icon: <CheckCircle className="h-5 w-5 text-success" />, label: t('dashboard.stat_jobs_completed'), value: completedJobs },
  ]

  const tabs: { key: Tab; label: string }[] = [
    { key: 'activities', label: t('dashboard.tab_activities') },
    { key: 'my_gigs', label: t('dashboard.tab_my_gigs') },
    { key: 'applications', label: t('dashboard.tab_applications') },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      {/* Demo banner */}
      {isDemo && (
        <div className="mb-4 p-3 bg-accent-50 dark:bg-accent-900/50 border border-accent-400 rounded-xl flex items-center gap-2 text-sm text-accent-600">
          <Info className="h-4 w-4 flex-shrink-0" />
          <span><strong>{t('signin.demo_mode')}</strong> — {t('dashboard.demo_banner')}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Dashboard</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500 hidden sm:block">{user.email}</span>
          <button onClick={() => signOut()} className="px-3 py-1.5 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center gap-1">
            <LogOut className="h-4 w-4" /> {t('nav.logout')}
          </button>
        </div>
      </div>

      {/* Profile card */}
      <div className="bg-gradient-to-r from-primary-50 dark:from-primary-900/50 to-white dark:to-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-200 to-primary-400 flex items-center justify-center text-white font-bold text-xl overflow-hidden">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" />
            ) : (
              profile?.full_name?.charAt(0)?.toUpperCase() || <User className="h-6 w-6" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{profile?.full_name || t('dashboard.complete_profile')}</h2>
            <div className="flex items-center gap-3 text-sm text-slate-500 mt-0.5 flex-wrap">
              {profile?.role && <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" />{profile.role}</span>}
              {profile?.city && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{profile.city}</span>}
              {profile?.rating_avg ? (
                <span className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 text-accent fill-accent" />{profile.rating_avg.toFixed(1)}
                </span>
              ) : null}
              {profile?.certificates && profile.certificates.length > 0 && (
                <span className="flex items-center gap-1">
                  <Award className="h-3.5 w-3.5" />{profile.certificates.length} {t('dashboard.certifications')}
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Link href="/messages" className="px-3 py-1.5 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              {t('nav.messages')}
              {unreadMessages > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-primary text-white text-[10px] font-bold rounded-full">{unreadMessages}</span>
              )}
            </Link>
            <Link href="/profile/edit" className="px-3 py-1.5 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center gap-1">
              <PenSquare className="h-4 w-4" /> {t('dashboard.edit')}
            </Link>
            <Link href="/gigs/new" className="px-3 py-1.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition flex items-center gap-1">
              <PlusCircle className="h-4 w-4" /> {t('nav.publish')}
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[1,2,3,4].map(i => <StatCardSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {stats.map((s) => (
            <div key={s.label} className="border border-slate-100 dark:border-slate-700 rounded-xl p-4 hover:shadow-soft transition">
              <div className="flex items-center gap-2 mb-1">{s.icon}<span className="text-xs text-slate-500">{s.label}</span></div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{s.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Matching suggestions */}
      {!loading && profile?.role && (
        <div className="mb-6">
          <MatchingSuggestions
            type="gigs"
            category={profile.role}
            city={profile.city}
            limit={3}
            title={t('dashboard.suggested_gigs')}
          />
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-200 dark:border-slate-600 mb-4 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium transition border-b-2 -mb-px whitespace-nowrap ${
              activeTab === tab.key
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {loading ? (
        <div className="text-sm text-slate-500">{t('common.loading')}</div>
      ) : (
        <div className="space-y-3">
          {activeTab === 'activities' && (
            bookings.length ? bookings.map((b) => {
              const variant = STATUS_BADGE_VARIANTS[b.status] || 'default'
              const labelKey = STATUS_LABEL_KEYS[b.status]
              const badge = { variant: variant as 'success' | 'accent' | 'danger' | 'default', label: labelKey ? t(labelKey) : (b.status || 'N/A') }
              return (
                <div key={b.id} className="border border-slate-100 dark:border-slate-700 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <Badge variant={badge.variant}>{badge.label}</Badge>
                    <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      {b.date ? new Date(b.date).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' }) : t('dashboard.date_not_specified')}
                    </div>
                  </div>
                  <div className="text-lg font-bold text-slate-900 dark:text-slate-100">&euro;{b.total_price || '-'}</div>
                </div>
              )
            }) : <div className="text-center py-8 text-slate-500">{t('dashboard.no_activities')}</div>
          )}

          {activeTab === 'my_gigs' && (
            myGigs.length ? myGigs.map((g) => (
              <Link key={g.id} href={`/gigs/${g.id}`} className="border border-slate-100 dark:border-slate-700 rounded-xl p-4 flex items-center justify-between hover:shadow-soft transition block">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">{g.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    {g.category && <Badge variant="primary">{g.category}</Badge>}
                    {g.status && <Badge variant={g.status === 'OPEN' ? 'success' : 'default'}>{g.status}</Badge>}
                  </div>
                </div>
                <div className="text-lg font-bold text-primary">&euro;{g.price || '-'}</div>
              </Link>
            )) : (
              <div className="text-center py-8">
                <p className="text-slate-500">{t('dashboard.no_gigs')}</p>
                <Link href="/gigs/new" className="mt-2 inline-block text-primary hover:underline font-medium">{t('dashboard.publish_first')}</Link>
              </div>
            )
          )}

          {activeTab === 'applications' && (
            <div className="text-center py-8 text-slate-500">
              <p>{t('dashboard.applications_placeholder')}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
