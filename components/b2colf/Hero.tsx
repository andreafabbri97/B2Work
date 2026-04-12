import Link from 'next/link'
import { ArrowRight, Star, Users, Briefcase, CheckCircle, ShieldCheck, Zap } from 'lucide-react'

export const Hero = () => {
  return (
    <section className="rounded-2xl bg-gradient-to-br from-primary-50 via-white to-secondary-50 px-6 py-16 sm:py-20 border border-slate-100">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="order-2 lg:order-1">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-50 border border-accent-200 rounded-full text-sm font-medium text-accent-700 mb-4">
            <Star className="h-3.5 w-3.5 fill-accent text-accent" />
            #1 Marketplace lavoro flessibile in Italia
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
            Trova il professionista giusto,{' '}
            <span className="text-primary">al momento giusto</span>
          </h1>
          <p className="mt-4 text-slate-600 text-lg leading-relaxed">
            Centinaia di opportunità locali per freelance e worker occasionali. Scopri, candidati o assumi in pochi istanti.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link href="/discovery" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary-600 transition shadow-soft text-center">
              Esplora offerte
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/gigs/new" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border-2 border-primary text-primary rounded-xl font-semibold hover:bg-primary-50 transition text-center">
              Pubblica subito
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 bg-white/80 backdrop-blur rounded-xl border border-slate-100 flex items-start gap-3 transition-all hover:-translate-y-0.5 hover:shadow-soft cursor-default">
              <div className="p-2 bg-primary-50 rounded-lg"><Users className="h-5 w-5 text-primary" /></div>
              <div>
                <div className="font-semibold text-slate-900">Per chi assume</div>
                <div className="text-sm text-slate-500">Selezione rapida &bull; Profili verificati</div>
              </div>
            </div>
            <div className="p-4 bg-white/80 backdrop-blur rounded-xl border border-slate-100 flex items-start gap-3 transition-all hover:-translate-y-0.5 hover:shadow-soft cursor-default">
              <div className="p-2 bg-secondary-50 rounded-lg"><Briefcase className="h-5 w-5 text-secondary" /></div>
              <div>
                <div className="font-semibold text-slate-900">Per chi lavora</div>
                <div className="text-sm text-slate-500">Offerte locali &bull; Pagamenti rapidi</div>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-success-50 border border-success-200 rounded-full text-success-700">
              <CheckCircle className="h-3.5 w-3.5" />
              Profili verificati
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-50 border border-primary-200 rounded-full text-primary-700">
              <ShieldCheck className="h-3.5 w-3.5" />
              Pagamento protetto
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent-50 border border-accent-200 rounded-full text-accent-700">
              <Zap className="h-3.5 w-3.5" />
              Risposta in 24h
            </span>
          </div>
        </div>

        <div className="order-1 lg:order-2 flex items-center justify-center animate-fade-in-up">
          <div className="w-full max-w-sm">
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center text-white font-bold text-sm">B2</div>
                <div>
                  <div className="font-semibold text-slate-900 text-sm">B2Work</div>
                  <div className="text-xs text-slate-500">Marketplace del lavoro</div>
                </div>
              </div>
              <div className="space-y-2.5">
                <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary font-bold text-xs">M</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-900">Marco R.</div>
                    <div className="text-xs text-slate-500 truncate">Cameriere &bull; Milano</div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <Star className="h-3 w-3 text-accent fill-accent" />
                    <span className="text-xs font-medium">4.9</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-secondary-100 flex items-center justify-center text-secondary font-bold text-xs">G</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-900">Giulia P.</div>
                    <div className="text-xs text-slate-500 truncate">Hostess &bull; Roma</div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <Star className="h-3 w-3 text-accent fill-accent" />
                    <span className="text-xs font-medium">4.8</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-accent-100 flex items-center justify-center text-accent-700 font-bold text-xs">A</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-900">Andrea S.</div>
                    <div className="text-xs text-slate-500 truncate">Barista &bull; Torino</div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <Star className="h-3 w-3 text-accent fill-accent" />
                    <span className="text-xs font-medium">5.0</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 text-center text-xs text-slate-400">+500 professionisti disponibili</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
