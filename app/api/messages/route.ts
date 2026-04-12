import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const db = createServerClient()
    const { searchParams } = request.nextUrl
    const conversationId = searchParams.get('conversation_id')
    if (!conversationId) return NextResponse.json({ error: 'conversation_id richiesto' }, { status: 400 })
    const { data, error } = await db.from('messages').select('*')
      .eq('conversation_id', conversationId).order('created_at', { ascending: true })
    if (error) throw error
    return NextResponse.json(data)
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = createServerClient()
    const body = await request.json()
    const { conversation_id, sender_id, content } = body as Record<string, unknown>
    if (!conversation_id || !sender_id || !content) return NextResponse.json({ error: 'Dati messaggio incompleti' }, { status: 400 })
    const { data, error } = await db.from('messages').insert({ conversation_id, sender_id, content }).select().single()
    if (error) throw error
    return NextResponse.json(data, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Errore nell\'invio del messaggio' }, { status: 500 })
  }
}
