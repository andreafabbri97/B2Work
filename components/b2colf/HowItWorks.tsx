'use client'

import React from 'react'
import { PenSquare, Users, Handshake, ArrowRight } from 'lucide-react'

const STEPS = [
  {
    icon: PenSquare,
    title: 'Pubblica',
    desc: 'Crea un annuncio rapido con data, ruolo e prezzo. Bastano 2 minuti.',
    color: 'bg-primary-50 text-primary',
  },
  {
    icon: Users,
    title: 'Connetti',
    desc: 'Ricevi candidature da professionisti verificati nella tua zona.',
    color: 'bg-secondary-50 text-secondary',
  },
  {
    icon: Handshake,
    title: 'Gestisci',
    desc: 'Conferma, comunica e paga direttamente. Tutto in un unico posto.',
    color: 'bg-accent-50 text-accent-600',
  },
]

export default function HowItWorks() {
  return (
    <section className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-8 sm:p-10 border border-slate-100">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Come funziona</h2>
          <p className="mt-2 text-slate-600">Pubblica un annuncio o cerca professionisti disponibili in 3 semplici passi</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {STEPS.map((step, i) => (
            <div key={i} className="relative text-center group">
              <div className={`h-16 w-16 ${step.color} rounded-2xl flex items-center justify-center mx-auto shadow-sm group-hover:scale-105 transition-transform`}>
                <step.icon className="h-7 w-7" />
              </div>
              <h4 className="font-semibold text-slate-900 mt-4 text-lg">{step.title}</h4>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">{step.desc}</p>
              {i < STEPS.length - 1 && (
                <ArrowRight className="hidden sm:block absolute -right-3 top-7 h-5 w-5 text-slate-300" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
