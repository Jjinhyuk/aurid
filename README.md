# Aurid Pass

**"스캔 한 번, 신뢰까지."** — 개인별 패스(링크·QR·시크릿 코드)로 검증 가능한 프로필을 보여주고, 업데이트 피드와 카테고리형 프로필 검색으로 사람을 발견·연결합니다.

## 기술 스택

- **앱**: React Native (Expo) - iOS/Android/Web 동시 지원
- **백엔드**: Supabase (Auth/DB/Storage/RLS)
- **네비게이션**: React Navigation (Bottom Tabs)

## 프로젝트 구조

```
aurid/
├── src/
│   ├── config/
│   │   └── supabase.js          # Supabase 클라이언트 설정
│   ├── navigation/
│   │   └── TabNavigator.js      # 하단 5탭 네비게이션
│   ├── screens/
│   │   ├── HomeScreen.js        # 피드 (메인 화면)
│   │   ├── DiscoverScreen.js    # 검색/카테고리
│   │   ├── PassScreen.js        # 내 패스 (QR/링크/코드)
│   │   ├── InboxScreen.js       # 연락요청/알림
│   │   └── ProfileScreen.js     # 프로필 편집/검증
│   └── components/              # 공통 컴포넌트
├── App.js                        # 앱 진입점
├── .env                          # 환경 변수 (Supabase 설정)
└── supabase-schema.sql          # DB 스키마 및 RLS 설정
```

## 시작하기

### 1. 패키지 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env` 파일이 이미 생성되어 있습니다. Supabase 프로젝트 설정이 포함되어 있습니다.

### 3. Supabase 데이터베이스 설정

1. [Supabase 대시보드](https://supabase.com/dashboard)에 로그인
2. 프로젝트 선택
3. **SQL Editor** 메뉴로 이동
4. `supabase-schema.sql` 파일 내용 복사
5. SQL Editor에 붙여넣기 후 실행

### 4. 앱 실행

#### 웹 (개발 테스트용)
```bash
npm run web
```

브라우저에서 `http://localhost:8081` 열림

#### 모바일 (iOS)
```bash
npm run ios
```

#### 모바일 (Android)
```bash
npm run android
```

#### Expo Go 앱으로 테스트
```bash
npx expo start
```

## 주요 기능 (MVP v0.1)

### 5개 탭 구조
1. **Home (피드)**: 검증된 프로필 업데이트 스트림
2. **Discover (발견)**: 카테고리별 프로필 검색 (Creator, Developer, Designer, Local Biz 등)
3. **Pass (내 패스)**: QR 코드, 짧은 링크, 시크릿 코드 표시
4. **Inbox (받은편지함)**: 연락 요청 및 알림
5. **Profile (프로필)**: 프로필 편집, 카테고리 선택, 검증 관리

### 데이터 구조
- **profiles**: 사용자 프로필 (핸들, 표시명, 카테고리, 태그)
- **claims**: 증명 카드 (work/edu/award/portfolio)
- **updates**: 피드용 업데이트 이벤트
- **cards**: 패스 카드 (QR/링크/시크릿 코드)
- **card_scans**: 스캔 기록
- **contact_requests**: 연락 요청
- **verifications**: 검증 정보 (이메일/전화/OAuth/문서)

## 다음 단계 (v0.2~0.3)

- [ ] 플랫폼 OAuth 연동 (YouTube, GitHub)
- [ ] 문서 해시 증빙
- [ ] Apple/Google Wallet Pass
- [ ] NFC 명함 등록
- [ ] 피드/검색 최적화
- [ ] 추천 정렬 알고리즘

## 라이선스

MIT
