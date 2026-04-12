'use client'

import React from 'react'
import { Smartphone, Globe, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function DownloadCTA() {
  return (
    <div className="rounded-2xl bg-gradient-to-r from-primary to-primary-700 text-white p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
      <div>
        <h3 className="text-2xl font-bold">Pronto per iniziare?</h3>
        <p className="mt-2 text-primary-100 max-w-md">
          Usa B2Work da qualsiasi dispositivo. Pubblica annunci, candidati e gestisci i tuoi lavori in pochi click.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/auth/signin"
          className="inline-flex items-center justify-center gap-2 bg-white text-primary px-6 py-3 rounded-xl font-semibold hover:bg-primary-50 transition"
        >
          <Globe className="h-5 w-5" />
          Inizia ora
          <ArrowRight className="h-4 w-4" />
        </Link>
        <button
          className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur text-white px-6 py-3 rounded-xl font-medium hover:bg-white/20 transition border border-white/20"
        >
          <Smartphone className="h-5 w-5" />
          App in arrivo
        </button>
      </div>
    </div>
  )
}
