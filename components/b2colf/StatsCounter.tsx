'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Users, FileText, ThumbsUp, MapPin } from 'lucide-react'

const stats = [
  { icon: <Users className="h-6 w-6 text-primary" />, value: 500, suffix: '+', label: 'Professionisti attivi' },
  { icon: <FileText className="h-6 w-6 text-secondary" />, value: 1200, suffix: '+', label: 'Annunci pubblicati' },
  { icon: <ThumbsUp className="h-6 w-6 text-success" />, value: 98, suffix: '%', label: 'Soddisfazione clienti' },
  { icon: <MapPin className="h-6 w-6 text-accent" />, value: 50, suffix: '+', label: 'Città coperte' },
]

function useCountUp(target: number, duration: number, isVisible: boolean) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!isVisible) return
    let start = 0
    const step = Math.ceil(target / (duration / 16))
    const timer = setInterval(() => {
      start += step
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(start)
      }
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration, isVisible])
  return count
}

function StatItem({ icon, value, suffix, label, isVisible }: { icon: React.ReactNode; value: number; suffix: string; label: string; isVisible: boolean }) {
  const count = useCountUp(value, 1500, isVisible)
  return (
    <div className="text-center">
      <div className="flex justify-center mb-3">{icon}</div>
      <div className="text-3xl font-extrabold text-slate-900">
        {count.toLocaleString('it-IT')}{suffix}
      </div>
      <div className="text-sm text-slate-600 mt-1">{label}</div>
    </div>
  )
}

export default function StatsCounter() {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-100 rounded-2xl p-8 sm:p-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          {stats.map((s) => (
            <StatItem key={s.label} {...s} isVisible={isVisible} />
          ))}
        </div>
      </div>
    </section>
  )
}
