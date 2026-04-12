-- 001_init.sql
-- Schema iniziale + RLS & Policies per B2Work

-- Extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Enums
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('COLF', 'HOST', 'WORKER');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'booking_status') THEN
    CREATE TYPE booking_status AS ENUM ('PENDING', 'CONFIRMED', 'PAID', 'CANCELLED');
  END IF;
END $$;

-- Profiles
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE,
  full_name text,
  role user_role,
  bio text,
  avatar_url text,
  city text,
  rating_avg numeric(2,1) DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_profiles_city ON profiles (city);

-- Listings (services offered by a Colf / worker)
CREATE TABLE IF NOT EXISTS listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  colf_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  hourly_rate numeric(8,2),
  services jsonb,
  availability_calendar jsonb,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_listings_colf_id ON listings (colf_id);

-- Gigs
CREATE TABLE IF NOT EXISTS gigs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  poster_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  category_id integer,
  category text,
  role text,
  location text,
  date timestamptz,
  duration_hours numeric(5,2),
  price numeric(10,2),
  status booking_status DEFAULT 'PENDING',
  created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_gigs_category ON gigs (category_id);
CREATE INDEX IF NOT EXISTS idx_gigs_poster ON gigs (poster_id);

-- Bookings
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  colf_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  gig_id uuid REFERENCES gigs(id) ON DELETE SET NULL,
  status booking_status DEFAULT 'PENDING',
  date timestamptz,
  total_price numeric(10,2),
  created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_bookings_colf ON bookings (colf_id);
CREATE INDEX IF NOT EXISTS idx_bookings_host ON bookings (host_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE gigs ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Profiles policies
DROP POLICY IF EXISTS "profiles_select_public" ON profiles;
CREATE POLICY "profiles_select_public" ON profiles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "profiles_insert_authenticated" ON profiles;
CREATE POLICY "profiles_insert_authenticated" ON profiles
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "profiles_update_self" ON profiles;
CREATE POLICY "profiles_update_self" ON profiles
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_delete_self" ON profiles;
CREATE POLICY "profiles_delete_self" ON profiles
  FOR DELETE USING (auth.uid() = id);

-- Gigs policies
DROP POLICY IF EXISTS "gigs_select_public" ON gigs;
CREATE POLICY "gigs_select_public" ON gigs
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "gigs_insert_authenticated" ON gigs;
CREATE POLICY "gigs_insert_authenticated" ON gigs
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "gigs_update_owner" ON gigs;
CREATE POLICY "gigs_update_owner" ON gigs
  FOR UPDATE USING (auth.uid() = poster_id) WITH CHECK (auth.uid() = poster_id);

DROP POLICY IF EXISTS "gigs_delete_owner" ON gigs;
CREATE POLICY "gigs_delete_owner" ON gigs
  FOR DELETE USING (auth.uid() = poster_id);

-- Bookings policies
DROP POLICY IF EXISTS "bookings_insert_authenticated" ON bookings;
CREATE POLICY "bookings_insert_authenticated" ON bookings
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "bookings_view_owner" ON bookings;
CREATE POLICY "bookings_view_owner" ON bookings
  FOR SELECT USING (auth.uid() = host_id OR auth.uid() = colf_id);

DROP POLICY IF EXISTS "bookings_update_owner" ON bookings;
CREATE POLICY "bookings_update_owner" ON bookings
  FOR UPDATE USING (auth.uid() = host_id OR auth.uid() = colf_id) WITH CHECK (auth.uid() = host_id OR auth.uid() = colf_id);

DROP POLICY IF EXISTS "bookings_delete_owner" ON bookings;
CREATE POLICY "bookings_delete_owner" ON bookings
  FOR DELETE USING (auth.uid() = host_id OR auth.uid() = colf_id);

-- Indexes and helpers
CREATE INDEX IF NOT EXISTS idx_gigs_date ON gigs (date);
