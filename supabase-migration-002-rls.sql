-- Migration 002: RLS 정책 개선 - 기본 비공개 원칙
-- 실행 방법: Supabase Dashboard > SQL Editor에서 실행

-- 1. 기존 정책 삭제
DROP POLICY IF EXISTS "프로필 조회 (전체 공개)" ON profiles;
DROP POLICY IF EXISTS "업데이트 조회 (전체 공개)" ON updates;
DROP POLICY IF EXISTS "프로필 소유자만 수정 가능" ON profiles;
DROP POLICY IF EXISTS "프로필 소유자만 업데이트 생성 가능" ON updates;

-- 2. Profiles 테이블 RLS 정책
-- 2-1. 본인 프로필은 항상 조회 가능
CREATE POLICY "본인 프로필 조회" ON profiles
FOR SELECT USING (auth.uid() = user_id);

-- 2-2. 공개 설정된 프로필만 다른 사람이 조회 가능
CREATE POLICY "공개 프로필 조회" ON profiles
FOR SELECT USING (
  visibility_json->>'default' = 'public'
  OR auth.uid() = user_id
);

-- 2-3. 본인 프로필만 수정 가능
CREATE POLICY "본인 프로필 수정" ON profiles
FOR UPDATE USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 2-4. 본인 프로필만 생성 가능
CREATE POLICY "본인 프로필 생성" ON profiles
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 3. Updates 테이블 RLS 정책
-- 3-1. 공개 프로필의 업데이트만 조회 가능
CREATE POLICY "공개 프로필 업데이트 조회" ON updates
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = updates.profile_id
    AND (
      profiles.visibility_json->>'default' = 'public'
      OR profiles.user_id = auth.uid()
    )
  )
);

-- 3-2. 본인 프로필에만 업데이트 생성 가능
CREATE POLICY "본인 업데이트 생성" ON updates
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = updates.profile_id
    AND profiles.user_id = auth.uid()
  )
);

-- 4. Cards 테이블 RLS 정책
-- 4-1. 본인 카드 조회
CREATE POLICY "본인 카드 조회" ON cards
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = cards.profile_id
    AND profiles.user_id = auth.uid()
  )
);

-- 4-2. 활성 카드는 누구나 조회 (스캔 목적)
CREATE POLICY "활성 카드 조회" ON cards
FOR SELECT USING (status = 'active');

-- 4-3. 본인 카드만 생성/수정
CREATE POLICY "본인 카드 생성" ON cards
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = cards.profile_id
    AND profiles.user_id = auth.uid()
  )
);

CREATE POLICY "본인 카드 수정" ON cards
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = cards.profile_id
    AND profiles.user_id = auth.uid()
  )
);

-- 5. Contact Requests 테이블 RLS 정책
-- 5-1. 본인이 받았거나 보낸 요청만 조회
CREATE POLICY "본인 연락 요청 조회" ON contact_requests
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE (
      profiles.id = contact_requests.to_profile_id
      OR profiles.id = contact_requests.from_profile_id
    )
    AND profiles.user_id = auth.uid()
  )
);

-- 5-2. 공개 프로필에만 요청 가능
CREATE POLICY "공개 프로필 연락 요청 생성" ON contact_requests
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = contact_requests.to_profile_id
    AND profiles.visibility_json->>'default' = 'public'
  )
  AND EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = contact_requests.from_profile_id
    AND profiles.user_id = auth.uid()
  )
);

-- 5-3. 본인이 받은 요청만 수정 (상태 변경)
CREATE POLICY "받은 요청 상태 변경" ON contact_requests
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = contact_requests.to_profile_id
    AND profiles.user_id = auth.uid()
  )
);

-- 6. Verifications 테이블 RLS 정책
-- 6-1. 본인 검증 정보만 조회
CREATE POLICY "본인 검증 정보 조회" ON verifications
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = verifications.profile_id
    AND profiles.user_id = auth.uid()
  )
);

-- 7. Card Scans 테이블 RLS 정책
-- 7-1. 카드 소유자만 스캔 기록 조회
CREATE POLICY "카드 소유자 스캔 기록 조회" ON card_scans
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM cards
    INNER JOIN profiles ON profiles.id = cards.profile_id
    WHERE cards.id = card_scans.card_id
    AND profiles.user_id = auth.uid()
  )
);

-- 7-2. 누구나 스캔 기록 생성 가능 (익명 스캔 허용)
CREATE POLICY "스캔 기록 생성" ON card_scans
FOR INSERT WITH CHECK (true);

-- 8. 검증: 정책 목록 확인
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
