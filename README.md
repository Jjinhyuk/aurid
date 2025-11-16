# Aurid Pass

> **"스캔 한 번, 신뢰까지."**
> 온라인과 오프라인의 당신을 하나의 패스로 연결합니다.

---

## 📌 프로젝트 비전

**Aurid Pass**는 명함을 넘어선, **검증 가능한 디지털 아이덴티티 플랫폼**입니다.

현대 사회에서 우리는 수많은 플랫폼에 흩어진 정체성을 가지고 있습니다. YouTube 크리에이터, GitHub 개발자, 로컬 비즈니스 운영자, 프리랜서 디자이너... 하지만 이 모든 것을 **하나의 신뢰할 수 있는 프로필**로 통합하고, **오프라인에서도 즉시 공유**할 수 있는 방법은 없었습니다.

**Aurid Pass**는 이 문제를 해결합니다.

### 🎯 핵심 가치 제안

1. **검증된 신원**: 실명, 생년월일, 성별 기반 진정성 있는 프로필
2. **즉각적인 공유**: QR·링크·시크릿 코드로 언제 어디서나 디지털 명함 교환
3. **증명 가능한 신뢰**: 이메일/핸드폰 인증, 플랫폼 연동으로 신원 검증
4. **프라이버시 우선**: 공개 범위를 세밀하게 제어, 사용자가 선택
5. **발견 가능성**: 카테고리·태그 기반 검색으로 새로운 연결 창출

---

## 🚀 왜 Aurid Pass인가?

### 기존 명함의 한계
- 일방향 정보 전달만 가능
- 업데이트 불가능
- 신뢰성 검증 불가
- 분실 시 연결 단절

### 기존 디지털 명함 서비스의 한계
- 단순 링크 나열, 맥락 없음
- 검증 기능 없음
- 실명 기반이 아니어서 신뢰도 낮음
- 명함 교환 기능 부재

### Aurid Pass의 차별점
- **실명 기반 검증**: 주민번호 앞 7자리로 생년월일·성별 확인
- **뱃지 시스템**: 이메일/핸드폰 인증, 플랫폼 연동으로 신뢰도 표시
- **명함 교환 플로우**: QR 스캔 → 프로필 보기 → 명함 저장
- **유연한 공개 설정**: 사용자가 원하는 정보만 공개
- **디지털 패스**: Apple Wallet 스타일의 신원 인증 도구

---

## 👥 타겟 사용자

### Primary
- **크리에이터**: YouTube, Instagram, TikTok 채널 운영자
- **개발자**: GitHub, Stack Overflow, 개인 블로그 운영자
- **디자이너**: Dribbble, Behance 포트폴리오 보유자
- **로컬 비즈니스**: 농부, 체험업, 소상공인

### Secondary
- **학생**: 프로젝트·대회 경력 관리
- **프리랜서**: 다양한 클라이언트 대응
- **구직자**: 통합 이력서 관리

---

## 🏗 기술 아키텍처

### Frontend
- **React Native (Expo)**: iOS/Android/Web 크로스 플랫폼
- **React Navigation**: 5탭 네비게이션 (Bottom Tabs + Stack)
- **Expo Vector Icons**: 일관된 UI 아이콘
- **react-native-qrcode-svg**: QR 코드 생성

### Backend
- **Supabase**
  - **Auth**: 이메일/전화번호 인증
  - **Database**: PostgreSQL with RLS (Row Level Security)
  - **Storage**: 프로필 이미지, 증명 사진, 포트폴리오
  - **Realtime**: 피드 업데이트 구독 (예정)

### 보안 설계 원칙
1. **실명 기반 신뢰**: 회원가입 시 실명, 생년월일, 성별 입력
2. **정보 수정 제한**: 실명, 생년월일, 성별은 운영자만 수정 가능
3. **인증 일치 확인**: 이메일/핸드폰 인증 시 실명 일치 여부 확인
4. **Row Level Security**: 데이터베이스 레벨에서 접근 제어
5. **뱃지 시스템**: 인증 완료 시 뱃지 부여로 신뢰도 표시

---

## 📂 프로젝트 구조

