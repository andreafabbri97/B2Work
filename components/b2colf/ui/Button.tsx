'use client'

import React from 'react'
import { cn } from '@/utils/cn'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'outline'
}

export function Button({ className, variant = 'default', children, ...props }: Props & { children?: React.ReactNode }) {
  return (
    <button
      {...props}
      className={cn(
        'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition',
        variant === 'default'
          ? 'bg-primary text-white hover:bg-blue-700'
          : 'border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700',
        className || ''
      )}
    >
      {children}
    </button>
  )
}

export default Button
