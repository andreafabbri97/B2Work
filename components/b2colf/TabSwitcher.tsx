'use client'

import React from 'react'
import { Briefcase, Users } from 'lucide-react'
import { useFilter } from './context/FilterContext'
import { useLanguage } from './context/LanguageContext'

export default function TabSwitcher() {
  const { activeTab, setActiveTab } = useFilter()
  const { t } = useLanguage()

  const TABS = [
    { key: 'gigs' as const, label: t('tabs.gigs'), icon: Briefcase },
    { key: 'professionals' as const, label: t('tabs.professionals'), icon: Users },
  ]

  return (
    <div className="inline-flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1 gap-1">
      {TABS.map(({ key, label, icon: Icon }) => {
        const isActive = activeTab === key
        return (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${
              isActive
                ? 'bg-white dark:bg-slate-900 text-primary shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        )
      })}
    </div>
  )
}
