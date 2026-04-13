'use client'

import React, { useEffect, useRef, useState } from 'react'
import { MapPin, List, Map as MapIcon, Locate } from 'lucide-react'
import { useLanguage } from '@/components/b2colf/context/LanguageContext'
import type { Profile, Gig } from '@/lib/types'

// Leaflet types
import type L from 'leaflet'

type MapItem = {
  id: string
  type: 'profile' | 'gig'
  title: string
  subtitle?: string
  latitude: number
  longitude: number
  price?: number
  rating?: number
  category?: string
  role?: string
}

type Props = {
  profiles?: Profile[]
  gigs?: Gig[]
  center?: [number, number]
  zoom?: number
  onItemClick?: (item: MapItem) => void
}

const DEFAULT_CENTER: [number, number] = [41.9028, 12.4964] // Roma
const DEFAULT_ZOOM = 6

function toMapItems(profiles: Profile[], gigs: Gig[]): MapItem[] {
  const items: MapItem[] = []

  for (const p of profiles) {
    if (p.latitude && p.longitude) {
      items.push({
        id: p.id,
        type: 'profile',
        title: p.full_name || 'Professionista',
        subtitle: p.city,
        latitude: p.latitude,
        longitude: p.longitude,
        rating: p.rating_avg,
        role: p.role,
      })
    }
  }

  for (const g of gigs) {
    if (g.latitude && g.longitude) {
      items.push({
        id: g.id,
        type: 'gig',
        title: g.title,
        subtitle: g.location,
        latitude: g.latitude,
        longitude: g.longitude,
        price: g.price,
        category: g.category,
        role: g.role,
      })
    }
  }

  return items
}

function createIcon(leaflet: typeof L, type: 'profile' | 'gig'): L.DivIcon {
  const color = type === 'profile' ? '#3b82f6' : '#f59e0b'
  const icon = type === 'profile' ? '👤' : '💼'
  return leaflet.divIcon({
    className: 'custom-marker',
    html: `<div style="background:${color};width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);font-size:16px;cursor:pointer;">${icon}</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20],
  })
}

export default function MapView({ profiles = [], gigs = [], center, zoom, onItemClick }: Props) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const [leafletLoaded, setLeafletLoaded] = useState(false)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const { t } = useLanguage()

  const items = toMapItems(profiles, gigs)

  // Load Leaflet dynamically (client-side only)
  useEffect(() => {
    let cancelled = false

    async function loadLeaflet() {
      if (typeof window === 'undefined') return

      // @ts-expect-error -- CSS import has no type declarations
      await import('leaflet/dist/leaflet.css')
      const L = (await import('leaflet')).default

      if (cancelled) return
      if (!mapRef.current || mapInstanceRef.current) return

      const mapCenter = center || userLocation || DEFAULT_CENTER
      const map = L.map(mapRef.current, {
        zoomControl: false,
      }).setView(mapCenter, zoom || DEFAULT_ZOOM)

      L.control.zoom({ position: 'topright' }).addTo(map)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map)

      // Add markers
      for (const item of items) {
        const marker = L.marker([item.latitude, item.longitude], {
          icon: createIcon(L, item.type),
        }).addTo(map)

        const popupContent = `
          <div style="min-width:180px;font-family:Inter,sans-serif;">
            <div style="font-weight:600;font-size:14px;margin-bottom:4px;">${item.title}</div>
            ${item.subtitle ? `<div style="color:#64748b;font-size:12px;margin-bottom:4px;">${item.subtitle}</div>` : ''}
            <div style="display:flex;gap:8px;align-items:center;font-size:12px;">
              ${item.price ? `<span style="font-weight:700;color:#3b82f6;">€${item.price}</span>` : ''}
              ${item.rating ? `<span>⭐ ${item.rating.toFixed(1)}</span>` : ''}
              ${item.category || item.role ? `<span style="background:#e2e8f0;padding:1px 6px;border-radius:4px;">${item.category || item.role}</span>` : ''}
            </div>
          </div>
        `
        marker.bindPopup(popupContent)

        if (onItemClick) {
          marker.on('click', () => onItemClick(item))
        }
      }

      // Add user location marker if available
      if (userLocation) {
        L.circleMarker(userLocation, {
          radius: 10,
          color: '#3b82f6',
          fillColor: '#3b82f6',
          fillOpacity: 0.3,
          weight: 2,
        }).addTo(map).bindPopup('La tua posizione')
      }

      // Fit bounds if items exist
      if (items.length > 0) {
        const bounds = L.latLngBounds(items.map(i => [i.latitude, i.longitude]))
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 })
      }

      mapInstanceRef.current = map
      setLeafletLoaded(true)
    }

    loadLeaflet()

    return () => {
      cancelled = true
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length, userLocation])

  function handleLocate() {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc: [number, number] = [pos.coords.latitude, pos.coords.longitude]
        setUserLocation(loc)
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView(loc, 12)
        }
      },
      (err) => console.error('Geolocation error:', err),
      { enableHighAccuracy: true }
    )
  }

  return (
    <div className="relative w-full h-full min-h-[400px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-600">
      <div ref={mapRef} className="w-full h-full min-h-[400px]" />

      {/* Locate button */}
      <button
        onClick={handleLocate}
        className="absolute bottom-4 right-4 z-[1000] bg-white dark:bg-slate-900 p-3 rounded-xl shadow-soft hover:shadow-soft-lg transition"
        title="Trova la mia posizione"
      >
        <Locate className="h-5 w-5 text-primary" />
      </button>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-xl p-3 text-xs space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-primary" />
          <span>{t('map.professionals')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-accent" />
          <span>{t('map.gigs')}</span>
        </div>
      </div>

      {!leafletLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800">
          <div className="text-slate-500 text-sm animate-pulse">{t('map.loading')}</div>
        </div>
      )}
    </div>
  )
}

// Toggle button for switching between list and map view
export function ViewToggle({ view, onChange }: { view: 'list' | 'map'; onChange: (v: 'list' | 'map') => void }) {
  const { t } = useLanguage()
  return (
    <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
      <button
        onClick={() => onChange('list')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
          view === 'list' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
        }`}
      >
        <List className="h-4 w-4" /> {t('map.list_view')}
      </button>
      <button
        onClick={() => onChange('map')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
          view === 'map' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
        }`}
      >
        <MapIcon className="h-4 w-4" /> {t('map.map_view')}
      </button>
    </div>
  )
}
