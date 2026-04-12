# B2Work — MVP

Semplice scaffold per l'MVP B2Work (Next.js 15 + TypeScript + Tailwind). B2Work è una piattaforma per lavori occasionali e freelance (colf, camerieri, baristi, runner, ecc.).

Quick start:

1. Installa dipendenze:

   npm install

2. Avvia in sviluppo:

   npm run dev

3. Visita http://localhost:3000

Note:
- Le API `GET /api/profiles` e `GET /api/gigs` sono mock temporanei; sostituire con Supabase (server-side) in produzione.
- Vedi `supabase/schema.sql` per lo schema DB aggiornato con `gigs`, `bookings` e `categories` per supportare offerte di lavoro occasionali.

Configura Supabase: crea un progetto su supabase.com e aggiungi le seguenti variabili in `.env.local`:

NEXT_PUBLIC_SUPABASE_URL=<your_supabase_url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_anon_key>
SUPABASE_SERVICE_ROLE_KEY=<your_service_role_key> # optional, use for server-side operations

Applicare le migrazioni e le policies (RLS):
1. Installa Supabase CLI: https://supabase.com/docs/guides/cli
2. Login: `supabase login` (usa il tuo token)
3. Esegui lo script di migrazione (dalla radice del progetto): `powershell -ExecutionPolicy Bypass -File scripts\apply_supabase_migrations.ps1`
   - Questo eseguirà `supabase sql --file supabase/migrations/001_init.sql` che crea tutte le tabelle e le policy RLS.
4. Crea il bucket avatars (se vuoi avatar pubblici): `supabase storage create avatars --public`

Nota: se preferisci pushare migrazioni come file di migrazione (workflow CLI), puoi adattare lo script per usare `supabase migration new` e `supabase db push`.

OAuth Providers (Google, Facebook):
- Nel dashboard Supabase -> Authentication -> Providers abilita Google e Facebook e incolla i rispettivi Client ID / secrets.
- Aggiungi redirect URL: `http://localhost:3000` (o la porta che stai usando) nel pannello OAuth del provider e nel pannello Supabase.
- Facebook: richiede App Review per alcune autorizzazioni (email). Se ti serve per sviluppo, puoi usare un'app in sviluppo invitando l'account tester.

Dopo aver configurato i provider, gli utenti potranno autenticarsi senza creare un account manuale usando i pulsanti "Google" e "Facebook" nella pagina di login.

- Configurato TailwindCSS e installate le dipendenze per Shadcn/UI e Lucide icons; i componenti principali usano ora un Button centralizzato (`components/b2colf/ui/Button.tsx`).
