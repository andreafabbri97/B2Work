'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/b2colf/context/AuthContext'
import { useToast } from '@/components/b2colf/context/ToastContext'
import Input from '@/components/b2colf/ui/Input'
import Link from 'next/link'
import { Mail, Lock, Eye, EyeOff, Briefcase, ArrowRight, Info } from 'lucide-react'

export default function SignInPage() {
  const { signIn, signUp, socialSignIn, user, isDemo } = useAuth()
  const router = useRouter()
  const { showToast } = useToast()
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const passwordStrength = (() => {
    if (password.length === 0) return { level: 0, label: '', color: '' }
    if (password.length < 6) return { level: 1, label: 'Debole', color: 'bg-danger' }
    if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) return { level: 2, label: 'Media', color: 'bg-accent' }
    return { level: 3, label: 'Forte', color: 'bg-success' }
  })()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) { setError('Compila tutti i campi'); return }
    setLoading(true)
    setError(null)
    try {
      const res = await signIn(email, password)
      if (res.error) throw res.error
      showToast('Accesso effettuato!', 'success')
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Credenziali non valide')
    } finally {
      setLoading(false)
    }
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) { setError('Compila tutti i campi'); return }
    if (password !== confirmPassword) { setError('Le password non coincidono'); return }
    if (password.length < 6) { setError('La password deve avere almeno 6 caratteri'); return }
    setLoading(true)
    setError(null)
    try {
      const res = await signUp(email, password)
      if (res.error) throw res.error
      await fetch('/api/profiles/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, full_name: '', role: 'WORKER' }) })
      showToast('Registrazione completata!', 'success')
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Errore nella registrazione')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  if (user) return null

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary rounded-2xl mb-4">
            <Briefcase className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Benvenuto su B2Work</h1>
          <p className="text-slate-500 mt-1">Il marketplace del lavoro flessibile</p>
        </div>

        {/* Demo credentials panel */}
        {isDemo && (
          <div className="bg-primary-50 border border-primary-200 rounded-2xl p-5 mb-4">
            <div className="flex items-start gap-2 mb-3">
              <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-primary-800 text-sm">Modalità Demo</h3>
                <p className="text-xs text-primary-600 mt-0.5">Supabase non configurato. Usa queste credenziali per testare:</p>
              </div>
            </div>
            <div className="space-y-2">
              {[
                { email: 'demo@b2work.it', pw: 'demo1234', role: 'WORKER', desc: 'Lavoratore' },
                { email: 'host@b2work.it', pw: 'host1234', role: 'HOST', desc: 'Datore di lavoro' },
              ].map((d) => (
                <button
                  key={d.email}
                  type="button"
                  onClick={() => { setEmail(d.email); setPassword(d.pw); setTab('login') }}
                  className="w-full text-left p-2.5 bg-white rounded-xl border border-primary-100 hover:border-primary-300 transition text-sm flex items-center justify-between group"
                >
                  <div>
                    <span className="font-medium text-slate-900">{d.email}</span>
                    <span className="text-slate-400 mx-2">/</span>
                    <span className="text-slate-500">{d.pw}</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 font-medium">{d.role}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white border border-slate-100 rounded-2xl p-6 sm:p-8 shadow-soft">
          {/* Tabs */}
          <div className="flex bg-slate-100 rounded-xl p-1 mb-6">
            <button
              onClick={() => { setTab('login'); setError(null) }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition ${tab === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Accedi
            </button>
            <button
              onClick={() => { setTab('register'); setError(null) }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition ${tab === 'register' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Registrati
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-danger-50 border border-danger-200 rounded-xl text-sm text-danger-700">
              {error}
            </div>
          )}

          <form onSubmit={tab === 'login' ? handleLogin : handleSignUp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="email"
                  placeholder="nome@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="La tua password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {tab === 'register' && password.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className={`flex-1 h-1 rounded-full ${i <= passwordStrength.level ? passwordStrength.color : 'bg-slate-200'}`} />
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Sicurezza: {passwordStrength.label}</p>
                </div>
              )}
            </div>

            {tab === 'register' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Conferma password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    type="password"
                    placeholder="Ripeti la password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            )}

            {tab === 'login' && (
              <div className="text-right">
                <button type="button" className="text-sm text-primary hover:underline">Password dimenticata?</button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'Caricamento...' : tab === 'login' ? 'Accedi' : 'Crea account'}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
            <div className="relative flex justify-center text-xs"><span className="bg-white px-3 text-slate-400">oppure continua con</span></div>
          </div>

          {/* Social */}
          <div className="flex gap-3">
            <button
              onClick={() => socialSignIn('google')}
              className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition flex items-center justify-center gap-2"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Google
            </button>
            <button
              onClick={() => socialSignIn('facebook')}
              className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition flex items-center justify-center gap-2"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Facebook
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Continuando, accetti i <Link href="/faq" className="underline hover:text-slate-600">Termini di servizio</Link> e la <Link href="/faq" className="underline hover:text-slate-600">Privacy policy</Link>
        </p>
      </div>
    </div>
  )
}
