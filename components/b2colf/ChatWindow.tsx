'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Send, ArrowLeft, User } from 'lucide-react'
import { useAuth } from '@/components/b2colf/context/AuthContext'
import type { Message, Conversation } from '@/lib/types'

type Props = {
  conversation: Conversation
  onBack?: () => void
}

export default function ChatWindow({ conversation, onBack }: Props) {
  const { user, supabase } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const otherUser = conversation.other_user

  // Fetch messages
  useEffect(() => {
    if (!supabase || !conversation.id) return

    async function fetchMessages() {
      const { data } = await supabase!
        .from('messages')
        .select('*')
        .eq('conversation_id', conversation.id)
        .order('created_at', { ascending: true })

      if (data) setMessages(data as Message[])
    }

    fetchMessages()

    // Mark unread messages as read
    if (user) {
      supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('conversation_id', conversation.id)
        .neq('sender_id', user.id)
        .is('read_at', null)
        .then(() => {})
    }

    // Subscribe to new messages
    const channel = supabase
      .channel(`chat-${conversation.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversation.id}` },
        (payload) => {
          const msg = payload.new as Message
          setMessages((prev) => [...prev, msg])

          // Mark as read if from other user
          if (msg.sender_id !== user?.id) {
            supabase!
              .from('messages')
              .update({ read_at: new Date().toISOString() })
              .eq('id', msg.id)
              .then(() => {})
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, conversation.id, user])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!newMessage.trim() || !supabase || !user || sending) return

    const content = newMessage.trim()
    setNewMessage('')
    setSending(true)

    try {
      const { error } = await supabase.from('messages').insert({
        conversation_id: conversation.id,
        sender_id: user.id,
        content,
      })

      if (error) throw error
    } catch (err) {
      console.error('Errore invio messaggio:', err)
      setNewMessage(content) // Restore on failure
    } finally {
      setSending(false)
      inputRef.current?.focus()
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-900">
        {onBack && (
          <button onClick={onBack} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition sm:hidden">
            <ArrowLeft className="h-5 w-5 text-slate-600" />
          </button>
        )}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-100 to-primary-300 flex items-center justify-center text-primary font-semibold text-sm">
          {otherUser?.full_name?.charAt(0)?.toUpperCase() || <User className="h-4 w-4" />}
        </div>
        <div>
          <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{otherUser?.full_name || 'Utente'}</div>
          {otherUser?.role && <div className="text-xs text-slate-500">{otherUser.role}</div>}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-slate-50/50 dark:bg-slate-800/50">
        {messages.length === 0 && (
          <div className="text-center text-sm text-slate-400 py-8">
            Inizia la conversazione...
          </div>
        )}
        {messages.map((msg) => {
          const isMine = msg.sender_id === user?.id
          return (
            <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                  isMine
                    ? 'bg-primary text-white rounded-br-md'
                    : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-600 rounded-bl-md'
                }`}
              >
                <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                <div className={`text-[10px] mt-1 ${isMine ? 'text-white/70' : 'text-slate-400'}`}>
                  {msg.created_at && new Date(msg.created_at).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                  {isMine && msg.read_at && ' ✓✓'}
                </div>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="flex items-center gap-2 px-4 py-3 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-900">
        <input
          ref={inputRef}
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Scrivi un messaggio..."
          className="flex-1 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          maxLength={2000}
        />
        <button
          type="submit"
          disabled={!newMessage.trim() || sending}
          className="p-2.5 bg-primary text-white rounded-xl hover:bg-primary-600 transition disabled:opacity-50"
        >
          <Send className="h-5 w-5" />
        </button>
      </form>
    </div>
  )
}

// Quick message templates
export function QuickMessages({ onSelect }: { onSelect: (msg: string) => void }) {
  const templates = [
    'Ciao, sei disponibile per questo lavoro?',
    'Confermo la prenotazione, grazie!',
    'Possiamo discutere i dettagli?',
    'A che ora possiamo iniziare?',
  ]

  return (
    <div className="flex flex-wrap gap-2 px-4 py-2">
      {templates.map((t) => (
        <button
          key={t}
          onClick={() => onSelect(t)}
          className="text-xs px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition"
        >
          {t}
        </button>
      ))}
    </div>
  )
}
