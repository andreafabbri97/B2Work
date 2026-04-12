'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/components/b2colf/context/AuthContext'
import { useToast } from '@/components/b2colf/context/ToastContext'
import Input from '@/components/b2colf/ui/Input'
import Textarea from '@/components/b2colf/ui/Textarea'
import { Form, FormField, FormLabel, FormControl, ShadcnButton } from '@/components/b2colf/shadcn'
import { User, MapPin, Briefcase, FileText, Camera, Save, ArrowLeft, Phone, Award, Clock, Plus, X } from 'lucide-react'
import Link from 'next/link'
import { ROLES } from '@/lib/constants'

const DAYS = [
  { key: 'mon', label: 'Lunedì' },
  { key: 'tue', label: 'Martedì' },
  { key: 'wed', label: 'Mercoledì' },
  { key: 'thu', label: 'Giovedì' },
  { key: 'fri', label: 'Venerdì' },
  { key: 'sat', label: 'Sabato' },
  { key: 'sun', label: 'Domenica' },
]

const COMMON_CERTS = ['HACCP', 'Sicurezza sul lavoro', 'Primo soccorso', 'Antincendio', 'SAB', 'Patente B']

type FormState = {
  full_name: string
  bio: string
  city: string
  role: string
  hourly_rate: string
  phone: string
  availability: Record<string, string[]>
  certificates: string[]
}

