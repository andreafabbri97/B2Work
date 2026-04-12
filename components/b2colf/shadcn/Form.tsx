'use client'

import React from 'react'

export function Form({ children, ...props }: React.FormHTMLAttributes<HTMLFormElement>) {
  return <form {...props}>{children}</form>
}

export default Form
