import './globals.css'
import React from 'react'
import { Inter } from 'next/font/google'
import { Navbar } from '@/components/b2colf/Navbar'
import Footer from '@/components/b2colf/Footer'
import { AuthProvider } from '@/components/b2colf/context/AuthContext'
import { ToastProvider } from '@/components/b2colf/context/ToastContext'
import ToastContainer from '@/components/b2colf/ui/Toast'
import ScrollToTop from '@/components/b2colf/ScrollToTop'
import ServiceWorkerRegistration from '@/components/b2colf/ServiceWorkerRegistration'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata = {
  title: 'B2Work — Lavoro flessibile e occasionale',
  description: 'B2Work — Marketplace per lavori occasionali e freelance. Trova professionisti verificati o pubblica annunci.',
  keywords: 'lavoro flessibile, freelance, lavoro occasionale, marketplace lavoro, professionisti, assunzione rapida, Italia',
  authors: [{ name: 'B2Work' }],
  manifest: '/B2Work/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'B2Work',
  },
  openGraph: {
    title: 'B2Work — Lavoro flessibile e occasionale',
    description: 'Trova professionisti verificati o pubblica annunci di lavoro. Marketplace #1 in Italia per lavori occasionali.',
    type: 'website',
    locale: 'it_IT',
    siteName: 'B2Work',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'B2Work — Lavoro flessibile e occasionale',
    description: 'Trova professionisti verificati o pubblica annunci di lavoro.',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#3b82f6',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={inter.variable}>
      <head>
        <link rel="apple-touch-icon" href="/B2Work/icons/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(l) {
                if (l.search[1] === '/') {
                  var decoded = l.search.slice(1).split('&').map(function(s) {
                    return s.replace(/~and~/g, '&')
                  }).join('?');
                  window.history.replaceState(null, null, l.pathname.slice(0, -1) + decoded + l.hash);
                }
              }(window.location))
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-white text-slate-900 antialiased flex flex-col font-sans">
        <AuthProvider>
          <ToastProvider>
            <Navbar />
            <main className="container mx-auto px-4 py-8 flex-1">{children}</main>
            <Footer />
            <ToastContainer />
            <ScrollToTop />
            <ServiceWorkerRegistration />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