export default function EditProfilePage() {
  const { user, supabase } = useAuth()
  const { showToast } = useToast()
  const [form, setForm] = useState<FormState>({
    full_name: '', bio: '', city: '', role: '', hourly_rate: '', phone: '',
    availability: {}, certificates: [],
  })
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [currentAvatar, setCurrentAvatar] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [newCert, setNewCert] = useState('')

  useEffect(() => {
    if (!user || !supabase) return
    const uid = user.id
    async function fetchProfile() {
      const { data } = await supabase.from('profiles').select('*').eq('id', uid).single()
      if (data) {
        setForm({
          full_name: data.full_name || '',
          bio: data.bio || '',
          city: data.city || '',
          role: data.role || '',
          hourly_rate: data.hourly_rate?.toString() || '',
          phone: data.phone || '',
          availability: data.availability || {},
          certificates: data.certificates || [],
        })
        if (data.avatar_url) setCurrentAvatar(data.avatar_url)
      }
    }
    fetchProfile()
  }, [user, supabase])

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('L\'immagine deve essere inferiore a 5MB', 'error')
        return
      }
      setAvatarFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setAvatarPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  function toggleDay(dayKey: string) {
    setForm((s) => {
      const updated = { ...s.availability }
      if (updated[dayKey]) {
        delete updated[dayKey]
      } else {
        updated[dayKey] = ['09:00-18:00']
      }
      return { ...s, availability: updated }
    })
  }

  function updateDaySlot(dayKey: string, value: string) {
    setForm((s) => ({
      ...s,
      availability: { ...s.availability, [dayKey]: [value] },
    }))
  }

  function addCertificate(cert: string) {
    const trimmed = cert.trim()
    if (!trimmed || form.certificates.includes(trimmed)) return
    setForm((s) => ({ ...s, certificates: [...s.certificates, trimmed] }))
    setNewCert('')
  }

  function removeCertificate(cert: string) {
    setForm((s) => ({ ...s, certificates: s.certificates.filter((c) => c !== cert) }))
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.full_name.trim()) e.full_name = 'Il nome è obbligatorio'
    if (!form.city.trim()) e.city = 'La città è obbligatoria'
    if (!form.role) e.role = 'Seleziona un ruolo'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    if (!user || !supabase) return showToast('Autenticazione richiesta', 'error')
    const uid = user.id
    setLoading(true)

    try {
      let avatar_url = undefined
      if (avatarFile) {
        const filePath = `avatars/${uid}-${Date.now()}-${avatarFile.name}`
        const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, avatarFile)
        if (uploadError) throw uploadError
        const { data: publicData } = await supabase.storage.from('avatars').getPublicUrl(filePath)
        avatar_url = publicData?.publicUrl
      }

      const payload: Record<string, unknown> = {
        id: uid,
        full_name: form.full_name,
        bio: form.bio,
        city: form.city,
        role: form.role,
        hourly_rate: form.hourly_rate ? Number(form.hourly_rate) : null,
        phone: form.phone || null,
        availability: Object.keys(form.availability).length > 0 ? form.availability : null,
        certificates: form.certificates.length > 0 ? form.certificates : null,
      }
      if (avatar_url) payload.avatar_url = avatar_url

      const { error } = await supabase.from('profiles').upsert(payload).select()
      if (error) throw error
      showToast('Profilo aggiornato con successo!', 'success')
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Errore nel salvataggio', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (!user) return (
    <div className="text-center py-16">
      <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">Devi essere autenticato</p>
      <Link href="/auth/signin" className="mt-4 inline-block text-primary hover:underline">Accedi</Link>
    </div>
  )

  const displayAvatar = avatarPreview || currentAvatar

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-primary transition mb-6">
        <ArrowLeft className="h-4 w-4" /> Torna alla dashboard
      </Link>

      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl overflow-hidden">
        {/* Header with avatar */}
        <div className="bg-gradient-to-r from-primary-50 dark:from-primary-900/30 to-secondary-50 dark:to-secondary-900/30 px-6 sm:px-8 pt-8 pb-16" />
        <div className="px-6 sm:px-8 -mt-12 pb-8">
          <div className="flex items-end gap-4 mb-6">
            <div className="relative group">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-200 to-primary-400 flex items-center justify-center text-white font-bold text-3xl shadow-soft border-4 border-white overflow-hidden">
                {displayAvatar ? (
                  <img src={displayAvatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  form.full_name?.charAt(0)?.toUpperCase() || '?'
                )}
              </div>
              <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition rounded-2xl cursor-pointer">
                <Camera className="h-6 w-6 text-white" />
                <input type="file" accept="image/*" className="sr-only" onChange={handleAvatarChange} />
              </label>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Modifica profilo</h1>
              <p className="text-sm text-slate-500">Aggiorna le tue informazioni professionali</p>
            </div>
          </div>

          <Form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic info */}
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-3">Informazioni base</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField>
                  <FormLabel><User className="inline h-4 w-4 mr-1" />Nome completo *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Mario Rossi"
                      value={form.full_name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm(s => ({ ...s, full_name: e.target.value }))}
                    />
                  </FormControl>
                  {errors.full_name && <p className="text-xs text-danger mt-1">{errors.full_name}</p>}
                </FormField>

                <FormField>
                  <FormLabel><Briefcase className="inline h-4 w-4 mr-1" />Ruolo *</FormLabel>
                  <FormControl>
                    <select
                      value={form.role}
                      onChange={(e) => setForm(s => ({ ...s, role: e.target.value }))}
                      className="w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                    >
                      <option value="">Seleziona ruolo</option>
                      {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </FormControl>
                  {errors.role && <p className="text-xs text-danger mt-1">{errors.role}</p>}
                </FormField>

                <FormField>
                  <FormLabel><MapPin className="inline h-4 w-4 mr-1" />Città *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="es. Milano"
                      value={form.city}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm(s => ({ ...s, city: e.target.value }))}
                    />
                  </FormControl>
                  {errors.city && <p className="text-xs text-danger mt-1">{errors.city}</p>}
                </FormField>

                <FormField>
                  <FormLabel><Phone className="inline h-4 w-4 mr-1" />Telefono</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="+39 333 1234567"
                      value={form.phone}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm(s => ({ ...s, phone: e.target.value }))}
                    />
                  </FormControl>
                </FormField>

                <FormField>
                  <FormLabel>Tariffa oraria (&euro;/h)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      placeholder="es. 15"
                      value={form.hourly_rate}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm(s => ({ ...s, hourly_rate: e.target.value }))}
                    />
                  </FormControl>
                </FormField>
              </div>
            </div>

            {/* Bio */}
            <FormField>
              <FormLabel><FileText className="inline h-4 w-4 mr-1" />Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descrivi la tua esperienza, le tue competenze e cosa ti rende speciale..."
                  value={form.bio}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setForm(s => ({ ...s, bio: e.target.value }))}
                  rows={4}
                />
              </FormControl>
              <p className="text-xs text-slate-400 mt-1">{form.bio.length}/500 caratteri</p>
            </FormField>

            {/* Availability */}
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4" /> Disponibilità settimanale
              </h3>
              <div className="space-y-2">
                {DAYS.map((day) => {
                  const isActive = day.key in form.availability
                  return (
                    <div key={day.key} className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => toggleDay(day.key)}
                        className={`w-24 text-left px-3 py-2 rounded-lg text-sm font-medium transition ${
                          isActive ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {day.label}
                      </button>
                      {isActive && (
                        <Input
                          placeholder="es. 09:00-18:00"
                          value={form.availability[day.key]?.[0] || ''}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateDaySlot(day.key, e.target.value)}
                          className="flex-1 max-w-xs"
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Certificates */}
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                <Award className="h-4 w-4" /> Certificazioni
              </h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {form.certificates.map((cert) => (
                  <span key={cert} className="inline-flex items-center gap-1 px-3 py-1.5 bg-secondary-50 dark:bg-secondary-900/30 text-secondary-700 rounded-lg text-sm font-medium">
                    {cert}
                    <button type="button" onClick={() => removeCertificate(cert)} className="ml-1 hover:text-danger">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {COMMON_CERTS.filter((c) => !form.certificates.includes(c)).map((cert) => (
                  <button
                    key={cert}
                    type="button"
                    onClick={() => addCertificate(cert)}
                    className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                  >
                    + {cert}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Aggiungi certificazione..."
                  value={newCert}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCert(e.target.value)}
                  onKeyDown={(e: React.KeyboardEvent) => { if (e.key === 'Enter') { e.preventDefault(); addCertificate(newCert) } }}
                  className="flex-1 max-w-xs"
                />
                <button
                  type="button"
                  onClick={() => addCertificate(newCert)}
                  className="px-3 py-2 bg-secondary text-white rounded-xl text-sm hover:bg-secondary-600 transition"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <ShadcnButton className="px-6 py-2.5 rounded-xl inline-flex items-center gap-2" disabled={loading}>
                <Save className="h-4 w-4" />
                {loading ? 'Salvataggio...' : 'Salva modifiche'}
              </ShadcnButton>
              <Link href="/dashboard" className="px-6 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition inline-flex items-center">
                Annulla
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  )
}
