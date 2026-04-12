'use client'

import React from 'react'
import Link from 'next/link'
import Button from './ui/Button'
import Badge from './ui/Badge'
import { useFavorites } from './context/FavoritesContext'
import { useLanguage } from './context/LanguageContext'
import { MapPin, Star, Heart, CheckCircle } from 'lucide-react'

type Props = {
  id: string
  full_name: string
  city: string
  bio: string | null
  rating_avg: number
  verified?: boolean
  role?: string
}

export default function ProfileCard({ id, full_name, city, bio, rating_avg, verified, role }: Props) {
  const { toggleFavorite, isFavorite } = useFavorites()
  const { t } = useLanguage()

  return (
    <article className="border border-slate-100 dark:border-slate-700 rounded-xl p-4 hover:shadow-soft transition group">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-primary font-bold text-lg">
          {full_name?.charAt(0)?.toUpperCase() || '?'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <Link href={`/profile/${id}`} className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-primary transition truncate block">
                {full_name}
                {verified && <CheckCircle className="inline ml-1 h-4 w-4 text-primary fill-primary-100" />}
              </Link>
              {role && <Badge variant="secondary" className="mt-0.5">{role}</Badge>}
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => toggleFavorite(id)} className="p-1 hover:bg-slate-50 dark:hover:bg-slate-800 rounded transition mr-1">
                <Heart className={`h-4 w-4 ${isFavorite(id) ? 'fill-danger text-danger' : 'text-slate-300'}`} />
              </button>
              <Star className="h-4 w-4 text-accent fill-accent" />
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{rating_avg?.toFixed(1)}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            <MapPin className="h-3 w-3" />
            {city}
          </div>
        </div>
      </div>

      {bio && <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{bio}</p>}

      <div className="mt-4 flex justify-end">
        <Link href={`/profile/${id}`}>
          <Button className="text-sm rounded-lg">{t('profiles.view')}</Button>
        </Link>
      </div>
    </article>
  )
}
