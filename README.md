# Aurid Pass

> **"스캔 한 번, 신뢰까지."**
> 온라인과 오프라인의 당신을 하나의 패스로 연결합니다.

---

## 📌 프로젝트 비전

**Aurid Pass**는 명함을 넘어선, **검증 가능한 디지털 아이덴티티 플랫폼**입니다.

현대 사회에서 우리는 수많은 플랫폼에 흩어진 정체성을 가지고 있습니다. YouTube 크리에이터, GitHub 개발자, 로컬 비즈니스 운영자, 프리랜서 디자이너... 하지만 이 모든 것을 **하나의 신뢰할 수 있는 프로필**로 통합하고, **오프라인에서도 즉시 공유**할 수 있는 방법은 없었습니다.

**Aurid Pass**는 이 문제를 해결합니다.

### 🎯 핵심 가치 제안

1. **통합된 신원**: 온라인·오프라인 활동을 하나의 검증 가능한 프로필로 통합
2. **즉각적인 공유**: QR·링크·시크릿 코드로 언제 어디서나 내 프로필 공유
3. **증명 가능한 신뢰**: 플랫폼 연동, 문서 해시, 추천으로 실존과 성과를 검증
4. **프라이버시 우선**: 공개 범위를 세밀하게 제어, 기본은 비공개
5. **발견 가능성**: 카테고리·태그 기반 검색으로 새로운 연결 창출

---

## 🚀 왜 Aurid Pass인가?

### 기존 명함의 한계
- 일방향 정보 전달만 가능
- 업데이트 불가능
- 신뢰성 검증 불가
- 분실 시 연결 단절

### 기존 링크 트리 서비스의 한계
- 단순 링크 나열, 맥락 없음
- 검증 기능 없음
- 오프라인 공유 어려움
- 업데이트 알림 없음

### Aurid Pass의 차별점
- **검증 레이어**: 실존·플랫폼·문서 3단계 검증
- **동적 업데이트 피드**: 프로필 변경 시 자동 공유
- **카테고리 발견**: Creator, Developer, Designer 등 직군별 탐색
- **유연한 공개 범위**: Public/Lite/Request 프리셋
- **오프라인 우선**: QR·NFC·Wallet Pass 지원 (예정)

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
- **React Navigation**: 5탭 네비게이션 (Bottom Tabs)
- **Expo Vector Icons**: 일관된 UI 아이콘

### Backend
- **Supabase**
  - **Auth**: 이메일/전화번호 인증
  - **Database**: PostgreSQL with RLS (Row Level Security)
  - **Storage**: 프로필 이미지, 문서 해시
  - **Realtime**: 피드 업데이트 구독 (예정)

### 보안 설계 원칙
1. **기본 비공개, 공개는 Opt-in**: 모든 정보는 기본적으로 비공개
2. **Row Level Security (RLS)**: 데이터베이스 레벨에서 접근 제어
3. **민감 정보 분리**: PII는 private 스키마, 서비스 롤만 접근
4. **동의 로그 저장**: 모든 공개/철회 동의 기록
5. **레이트 리밋**: 연락 요청, API 호출 제한
6. **미성년자 보호**: 연령대만 노출, 더 제한적인 기본 설정

---

## 📂 프로젝트 구조

```
aurid/
├── src/
│   ├── config/
│   │   └── supabase.js          # Supabase 클라이언트 설정
│   ├── navigation/
│   │   └── TabNavigator.js      # 하단 5탭 네비게이션
│   ├── screens/
│   │   ├── HomeScreen.js        # 피드 (메인)
│   │   ├── DiscoverScreen.js    # 카테고리 탐색
│   │   ├── PassScreen.js        # QR/링크/코드
│   │   ├── InboxScreen.js       # 연락요청/알림
│   │   └── ProfileScreen.js     # 프로필 편집
│   └── components/              # 재사용 컴포넌트
├── App.js                        # 앱 진입점
├── .env                          # 환경 변수 (git 제외)
└── supabase-schema.sql          # DB 스키마 & RLS
```

