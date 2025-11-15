-- Aurid Pass Database Schema
-- 이 파일을 Supabase SQL Editor에서 실행하세요

-- 1. Profiles 테이블 (프로필 정보)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  handle TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  short_code TEXT UNIQUE,
  headline TEXT,
  bio TEXT,
  phone TEXT,
  location TEXT,
  avatar_url TEXT,
  links TEXT[],
  categories TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  visibility_json JSONB DEFAULT '{}',
  card_settings JSONB DEFAULT '{"template": "basic", "color": "#2563EB", "visibleFields": {"name": true, "headline": true, "email": true, "phone": true, "links": true, "qr": true}}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Claims 테이블 (증명 카드: work/edu/award/portfolio)
CREATE TABLE IF NOT EXISTS claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('work', 'edu', 'award', 'portfolio')),
  title TEXT NOT NULL,
  description TEXT,
  link TEXT,
  file_hash TEXT,
  proof_type TEXT CHECK (proof_type IN ('oauth', 'hash', 'endorse')),
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Updates 테이블 (피드용 업데이트)
CREATE TABLE IF NOT EXISTS updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('join', 'edit', 'new_claim', 'role_change')),
  payload_json JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Cards 테이블 (패스 카드: QR/링크/시크릿 코드)
CREATE TABLE IF NOT EXISTS cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  label TEXT,
  short_code TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'revoked')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Card Scans 테이블 (스캔 기록)
CREATE TABLE IF NOT EXISTS card_scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id UUID REFERENCES cards(id) ON DELETE CASCADE,
  user_agent TEXT,
  referer TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Contact Requests 테이블 (연락 요청)
CREATE TABLE IF NOT EXISTS contact_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  to_profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  from_profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'blocked')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Verifications 테이블 (검증 정보)
CREATE TABLE IF NOT EXISTS verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('email', 'phone', 'oauth', 'org')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'failed')),
  issued_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_profiles_handle ON profiles(handle);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_short_code ON profiles(short_code);
CREATE INDEX IF NOT EXISTS idx_profiles_card_settings ON profiles USING GIN (card_settings);
CREATE INDEX IF NOT EXISTS idx_claims_profile_id ON claims(profile_id);
CREATE INDEX IF NOT EXISTS idx_updates_profile_id ON updates(profile_id);
CREATE INDEX IF NOT EXISTS idx_updates_created_at ON updates(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cards_profile_id ON cards(profile_id);
CREATE INDEX IF NOT EXISTS idx_cards_short_code ON cards(short_code);
CREATE INDEX IF NOT EXISTS idx_contact_requests_to_profile ON contact_requests(to_profile_id);
CREATE INDEX IF NOT EXISTS idx_contact_requests_from_profile ON contact_requests(from_profile_id);

-- Row Level Security (RLS) 설정
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE verifications ENABLE ROW LEVEL SECURITY;

-- Profiles RLS 정책
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Claims RLS 정책
CREATE POLICY "Public claims are viewable by everyone"
  ON claims FOR SELECT
  USING (is_public = true);

CREATE POLICY "Users can view their own claims"
  ON claims FOR SELECT
  USING (profile_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can insert their own claims"
  ON claims FOR INSERT
  WITH CHECK (profile_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can update their own claims"
  ON claims FOR UPDATE
  USING (profile_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  ));

-- Updates RLS 정책
CREATE POLICY "Updates are viewable by everyone"
  ON updates FOR SELECT
  USING (true);

CREATE POLICY "Updates can be inserted by system"
  ON updates FOR INSERT
  WITH CHECK (true);

-- Cards RLS 정책
CREATE POLICY "Cards are viewable by owner"
  ON cards FOR SELECT
  USING (profile_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can insert their own cards"
  ON cards FOR INSERT
  WITH CHECK (profile_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  ));

-- Card Scans RLS 정책
CREATE POLICY "Card scans are viewable by card owner"
  ON card_scans FOR SELECT
  USING (card_id IN (
    SELECT c.id FROM cards c
    JOIN profiles p ON p.id = c.profile_id
    WHERE p.user_id = auth.uid()
  ));

CREATE POLICY "Anyone can insert card scans"
  ON card_scans FOR INSERT
  WITH CHECK (true);

-- Contact Requests RLS 정책
CREATE POLICY "Users can view requests sent to them"
  ON contact_requests FOR SELECT
  USING (to_profile_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  ) OR from_profile_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can insert contact requests"
  ON contact_requests FOR INSERT
  WITH CHECK (from_profile_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can update requests sent to them"
  ON contact_requests FOR UPDATE
  USING (to_profile_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  ));

-- Verifications RLS 정책
CREATE POLICY "Users can view their own verifications"
  ON verifications FOR SELECT
  USING (profile_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "System can insert verifications"
  ON verifications FOR INSERT
  WITH CHECK (true);

-- 함수: 프로필 생성 시 자동으로 업데이트 생성
CREATE OR REPLACE FUNCTION create_profile_update()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO updates (profile_id, kind, payload_json)
  VALUES (NEW.id, 'join', jsonb_build_object('display_name', NEW.display_name));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_profile_created
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_profile_update();

-- 함수: Claim 생성 시 자동으로 업데이트 생성
CREATE OR REPLACE FUNCTION create_claim_update()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO updates (profile_id, kind, payload_json)
  VALUES (NEW.profile_id, 'new_claim', jsonb_build_object('claim_id', NEW.id, 'title', NEW.title, 'type', NEW.type));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_claim_created
  AFTER INSERT ON claims
  FOR EACH ROW
  EXECUTE FUNCTION create_claim_update();
