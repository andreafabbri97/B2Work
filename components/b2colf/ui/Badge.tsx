'use client'

import React from 'react'
import { cn } from '@/utils/cn'

type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'danger' | 'accent' | 'outline'

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-slate-100 text-slate-700',
  primary: 'bg-primary-100 text-primary-700',
  secondary: 'bg-secondary-100 text-secondary-700',
  success: 'bg-success-50 text-success-600',
  danger: 'bg-danger-50 text-danger-600',
  accent: 'bg-accent-100 text-accent-600',
  outline: 'bg-white border border-slate-200 text-slate-600',
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