---

## 🎨 5탭 네비게이션 구조

### 1. Home (피드)
- 검증된 프로필 업데이트 스트림
- 신규 가입, 프로필 변경, 새 Claim 추가 등
- "검증된 업데이트 우선" 필터

### 2. Discover (발견)
- 카테고리: Creator, Developer, Designer, Local Biz, Student 등
- 필터: 지역, 스킬/태그, 가용상태, 검증레벨
- 카드형 결과 리스트

### 3. Pass (내 패스) ⭐️ 핵심
- **QR 코드**: 크게 표시, 스캔 즉시 프로필 공유
- **짧은 링크**: aurid.app/handle (복사 가능)
- **시크릿 코드**: 6~8자 영숫자 (오프라인 입력용)
- 스캔 카운트, 최근 스캔 힌트

### 4. Inbox (받은편지함)
- 연락 요청: 보낸 사람, 목적, 메모
- 액션: 수락(확장 공개) / 거절 / 차단
- 시스템 알림: 패스 스캔됨, 프로필 승인됨, 추천 받음

### 5. Profile (프로필)
- 카테고리별 섹션 (토글형)
- Claim 카드: work/edu/award/portfolio
- 공개 범위: Public / Lite / Request
- 검증: 실존(전화/이메일) / 플랫폼(OAuth) / 문서(Hash)

---

## 🗄 데이터베이스 스키마

### 핵심 테이블

#### `profiles` - 사용자 프로필
- `handle`, `display_name`, `bio`, `location`
- `categories[]`, `tags[]` (배열)
- `visibility_json` (JSONB, 필드별 공개 범위)

#### `claims` - 증명 카드
- `type`: work/edu/award/portfolio
- `proof_type`: oauth/hash/endorse
- `is_public`: 공개 여부

#### `updates` - 피드 업데이트
- `kind`: join/edit/new_claim/role_change
- `payload_json`: 이벤트 상세 정보

#### `cards` - 패스 카드
- `short_code`: 고유 짧은 코드
- `status`: active/revoked

#### `contact_requests` - 연락 요청
- `to_profile_id`, `from_profile_id`
- `status`: pending/accepted/blocked

#### `verifications` - 검증 정보
- `kind`: email/phone/oauth/org
- `status`: pending/verified/failed

### RLS (Row Level Security)
- **profiles**: 모두 읽기 가능, 본인만 수정
- **claims**: 공개된 것만 읽기, 본인은 모두 읽기/수정
- **contact_requests**: 송/수신자만 읽기
- **verifications**: 본인만 읽기

---

## 🛠 시작하기

### 1. 저장소 클론 및 설치

```bash
git clone https://github.com/Jjinhyuk/aurid.git
cd aurid
npm install
```

### 2. 환경 변수 설정

`.env` 파일 생성 (또는 기존 파일 수정):

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Supabase 데이터베이스 설정

