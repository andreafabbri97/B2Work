'use client'

import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useLanguage } from '@/components/b2colf/context/LanguageContext'

function AccordionItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-slate-100 dark:border-slate-700 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left hover:text-primary transition"
      >
        <span className="font-medium text-slate-800 dark:text-slate-200">{q}</span>
        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="pb-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed animate-fade-in">
          {a}
        </div>
      )}
    </div>
  )
}

export default function FAQPage() {
  const { t } = useLanguage()

  const sections = [
    {
      title: t('faq.section1'),
      items: [
        { q: t('faq.q1'), a: t('faq.a1') },
        { q: t('faq.q2'), a: t('faq.a2') },
        { q: t('faq.q3'), a: t('faq.a3') },
        { q: t('faq.q4'), a: t('faq.a4') },
      ],
    },
    {
      title: t('faq.section2'),
      items: [
        { q: t('faq.q5'), a: t('faq.a5') },
        { q: t('faq.q6'), a: t('faq.a6') },
        { q: t('faq.q7'), a: t('faq.a7') },
      ],
    },
    {
      title: t('faq.section3'),
      items: [
        { q: t('faq.q8'), a: t('faq.a8') },
        { q: t('faq.q9'), a: t('faq.a9') },
        { q: t('faq.q10'), a: t('faq.a10') },
      ],
    },
    {
      title: t('faq.section4'),
      items: [
        { q: t('faq.q11'), a: t('faq.a11') },
        { q: t('faq.q12'), a: t('faq.a12') },
        { q: t('faq.q13'), a: t('faq.a13') },
      ],
    },
  ]

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{t('faq.title')}</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">{t('faq.subtitle')}</p>
      </div>

      <div className="space-y-8">
        {sections.map((section) => (
          <div key={section.title}>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">{section.title}</h2>
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-xl px-5">
              {section.items.map((item) => (
                <AccordionItem key={item.q} {...item} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