```
aurid/
├── src/
│   ├── config/
│   │   ├── supabase.js          # Supabase 클라이언트 설정
│   │   └── colors.js            # 컬러 시스템
│   ├── contexts/
│   │   └── AuthContext.js       # 인증 컨텍스트
│   ├── navigation/
│   │   ├── MainNavigator.js     # Stack Navigator (모달 화면)
│   │   └── TabNavigator.js      # 하단 5탭 네비게이션
│   ├── screens/
│   │   ├── HomeScreen.js        # 피드 (메인)
│   │   ├── DiscoverScreen.js    # 카테고리 탐색
│   │   ├── CardScreen.js        # 명함 (내 명함/보관 명함)
│   │   ├── MyCardScreen.js      # 내 명함 상세
│   │   ├── SavedCardsScreen.js  # 보관 명함 리스트
│   │   ├── CardDetailScreen.js  # 명함 상세보기
│   │   ├── CardEditorScreen.js  # 명함 꾸미기
│   │   ├── PassScreen.js        # 디지털 패스 (QR/시크릿 코드)
│   │   ├── VerificationScreen.js # 더보기 (프로필/설정)
│   │   ├── EditProfileScreen.js # 프로필 편집
│   │   ├── VerifyEmailScreen.js # 이메일 인증
│   │   ├── VerifyPhoneScreen.js # 핸드폰 인증
│   │   ├── InboxScreen.js       # 받은편지함
│   │   ├── LoginScreen.js       # 로그인
│   │   ├── SignupScreen.js      # 회원가입
│   │   └── WelcomeScreen.js     # 웰컴 화면
│   └── components/
│       └── CustomHeader.js      # 커스텀 헤더
├── App.js                        # 앱 진입점
├── .env                          # 환경 변수 (git 제외)
├── supabase-schema.sql          # 초기 DB 스키마
├── supabase-migration-001-profile-settings.sql   # 프로필 설정 추가
├── supabase-migration-002-identity-fields.sql    # 실명 및 인증 필드 추가
└── supabase-migration-003-card-settings.sql      # 명함 설정 추가
```

---

## 🎨 5탭 네비게이션 구조

### 1. Home (피드)
- 검증된 프로필 업데이트 스트림
- 신규 가입, 프로필 변경, 새로운 활동 등
- "검증된 업데이트 우선" 필터

### 2. Discover (발견)
- 카테고리: Creator, Developer, Designer, Local Biz, Student 등
- 필터: 지역, 스킬/태그, 검증레벨
- 카드형 결과 리스트

### 3. Card (명함) ⭐️ 핵심
- **내 명함**:
  - 명함 미리보기 (QR 코드 포함)
  - QR 터치 → 공유 모달 (대형 QR, 공유하기, 링크 복사)
  - 스캔 횟수 통계
  - 명함 꾸미기 버튼
- **보관 명함**:
  - 카테고리별 필터 (전체, 크리에이터, 개발자 등)
  - 받은 명함 리스트
  - 명함 클릭 → 상세보기 (연락처, 소개, 삭제)

### 4. Pass (패스) ⭐️ 디지털 신원증
- **디지털 패스 카드** (Apple Wallet 스타일):
  - AURID PASS 로고 헤더
  - 대형 QR 코드 (200px)
  - 밝기 조절 버튼 (스캔 환경 대응)
  - 사용자 이름 + 핸들
  - PASS ID (고유 식별자)
- **빠른 인증**:
  - 시크릿 코드 (6~8자, 복사 가능)
- **사용 통계**:
  - QR 스캔 횟수
  - 인증 완료 횟수
  - 마지막 사용 시간
- **패스 관리**:
  - 보안 설정
  - 사용 이력
  - 패스 정보

### 5. 더보기
**현재 상태**: VerificationScreen (완성)

**구조**:
- **상단**: 프로필 요약
  - 프로필 아바타
  - 이름 (display_name)
  - 뱃지 (인증 상태 표시)
  - 카테고리
  - 핸들 (@username)
- **메인 메뉴** (1줄 4개 배치):
  - 프로필 → EditProfile
  - 명함함 → SavedCards
  - 증명 사진 (예정)
  - 설정 (예정)
- **구분선**
- **하단 메뉴 리스트**:
  - 공지사항 (예정)
  - 이벤트 (예정)
  - 고객센터 (예정)
  - 앱 정보 (예정)
- **로그아웃 버튼**

---

## 🔐 회원가입 및 인증 시스템

