'use client'

import React from 'react'
import Link from 'next/link'
import { Target, Heart, Shield, Zap, Users, Globe } from 'lucide-react'
import { useLanguage } from '@/components/b2colf/context/LanguageContext'

export default function AboutPage() {
  const { t } = useLanguage()

  const values = [
    { icon: <Shield className="h-6 w-6 text-primary" />, title: t('about.value1'), desc: t('about.value1_desc') },
    { icon: <Zap className="h-6 w-6 text-accent" />, title: t('about.value2'), desc: t('about.value2_desc') },
    { icon: <Heart className="h-6 w-6 text-danger" />, title: t('about.value3'), desc: t('about.value3_desc') },
    { icon: <Users className="h-6 w-6 text-secondary" />, title: t('about.value4'), desc: t('about.value4_desc') },
    { icon: <Globe className="h-6 w-6 text-primary-600" />, title: t('about.value5'), desc: t('about.value5_desc') },
    { icon: <Target className="h-6 w-6 text-accent-600" />, title: t('about.value6'), desc: t('about.value6_desc') },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero section */}
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100">{t('about.title')}</h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          {t('about.desc')}
        </p>
      </div>

      {/* Mission */}
      <section className="bg-gradient-to-br from-primary-50 to-white dark:from-primary-900/50 dark:to-slate-900 border border-primary-100 dark:border-primary-800 rounded-2xl p-8 mb-12">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary-100 dark:bg-primary-900/50 rounded-xl">
            <Target className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{t('about.mission_title')}</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('about.mission_desc')}
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-slate-100 mb-8">{t('about.values_title')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {values.map((v) => (
            <div key={v.title} className="border border-slate-100 dark:border-slate-700 rounded-xl p-5 hover:shadow-soft transition">
              <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg w-fit mb-3">{v.icon}</div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">{v.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team placeholder */}
      <section className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-8 mb-12 text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">{t('about.team_title')}</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">{t('about.team_desc')}</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {['Marco R.', 'Sara L.', 'Andrea P.', 'Giulia M.'].map((name) => (
            <div key={name} className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-soft dark:shadow-slate-900/50">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/50 rounded-full mx-auto mb-3 flex items-center justify-center text-primary font-bold text-lg">
                {name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="font-medium text-slate-800 dark:text-slate-200">{name}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Co-founder</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t('about.cta_title')}</h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400">{t('about.cta_desc')}</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/auth/signin" className="px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-600 transition">
            {t('about.cta_register')}
          </Link>
          <Link href="/discovery" className="px-6 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
            {t('about.cta_explore')}
          </Link>
        </div>
      </section>
    </div>
  )
}
