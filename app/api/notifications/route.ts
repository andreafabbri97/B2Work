import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const db = createServerClient()
    const { searchParams } = request.nextUrl
    const userId = searchParams.get('user_id')
    if (!userId) return NextResponse.json({ error: 'user_id richiesto' }, { status: 400 })
    const { data, error } = await db.from('notifications').select('*')
      .eq('user_id', userId).order('created_at', { ascending: false }).limit(50)
    if (error) throw error
    return NextResponse.json(data)
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const db = createServerClient()
    const body = await request.json()
    const { id } = body as Record<string, unknown>
    if (!id) return NextResponse.json({ error: 'id richiesto' }, { status: 400 })
    const { data, error } = await db.from('notifications').update({ read: true }).eq('id', id).select().single()
    if (error) throw error
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Errore nell\'aggiornamento' }, { status: 500 })
  }
}
