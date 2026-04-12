'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/components/b2colf/context/AuthContext'
import { useRouter } from 'next/navigation'
import { MessageSquare, User, Search } from 'lucide-react'
import ChatWindow from '@/components/b2colf/ChatWindow'
import type { Conversation } from '@/lib/types'
import { useLanguage } from '@/components/b2colf/context/LanguageContext'

export default function MessagesPage() {
  const { user, supabase } = useAuth()
  const router = useRouter()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selected, setSelected] = useState<Conversation | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const { t } = useLanguage()

  useEffect(() => {
    if (!user) {
      router.push('/auth/signin')
      return
    }

    async function fetchConversations() {
      if (!supabase || !user) { setLoading(false); return }
      try {
        const { data } = await supabase
          .from('conversations')
          .select(`
            *,
            p1:profiles!participant_1(id, full_name, avatar_url, role),
            p2:profiles!participant_2(id, full_name, avatar_url, role)
          `)
          .or(`participant_1.eq.${user.id},participant_2.eq.${user.id}`)
          .order('last_message_at', { ascending: false })

        if (data) {
          const enriched: Conversation[] = await Promise.all(
            data.map(async (c: Record<string, unknown>) => {
              const p1 = c.p1 as Record<string, unknown> | null
              const p2 = c.p2 as Record<string, unknown> | null
              const otherUser = (p1 && (p1.id as string) !== user.id) ? p1 : p2

              const { data: lastMsg } = await supabase
                .from('messages')
                .select('content')
                .eq('conversation_id', c.id as string)
                .order('created_at', { ascending: false })
                .limit(1)
                .single()

              const { count } = await supabase
                .from('messages')
                .select('*', { count: 'exact', head: true })
                .eq('conversation_id', c.id as string)
                .neq('sender_id', user.id)
                .is('read_at', null)

              return {
                id: c.id as string,
                participant_1: c.participant_1 as string,
                participant_2: c.participant_2 as string,
                gig_id: c.gig_id as string | null,
                last_message_at: c.last_message_at as string,
                created_at: c.created_at as string,
                other_user: otherUser as Conversation['other_user'],
                last_message: (lastMsg?.content as string) || undefined,
                unread_count: count || 0,
              }
            })
          )
          setConversations(enriched)
        }
      } catch (err) {
        console.error('Errore caricamento conversazioni:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchConversations()
  }, [user, supabase, router])

  if (!user) return null

  const filtered = conversations.filter((c) =>
    !search || c.other_user?.full_name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">{t('messages.title')}</h1>

      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl overflow-hidden" style={{ height: 'calc(100vh - 220px)' }}>
        <div className="flex h-full">
          {/* Conversation list */}
          <div className={`w-full sm:w-80 border-r border-slate-100 dark:border-slate-700 flex flex-col ${selected ? 'hidden sm:flex' : 'flex'}`}>
            {/* Search */}
            <div className="p-3 border-b border-slate-100 dark:border-slate-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t('messages.search_placeholder')}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-sm text-slate-500 animate-pulse">{t('common.loading')}</div>
              ) : filtered.length === 0 ? (
                <div className="p-8 text-center">
                  <MessageSquare className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm text-slate-500">{t('messages.no_conversations')}</p>
                  <p className="text-xs text-slate-400 mt-1">{t('messages.contact_to_start')}</p>
                </div>
              ) : (
                filtered.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelected(c)}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition text-left border-b border-slate-50 dark:border-slate-800 ${
                      selected?.id === c.id ? 'bg-primary-50 dark:bg-primary-900/30' : ''
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-100 to-primary-300 flex items-center justify-center text-primary font-semibold text-sm flex-shrink-0">
                      {c.other_user?.full_name?.charAt(0)?.toUpperCase() || <User className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`text-sm truncate ${(c.unread_count || 0) > 0 ? 'font-semibold text-slate-900 dark:text-slate-100' : 'text-slate-700 dark:text-slate-300'}`}>
                          {c.other_user?.full_name || t('messages.user')}
                        </span>
                        {c.last_message_at && (
                          <span className="text-[10px] text-slate-400 flex-shrink-0">
                            {new Date(c.last_message_at).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-0.5">
                        <p className="text-xs text-slate-500 truncate">{c.last_message || t('messages.no_messages')}</p>
                        {(c.unread_count || 0) > 0 && (
                          <span className="w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center flex-shrink-0">
                            {c.unread_count}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat area */}
          <div className={`flex-1 ${!selected ? 'hidden sm:flex' : 'flex'} flex-col`}>
            {selected ? (
              <ChatWindow conversation={selected} onBack={() => setSelected(null)} />
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">{t('messages.select_conversation')}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
