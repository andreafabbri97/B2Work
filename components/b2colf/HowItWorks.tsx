'use client'

import React from 'react'
import { PenSquare, Users, Handshake, ArrowRight } from 'lucide-react'
import { useLanguage } from './context/LanguageContext'

const STEP_CONFIGS = [
  {
    icon: PenSquare,
    titleKey: 'howitworks.step1',
    descKey: 'howitworks.step1_desc',
    color: 'bg-primary-50 text-primary dark:bg-primary-900/50',
  },
  {
    icon: Users,
    titleKey: 'howitworks.step2',
    descKey: 'howitworks.step2_desc',
    color: 'bg-secondary-50 text-secondary dark:bg-secondary-900/50',
  },
  {
    icon: Handshake,
    titleKey: 'howitworks.step3',
    descKey: 'howitworks.step3_desc',
    color: 'bg-accent-50 text-accent-600 dark:bg-accent-900/50',
  },
]

export default function HowItWorks() {
  const { t } = useLanguage()

  return (
    <section className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-2xl p-8 sm:p-10 border border-slate-100 dark:border-slate-700">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">{t('howitworks.title')}</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">{t('howitworks.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {STEP_CONFIGS.map((step, i) => (
            <div key={i} className="relative text-center group">
              <div className={`h-16 w-16 ${step.color} rounded-2xl flex items-center justify-center mx-auto shadow-sm group-hover:scale-105 transition-transform`}>
                <step.icon className="h-7 w-7" />
              </div>
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mt-4 text-lg">{t(step.titleKey)}</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">{t(step.descKey)}</p>
              {i < STEP_CONFIGS.length - 1 && (
                <ArrowRight className="hidden sm:block absolute -right-3 top-7 h-5 w-5 text-slate-300 dark:text-slate-600" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
