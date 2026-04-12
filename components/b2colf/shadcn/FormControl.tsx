'use client'

import React from 'react'

export function FormControl({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`mt-1 ${className || ''}`}>{children}</div>
}

export default FormControl
