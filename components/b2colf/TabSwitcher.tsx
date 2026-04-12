'use client'

import React from 'react'
import { Briefcase, Users } from 'lucide-react'
import { useFilter } from './context/FilterContext'

const TABS = [
  { key: 'gigs' as const, label: 'Annunci', icon: Briefcase },
  { key: 'professionals' as const, label: 'Professionisti', icon: Users },
]

export default function TabSwitcher() {
  const { activeTab, setActiveTab } = useFilter()

  return (
    <div className="inline-flex bg-slate-100 rounded-lg p-1 gap-1">
      {TABS.map(({ key, label, icon: Icon }) => {
        const isActive = activeTab === key
        return (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${
              isActive
                ? 'bg-white text-primary shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
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
