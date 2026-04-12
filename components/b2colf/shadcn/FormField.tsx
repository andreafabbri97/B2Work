'use client'

import React from 'react'

export function FormField({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>
}

export default FormField
