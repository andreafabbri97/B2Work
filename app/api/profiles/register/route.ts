import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { validateProfilePayload } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    const db = createServerClient()
    const body = await request.json()
    const validation = validateProfilePayload(body)
    if (!validation.ok) return NextResponse.json({ error: validation.error }, { status: 400 })
    const { data, error } = await db.from('profiles').insert(validation.data).select().single()
    if (error) throw error
    return NextResponse.json(data, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Errore nella registrazione' }, { status: 500 })
  }
}
