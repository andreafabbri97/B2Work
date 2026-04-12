-- Supabase / Postgres schema for B2Colf MVP

-- Roles
CREATE TYPE user_role AS ENUM ('COLF', 'HOST');

-- Booking status
CREATE TYPE booking_status AS ENUM ('PENDING', 'CONFIRMED', 'PAID', 'CANCELLED');

-- Profiles
CREATE TABLE profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role user_role NOT NULL,
  bio text,
  avatar_url text,
  city text,
  rating_avg numeric(2,1) DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_profiles_city ON profiles (city);

-- Listings (services offered by a Colf)
CREATE TABLE listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  colf_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  hourly_rate numeric(8,2),
  services jsonb, -- e.g. {"laundry":true, "deep_clean":true}
  availability_calendar jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_listings_colf_id ON listings (colf_id);

-- Bookings
CREATE TABLE bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  colf_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  status booking_status DEFAULT 'PENDING',
  date timestamptz NOT NULL,
  total_price numeric(10,2),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_bookings_colf ON bookings (colf_id);
CREATE INDEX idx_bookings_host ON bookings (host_id);

-- Example: materialized view for ratings aggregated (optional)
-- CREATE MATERIALIZED VIEW profile_rating AS
--   SELECT colf_id, AVG(rating) as avg_rating FROM reviews GROUP BY colf_id;

-- Gigs & Categories (new for B2Work)
CREATE TABLE categories (
  id serial PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TYPE gig_status AS ENUM ('OPEN', 'FILLED', 'CANCELLED');

CREATE TABLE gigs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  poster_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  category_id integer REFERENCES categories(id),
  role text, -- free text role like 'Cameriere', 'Colf'
  location text,
  date timestamptz,
  duration_hours numeric(5,2),
  price numeric(10,2),
  status gig_status DEFAULT 'OPEN',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_gigs_category ON gigs (category_id);
CREATE INDEX idx_gigs_poster ON gigs (poster_id);

-- Notes:
-- - Use Supabase policies to protect rows and implement RBAC.
-- - Consider using pg_trgm for search by name/city.