1. [Supabase 대시보드](https://supabase.com/dashboard) 접속
2. 프로젝트 생성 또는 선택
3. **SQL Editor** → `supabase-schema.sql` 내용 복사 → 실행
4. Auth 설정: Email/Phone 활성화

### 4. 앱 실행

#### 개발 서버 (QR 코드로 모바일 테스트)
```bash
npm start
```

#### 웹 (레이아웃 빠른 확인)
```bash
npm run dev
# 또는
npm run web
```

#### iOS/Android (에뮬레이터)
```bash
npm run ios      # macOS only
npm run android  # Android Studio 필요
```

### 5. 모바일 테스트 (Expo Go 앱)

1. **Expo Go** 앱 설치 (App Store / Google Play)
2. `npm start` 실행 후 QR 코드 스캔
3. 핸드폰과 PC가 **같은 WiFi**에 연결되어 있어야 함

---

## 🚧 개발 로드맵

### ✅ MVP v0.1 (완료 - 2주)
- [x] Git/Supabase 세팅
- [x] 5탭 네비게이션 구조
- [x] DB 스키마 & RLS 설정
- [x] 기본 화면 UI 골격

### 🔄 v0.2 (2주 예상)
- [ ] 온보딩 플로우 (이메일/전화 인증)
- [ ] Pass 탭: QR 코드 생성 (라이브러리 연동)
- [ ] Profile 탭: 편집 기능 (카테고리, 태그, 소개)
- [ ] Supabase Auth 연동 (회원가입/로그인)
- [ ] 프로필 생성 자동화 (첫 로그인 시)

### 🔜 v0.3 (3주 예상)
- [ ] Discover: 카테고리/태그 필터 검색
- [ ] Home: 실시간 피드 (Supabase Realtime)
- [ ] Inbox: 연락 요청 수락/거절
- [ ] Claim 카드 생성/편집 (work/edu/award/portfolio)
- [ ] 공개 범위 프리셋 (Public/Lite/Request)

### 🎯 v0.4~v1.0 (2개월 예상)
- [ ] 플랫폼 OAuth (YouTube API, GitHub OAuth)
- [ ] 문서 해시 증빙 (PDF → SHA-256)
- [ ] Apple/Google Wallet Pass 생성
- [ ] NFC 명함 등록 (NFC 태그 연동)
- [ ] 추천/Endorse 기능
- [ ] 알림 시스템 (푸시 알림)
- [ ] 다국어 지원 (i18n)
- [ ] 앱 스토어 배포 (TestFlight / Google Play Beta)

### 🔮 Future (v1.0+)
- [ ] AR 명함 (로고 마커 → 프로필 카드)
- [ ] 팀/기관 디렉터리
- [ ] 분석 대시보드 (스캔 통계, 유입 경로)
- [ ] 프리미엄 기능 (커스텀 도메인, 고급 분석)
- [ ] 웹 플레이어 (비회원 프로필 뷰어)

---

## 🔐 보안 및 프라이버시 원칙

### 설계 철학
1. **기본 비공개 (Privacy by Default)**
   - 모든 정보는 생성 시 비공개
   - 사용자가 명시적으로 공개 선택 시만 노출

2. **최소 권한 원칙 (Principle of Least Privilege)**
   - 데이터베이스 RLS로 접근 제어
   - 서비스 롤도 필요한 테이블만 접근

3. **투명성과 제어권**
   - 공개/철회 동의 로그 저장
   - 사용자가 언제든 데이터 내보내기/삭제 가능

4. **미성년자 보호**
   - 19세 미만: 연령대만 노출, 디폴트 더 제한적
   - 연락 요청 필터링 강화

5. **레이트 리밋 & 신고 시스템**
   - 연락 요청: 1일 10건 제한 (인증 사용자)
   - CAPTCHA (비인증 접근 시)
   - 신고/차단 기능 기본 제공

### 준수 예정 규정
- GDPR (일반 데이터 보호 규정)
- CCPA (캘리포니아 소비자 프라이버시법)
- 한국 개인정보보호법

---

## 🤝 기여 방법

현재는 1인 개발 중이지만, 향후 오픈소스 기여를 환영합니다.

### 기여 가능 영역
- **버그 리포트**: GitHub Issues에 등록
- **기능 제안**: Discussions에서 논의
- **코드 기여**: PR 환영 (코드 리뷰 후 머지)
- **디자인**: Figma 파일 공유 예정
- **문서화**: README, Wiki 개선

### 개발 가이드
1. Fork & Clone
2. 새 브랜치 생성 (`feature/your-feature`)
3. 커밋 메시지 규칙: `feat:`, `fix:`, `docs:`, `refactor:`
4. PR 생성 (main ← feature)

---

## 📞 연락처 및 링크

- **GitHub**: [https://github.com/Jjinhyuk/aurid](https://github.com/Jjinhyuk/aurid)
- **이슈 트래킹**: [GitHub Issues](https://github.com/Jjinhyuk/aurid/issues)
- **개발자**: Jjinhyuk (1인 개발, Solo Founder)

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
