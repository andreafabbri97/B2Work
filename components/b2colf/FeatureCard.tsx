'use client'

import React from 'react'
import { Users, Calendar, CheckCircle, Briefcase } from 'lucide-react'

type Props = {
  title: string
  desc: string
  icon: 'users' | 'calendar' | 'check' | 'briefcase'
}

const ICON_CONFIG = {
  users: { Icon: Users, bg: 'bg-primary-50 dark:bg-primary-900/30', text: 'text-primary', border: 'group-hover:border-primary-200' },
  calendar: { Icon: Calendar, bg: 'bg-secondary-50 dark:bg-secondary-900/30', text: 'text-secondary', border: 'group-hover:border-secondary-200' },
  check: { Icon: CheckCircle, bg: 'bg-success-50 dark:bg-success-900/30', text: 'text-success', border: 'group-hover:border-success-200' },
  briefcase: { Icon: Briefcase, bg: 'bg-accent-50 dark:bg-accent-900/30', text: 'text-accent-600', border: 'group-hover:border-accent-200' },
}

export default function FeatureCard({ title, desc, icon }: Props) {
  const config = ICON_CONFIG[icon] || ICON_CONFIG.briefcase
  const { Icon } = config

  return (
    <div className={`bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl p-6 hover:shadow-soft transition-all hover:-translate-y-0.5 group ${config.border}`}>
      <div className="flex items-center gap-4">
        <div className={`p-3 ${config.bg} rounded-xl group-hover:scale-105 transition-transform`}>
          <Icon className={`h-6 w-6 ${config.text}`} />
        </div>
        <h3 className="font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      </div>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{desc}</p>
    </div>
  )
}
