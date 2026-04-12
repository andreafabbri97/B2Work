'use client'

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import SearchBar from '@/components/b2colf/SearchBar'
import ProfileGrid from '@/components/b2colf/ProfileGrid'
import Sidebar from '@/components/b2colf/Sidebar'
import GigsList from '@/components/b2colf/GigsList'
import MobileCategoryFilter from '@/components/b2colf/MobileCategoryFilter'
import SortDropdown from '@/components/b2colf/SortDropdown'
import TabSwitcher from '@/components/b2colf/TabSwitcher'
import { ViewToggle } from '@/components/b2colf/MapView'
import { FilterProvider, useFilter } from '@/components/b2colf/context/FilterContext'
import { FavoritesProvider } from '@/components/b2colf/context/FavoritesContext'
import { useAuth } from '@/components/b2colf/context/AuthContext'
import { useLanguage } from '@/components/b2colf/context/LanguageContext'
import type { Profile, Gig } from '@/lib/types'
import { getProfiles, getGigs } from '@/lib/api'

const MapView = dynamic(() => import('@/components/b2colf/MapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse flex items-center justify-center">
      <span className="text-slate-400 text-sm">Caricamento mappa...</span>
    </div>
  ),
})

function DiscoveryContent() {
  const [view, setView] = useState<'list' | 'map'>('list')
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [gigs, setGigs] = useState<Gig[]>([])
  const { activeTab, setActiveTab } = useFilter()
  const { demoProfile } = useAuth()
  const { t } = useLanguage()

  const userRole = demoProfile?.role?.toUpperCase()
  const isHost = userRole === 'HOST'

  // Set default tab based on user role (only on first render)
  useEffect(() => {
    setActiveTab(isHost ? 'professionals' : 'gigs')
  }, [isHost, setActiveTab])

  const title = isHost ? t('discovery.title_host') : t('discovery.title_worker')
  const subtitle = isHost
    ? t('discovery.subtitle_host')
    : t('discovery.subtitle_worker')

  useEffect(() => {
    if (view !== 'map') return

    async function fetchMapData() {
      try {
        const [profilesData, gigsData] = await Promise.all([
          getProfiles(),
          getGigs(),
        ])
        setProfiles(profilesData)
        setGigs(gigsData)
      } catch (err) {
        console.error('Errore caricamento dati mappa:', err)
      }
    }

    fetchMapData()
  }, [view])

  return (
    <div className="md:flex md:items-start md:gap-6">
      <div className="md:w-64 md:flex-shrink-0">
        <Sidebar />
      </div>

      <div className="flex-1">
        <header className="mb-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{title}</h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">{subtitle}</p>
            </div>
            <ViewToggle view={view} onChange={setView} />
          </div>
        </header>

        {view === 'map' ? (
          <div className="space-y-4">
            <SearchBar />
            <div className="h-[500px] sm:h-[600px] relative z-0">
              <MapView profiles={profiles} gigs={gigs} />
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <SearchBar />

            <div className="md:hidden">
              <MobileCategoryFilter />
            </div>

            <div className="flex items-center justify-between flex-wrap gap-3">
              <TabSwitcher />
              <SortDropdown />
            </div>

            {activeTab === 'gigs' ? (
              <section>
                <GigsList />
              </section>
            ) : (
              <section>
                <ProfileGrid />
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function DiscoveryPage() {
  return (
    <FilterProvider>
      <FavoritesProvider>
        <DiscoveryContent />
      </FavoritesProvider>
    </FilterProvider>
  )
}
