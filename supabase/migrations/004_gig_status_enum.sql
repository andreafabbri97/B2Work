-- 004_gig_status_enum.sql
-- Aggiunge enum gig_status e corregge la colonna status in gigs

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'gig_status') THEN
    CREATE TYPE gig_status AS ENUM ('OPEN', 'FILLED', 'CANCELLED');
  END IF;
END $$;

ALTER TABLE gigs ALTER COLUMN status DROP DEFAULT;
ALTER TABLE gigs ALTER COLUMN status TYPE gig_status USING
  CASE status::text
    WHEN 'PENDING' THEN 'OPEN'::gig_status
    WHEN 'CONFIRMED' THEN 'FILLED'::gig_status
    WHEN 'CANCELLED' THEN 'CANCELLED'::gig_status
    ELSE 'OPEN'::gig_status
  END;
ALTER TABLE gigs ALTER COLUMN status SET DEFAULT 'OPEN'::gig_status;
