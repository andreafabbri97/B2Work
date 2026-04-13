'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { User as UserIcon, Menu, X, Briefcase, Search, PlusCircle, LayoutDashboard, LogOut, HelpCircle, Info, MessageSquare, Moon, Sun, Globe } from 'lucide-react'
import Button from './ui/Button'
import NotificationBell from './NotificationBell'
import { useAuth } from './context/AuthContext'
import { useTheme } from './context/ThemeContext'
import { useLanguage } from './context/LanguageContext'

export function Navbar() {
  const auth = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { locale, toggleLocale, t } = useLanguage()
  const [mobileOpen, setMobileOpen] = useState(false)

  const navLinks = [
    { href: '/discovery', label: t('nav.search'), icon: <Search className="h-4 w-4" /> },
    { href: '/gigs/new', label: t('nav.publish'), icon: <PlusCircle className="h-4 w-4" /> },
    { href: '/about', label: t('nav.about'), icon: <Info className="h-4 w-4" /> },
    { href: '/faq', label: t('nav.faq'), icon: <HelpCircle className="h-4 w-4" /> },
  ]

  return (
    <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <Briefcase className="h-6 w-6" />
          B2Work
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition">
              {link.label}
            </Link>
          ))}

          {/* Theme + Language toggles */}
          <div className="flex items-center gap-1">
            <button onClick={toggleTheme} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition" title={theme === 'dark' ? 'Light mode' : 'Dark mode'}>
              {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-500" />}
            </button>
            <button onClick={toggleLocale} className="px-2 py-1 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-600 dark:text-slate-300">
              {locale === 'it' ? 'EN' : 'IT'}
            </button>
          </div>

          {auth.user ? (
            <div className="flex items-center gap-2">
              <Link href="/messages" className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition" title={t('nav.messages')}>
                <MessageSquare className="h-5 w-5 text-slate-600 dark:text-slate-300" />
              </Link>
              <NotificationBell />
              <Link href="/dashboard" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition flex items-center gap-1 ml-1">
                <LayoutDashboard className="h-4 w-4" />
                {t('nav.dashboard')}
              </Link>
              <button onClick={() => auth.signOut()} className="text-sm px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center gap-1">
                <LogOut className="h-4 w-4" />
                {t('nav.logout')}
              </button>
            </div>
          ) : (
            <Link href="/auth/signin">
              <Button className="text-sm px-4 py-2 rounded-lg">
                {t('nav.login')} <UserIcon className="ml-2 h-4 w-4 inline" />
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          aria-label="Menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-[60] md:hidden" onClick={() => setMobileOpen(false)} />
          <div className="fixed top-0 right-0 h-full w-[280px] bg-white dark:bg-slate-900 z-[70] shadow-2xl animate-slide-in-right md:hidden flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
              <span className="font-bold text-lg text-primary flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                B2Work
              </span>
              <button onClick={() => setMobileOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 space-y-1 flex-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-primary-50 dark:hover:bg-slate-800 hover:text-primary transition font-medium"
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
              <hr className="my-3 border-slate-100 dark:border-slate-800" />
              {auth.user ? (
                <>
                  <Link href="/messages" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-primary-50 dark:hover:bg-slate-800 hover:text-primary transition font-medium">
                    <MessageSquare className="h-4 w-4" />
                    {t('nav.messages')}
                  </Link>
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-primary-50 dark:hover:bg-slate-800 hover:text-primary transition font-medium">
                    <LayoutDashboard className="h-4 w-4" />
                    {t('nav.dashboard')}
                  </Link>
                  <Link href="/profile/edit" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-primary-50 dark:hover:bg-slate-800 hover:text-primary transition font-medium">
                    <UserIcon className="h-4 w-4" />
                    {t('nav.profile')}
                  </Link>
                  <button onClick={() => { auth.signOut(); setMobileOpen(false) }} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-danger hover:bg-danger-50 dark:hover:bg-slate-800 transition font-medium w-full text-left">
                    <LogOut className="h-4 w-4" />
                    {t('nav.logout')}
                  </button>
                </>
              ) : (
                <Link href="/auth/signin" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary text-white font-medium">
                  <UserIcon className="h-4 w-4" />
                  {t('nav.signin')}
                </Link>
              )}
            </div>
            {/* Theme + Language toggles at bottom */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <button onClick={toggleTheme} className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition text-sm">
                {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-500" />}
                {theme === 'dark' ? 'Light' : 'Dark'}
              </button>
              <button onClick={toggleLocale} className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition text-sm">
                <Globe className="h-4 w-4" />
                {locale === 'it' ? 'English' : 'Italiano'}
              </button>
            </div>
          </div>
        </>
      )}
    </nav>
  )
}

export default Navbar