### 필수 입력 정보 (회원가입)
1. **이메일** (로그인 ID)
2. **비밀번호** (8자 이상)
3. **실명** (수정 불가)
4. **주민번호** 앞 6자리 + 뒤 1자리 (생년월일 + 성별 확인용, 저장 안 됨)
   - SHA-256 해싱하여 identity_hash로 저장
   - 중복 가입 방지 (같은 주민번호로 여러 계정 생성 불가)
5. **핸드폰 번호** (수정 가능)

### 자동 생성 정보
- **생년월일** (주민번호에서 자동 파싱, 수정 불가)
- **성별** (주민번호에서 자동 파싱, 수정 불가)
- **핸들** (이메일 앞부분에서 자동 생성, 수정 불가)
- **시크릿 코드** (6자리 랜덤 코드)

### 정보 수정 권한
- **영구 잠금**: 실명, 생년월일, 성별, identity_hash
  - 사용자는 수정 불가
  - 운영자만 수정 가능 (고객센터 요청 시)
- **사용자 수정 가능**: display_name, 핸드폰번호, 이메일, 카테고리, 한줄소개, 프로필 사진, 링크, 공개 설정 등

### 인증 및 뱃지 시스템
1. **이메일 인증**:
   - 6자리 인증 코드 발송 (개발 모드: Alert 표시)
   - 유효 시간: 10분
   - 실명 일치 확인 (불일치 시 인증 실패)
   - 성공 시 "이메일 인증" 뱃지 부여

2. **핸드폰 인증**:
   - 6자리 인증 코드 발송 (개발 모드: Alert 표시)
   - 유효 시간: 5분
   - 실명 일치 확인 (불일치 시 인증 실패)
   - 성공 시 "핸드폰 인증" 뱃지 부여

3. **실존 인증** (자동):
   - 이메일 + 핸드폰 인증 모두 완료 시 자동 부여
   - "실존 인증" 뱃지 (shield-checkmark)
   - 가장 높은 신뢰도 표시

4. **뱃지 타입** (복수 뱃지 가능):
   - **existence**: 이메일 인증, 핸드폰 인증, 실존 인증
   - **platform**: YouTube, GitHub 등 OAuth 연동 (예정)
   - **document**: 증명서류 해시 등록 (예정)
   - **recommend**: 다른 사용자의 추천 (예정)

---

## 🤝 명함 교환 플로우

### QR 스캔 시나리오

#### 1. 앱 미설치 사용자가 QR 스캔
```
QR 스캔 → 웹 랜딩 페이지 → 앱 설치 유도
```

#### 2. 앱 설치 사용자가 QR 스캔
```
QR 스캔
  ↓
프로필 페이지 표시
  - 기본 정보 (이름, 직업, 한줄소개)
  - 포트폴리오 (설정에 따라 공개/비공개)
  - 증명 사진 (설정에 따라 공개/비공개)
  ↓
화면 하단 고정 버튼: "명함 저장하기"
  ↓
버튼 클릭
  ↓
명함 미리보기 모달
  - 명함 정보 (이름, 직업, 연락처, QR 코드)
  - 저장하기 버튼
  ↓
저장하기 클릭
  ↓
보관 명함에 저장 완료
```

### 명함 저장 후
- 보관 명함 탭에서 확인 가능
- 카테고리별 필터링
- 명함 클릭 → 상세보기 (연락처 클릭 시 전화/이메일 앱 실행)
- 삭제 가능

---

## 🗄 데이터베이스 스키마

### 핵심 테이블

