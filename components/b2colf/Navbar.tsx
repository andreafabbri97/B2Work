'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { User as UserIcon, Menu, X, Briefcase, Search, PlusCircle, LayoutDashboard, LogOut, HelpCircle, Info, MessageSquare } from 'lucide-react'
import Button from './ui/Button'
import NotificationBell from './NotificationBell'
import { useAuth } from './context/AuthContext'

export function Navbar() {
  const auth = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  const navLinks = [
    { href: '/discovery', label: 'Cerca', icon: <Search className="h-4 w-4" /> },
    { href: '/gigs/new', label: 'Pubblica', icon: <PlusCircle className="h-4 w-4" /> },
    { href: '/about', label: 'Chi siamo', icon: <Info className="h-4 w-4" /> },
    { href: '/faq', label: 'FAQ', icon: <HelpCircle className="h-4 w-4" /> },
  ]

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <Briefcase className="h-6 w-6" />
          B2Work
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-slate-600 hover:text-primary transition">
              {link.label}
            </Link>
          ))}
          {auth.user ? (
            <div className="flex items-center gap-2">
              <Link href="/messages" className="p-2 rounded-xl hover:bg-slate-100 transition" title="Messaggi">
                <MessageSquare className="h-5 w-5 text-slate-600" />
              </Link>
              <NotificationBell />
              <Link href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-primary transition flex items-center gap-1 ml-1">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <button onClick={() => auth.signOut()} className="text-sm px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition flex items-center gap-1">
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          ) : (
            <Link href="/auth/signin">
              <Button className="text-sm px-4 py-2 rounded-lg">
                Login <UserIcon className="ml-2 h-4 w-4 inline" />
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition"
          aria-label="Menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40 md:hidden" onClick={() => setMobileOpen(false)} />
          <div className="fixed top-0 right-0 h-full w-72 bg-white z-50 shadow-soft-xl animate-slide-in-right md:hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <span className="font-bold text-lg text-primary flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                B2Work
              </span>
              <button onClick={() => setMobileOpen(false)} className="p-1 rounded-lg hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 hover:bg-primary-50 hover:text-primary transition font-medium"
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
              <hr className="my-3 border-slate-100" />
              {auth.user ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 hover:bg-primary-50 hover:text-primary transition font-medium"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <Link
                    href="/profile/edit"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 hover:bg-primary-50 hover:text-primary transition font-medium"
                  >
                    <UserIcon className="h-4 w-4" />
                    Profilo
                  </Link>
                  <button
                    onClick={() => { auth.signOut(); setMobileOpen(false) }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-danger hover:bg-danger-50 transition font-medium w-full text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/auth/signin"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary text-white font-medium"
                >
                  <UserIcon className="h-4 w-4" />
                  Accedi / Registrati
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </nav>
  )
}

export default Navbar
