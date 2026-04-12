'use client'

import React, { forwardRef } from 'react'

export const Textarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  (props, ref) => {
    return (
      <textarea
        ref={ref}
        {...props}
        className={`w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition ${props.className || ''}`}
      />
    )
  }
)

Textarea.displayName = 'Textarea'

export default Textarea
