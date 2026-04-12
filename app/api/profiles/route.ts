import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const db = createServerClient()
    const { searchParams } = request.nextUrl
    const city = searchParams.get('city')
    const role = searchParams.get('role')

    let query = db.from('profiles').select('*').order('rating_avg', { ascending: false })
    if (city) query = query.ilike('city', `%${city}%`)
    if (role) query = query.eq('role', role)

    const { data, error } = await query
    if (error) throw error
    return NextResponse.json(data)
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}
