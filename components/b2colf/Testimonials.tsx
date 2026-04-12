'use client'

import React from 'react'
import { Star, Quote } from 'lucide-react'
import { useLanguage } from './context/LanguageContext'

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Luca Moretti',
    role: 'Ristoratore',
    city: 'Milano',
    initial: 'L',
    color: 'from-primary to-primary-600',
    rating: 5,
    text: 'Ho trovato un cameriere esperto in meno di 12 ore. Il processo è stato semplicissimo e il professionista era affidabile e puntuale.',
  },
  {
    id: 2,
    name: 'Maria Conti',
    role: 'Property Manager',
    city: 'Roma',
    initial: 'M',
    color: 'from-secondary to-secondary-600',
    rating: 5,
    text: 'La colf che ho trovato su B2Work ha salvato il check-in prima di un grande evento. Un servizio davvero indispensabile per chi gestisce immobili.',
  },
  {
    id: 3,
    name: 'Giulia Ferrara',
    role: 'Event Planner',
    city: 'Napoli',
    initial: 'G',
    color: 'from-accent-500 to-accent-600',
    rating: 4,
    text: 'Perfetto per coprire lo staff in last minute. Ho usato B2Work per 3 eventi e ogni volta ho trovato persone competenti e disponibili.',
  },
]

export default function Testimonials() {
  const { t } = useLanguage()

  return (
    <section>
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">{t('testimonials.title')}</h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400">{t('testimonials.subtitle')}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {TESTIMONIALS.map((item) => (
          <blockquote key={item.id} className="relative p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl hover:shadow-soft transition group">
            <Quote className="absolute top-4 right-4 h-8 w-8 text-slate-100 dark:text-slate-700 group-hover:text-primary-100 transition" />
            <div className="flex items-center gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className={`h-4 w-4 ${i <= item.rating ? 'text-accent fill-accent' : 'text-slate-200 dark:text-slate-600'}`} />
              ))}
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm">&ldquo;{item.text}&rdquo;</p>
            <footer className="mt-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-white font-bold text-sm`}>
                {item.initial}
              </div>
              <div>
                <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{item.name}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{item.role} &bull; {item.city}</div>
              </div>
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  )
}
