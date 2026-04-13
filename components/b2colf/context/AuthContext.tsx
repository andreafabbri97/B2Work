'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { createClient, type SupabaseClient, type Session, type User } from '@supabase/supabase-js'

// ── Demo users (active when Supabase env vars are missing) ──────────────
const DEMO_USERS: Record<string, { password: string; profile: DemoProfile }> = {
  'demo@b2work.it': {
    password: 'demo1234',
    profile: { id: 'demo-worker-1', email: 'demo@b2work.it', full_name: 'Marco Rossi', role: 'WORKER', city: 'Milano', rating_avg: 4.5, bio: 'Lavoratore tuttofare con esperienza', avatar_url: null, verified: true },
  },
  'host@b2work.it': {
    password: 'host1234',
    profile: { id: 'demo-host-1', email: 'host@b2work.it', full_name: 'Laura Bianchi', role: 'HOST', city: 'Roma', rating_avg: 4.8, bio: 'Cerco collaboratori domestici affidabili', avatar_url: null, verified: true },
  },
}

type DemoProfile = {
  id: string; email: string; full_name: string; role: string
  city: string; rating_avg: number; bio: string; avatar_url: string | null; verified: boolean
}

function isDemoMode(): boolean {
  return !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
}

// Build a fake User object that satisfies the parts of the Supabase User type we use
function makeDemoUser(p: DemoProfile): User {
  return {
    id: p.id,
    email: p.email,
    app_metadata: {},
    user_metadata: { full_name: p.full_name, role: p.role },
    aud: 'authenticated',
    created_at: new Date().toISOString(),
  } as unknown as User
}

// ── Context type ────────────────────────────────────────────────────────
type AuthContextType = {
  user: User | null
  session: Session | null
  supabase: SupabaseClient
  signUp: (email: string, password: string) => Promise<any>
  signIn: (email: string, password: string) => Promise<any>
  socialSignIn: (provider: 'google' | 'facebook') => Promise<any>
  signOut: () => Promise<any>
  isDemo: boolean
  demoProfile: DemoProfile | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const DEMO_STORAGE_KEY = 'b2work_demo_user'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const demo = isDemoMode()

  // Create a browser Supabase client using public keys to avoid server-only bundling.
  const [supabase] = useState<SupabaseClient>(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (url && key) {
      return createClient(url, key)
    }

    // Minimal noop stub that matches the used auth interface
    const noop = {
      auth: {
        getSession: async () => ({ data: { session: null } }),
        onAuthStateChange: (_cb: any) => ({ subscription: { unsubscribe: () => {} } }),
        signUp: async () => ({ data: null, error: null }),
        signInWithPassword: async () => ({ data: null, error: null }),
        signOut: async () => ({ data: null, error: null }),
      },
      from: () => ({
        select: () => ({ eq: () => ({ single: async () => ({ data: null, error: null }), or: () => ({ data: [], error: null }) }), or: () => ({ data: [], error: null }), neq: () => ({ is: () => ({ data: null, error: null, count: 0 }) }), order: () => ({ limit: () => ({ eq: () => ({ data: [], error: null }), ilike: () => ({ data: [], error: null }), data: [], error: null }) }) }),
      }),
    } as unknown as SupabaseClient

    return noop
  })
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [demoProfile, setDemoProfile] = useState<DemoProfile | null>(null)

  // Restore demo session from localStorage
  useEffect(() => {
    if (demo) {
      try {
        const stored = typeof window !== 'undefined' ? localStorage.getItem(DEMO_STORAGE_KEY) : null
        if (stored) {
          const email = stored
          const entry = DEMO_USERS[email]
          if (entry) {
            setUser(makeDemoUser(entry.profile))
            setDemoProfile(entry.profile)
          }
        }
      } catch { /* localStorage not available */ }
      return
    }

    let mounted = true
    async function init() {
      const { data } = await supabase.auth.getSession()
      if (!mounted) return
      setSession(data.session)
      setUser(data.session?.user ?? null)
    }
    init()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess ?? null)
      setUser(sess?.user ?? null)
    })

    return () => {
      mounted = false
      listener?.subscription.unsubscribe()
    }
  }, [supabase, demo])

  async function signUp(email: string, password: string) {
    if (demo) {
      // In demo mode, allow "registration" by just logging in if it matches a demo user,
      // otherwise pretend it worked
      const entry = DEMO_USERS[email.toLowerCase()]
      if (entry) {
        setUser(makeDemoUser(entry.profile))
        setDemoProfile(entry.profile)
        localStorage.setItem(DEMO_STORAGE_KEY, email.toLowerCase())
        return { data: { user: makeDemoUser(entry.profile) }, error: null }
      }
      return { data: null, error: { message: 'In modalità demo, usa uno degli account predefiniti.' } }
    }
    return supabase.auth.signUp({ email, password })
  }

  async function signIn(email: string, password: string) {
    if (demo) {
      const entry = DEMO_USERS[email.toLowerCase()]
      if (!entry) {
        return { data: null, error: { message: 'Account demo non trovato. Usa: demo@b2work.it (worker) o host@b2work.it (host)' } }
      }
      if (entry.password !== password) {
        return { data: null, error: { message: 'Password errata per account demo' } }
      }
      setUser(makeDemoUser(entry.profile))
      setDemoProfile(entry.profile)
      localStorage.setItem(DEMO_STORAGE_KEY, email.toLowerCase())
      return { data: { user: makeDemoUser(entry.profile) }, error: null }
    }
    return supabase.auth.signInWithPassword({ email, password })
  }

  async function socialSignIn(provider: 'google' | 'facebook') {
    if (demo) {
      return { data: null, error: { message: 'Social login non disponibile in modalità demo. Usa email e password.' } }
    }
    if (!supabase.auth.signInWithOAuth) {
      return { data: null, error: { message: 'OAuth non configurato' } }
    }
    const redirectTo = typeof window !== 'undefined'
      ? window.location.origin + '/B2Work/profile/setup/'
      : undefined
    return supabase.auth.signInWithOAuth({ provider, options: { redirectTo } as any })
  }

  async function signOut() {
    if (demo) {
      setUser(null)
      setDemoProfile(null)
      localStorage.removeItem(DEMO_STORAGE_KEY)
      return
    }
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
  }

  return (
    <AuthContext.Provider value={{ user, session, supabase, signUp, signIn, socialSignIn, signOut, isDemo: demo, demoProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
