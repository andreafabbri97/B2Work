import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function GET() {
  try {
    const db = createServerClient()
    const { data, error } = await db.from('categories').select('*').order('id')
    if (error) throw error
    return NextResponse.json(data)
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}
