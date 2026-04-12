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

const statusBadge: Record<string, { variant: 'success' | 'accent' | 'danger' | 'default'; label: string }> = {
  PENDING: { variant: 'accent', label: 'In attesa' },
  CONFIRMED: { variant: 'success', label: 'Confermato' },
  PAID: { variant: 'success', label: 'Pagato' },
  CANCELLED: { variant: 'danger', label: 'Annullato' },
}

type Tab = 'activities' | 'my_gigs' | 'applications'

export default function DashboardPage() {
  const { user, supabase, signOut, isDemo, demoProfile } = useAuth()
  const router = useRouter()
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
    { icon: <FileText className="h-5 w-5 text-primary" />, label: 'Annunci pubblicati', value: myGigs.length },
    { icon: <Send className="h-5 w-5 text-secondary" />, label: 'Candidature inviate', value: bookings.filter(b => b.colf_id === user.id).length },
    { icon: <Star className="h-5 w-5 text-accent" />, label: 'Rating medio', value: profile?.rating_avg?.toFixed(1) || '-' },
    { icon: <CheckCircle className="h-5 w-5 text-success" />, label: 'Lavori completati', value: completedJobs },
  ]

  const tabs: { key: Tab; label: string }[] = [
    { key: 'activities', label: 'Le mie attività' },
    { key: 'my_gigs', label: 'I miei annunci' },
    { key: 'applications', label: 'Candidature ricevute' },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      {/* Demo banner */}
      {isDemo && (
        <div className="mb-4 p-3 bg-accent-50 border border-accent-400 rounded-xl flex items-center gap-2 text-sm text-accent-600">
          <Info className="h-4 w-4 flex-shrink-0" />
          <span><strong>Modalità Demo</strong> — Stai usando un account di test. I dati non vengono salvati.</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500 hidden sm:block">{user.email}</span>
          <button onClick={() => signOut()} className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition flex items-center gap-1">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </div>

      {/* Profile card */}
      <div className="bg-gradient-to-r from-primary-50 to-white border border-slate-100 rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-200 to-primary-400 flex items-center justify-center text-white font-bold text-xl overflow-hidden">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" />
            ) : (
              profile?.full_name?.charAt(0)?.toUpperCase() || <User className="h-6 w-6" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-slate-900">{profile?.full_name || 'Completa il profilo'}</h2>
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
                  <Award className="h-3.5 w-3.5" />{profile.certificates.length} certificazioni
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Link href="/messages" className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              Messaggi
              {unreadMessages > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-primary text-white text-[10px] font-bold rounded-full">{unreadMessages}</span>
              )}
            </Link>
            <Link href="/profile/edit" className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition flex items-center gap-1">
              <PenSquare className="h-4 w-4" /> Modifica
            </Link>
            <Link href="/gigs/new" className="px-3 py-1.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition flex items-center gap-1">
              <PlusCircle className="h-4 w-4" /> Pubblica
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
            <div key={s.label} className="border border-slate-100 rounded-xl p-4 hover:shadow-soft transition">
              <div className="flex items-center gap-2 mb-1">{s.icon}<span className="text-xs text-slate-500">{s.label}</span></div>
              <div className="text-2xl font-bold text-slate-900">{s.value}</div>
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
            title="Annunci consigliati per te"
          />
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-200 mb-4 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium transition border-b-2 -mb-px whitespace-nowrap ${
              activeTab === tab.key
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {loading ? (
        <div className="text-sm text-slate-500">Caricamento...</div>
      ) : (
        <div className="space-y-3">
          {activeTab === 'activities' && (
            bookings.length ? bookings.map((b) => {
              const badge = statusBadge[b.status] || { variant: 'default' as const, label: b.status || 'N/A' }
              return (
                <div key={b.id} className="border border-slate-100 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <Badge variant={badge.variant}>{badge.label}</Badge>
                    <div className="text-sm text-slate-600 mt-1">
                      {b.date ? new Date(b.date).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Data non specificata'}
                    </div>
                  </div>
                  <div className="text-lg font-bold text-slate-900">&euro;{b.total_price || '-'}</div>
                </div>
              )
            }) : <div className="text-center py-8 text-slate-500">Nessuna attività trovata.</div>
          )}

          {activeTab === 'my_gigs' && (
            myGigs.length ? myGigs.map((g) => (
              <Link key={g.id} href={`/gigs/${g.id}`} className="border border-slate-100 rounded-xl p-4 flex items-center justify-between hover:shadow-soft transition block">
                <div>
                  <h3 className="font-semibold text-slate-900">{g.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    {g.category && <Badge variant="primary">{g.category}</Badge>}
                    {g.status && <Badge variant={g.status === 'OPEN' ? 'success' : 'default'}>{g.status}</Badge>}
                  </div>
                </div>
                <div className="text-lg font-bold text-primary">&euro;{g.price || '-'}</div>
              </Link>
            )) : (
              <div className="text-center py-8">
                <p className="text-slate-500">Non hai ancora pubblicato annunci.</p>
                <Link href="/gigs/new" className="mt-2 inline-block text-primary hover:underline font-medium">Pubblica il primo annuncio</Link>
              </div>
            )
          )}

          {activeTab === 'applications' && (
            <div className="text-center py-8 text-slate-500">
              <p>Le candidature ricevute per i tuoi annunci appariranno qui.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
