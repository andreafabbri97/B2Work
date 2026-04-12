import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const anonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Don't create client at module-eval time if env not configured — protects local dev without Supabase
export const supabase = url && anonKey ? createClient(url, anonKey) : null

// Server-side helper that uses service role if available; throws if no server config
export function createServerClient(serviceRoleKey?: string) {
  const key = serviceRoleKey || process.env.SUPABASE_SERVICE_ROLE_KEY || anonKey
  if (!url || !key) throw new Error('Supabase not configured on server')
  return createClient(url, key)
}
