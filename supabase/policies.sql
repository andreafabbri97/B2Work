-- Supabase RLS & Policies for B2Work (suggested)

-- Enable RLS for sensitive tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE gigs ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Profiles: anyone can SELECT, but only owner can INSERT/UPDATE/DELETE
CREATE POLICY "profiles_select_public" ON profiles
  FOR SELECT
  USING (true);

CREATE POLICY "profiles_self_write" ON profiles
  FOR ALL
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Gigs: anyone can read; authenticated users can INSERT; owners can UPDATE/DELETE
CREATE POLICY "gigs_select_public" ON gigs
  FOR SELECT
  USING (true);

CREATE POLICY "gigs_insert_authenticated" ON gigs
  FOR INSERT
  WITH CHECK (auth.role() IS NOT NULL);

CREATE POLICY "gigs_owner" ON gigs
  FOR UPDATE, DELETE
  USING (auth.uid() = poster_id);

-- Bookings: authenticated users can INSERT; owner host/colf can view
CREATE POLICY "bookings_insert_authenticated" ON bookings
  FOR INSERT
  WITH CHECK (auth.role() IS NOT NULL);

CREATE POLICY "bookings_view_owner" ON bookings
  FOR SELECT
  USING (auth.uid() = host_id OR auth.uid() = colf_id);

-- Notes:
-- - Create a bucket 'avatars' in Storage and set public URLs if you want public avatars.
-- - Adjust policies as needed; use SUPABASE_SERVICE_ROLE_KEY for server migrations.
