'use client'

import React, { Component } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

type Props = { children: React.ReactNode }
type State = { hasError: boolean; error: Error | null }

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4 py-16">
          <div className="p-4 bg-danger-50 dark:bg-danger-900/50 rounded-full mb-4">
            <AlertTriangle className="h-8 w-8 text-danger" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Qualcosa è andato storto</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400 max-w-md">
            Si è verificato un errore imprevisto. Riprova o torna alla pagina principale.
          </p>
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-600 transition"
            >
              <RefreshCw className="h-4 w-4" />
              Riprova
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              <Home className="h-4 w-4" />
              Home
            </Link>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
