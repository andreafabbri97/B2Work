'use client'

import React from 'react'
import Link from 'next/link'
import { Briefcase, Mail, MapPin, Phone } from 'lucide-react'
import { useLanguage } from './context/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300 dark:text-slate-400 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="h-6 w-6 text-primary-400" />
              <span className="text-xl font-bold text-white">B2Work</span>
            </div>
            <p className="text-sm leading-relaxed">
              {t('footer.desc')}
            </p>
          </div>

          {/* Link utili */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t('footer.useful_links')}</h4>
            <nav className="space-y-2 text-sm">
              <Link href="/discovery" className="block hover:text-white transition">{t('footer.search_job')}</Link>
              <Link href="/gigs/new" className="block hover:text-white transition">{t('footer.publish_ad')}</Link>
              <Link href="/about" className="block hover:text-white transition">{t('nav.about')}</Link>
              <Link href="/faq" className="block hover:text-white transition">{t('nav.faq')}</Link>
            </nav>
          </div>

          {/* Per i professionisti */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t('footer.for_professionals')}</h4>
            <nav className="space-y-2 text-sm">
              <Link href="/auth/signin" className="block hover:text-white transition">{t('footer.register')}</Link>
              <Link href="/profile/edit" className="block hover:text-white transition">{t('footer.complete_profile')}</Link>
              <Link href="/dashboard" className="block hover:text-white transition">{t('nav.dashboard')}</Link>
              <Link href="/discovery" className="block hover:text-white transition">{t('footer.explore_offers')}</Link>
            </nav>
          </div>

          {/* Contatti */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t('footer.contacts')}</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary-400" />
                <span>info@b2work.it</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary-400" />
                <span>+39 02 1234567</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary-400" />
                <span>Milano, Italia</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 dark:border-slate-700 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm">&copy; {new Date().getFullYear()} B2Work — {t('footer.rights')}</p>
          <div className="flex gap-4 text-sm">
            <Link href="#" className="hover:text-white transition">{t('footer.privacy')}</Link>
            <Link href="#" className="hover:text-white transition">{t('footer.terms')}</Link>
            <Link href="#" className="hover:text-white transition">{t('footer.cookies')}</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
