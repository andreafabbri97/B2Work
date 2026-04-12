import React from 'react'
import Hero from '@/components/b2colf/Hero'
import FeatureCard from '@/components/b2colf/FeatureCard'
import HowItWorks from '@/components/b2colf/HowItWorks'
import Testimonials from '@/components/b2colf/Testimonials'
import DownloadCTA from '@/components/b2colf/DownloadCTA'
import StatsCounter from '@/components/b2colf/StatsCounter'

export default function Home() {
  return (
    <div className="space-y-14">
      <Hero />

      <section className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-slate-900">Perch&eacute; scegliere B2Work</h2>
        <p className="text-slate-600 mt-2 text-center">Semplice, veloce, affidabile &mdash; provalo oggi.</p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <FeatureCard icon="users" title="Professionisti verificati" desc="Recensioni, badge verificazione e storico lavori." />
          <FeatureCard icon="calendar" title="Disponibilit&agrave; immediata" desc="Cerca per data e trova chi &egrave; disponibile ora." />
          <FeatureCard icon="check" title="Sicurezza e pagamento" desc="Flusso di pagamento sicuro e policy chiare." />
          <FeatureCard icon="briefcase" title="Ampia copertura di ruoli" desc="Dalla colf al cameriere, fino a tutte le esigenze." />
        </div>
      </section>

      <StatsCounter />

      <div className="max-w-5xl mx-auto space-y-10">
        <HowItWorks />
        <Testimonials />
        <DownloadCTA />
      </div>
    </div>
  )
}
