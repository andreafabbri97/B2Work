'use client'

import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const sections = [
  {
    title: 'Per chi assume',
    items: [
      { q: 'Come trovo un professionista?', a: 'Vai alla sezione "Cerca" e filtra per categoria, città o ruolo. Puoi contattare i professionisti direttamente dal loro profilo.' },
      { q: 'Come pubblico un annuncio di lavoro?', a: 'Clicca su "Pubblica" nella barra di navigazione, compila il form con tutti i dettagli del lavoro e conferma la pubblicazione.' },
      { q: 'Posso vedere le recensioni dei professionisti?', a: 'Sì, ogni profilo mostra la valutazione media e le recensioni ricevute dai datori di lavoro precedenti.' },
      { q: 'Quanto costa pubblicare un annuncio?', a: 'La pubblicazione degli annunci è gratuita durante la fase di lancio della piattaforma.' },
    ],
  },
  {
    title: 'Per chi lavora',
    items: [
      { q: 'Come mi registro come professionista?', a: 'Crea un account, completa il tuo profilo con competenze, esperienze e disponibilità, e inizia a candidarti per gli annunci.' },
      { q: 'Come mi candido per un lavoro?', a: 'Nella pagina di dettaglio dell\'annuncio, clicca su "Candidati" e seleziona la data preferita. Il datore di lavoro riceverà la tua candidatura.' },
      { q: 'Posso scegliere le mie tariffe?', a: 'Sì, puoi indicare le tariffe nel tuo profilo. Per ogni annuncio il prezzo viene stabilito dal datore di lavoro, ma puoi sempre negoziare.' },
    ],
  },
  {
    title: 'Pagamenti',
    items: [
      { q: 'Come funzionano i pagamenti?', a: 'I pagamenti vengono gestiti in modo sicuro attraverso la piattaforma. Il pagamento viene trattenuto fino al completamento del lavoro.' },
      { q: 'Quando ricevo il pagamento?', a: 'Il pagamento viene rilasciato entro 24-48 ore dalla conferma del completamento del lavoro da parte del datore di lavoro.' },
      { q: 'Quali metodi di pagamento sono accettati?', a: 'Accettiamo carte di credito/debito e bonifici bancari. Stiamo lavorando per aggiungere altri metodi.' },
    ],
  },
  {
    title: 'Account e sicurezza',
    items: [
      { q: 'Come posso modificare il mio profilo?', a: 'Accedi alla Dashboard e clicca su "Modifica profilo" per aggiornare le tue informazioni, foto e competenze.' },
      { q: 'I miei dati sono al sicuro?', a: 'Sì, utilizziamo crittografia SSL e seguiamo le migliori pratiche di sicurezza per proteggere i tuoi dati personali.' },
      { q: 'Posso eliminare il mio account?', a: 'Sì, puoi richiedere la cancellazione del tuo account contattando il supporto. Tutti i tuoi dati verranno eliminati.' },
    ],
  },
]

function AccordionItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left hover:text-primary transition"
      >
        <span className="font-medium text-slate-800">{q}</span>
        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="pb-4 text-sm text-slate-600 leading-relaxed animate-fade-in">
          {a}
        </div>
      )}
    </div>
  )
}

export default function FAQPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-900">Domande frequenti</h1>
        <p className="mt-2 text-slate-600">Tutto quello che devi sapere su B2Work.</p>
      </div>

      <div className="space-y-8">
        {sections.map((section) => (
          <div key={section.title}>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">{section.title}</h2>
            <div className="bg-white border border-slate-100 rounded-xl px-5">
              {section.items.map((item) => (
                <AccordionItem key={item.q} {...item} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
