'use client'

import React, { useEffect, useState, useRef } from 'react'
import { Bell, MessageSquare, Star, Briefcase, Users, Check } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/components/b2colf/context/AuthContext'
import type { Notification } from '@/lib/types'

const iconMap: Record<string, React.ReactNode> = {
  new_application: <Users className="h-4 w-4 text-primary" />,
  message: <MessageSquare className="h-4 w-4 text-secondary" />,
  review: <Star className="h-4 w-4 text-accent" />,
  booking_update: <Briefcase className="h-4 w-4 text-success" />,
  gig_match: <Briefcase className="h-4 w-4 text-primary" />,
}

function getNotificationLink(n: Notification): string {
  const data = n.data as Record<string, string> | null
  if (n.type === 'message' && data?.conversation_id) return '/messages'
  if (n.type === 'new_application' && data?.gig_id) return `/gigs/${data.gig_id}`
  if (n.type === 'review' && data?.profile_id) return `/profile/${data.profile_id}`
  if (n.type === 'booking_update' && data?.booking_id) return '/dashboard'
  if (n.type === 'gig_match' && data?.gig_id) return `/gigs/${data.gig_id}`
  return '/dashboard'
}

export default function NotificationBell() {
  const { user, supabase, isDemo } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter((n) => !n.read).length

  useEffect(() => {
    if (!user || !supabase || isDemo) return

    async function fetchNotifications() {
      if (!supabase) return
      try {
        const { data } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user!.id)
          .order('created_at', { ascending: false })
          .limit(20)

        if (data) setNotifications(data as Notification[])
      } catch {
        // Supabase not configured, skip
      }
    }

    fetchNotifications()

    // Subscribe to new notifications via Supabase Realtime
    if (typeof supabase.channel !== 'function') return

    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
        (payload) => {
          setNotifications((prev) => [payload.new as Notification, ...prev])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, supabase, isDemo])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function markAllRead() {
    if (!supabase || !user || isDemo) {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
      return
    }
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', user.id)
      .eq('read', false)

    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  async function markRead(id: string) {
    if (isDemo) {
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
      return
    }
    if (!supabase) return
    await supabase.from('notifications').update({ read: true }).eq('id', id)
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  if (!user) return null

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-xl hover:bg-slate-100 transition"
        aria-label="Notifiche"
      >
        <Bell className="h-5 w-5 text-slate-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-danger text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce-in">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-soft-xl z-50 overflow-hidden animate-fade-in-up">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900">Notifiche</h3>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-xs text-primary hover:underline flex items-center gap-1">
                <Check className="h-3 w-3" /> Segna tutte come lette
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-500">Nessuna notifica</div>
            ) : (
              notifications.map((n) => (
                <Link
                  key={n.id}
                  href={getNotificationLink(n)}
                  onClick={() => {
                    markRead(n.id)
                    setOpen(false)
                  }}
                  className={`flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition border-b border-slate-50 ${
                    !n.read ? 'bg-primary-50/50' : ''
                  }`}
                >
                  <div className="mt-0.5 p-1.5 rounded-lg bg-slate-100">
                    {iconMap[n.type] || <Bell className="h-4 w-4 text-slate-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${!n.read ? 'font-semibold text-slate-900' : 'text-slate-700'}`}>
                      {n.title}
                    </p>
                    {n.body && <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.body}</p>}
                    {n.created_at && (
                      <p className="text-[10px] text-slate-400 mt-1">
                        {formatTimeAgo(n.created_at)}
                      </p>
                    )}
                  </div>
                  {!n.read && <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />}
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function formatTimeAgo(dateStr: string): string {
  const now = Date.now()
  const date = new Date(dateStr).getTime()
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Adesso'
  if (minutes < 60) return `${minutes} min fa`
  if (hours < 24) return `${hours} ore fa`
  if (days < 7) return `${days} giorni fa`
  return new Date(dateStr).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })
}
