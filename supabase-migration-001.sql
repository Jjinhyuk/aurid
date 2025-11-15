-- Migration 001: profiles 테이블에 필수 컬럼 추가
-- 실행 방법: Supabase Dashboard > SQL Editor에서 실행

-- 1. profiles 테이블에 누락된 컬럼 추가
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS short_code TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS headline TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS links TEXT[];

-- 2. 인덱스 추가 (검색 성능 향상)
CREATE INDEX IF NOT EXISTS idx_profiles_short_code ON profiles(short_code);

-- 3. 기존 프로필에 short_code 자동 생성 (없는 경우만)
-- 6자 영숫자 랜덤 코드 생성
UPDATE profiles
SET short_code = UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6))
WHERE short_code IS NULL;

-- 4. 검증: 컬럼 확인
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles'
AND column_name IN ('short_code', 'headline', 'phone', 'links');
