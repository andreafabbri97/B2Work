-- 002_mvp_features.sql
-- Aggiunge: geolocalizzazione, recensioni, messaggistica, notifiche

-- ============================================================
-- 1. GEOLOCALIZZAZIONE su profiles e gigs
-- ============================================================
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS latitude numeric(10,7);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS longitude numeric(10,7);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS address text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS hourly_rate numeric(8,2);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS availability jsonb;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS certificates jsonb;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS verified boolean DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS response_time_hours integer;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone text;

ALTER TABLE gigs ADD COLUMN IF NOT EXISTS latitude numeric(10,7);
ALTER TABLE gigs ADD COLUMN IF NOT EXISTS longitude numeric(10,7);

CREATE INDEX IF NOT EXISTS idx_profiles_geo ON profiles (latitude, longitude) WHERE latitude IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_gigs_geo ON gigs (latitude, longitude) WHERE latitude IS NOT NULL;

-- ============================================================
-- 2. RECENSIONI
-- ============================================================
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE,
  reviewer_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  reviewed_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text NOT NULL CHECK (char_length(comment) >= 10),
  created_at timestamptz DEFAULT now(),
  UNIQUE(booking_id, reviewer_id)
);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewed ON reviews (reviewed_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewer ON reviews (reviewer_id);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reviews_select_public" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "reviews_insert_authenticated" ON reviews
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = reviewer_id);

CREATE POLICY "reviews_update_own" ON reviews
  FOR UPDATE USING (auth.uid() = reviewer_id);

-- Funzione per aggiornare il rating medio del profilo
CREATE OR REPLACE FUNCTION update_profile_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET rating_avg = (
    SELECT COALESCE(ROUND(AVG(rating)::numeric, 1), 0)
    FROM reviews
    WHERE reviewed_id = NEW.reviewed_id
  )
  WHERE id = NEW.reviewed_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_rating ON reviews;
CREATE TRIGGER trg_update_rating
  AFTER INSERT OR UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_profile_rating();

-- ============================================================
-- 3. MESSAGGISTICA
-- ============================================================
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_1 uuid REFERENCES profiles(id) ON DELETE CASCADE,
  participant_2 uuid REFERENCES profiles(id) ON DELETE CASCADE,
  gig_id uuid REFERENCES gigs(id) ON DELETE SET NULL,
  last_message_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_conversations_p1 ON conversations (participant_1);
CREATE INDEX IF NOT EXISTS idx_conversations_p2 ON conversations (participant_2);

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "conversations_select_participant" ON conversations
  FOR SELECT USING (auth.uid() = participant_1 OR auth.uid() = participant_2);

CREATE POLICY "conversations_insert_authenticated" ON conversations
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND (auth.uid() = participant_1 OR auth.uid() = participant_2));

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  content text NOT NULL,
  read_at timestamptz,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages (conversation_id, created_at);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- I messaggi sono visibili solo ai partecipanti della conversazione
CREATE POLICY "messages_select_participant" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = messages.conversation_id
      AND (auth.uid() = c.participant_1 OR auth.uid() = c.participant_2)
    )
  );

CREATE POLICY "messages_insert_participant" ON messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = conversation_id
      AND (auth.uid() = c.participant_1 OR auth.uid() = c.participant_2)
    )
  );

-- Trigger per aggiornare last_message_at nella conversazione
CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations SET last_message_at = now() WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_conversation_ts ON messages;
CREATE TRIGGER trg_update_conversation_ts
  AFTER INSERT ON messages
  FOR EACH ROW EXECUTE FUNCTION update_conversation_timestamp();

-- ============================================================
-- 4. NOTIFICHE
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  body text,
  data jsonb,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications (user_id, read, created_at DESC);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notifications_select_own" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "notifications_update_own" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "notifications_insert_system" ON notifications
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Abilita Realtime per messaggi e notifiche
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
