import React from 'react'
import Link from 'next/link'
import { Briefcase, Mail, MapPin, Phone } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="h-6 w-6 text-primary-400" />
              <span className="text-xl font-bold text-white">B2Work</span>
            </div>
            <p className="text-sm leading-relaxed">
              La piattaforma che connette professionisti e datori di lavoro per opportunità flessibili e occasionali.
            </p>
          </div>

          {/* Link utili */}
          <div>
            <h4 className="text-white font-semibold mb-4">Link utili</h4>
            <nav className="space-y-2 text-sm">
              <Link href="/discovery" className="block hover:text-white transition">Cerca lavoro</Link>
              <Link href="/gigs/new" className="block hover:text-white transition">Pubblica annuncio</Link>
              <Link href="/about" className="block hover:text-white transition">Chi siamo</Link>
              <Link href="/faq" className="block hover:text-white transition">FAQ</Link>
            </nav>
          </div>

          {/* Per i professionisti */}
          <div>
            <h4 className="text-white font-semibold mb-4">Per i professionisti</h4>
            <nav className="space-y-2 text-sm">
              <Link href="/auth/signin" className="block hover:text-white transition">Registrati</Link>
              <Link href="/profile/edit" className="block hover:text-white transition">Completa il profilo</Link>
              <Link href="/dashboard" className="block hover:text-white transition">Dashboard</Link>
              <Link href="/discovery" className="block hover:text-white transition">Esplora offerte</Link>
            </nav>
          </div>

          {/* Contatti */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contatti</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary-400" />
                <span>info@b2work.it</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary-400" />
                <span>+39 02 1234567</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary-400" />
                <span>Milano, Italia</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm">&copy; {new Date().getFullYear()} B2Work — Tutti i diritti riservati</p>
          <div className="flex gap-4 text-sm">
            <Link href="#" className="hover:text-white transition">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition">Termini di Servizio</Link>
            <Link href="#" className="hover:text-white transition">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
