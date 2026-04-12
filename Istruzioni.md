These instructions will be in english, but you will always talk with the developer in ITALIAN
# ROLE
Act as a Full-Stack Software Architect and Lead Developer. Your goal is to build the MVP of "B2Colf", a hybrid platform (Social Network + Service Marketplace) connecting professional cleaners with property managers.

# TECH STACK (Standard LLM Compliance)
- Framework: Next.js 15 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS + Shadcn/UI
- Database/Auth: Supabase (PostgreSQL)
- Icons: Lucide-react
- State Management: React Context or Zustand

# PROJECT STRUCTURE & SCOPE
Create a responsive web application that functions as both a site and a PWA (Progressive Web App).

## 1. DATA SCHEMA (Supabase/Prisma)
- Table 'profiles': id, email, full_name, role (COLF | HOST), bio, avatar_url, city, rating_avg.
- Table 'listings': id, colf_id, hourly_rate, services (JSON: laundry, deep_clean, etc.), availability_calendar.
- Table 'bookings': id, host_id, colf_id, status (PENDING, CONFIRMED, PAID), date, total_price.

## 2. CORE FEATURES TO BUILD
- LANDING PAGE: Modern, high-conversion hero section. Dual-CTA for Cleaners and Hosts.
- DISCOVERY ENGINE: A searchable feed of Colf profiles. Cards must show "Social Proof" (rating, verified badges, previous clients).
- BOOKING FLOW: Simple multi-step form to select date, service type, and confirm request.
- USER DASHBOARD: 
  - Host view: Manage active cleanings and upcoming check-ins.
  - Colf view: Personal profile (LinkedIn style), job requests, and earnings summary.

## 3. DESIGN GUIDELINES (Vibe)
- Aesthetic: Clean, Trustworthy, Professional. Use a palette of Soft Blue (#3b82f6) and White.
- Components: Use [Shadcn/UI](https://ui.shadcn.com) for tables, dialogs, and cards.

# INSTRUCTION
"Starting from the root, generate the folder structure, 'layout.tsx', 'page.tsx', and the core components in '/components/b2colf'. Provide the SQL schema for Supabase and the initial frontend code for the Discovery page. Ensure the code is production-ready and modular."
