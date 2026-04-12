import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { validateBookingPayload } from '@/lib/validation'

export async function GET(request: NextRequest) {
  try {
    const db = createServerClient()
    const { searchParams } = request.nextUrl
    const userId = searchParams.get('user_id')
    let query = db.from('bookings').select('*').order('created_at', { ascending: false })
    if (userId) query = query.or(`host_id.eq.${userId},colf_id.eq.${userId}`)
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
    const validation = validateBookingPayload(body)
    if (!validation.ok) return NextResponse.json({ error: validation.error }, { status: 400 })
    const { data, error } = await db.from('bookings').insert(validation.data).select().single()
    if (error) throw error
    return NextResponse.json(data, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Errore nella prenotazione' }, { status: 500 })
  }
}
