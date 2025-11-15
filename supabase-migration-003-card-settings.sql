-- Migration 003: Add card_settings column to profiles
-- 명함 꾸미기 설정을 저장하기 위한 컬럼 추가

-- Add card_settings column (JSONB type for flexibility)
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS card_settings JSONB DEFAULT '{
  "template": "basic",
  "color": "#2563EB",
  "visibleFields": {
    "name": true,
    "headline": true,
    "email": true,
    "phone": true,
    "links": true,
    "qr": true
  }
}'::jsonb;

-- Create index for faster queries on card_settings
CREATE INDEX IF NOT EXISTS idx_profiles_card_settings ON profiles USING GIN (card_settings);

-- Comment for documentation
COMMENT ON COLUMN profiles.card_settings IS '명함 꾸미기 설정: 템플릿, 색상, 표시할 필드 등을 JSON으로 저장';
