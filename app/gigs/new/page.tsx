'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Input from '@/components/b2colf/ui/Input'
import Textarea from '@/components/b2colf/ui/Textarea'
import Badge from '@/components/b2colf/ui/Badge'
import { Form, FormField, FormLabel, FormControl, ShadcnButton } from '@/components/b2colf/shadcn'
import { useToast } from '@/components/b2colf/context/ToastContext'
import { MapPin, Calendar, Clock, Euro, FileText, Tag, Briefcase, Eye } from 'lucide-react'
import { ROLES } from '@/lib/constants'
import type { Category } from '@/lib/types'

export default function NewGigPage() {
  const router = useRouter()
  const { showToast } = useToast()
  const [categories, setCategories] = useState<Category[]>([])
  const [form, setForm] = useState({ title: '', description: '', category: '', role: '', location: '', date: '', duration_hours: '', price: '' })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(setCategories).catch(() => {})
  }, [])

  const handleChange = (k: string, v: string) => {
    setForm((s) => ({ ...s, [k]: v }))
    if (errors[k]) setErrors((e) => { const n = { ...e }; delete n[k]; return n })
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.title.trim()) e.title = 'Il titolo è obbligatorio'
    if (!form.category) e.category = 'Seleziona una categoria'
    if (!form.role) e.role = 'Seleziona un ruolo'
    if (!form.location.trim()) e.location = 'Il luogo è obbligatorio'
    if (!form.price || Number(form.price) <= 0) e.price = 'Inserisci un prezzo valido'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const payload = {
        title: form.title,
        description: form.description,
        category: form.category,
        role: form.role,
        location: form.location,
        date: form.date ? new Date(form.date).toISOString() : null,
        duration_hours: Number(form.duration_hours) || null,
        price: Number(form.price) || null,
      }
      const res = await fetch('/api/gigs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Errore')
      showToast('Annuncio pubblicato con successo!', 'success')
      router.push('/discovery')
    } catch (err: any) {
      showToast(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Pubblica un annuncio</h1>
        <p className="text-slate-600 mt-1">Compila i dettagli del lavoro che stai offrendo.</p>
      </div>

      {/* Progress indicator */}
      <div className="flex items-center gap-2 mb-6">
        <div className={`flex-1 h-1.5 rounded-full ${form.title && form.category ? 'bg-primary' : 'bg-slate-200'}`} />
        <div className={`flex-1 h-1.5 rounded-full ${form.role && form.location ? 'bg-primary' : 'bg-slate-200'}`} />
        <div className={`flex-1 h-1.5 rounded-full ${form.price ? 'bg-primary' : 'bg-slate-200'}`} />
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl p-6">
        <Form onSubmit={handleSubmit} className="space-y-4">
          <FormField>
            <FormLabel><FileText className="inline h-4 w-4 mr-1" />Titolo *</FormLabel>
            <FormControl>
              <Input placeholder="es. Cameriere per evento serale" value={form.title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('title', e.target.value)} />
            </FormControl>
            {errors.title && <p className="text-xs text-danger mt-1">{errors.title}</p>}
          </FormField>

          <FormField>
            <FormLabel><FileText className="inline h-4 w-4 mr-1" />Descrizione</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Descrivi il lavoro, i requisiti e le aspettative..."
                value={form.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange('description', e.target.value)}
                rows={4}
              />
            </FormControl>
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField>
              <FormLabel><Tag className="inline h-4 w-4 mr-1" />Categoria *</FormLabel>
              <FormControl>
                <select
                  value={form.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="">Seleziona categoria</option>
                  {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </FormControl>
              {errors.category && <p className="text-xs text-danger mt-1">{errors.category}</p>}
            </FormField>

            <FormField>
              <FormLabel><Briefcase className="inline h-4 w-4 mr-1" />Ruolo *</FormLabel>
              <FormControl>
                <select
                  value={form.role}
                  onChange={(e) => handleChange('role', e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="">Seleziona ruolo</option>
                  {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </FormControl>
              {errors.role && <p className="text-xs text-danger mt-1">{errors.role}</p>}
            </FormField>
          </div>

          <FormField>
            <FormLabel><MapPin className="inline h-4 w-4 mr-1" />Luogo *</FormLabel>
            <FormControl>
              <Input placeholder="es. Milano, Via Roma 15" value={form.location} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('location', e.target.value)} />
            </FormControl>
            {errors.location && <p className="text-xs text-danger mt-1">{errors.location}</p>}
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField>
              <FormLabel><Calendar className="inline h-4 w-4 mr-1" />Data</FormLabel>
              <FormControl>
                <Input type="datetime-local" value={form.date} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('date', e.target.value)} />
              </FormControl>
            </FormField>

            <FormField>
              <FormLabel><Clock className="inline h-4 w-4 mr-1" />Durata (ore)</FormLabel>
              <FormControl>
                <Input type="number" min="1" placeholder="es. 4" value={form.duration_hours} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('duration_hours', e.target.value)} />
              </FormControl>
            </FormField>

            <FormField>
              <FormLabel><Euro className="inline h-4 w-4 mr-1" />Prezzo (&euro;) *</FormLabel>
              <FormControl>
                <Input type="number" min="1" placeholder="es. 80" value={form.price} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('price', e.target.value)} />
              </FormControl>
              {errors.price && <p className="text-xs text-danger mt-1">{errors.price}</p>}
            </FormField>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowPreview(!showPreview)} className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition flex items-center gap-2">
              <Eye className="h-4 w-4" />
              {showPreview ? 'Nascondi' : 'Anteprima'}
            </button>
            <ShadcnButton className="px-6 py-2 rounded-lg" type="submit" disabled={loading}>
              {loading ? 'Pubblicando...' : 'Pubblica annuncio'}
            </ShadcnButton>
          </div>
        </Form>

        {/* Preview */}
        {showPreview && form.title && (
          <div className="mt-6 border-t pt-6">
            <h3 className="text-sm font-semibold text-slate-500 mb-3">Anteprima annuncio</h3>
            <div className="border border-slate-100 rounded-xl p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-slate-900">{form.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    {form.category && <Badge variant="primary">{form.category}</Badge>}
                    {form.role && <Badge variant="outline">{form.role}</Badge>}
                  </div>
                </div>
                {form.price && <span className="text-lg font-bold text-primary">&euro;{form.price}</span>}
              </div>
              {form.description && <p className="mt-2 text-sm text-slate-600">{form.description}</p>}
              <div className="mt-2 flex gap-3 text-xs text-slate-500">
                {form.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{form.location}</span>}
                {form.date && <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(form.date).toLocaleDateString('it-IT')}</span>}
                {form.duration_hours && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{form.duration_hours}h</span>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
