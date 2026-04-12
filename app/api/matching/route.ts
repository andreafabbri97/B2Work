import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const db = createServerClient()
    const { searchParams } = request.nextUrl
    const userId = searchParams.get('user_id')
    const category = searchParams.get('category')
    const city = searchParams.get('city')

    let query = db.from('gigs').select('*').eq('status', 'OPEN').order('created_at', { ascending: false }).limit(10)
    if (category) query = query.eq('category', category)
    if (city) query = query.ilike('location', `%${city}%`)
    if (userId) query = query.neq('poster_id', userId)

    const { data, error } = await query
    if (error) throw error
    return NextResponse.json(data)
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}
