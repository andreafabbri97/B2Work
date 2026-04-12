import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { validateGigPayload } from '@/lib/validation'

export async function GET(request: NextRequest) {
  try {
    const db = createServerClient()
    const { searchParams } = request.nextUrl
    const category = searchParams.get('category')
    const location = searchParams.get('location')

    let query = db.from('gigs').select('*').order('created_at', { ascending: false })
    if (category) query = query.eq('category', category)
    if (location) query = query.ilike('location', `%${location}%`)

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
    const validation = validateGigPayload(body)
    if (!validation.ok) return NextResponse.json({ error: validation.error }, { status: 400 })
    const { data, error } = await db.from('gigs').insert(validation.data).select().single()
    if (error) throw error
    return NextResponse.json(data, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Errore nella creazione dell\'annuncio' }, { status: 500 })
  }
}
