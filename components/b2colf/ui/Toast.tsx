'use client'

import React from 'react'
import { useToast } from '../context/ToastContext'
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'

const icons = {
  success: <CheckCircle className="h-5 w-5 text-success" />,
  error: <AlertCircle className="h-5 w-5 text-danger" />,
  info: <Info className="h-5 w-5 text-primary" />,
}

const bgColors = {
  success: 'bg-success-50 dark:bg-success-900/50 border-success/20',
  error: 'bg-danger-50 dark:bg-danger-900/50 border-danger/20',
  info: 'bg-primary-50 dark:bg-primary-900/50 border-primary/20',
}

export default function ToastContainer() {
  const { toasts, removeToast } = useToast()

  if (!toasts.length) return null

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-soft dark:shadow-slate-900/50 ${bgColors[toast.type]} ${
            toast.leaving ? 'animate-toast-out' : 'animate-toast-in'
          }`}
        >
          {icons[toast.type]}
          <span className="text-sm font-medium text-slate-800 dark:text-slate-200 flex-1">{toast.message}</span>
          <button onClick={() => removeToast(toast.id)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
