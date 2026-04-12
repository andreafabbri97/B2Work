import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const db = createServerClient()
    const { data, error } = await db.from('gigs').select('*').eq('id', id).single()
    if (error || !data) return NextResponse.json({ error: 'Annuncio non trovato' }, { status: 404 })
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Errore server' }, { status: 500 })
  }
}
