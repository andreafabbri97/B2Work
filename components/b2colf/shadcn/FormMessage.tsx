'use client'

import React from 'react'

export function FormMessage({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={`text-sm text-red-600 ${className || ''}`}>{children}</p>
}

export default FormMessage
