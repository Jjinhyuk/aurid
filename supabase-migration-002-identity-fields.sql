-- Migration 002: 실명 및 신원 필드 추가
-- 실행일: 2025-01-XX
-- 목적: 실명 기반 신원 확인 시스템 구축

-- 1. profiles 테이블에 신원 필드 추가
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS real_name TEXT,
ADD COLUMN IF NOT EXISTS birth_date DATE,
ADD COLUMN IF NOT EXISTS gender TEXT CHECK (gender IN ('male', 'female')),
ADD COLUMN IF NOT EXISTS identity_hash TEXT UNIQUE, -- 주민번호 앞 7자리 해시 (중복 가입 방지)
ADD COLUMN IF NOT EXISTS phone TEXT;

-- 2. 인덱스 생성 (검색 성능 향상)
CREATE INDEX IF NOT EXISTS idx_profiles_identity_hash ON profiles(identity_hash);
CREATE INDEX IF NOT EXISTS idx_profiles_real_name ON profiles(real_name);
CREATE INDEX IF NOT EXISTS idx_profiles_birth_date ON profiles(birth_date);

-- 3. verifications 테이블 생성 (인증 정보)
CREATE TABLE IF NOT EXISTS verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('email', 'phone', 'oauth', 'document')),
  provider TEXT, -- 'google', 'github', 'youtube' 등
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'failed', 'revoked')),
  verified_at TIMESTAMPTZ,
  verified_name TEXT, -- 인증된 실명 (이메일/핸드폰 인증 시 비교용)
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. verifications 인덱스
CREATE INDEX IF NOT EXISTS idx_verifications_profile_id ON verifications(profile_id);
CREATE INDEX IF NOT EXISTS idx_verifications_kind ON verifications(kind);
CREATE INDEX IF NOT EXISTS idx_verifications_status ON verifications(status);

-- 5. badges 테이블 생성 (뱃지 시스템)
CREATE TABLE IF NOT EXISTS badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('existence', 'platform', 'document', 'recommend')),
  name TEXT NOT NULL, -- '실존 인증', 'GitHub 연동' 등
  icon TEXT, -- 아이콘 이름
  color TEXT, -- 색상 코드
  awarded_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- 6. badges 인덱스
CREATE INDEX IF NOT EXISTS idx_badges_profile_id ON badges(profile_id);
CREATE INDEX IF NOT EXISTS idx_badges_type ON badges(type);

-- 7. saved_cards 테이블 생성 (보관 명함)
CREATE TABLE IF NOT EXISTS saved_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  card_owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  saved_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,
  UNIQUE(owner_id, card_owner_id) -- 같은 명함 중복 저장 방지
);

-- 8. saved_cards 인덱스
CREATE INDEX IF NOT EXISTS idx_saved_cards_owner_id ON saved_cards(owner_id);
CREATE INDEX IF NOT EXISTS idx_saved_cards_card_owner_id ON saved_cards(card_owner_id);

-- 9. RLS 정책 - verifications
ALTER TABLE verifications ENABLE ROW LEVEL SECURITY;

-- 본인만 자신의 인증 정보 읽기
CREATE POLICY "Users can read own verifications"
  ON verifications FOR SELECT
  USING (
    profile_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  );

-- 시스템만 인증 정보 생성/수정 (서비스 롤 사용)
CREATE POLICY "Service role can manage verifications"
  ON verifications FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- 10. RLS 정책 - badges
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

-- 모두 뱃지 읽기 가능
CREATE POLICY "Anyone can read badges"
  ON badges FOR SELECT
  USING (true);

-- 시스템만 뱃지 생성/수정
CREATE POLICY "Service role can manage badges"
  ON badges FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- 11. RLS 정책 - saved_cards
ALTER TABLE saved_cards ENABLE ROW LEVEL SECURITY;

-- 본인 소유 명함만 조회
CREATE POLICY "Users can read own saved cards"
  ON saved_cards FOR SELECT
  USING (
    owner_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  );

-- 본인 소유 명함만 생성
CREATE POLICY "Users can insert own saved cards"
  ON saved_cards FOR INSERT
  WITH CHECK (
    owner_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  );

-- 본인 소유 명함만 삭제
CREATE POLICY "Users can delete own saved cards"
  ON saved_cards FOR DELETE
  USING (
    owner_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  );

-- 12. 함수: updated_at 자동 갱신
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 13. 트리거: verifications updated_at 자동 갱신
DROP TRIGGER IF EXISTS update_verifications_updated_at ON verifications;
CREATE TRIGGER update_verifications_updated_at
  BEFORE UPDATE ON verifications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 14. 주석 (문서화)
COMMENT ON COLUMN profiles.real_name IS '실명 (수정 불가, 운영자만 수정 가능)';
COMMENT ON COLUMN profiles.birth_date IS '생년월일 (주민번호 앞 6자리에서 파싱, 수정 불가)';
COMMENT ON COLUMN profiles.gender IS '성별 (주민번호 뒤 1자리에서 파싱, 수정 불가)';
COMMENT ON COLUMN profiles.identity_hash IS '주민번호 앞 7자리 SHA-256 해시 (중복 가입 방지용, UNIQUE)';
COMMENT ON TABLE verifications IS '인증 정보 (이메일, 핸드폰, OAuth, 문서)';
COMMENT ON TABLE badges IS '사용자 뱃지 (실존 인증, 플랫폼 연동 등)';
COMMENT ON TABLE saved_cards IS '보관 명함 (다른 사용자 명함 저장)';
