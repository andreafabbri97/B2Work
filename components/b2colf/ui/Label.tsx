'use client'

import React from 'react'

export function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={`block text-sm font-medium text-slate-700 ${className || ''}`}>{children}</label>
}

export default Label
