'use client'

import Link from 'next/link'
import { ArrowRight, Star, Users, Briefcase, CheckCircle, ShieldCheck, Zap } from 'lucide-react'
import { useLanguage } from './context/LanguageContext'

export const Hero = () => {
  const { t } = useLanguage()

  return (
    <section className="rounded-2xl bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 px-6 py-16 sm:py-20 border border-slate-100 dark:border-slate-600">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="order-2 lg:order-1">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-50 dark:bg-accent-900/50 border border-accent-200 dark:border-accent-600 rounded-full text-sm font-medium text-accent-700 dark:text-accent-300 mb-4">
            <Star className="h-3.5 w-3.5 fill-accent text-accent" />
            {t('hero.badge')}
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 leading-tight">
            {t('hero.title1')}{' '}
            <span className="text-primary">{t('hero.title2')}</span>
          </h1>
          <p className="mt-4 text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
            {t('hero.desc')}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link href="/discovery" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary-600 transition shadow-soft text-center">
              {t('hero.cta_explore')}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/gigs/new" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border-2 border-primary text-primary rounded-xl font-semibold hover:bg-primary-50 dark:hover:bg-primary-900/50 transition text-center">
              {t('hero.cta_publish')}
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 bg-white/80 dark:bg-slate-800 backdrop-blur rounded-xl border border-slate-100 dark:border-slate-600 flex items-start gap-3 transition-all hover:-translate-y-0.5 hover:shadow-soft dark:shadow-slate-900/50 cursor-default">
              <div className="p-2 bg-primary-50 dark:bg-primary-900/50 rounded-lg"><Users className="h-5 w-5 text-primary" /></div>
              <div>
                <div className="font-semibold text-slate-900 dark:text-slate-100">{t('hero.for_hirers')}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">{t('hero.for_hirers_desc')}</div>
              </div>
            </div>
            <div className="p-4 bg-white/80 dark:bg-slate-800 backdrop-blur rounded-xl border border-slate-100 dark:border-slate-600 flex items-start gap-3 transition-all hover:-translate-y-0.5 hover:shadow-soft dark:shadow-slate-900/50 cursor-default">
              <div className="p-2 bg-secondary-50 dark:bg-secondary-900/50 rounded-lg"><Briefcase className="h-5 w-5 text-secondary" /></div>
              <div>
                <div className="font-semibold text-slate-900 dark:text-slate-100">{t('hero.for_workers')}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">{t('hero.for_workers_desc')}</div>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-success-50 dark:bg-success-900/50 border border-success-200 dark:border-success-600 rounded-full text-success-700 dark:text-success-300">
              <CheckCircle className="h-3.5 w-3.5" />
              {t('hero.trust1')}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-50 dark:bg-primary-900/50 border border-primary-200 dark:border-primary-600 rounded-full text-primary-700 dark:text-primary-300">
              <ShieldCheck className="h-3.5 w-3.5" />
              {t('hero.trust2')}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent-50 dark:bg-accent-900/50 border border-accent-200 dark:border-accent-600 rounded-full text-accent-700 dark:text-accent-300">
              <Zap className="h-3.5 w-3.5" />
              {t('hero.trust3')}
            </span>
          </div>
        </div>

        <div className="order-1 lg:order-2 flex items-center justify-center animate-fade-in-up">
          <div className="w-full max-w-sm">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xl border border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center text-white font-bold text-sm">B2</div>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm">B2Work</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{t('hero.card_title')}</div>
                </div>
              </div>
              <div className="space-y-2.5">
                <div className="flex items-center gap-3 p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary font-bold text-xs">M</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100">Marco R.</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 truncate">Cameriere &bull; Milano</div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <Star className="h-3 w-3 text-accent fill-accent" />
                    <span className="text-xs font-medium">4.9</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-secondary-100 dark:bg-secondary-900/50 flex items-center justify-center text-secondary font-bold text-xs">G</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100">Giulia P.</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 truncate">Hostess &bull; Roma</div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <Star className="h-3 w-3 text-accent fill-accent" />
                    <span className="text-xs font-medium">4.8</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-accent-100 dark:bg-accent-900/50 flex items-center justify-center text-accent-700 dark:text-accent-300 font-bold text-xs">A</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100">Andrea S.</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 truncate">Barista &bull; Torino</div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <Star className="h-3 w-3 text-accent fill-accent" />
                    <span className="text-xs font-medium">5.0</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 text-center text-xs text-slate-400 dark:text-slate-500">{t('hero.card_footer')}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
