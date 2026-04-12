'use client'

import React from 'react'
import Hero from '@/components/b2colf/Hero'
import FeatureCard from '@/components/b2colf/FeatureCard'
import HowItWorks from '@/components/b2colf/HowItWorks'
import Testimonials from '@/components/b2colf/Testimonials'
import DownloadCTA from '@/components/b2colf/DownloadCTA'
import StatsCounter from '@/components/b2colf/StatsCounter'
import { useLanguage } from '@/components/b2colf/context/LanguageContext'

export default function Home() {
  const { t } = useLanguage()

  return (
    <div className="space-y-14">
      <Hero />

      <section className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-slate-100">{t('home.features_title')}</h2>
        <p className="text-slate-600 dark:text-slate-400 mt-2 text-center">{t('home.features_subtitle')}</p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <FeatureCard icon="users" title={t('home.feature1_title')} desc={t('home.feature1_desc')} />
          <FeatureCard icon="calendar" title={t('home.feature2_title')} desc={t('home.feature2_desc')} />
          <FeatureCard icon="check" title={t('home.feature3_title')} desc={t('home.feature3_desc')} />
          <FeatureCard icon="briefcase" title={t('home.feature4_title')} desc={t('home.feature4_desc')} />
        </div>
      </section>

      <StatsCounter />

      <div className="max-w-5xl mx-auto space-y-10">
        <HowItWorks />
        <Testimonials />
        <DownloadCTA />
      </div>
    </div>
  )
}
