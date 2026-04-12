import React from 'react'
import Link from 'next/link'
import { Target, Heart, Shield, Zap, Users, Globe } from 'lucide-react'

const values = [
  { icon: <Shield className="h-6 w-6 text-primary" />, title: 'Affidabilità', desc: 'Profili verificati e pagamenti protetti per ogni collaborazione.' },
  { icon: <Zap className="h-6 w-6 text-accent" />, title: 'Velocità', desc: 'Trova il professionista giusto in poche ore, non settimane.' },
  { icon: <Heart className="h-6 w-6 text-danger" />, title: 'Passione', desc: 'Crediamo nel valore del lavoro flessibile e nella dignità di ogni lavoratore.' },
  { icon: <Users className="h-6 w-6 text-secondary" />, title: 'Community', desc: 'Una rete di professionisti che si supportano e crescono insieme.' },
  { icon: <Globe className="h-6 w-6 text-primary-600" />, title: 'Accessibilità', desc: 'Disponibile ovunque, su ogni dispositivo, per chiunque.' },
  { icon: <Target className="h-6 w-6 text-accent-600" />, title: 'Precisione', desc: 'Matching intelligente tra domanda e offerta di lavoro.' },
]

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero section */}
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Chi siamo</h1>
        <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          B2Work nasce dall&apos;idea che trovare lavoro flessibile debba essere semplice, sicuro e veloce.
          Connettiamo professionisti e datori di lavoro per opportunità occasionali in tutta Italia.
        </p>
      </div>

      {/* Mission */}
      <section className="bg-gradient-to-br from-primary-50 to-white border border-primary-100 rounded-2xl p-8 mb-12">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary-100 rounded-xl">
            <Target className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">La nostra missione</h2>
            <p className="mt-2 text-slate-600 leading-relaxed">
              Creare la piattaforma di riferimento in Italia per il lavoro occasionale e freelance,
              dove ogni professionista possa trovare opportunità adatte alle proprie competenze e
              ogni azienda possa trovare il talento giusto al momento giusto. Vogliamo rendere il
              mercato del lavoro flessibile trasparente, equo e accessibile a tutti.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-center text-slate-900 mb-8">I nostri valori</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {values.map((v) => (
            <div key={v.title} className="border border-slate-100 rounded-xl p-5 hover:shadow-soft transition">
              <div className="p-2 bg-slate-50 rounded-lg w-fit mb-3">{v.icon}</div>
              <h3 className="font-semibold text-slate-900">{v.title}</h3>
              <p className="text-sm text-slate-600 mt-1">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team placeholder */}
      <section className="bg-slate-50 rounded-2xl p-8 mb-12 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-3">Il nostro team</h2>
        <p className="text-slate-600 mb-6">Un team giovane e appassionato con sede a Milano, dedicato a trasformare il mondo del lavoro flessibile.</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {['Marco R.', 'Sara L.', 'Andrea P.', 'Giulia M.'].map((name) => (
            <div key={name} className="bg-white rounded-xl p-4 shadow-soft">
              <div className="w-16 h-16 bg-primary-100 rounded-full mx-auto mb-3 flex items-center justify-center text-primary font-bold text-lg">
                {name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="font-medium text-slate-800">{name}</div>
              <div className="text-xs text-slate-500">Co-founder</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center">
        <h2 className="text-2xl font-bold text-slate-900">Unisciti a noi</h2>
        <p className="mt-2 text-slate-600">Inizia oggi a scoprire le opportunità su B2Work.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/auth/signin" className="px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-600 transition">
            Registrati gratis
          </Link>
          <Link href="/discovery" className="px-6 py-2.5 border border-slate-200 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition">
            Esplora annunci
          </Link>
        </div>
      </section>
    </div>
  )
}