#### `profiles` - 사용자 프로필
```sql
- id: UUID (Primary Key)
- user_id: UUID (FK to auth.users)
- handle: TEXT (고유 핸들, @username, 수정 불가)
- display_name: TEXT (표시 이름)
- real_name: TEXT (실명, 수정 불가)
- birth_date: DATE (생년월일, 수정 불가)
- gender: TEXT (성별, 수정 불가)
- identity_hash: TEXT UNIQUE (주민번호 SHA-256 해시, 중복 가입 방지)
- phone: TEXT (핸드폰 번호)
- email: TEXT (이메일)
- categories: TEXT[] (직업 카테고리 배열)
- headline: TEXT (한줄소개)
- bio: TEXT (자기소개)
- location: TEXT (위치)
- links: TEXT[] (링크 배열)
- tags: TEXT[] (태그 배열)
- visibility_json: JSONB (필드별 공개 범위)
- short_code: TEXT (시크릿 코드, 6~8자)
- profile_settings: JSONB (프로필 설정)
- card_settings: JSONB (명함 설정)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### `verifications` - 인증 정보
```sql
- id: UUID (Primary Key)
- profile_id: UUID (FK to profiles)
- kind: TEXT (email/phone/oauth/document)
- status: TEXT (pending/verified/failed/revoked)
- verified_at: TIMESTAMP
- verified_name: TEXT (인증 시 실명, 매칭용)
- metadata: JSONB (인증 코드, 만료 시간 등)
- created_at: TIMESTAMP
```

#### `badges` - 뱃지
```sql
- id: UUID (Primary Key)
- profile_id: UUID (FK to profiles)
- type: TEXT (existence/platform/document/recommend)
- name: TEXT (뱃지 이름, 예: "이메일 인증", "실존 인증")
- icon: TEXT (Ionicons 아이콘 이름)
- color: TEXT (HEX 색상)
- metadata: JSONB (뱃지 관련 정보)
- awarded_at: TIMESTAMP
```

#### `saved_cards` - 보관 명함
```sql
- id: UUID (Primary Key)
- owner_id: UUID (명함을 저장한 사용자)
- card_owner_id: UUID (명함 주인)
- saved_at: TIMESTAMP
- notes: TEXT (메모)
```

#### `updates` - 피드 업데이트
```sql
- id: UUID (Primary Key)
- profile_id: UUID (FK to profiles)
- kind: TEXT (join/edit/new_claim/badge)
- payload_json: JSONB (이벤트 상세 정보)
- created_at: TIMESTAMP
```

#### `contact_requests` - 연락 요청
```sql
- id: UUID (Primary Key)
- to_profile_id: UUID (수신자)
- from_profile_id: UUID (발신자)
- message: TEXT (요청 메시지)
- status: TEXT (pending/accepted/rejected/blocked)
- created_at: TIMESTAMP
```

### RLS (Row Level Security)
- **profiles**: 모두 읽기 가능 (visibility에 따라 제한), 본인만 수정
- **verifications**: 본인만 읽기/수정
- **badges**: 모두 읽기 가능, 시스템만 생성/수정
- **saved_cards**: 본인 것만 읽기/수정/삭제
- **contact_requests**: 송/수신자만 읽기

---

## 🛠 시작하기

### 1. 저장소 클론 및 설치

```bash
git clone https://github.com/Jjinhyuk/aurid.git
cd aurid
npm install
```

### 2. 환경 변수 설정

`.env` 파일 생성:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Supabase 데이터베이스 설정

1. [Supabase 대시보드](https://supabase.com/dashboard) 접속
2. 프로젝트 생성 또는 선택
3. **SQL Editor** → `supabase-schema.sql` 실행
4. **SQL Editor** → `supabase-migration-001.sql` 실행
5. **SQL Editor** → `supabase-migration-003.sql` 실행
6. Auth 설정: Email/Phone 활성화

### 4. 앱 실행

#### 개발 서버
```bash
npm start
```

#### 웹
```bash
npm run web
```

#### iOS/Android
```bash
npm run ios      # macOS only
npm run android  # Android Studio 필요
```

---

## 🚧 개발 로드맵

### ✅ MVP v0.1 (완료)
- [x] Git/Supabase 세팅
- [x] 5탭 네비게이션 구조
- [x] DB 스키마 & RLS 설정
- [x] 기본 화면 UI 골격

### ✅ v0.2 (완료)
- [x] Pass 탭: QR 코드 생성
- [x] Profile 탭: 편집 기능
- [x] Supabase Auth 연동
- [x] 프로필 생성 자동화
- [x] AuthContext 구현

### ✅ v0.3 (완료)
- [x] Card 탭 구조 (내 명함/보관 명함)
- [x] MyCardScreen: 명함 미리보기, QR 공유 모달, 스캔 통계
- [x] SavedCardsScreen: 카테고리 필터, 명함 리스트
- [x] CardDetailScreen: 명함 상세보기, 연락처 액션
- [x] CardEditorScreen: 명함 꾸미기 (템플릿, 색상, 공개 필드)
- [x] PassScreen: 디지털 패스 카드 (밝기 조절, 시크릿 코드, 통계)
- [x] MainNavigator: Stack 네비게이션 (모달 화면)

### ✅ v0.4 (완료 - 현재)
- [x] **더보기 탭 UI 개편**:
  - [x] 프로필 요약 (이름, 핸들, 뱃지, 카테고리)
  - [x] 메인 메뉴 1x4 배치 (프로필, 명함함, 증명 사진, 설정)
  - [x] 하단 리스트 메뉴 (공지사항, 이벤트, 고객센터, 앱 정보)
  - [x] 로그아웃 버튼
- [x] **회원가입 플로우 개선**:
  - [x] 실명, 주민번호 앞 7자리, 핸드폰 입력 필드 추가
  - [x] SHA-256 해싱으로 identity_hash 생성
  - [x] 중복 가입 방지 (identity_hash UNIQUE)
  - [x] 생년월일/성별 자동 파싱
  - [x] 수정 불가 필드 처리
- [x] **인증 시스템**:
  - [x] VerifyEmailScreen (이메일 인증, 개발 모드)
  - [x] VerifyPhoneScreen (핸드폰 인증, 개발 모드)
  - [x] 인증 코드 만료 체크 (이메일 10분, 핸드폰 5분)
  - [x] 실명 일치 확인
  - [x] EditProfileScreen에 인증 섹션 추가
- [x] **뱃지 시스템**:
  - [x] badges 테이블 생성
  - [x] 이메일 인증 뱃지
  - [x] 핸드폰 인증 뱃지
  - [x] 실존 인증 뱃지 (이메일 + 핸드폰)
  - [x] 프로필에 뱃지 표시
- [x] **데이터베이스 마이그레이션**:
  - [x] supabase-migration-002-identity-fields.sql 생성 및 실행
  - [x] profiles 테이블에 신원 필드 추가
  - [x] verifications 테이블 생성
  - [x] badges 테이블 생성

### 🔜 v0.5 (예정)
- [ ] QR 스캔 기능 구현
- [ ] 명함 교환 플로우 (QR → 프로필 → 저장)
- [ ] Discover: 카테고리/태그 필터 검색
- [ ] Home: 실시간 피드 (Supabase Realtime)
- [ ] Inbox: 연락 요청 수락/거절

### 🎯 v1.0 (장기 목표)
- [ ] 포트폴리오 기능
- [ ] 증명 사진 업로드
- [ ] 플랫폼 OAuth (YouTube, GitHub)
- [ ] 문서 해시 증빙
- [ ] 추천/Endorse 기능
- [ ] 알림 시스템 (푸시 알림)
- [ ] 앱 스토어 배포

### 🔮 Future
- [ ] Apple/Google Wallet Pass
- [ ] NFC 명함
- [ ] AR 명함
- [ ] 팀/기관 디렉터리
- [ ] 분석 대시보드
- [ ] 웹 플레이어 (비회원 프로필 뷰어)

---

## 📊 현재 구현 상태 (v0.4)

### 완성된 화면
1. **HomeScreen** - 피드 (골격)
2. **DiscoverScreen** - 탐색 (골격)
3. **CardScreen** - 명함 탭 (내 명함/보관 명함 토글)
4. **MyCardScreen** - 내 명함 상세 (QR, 공유 모달, 통계)
5. **SavedCardsScreen** - 보관 명함 (카테고리 필터, 리스트)
6. **CardDetailScreen** - 명함 상세보기 (연락처, 삭제)
7. **CardEditorScreen** - 명함 꾸미기 (템플릿, 색상, 공개 필드)
8. **PassScreen** - 디지털 패스 (QR, 시크릿 코드, 통계)
9. **VerificationScreen** - 더보기 (프로필 요약, 메뉴, 로그아웃)
10. **EditProfileScreen** - 프로필 편집 + 인증 섹션
11. **VerifyEmailScreen** - 이메일 인증 (개발 모드)
12. **VerifyPhoneScreen** - 핸드폰 인증 (개발 모드)
13. **InboxScreen** - 받은편지함 (골격)
14. **LoginScreen** - 로그인
15. **SignupScreen** - 회원가입 (실명, 주민번호, 중복 방지)
16. **WelcomeScreen** - 웰컴 화면

### 구현된 기능
- ✅ Supabase Auth 연동
- ✅ AuthContext (전역 상태 관리)
- ✅ QR 코드 생성
- ✅ 프로필 CRUD
- ✅ 명함 꾸미기 (설정 저장)
- ✅ 카테고리 필터링
- ✅ 공유 모달
- ✅ 디지털 패스 (밝기 조절)
- ✅ 실명 기반 회원가입
- ✅ 중복 가입 방지 (identity_hash)
- ✅ 이메일/핸드폰 인증 (개발 모드)
- ✅ 뱃지 시스템 (이메일, 핸드폰, 실존 인증)
- ✅ 실명 일치 확인

### 미구현 기능
- ⏳ QR 스캔
- ⏳ 명함 교환 (저장)
- ⏳ 실제 이메일/SMS 발송 (SendGrid, Twilio 등)
- ⏳ 피드 데이터 로딩
- ⏳ 검색 기능
- ⏳ 연락 요청
- ⏳ 플랫폼 OAuth (YouTube, GitHub)
- ⏳ 문서 인증

---

## 🎨 디자인 시스템

### 컬러 팔레트
- **Primary**: Navy Blue (#2563EB) - 신뢰, 전문성
- **Accent**: Cyan (#22D3EE) - 아이콘, 강조
- **Background**: Light Slate (#F8FAFC)
- **Surface**: White (#FFFFFF)
- **Text**: Ink (#0B1220), Slate (#475569), Muted (#94A3B8)
- **Success**: Green (#16A34A)
- **Warning**: Amber (#F59E0B)
- **Error**: Red (#DC2626)

### 카테고리
- 크리에이터 (videocam)
- 개발자 (code-slash)
- 디자이너 (color-palette)
- 프리랜서 (briefcase)
- 학생 (school)
- 자영업자 (storefront)
- 예술가 (brush)
- 작가 (book)
- 사진작가 (camera)
- 마케터 (megaphone)
- 교육자 (school)
- 연구원 (flask)
- 엔지니어 (construct)
- 의료인 (medical)
- 농업인 (leaf)
- 기타 (ellipsis-horizontal)

---

## 🔐 보안 및 프라이버시

### 설계 철학
1. **실명 기반 신뢰**
   - 회원가입 시 실명, 생년월일, 성별 입력 필수
   - 주민번호 앞 7자리로 생년월일·성별 검증
   - 수정 불가 처리로 신원 위조 방지

2. **인증 일치 확인**
   - 이메일/핸드폰 인증 시 실명 일치 여부 확인
   - 불일치 시 인증 실패 처리

3. **뱃지로 신뢰도 표시**
   - 인증 완료 시 뱃지 부여
   - 프로필에 뱃지 표시로 신뢰도 시각화

4. **사용자 제어권**
   - 공개 범위 세밀하게 제어
   - 명함 교환 시 원하는 정보만 공개

5. **Row Level Security**
   - 데이터베이스 레벨에서 접근 제어
   - 본인 데이터만 수정 가능

---

## 🤝 기여 방법

현재는 1인 개발 중이지만, 향후 오픈소스 기여를 환영합니다.

### 기여 가능 영역
- **버그 리포트**: GitHub Issues에 등록
- **기능 제안**: Discussions에서 논의
- **코드 기여**: PR 환영 (코드 리뷰 후 머지)
- **문서화**: README, Wiki 개선

---

## 📞 연락처

- **GitHub**: [https://github.com/Jjinhyuk/aurid](https://github.com/Jjinhyuk/aurid)
- **이슈 트래킹**: [GitHub Issues](https://github.com/Jjinhyuk/aurid/issues)
- **개발자**: Jjinhyuk (Solo Founder)

---

## 📄 라이선스

MIT License - 자유롭게 사용, 수정, 배포 가능

---

## 💡 개발 철학

**"실용주의와 완성도의 균형"**

- **빠른 반복**: MVP 먼저, 피드백으로 개선
- **사용자 중심**: 화려함보다 편의성
- **신뢰 우선**: 검증 없는 기능은 출시 안 함
- **지속 가능성**: 기술 부채 최소화, 문서화 우선

---

**Built with ❤️ by Jjinhyuk**
*"명함을 넘어서, 증명까지."*
