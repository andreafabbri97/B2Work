import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const db = createServerClient()
    const { searchParams } = request.nextUrl
    const reviewedId = searchParams.get('reviewed_id')
    let query = db.from('reviews').select('*').order('created_at', { ascending: false })
    if (reviewedId) query = query.eq('reviewed_id', reviewedId)
    const { data, error } = await query
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
    const { reviewer_id, reviewed_id, booking_id, rating, comment } = body as Record<string, unknown>
    if (!reviewer_id || !reviewed_id || typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Dati recensione non validi' }, { status: 400 })
    }
    if (typeof comment !== 'string' || comment.trim().length < 10) {
      return NextResponse.json({ error: 'Il commento deve avere almeno 10 caratteri' }, { status: 400 })
    }
    const { data, error } = await db.from('reviews').insert({
      reviewer_id, reviewed_id, booking_id: booking_id || null, rating, comment: comment.trim(),
    }).select().single()
    if (error) throw error
    return NextResponse.json(data, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Errore nell\'invio della recensione' }, { status: 500 })
  }
}
