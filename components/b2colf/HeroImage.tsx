'use client'

import Image from 'next/image'
import React from 'react'

import BLUR_DATA_URL from './hero-people-blur'

export default function HeroImage({ src = '/images/hero-people-1280.webp', alt = 'Persone che lavorano su B2Work' }: { src?: string; alt?: string }) {
  const [loaded, setLoaded] = React.useState(false)

  return (
    <div className={`w-full h-80 rounded-lg overflow-hidden bg-gradient-to-br from-blue-50 to-white ${loaded ? '' : 'animate-pulse'}`}>
      <Image
        src={src}
        alt={alt}
        width={520}
        height={320}
        className={`w-full h-full object-cover transition-transform duration-300 ${loaded ? 'scale-100 blur-0' : 'scale-105 blur-sm'}`}
        onLoad={() => setLoaded(true)}
        loading="lazy"
        priority={false}
        placeholder="blur"
        blurDataURL={BLUR_DATA_URL}
      />
    </div>
  )
}
