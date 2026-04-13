'use client'

import React from 'react'
import { cn } from '@/utils/cn'

type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'danger' | 'accent' | 'outline'

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
  primary: 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-200',
  secondary: 'bg-secondary-100 text-secondary-700 dark:bg-secondary-900/50 dark:text-secondary-200',
  success: 'bg-success-50 text-success-600 dark:bg-success-900/50 dark:text-success-300',
  danger: 'bg-danger-50 text-danger-600 dark:bg-danger-900/50 dark:text-danger-300',
  accent: 'bg-accent-100 text-accent-600 dark:bg-accent-900/50 dark:text-accent-300',
  outline: 'bg-white border border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300',
}

type Props = {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

export default function Badge({ children, variant = 'default', className }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
