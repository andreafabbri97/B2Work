import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const db = createServerClient()
    const { searchParams } = request.nextUrl
    const userId = searchParams.get('user_id')
    if (!userId) return NextResponse.json({ error: 'user_id richiesto' }, { status: 400 })
    const { data, error } = await db.from('conversations').select('*')
      .or(`participant_1.eq.${userId},participant_2.eq.${userId}`)
      .order('last_message_at', { ascending: false })
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
    const { participant_1, participant_2, gig_id } = body as Record<string, unknown>
    if (!participant_1 || !participant_2) return NextResponse.json({ error: 'Partecipanti richiesti' }, { status: 400 })
    const { data, error } = await db.from('conversations').insert({
      participant_1, participant_2, gig_id: gig_id || null,
    }).select().single()
    if (error) throw error
    return NextResponse.json(data, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Errore nella creazione della conversazione' }, { status: 500 })
  }
}
