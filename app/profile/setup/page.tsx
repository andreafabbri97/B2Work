'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/b2colf/context/AuthContext'
import { useToast } from '@/components/b2colf/context/ToastContext'
import { useLanguage } from '@/components/b2colf/context/LanguageContext'
import Input from '@/components/b2colf/ui/Input'
import { Briefcase, Users, MapPin, User, ArrowRight, CheckCircle } from 'lucide-react'
import { ROLES } from '@/lib/constants'

type AccountType = 'WORKER' | 'HOST' | null
type Step = 'type' | 'details'

export default function ProfileSetupPage() {
  const { user, supabase } = useAuth()
  const { showToast } = useToast()
  const { t } = useLanguage()
  const router = useRouter()

  const [step, setStep] = useState<Step>('type')
  const [accountType, setAccountType] = useState<AccountType>(null)
  const [fullName, setFullName] = useState('')
  const [city, setCity] = useState('')
  const [role, setRole] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push('/auth/signin')
      return
    }
    // Pre-fill name from Google auth metadata
    const meta = (user as any)?.user_metadata
    if (meta?.full_name || meta?.name) {
      setFullName(meta.full_name || meta.name)
    }
    // If profile already complete, go to dashboard
    if (supabase) {
      supabase.from('profiles').select('city,role').eq('id', user.id).single().then(({ data }) => {
        if (data?.city && data.city.trim() !== '') {
          router.push('/dashboard')
        }
      })
    }
  }, [user, supabase, router])

  async function handleSubmit() {
    if (!user || !supabase) return
    if (!accountType) return
    if (!fullName.trim()) return showToast(t('profileedit.error_name'), 'error')
    if (!city.trim()) return showToast(t('profileedit.error_city'), 'error')

    setLoading(true)
    try {
      const payload: Record<string, unknown> = {
        id: user.id,
        full_name: fullName.trim(),
        city: city.trim(),
        role: accountType === 'HOST' ? 'HOST' : (role || 'WORKER'),
      }

      const { error } = await supabase.from('profiles').upsert(payload).select()
      if (error) throw error

      showToast(t('profileedit.success'), 'success')
      router.push('/dashboard')
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : t('profileedit.error_save'), 'error')
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary rounded-2xl mb-4">
            <Briefcase className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {t('setup.welcome')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {t('setup.subtitle')}
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className={`h-2 w-12 rounded-full transition-colors ${step === 'type' ? 'bg-primary' : 'bg-primary/30'}`} />
          <div className={`h-2 w-12 rounded-full transition-colors ${step === 'details' ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`} />
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl p-6 sm:p-8 shadow-soft dark:shadow-slate-900/50">

          {/* Step 1: Choose account type */}
          {step === 'type' && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 text-center mb-6">
                {t('setup.choose_type')}
              </h2>

              <button
                onClick={() => setAccountType('WORKER')}
                className={`w-full p-5 rounded-2xl border-2 transition text-left flex items-start gap-4 ${
                  accountType === 'WORKER'
                    ? 'border-primary bg-primary-50 dark:bg-primary-900/50'
                    : 'border-slate-200 dark:border-slate-600 hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className={`p-3 rounded-xl ${accountType === 'WORKER' ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                  <Users className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">{t('setup.worker_title')}</h3>
                    {accountType === 'WORKER' && <CheckCircle className="h-5 w-5 text-primary" />}
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t('setup.worker_desc')}</p>
                </div>
              </button>

              <button
                onClick={() => setAccountType('HOST')}
                className={`w-full p-5 rounded-2xl border-2 transition text-left flex items-start gap-4 ${
                  accountType === 'HOST'
                    ? 'border-secondary bg-secondary-50 dark:bg-secondary-900/50'
                    : 'border-slate-200 dark:border-slate-600 hover:border-secondary/50 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className={`p-3 rounded-xl ${accountType === 'HOST' ? 'bg-secondary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                  <Briefcase className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">{t('setup.host_title')}</h3>
                    {accountType === 'HOST' && <CheckCircle className="h-5 w-5 text-secondary" />}
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t('setup.host_desc')}</p>
                </div>
              </button>

              <button
                onClick={() => accountType && setStep('details')}
                disabled={!accountType}
                className="w-full mt-4 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-600 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {t('setup.continue')}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Step 2: Basic details */}
          {step === 'details' && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 text-center mb-2">
                {t('setup.complete_profile')}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-6">
                {accountType === 'WORKER' ? t('setup.worker_details_desc') : t('setup.host_details_desc')}
              </p>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  <User className="inline h-4 w-4 mr-1" />{t('profileedit.full_name')} *
                </label>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Mario Rossi"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  <MapPin className="inline h-4 w-4 mr-1" />{t('profileedit.city')} *
                </label>
                <Input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder={t('profileedit.city_placeholder')}
                />
              </div>

              {accountType === 'WORKER' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    <Briefcase className="inline h-4 w-4 mr-1" />{t('profileedit.role')} *
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                  >
                    <option value="">{t('profileedit.select_role')}</option>
                    {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setStep('type')}
                  className="px-6 py-3 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                >
                  {t('common.back')}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading || !fullName.trim() || !city.trim()}
                  className="flex-1 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-600 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? t('common.loading') : t('setup.start_using')}
                  {!loading && <ArrowRight className="h-4 w-4" />}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
