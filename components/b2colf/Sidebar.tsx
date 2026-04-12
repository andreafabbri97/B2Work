'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import CategoryList from './CategoryList'
import { Search, PlusCircle, LayoutDashboard, Briefcase } from 'lucide-react'

const NAV_LINKS = [
  { href: '/discovery', icon: Search, label: 'Cerca lavoro' },
  { href: '/gigs', icon: Briefcase, label: 'Tutti gli annunci' },
  { href: '/gigs/new', icon: PlusCircle, label: 'Pubblica annuncio' },
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:block w-64 pr-4">
      <div className="sticky top-24">
        <nav className="bg-white border border-slate-100 rounded-xl p-4 space-y-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition font-medium text-sm ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-slate-700 hover:bg-primary-50 hover:text-primary'
                }`}
              >
                <link.icon className="h-4 w-4" /> {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="mt-4">
          <h4 className="text-sm font-semibold text-slate-700 mb-2 px-1">Categorie</h4>
          <CategoryList />
        </div>
      </div>
    </aside>
  )
}
