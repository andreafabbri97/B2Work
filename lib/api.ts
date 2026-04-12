// Client-side data layer — calls Supabase directly when API routes are unavailable (static export)
// Falls back to /api/* when running on a Next.js server (local dev)

import { supabase } from './supabase'
import type { Gig, Profile, Category, Review } from './types'

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '/B2Work'

function isStaticHost(): boolean {
  if (typeof window === 'undefined') return false
  // On GitHub Pages or any static host, API routes don't exist — use Supabase directly
  return supabase !== null
}

async function fetchApi<T>(path: string): Promise<T> {
  const res = await fetch(path)
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

// --- Categories ---
export async function getCategories(): Promise<Category[]> {
  if (isStaticHost() && supabase) {
    const { data } = await supabase.from('categories').select('*').order('id')
    return (data as Category[]) || []
  }
  return fetchApi('/api/categories')
}

// --- Gigs ---
export async function getGigs(filters?: { category?: string; location?: string }): Promise<Gig[]> {
  if (isStaticHost() && supabase) {
    let query = supabase.from('gigs').select('*').order('created_at', { ascending: false })
    if (filters?.category) query = query.eq('category', filters.category)
    if (filters?.location) query = query.ilike('location', `%${filters.location}%`)
    const { data } = await query
    return (data as Gig[]) || []
  }
  const params = new URLSearchParams()
  if (filters?.category) params.set('category', filters.category)
  if (filters?.location) params.set('location', filters.location)
  const qs = params.toString()
  return fetchApi(`/api/gigs${qs ? `?${qs}` : ''}`)
}

export async function getGigById(id: string): Promise<Gig | null> {
  if (isStaticHost() && supabase) {
    const { data } = await supabase.from('gigs').select('*').eq('id', id).single()
    return data as Gig | null
  }
  try {
    return await fetchApi(`/api/gigs/${id}`)
  } catch {
    return null
  }
}

// --- Profiles ---
export async function getProfiles(filters?: { city?: string; role?: string }): Promise<Profile[]> {
  if (isStaticHost() && supabase) {
    let query = supabase.from('profiles').select('*').order('rating_avg', { ascending: false })
    if (filters?.city) query = query.ilike('city', `%${filters.city}%`)
    if (filters?.role) query = query.eq('role', filters.role)
    const { data } = await query
    return (data as Profile[]) || []
  }
  const params = new URLSearchParams()
  if (filters?.city) params.set('city', filters.city)
  if (filters?.role) params.set('role', filters.role)
  const qs = params.toString()
  return fetchApi(`/api/profiles${qs ? `?${qs}` : ''}`)
}

export async function getProfileById(id: string): Promise<Profile | null> {
  if (isStaticHost() && supabase) {
    const { data } = await supabase.from('profiles').select('*').eq('id', id).single()
    return data as Profile | null
  }
  try {
    return await fetchApi(`/api/profiles/${id}`)
  } catch {
    return null
  }
}

// --- Reviews ---
export async function getReviews(reviewedId?: string): Promise<Review[]> {
  if (isStaticHost() && supabase) {
    let query = supabase.from('reviews').select('*').order('created_at', { ascending: false })
    if (reviewedId) query = query.eq('reviewed_id', reviewedId)
    const { data } = await query
    return (data as Review[]) || []
  }
  const qs = reviewedId ? `?reviewed_id=${reviewedId}` : ''
  return fetchApi(`/api/reviews${qs}`)
}

// --- Matching ---
export async function getMatchingGigs(opts?: { userId?: string; category?: string; city?: string }): Promise<Gig[]> {
  if (isStaticHost() && supabase) {
    let query = supabase.from('gigs').select('*').eq('status', 'OPEN').order('created_at', { ascending: false }).limit(10)
    if (opts?.category) query = query.eq('category', opts.category)
    if (opts?.city) query = query.ilike('location', `%${opts.city}%`)
    if (opts?.userId) query = query.neq('poster_id', opts.userId)
    const { data } = await query
    return (data as Gig[]) || []
  }
  const params = new URLSearchParams()
  if (opts?.userId) params.set('user_id', opts.userId)
  if (opts?.category) params.set('category', opts.category)
  if (opts?.city) params.set('city', opts.city)
  const qs = params.toString()
  return fetchApi(`/api/matching${qs ? `?${qs}` : ''}`)
}
