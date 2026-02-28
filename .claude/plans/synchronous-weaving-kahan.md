# thisis.at i18n — 한국어/영어/일본어 3개 국어 지원

## Context
현재 모든 UI 텍스트가 한국어로 하드코딩 되어 있음. 사용자 요청: en/ja/ko 3개 국어로 전환 가능하게. URL 라우팅 변경 없이, 쿠키 기반 locale 전환 방식으로 구현.

---

## 아키텍처

- **외부 라이브러리 없음** — 커스텀 경량 i18n (next-intl 등 불필요)
- **쿠키 기반 locale** — `locale` 쿠키로 언어 저장, 기본값 `ko`
- **서버 컴포넌트**: `getLocale()` + `getT()` (cookies()로 읽기)
- **클라이언트 컴포넌트**: `LocaleProvider` Context + `useT()` hook
- **딕셔너리**: flat key-value 객체 (`lib/i18n/dictionaries/ko.ts`, `en.ts`, `ja.ts`)
- **설정 파일 확장**: `labelKo` → `label: { ko, en, ja }` 또는 lookup 패턴

---

## 새 파일 (7개)

| 파일 | 용도 |
|------|------|
| `lib/i18n/types.ts` | `Locale` 타입, `LOCALES` 상수 |
| `lib/i18n/server.ts` | `getLocale()`, `getT()` — 서버 컴포넌트용 |
| `lib/i18n/client.tsx` | `LocaleProvider`, `useLocale()`, `useT()` — 클라이언트용 |
| `lib/i18n/dictionaries/ko.ts` | 한국어 딕셔너리 (~200키) |
| `lib/i18n/dictionaries/en.ts` | 영어 딕셔너리 |
| `lib/i18n/dictionaries/ja.ts` | 일본어 딕셔너리 |
| `components/public/language-switcher.tsx` | 언어 전환 버튼 (KO / EN / JA) |

## 수정 파일 (~20개)

### 핵심 인프라
| 파일 | 변경 |
|------|------|
| `app/layout.tsx` | `<html lang>` 동적 설정, `LocaleProvider` 래핑, locale 쿠키 읽기 |
| `middleware.ts` | Accept-Language 헤더로 초기 locale 자동 감지 (쿠키 없을 때) |

### 공개 페이지 (서버 컴포넌트)
| 파일 | 변경 |
|------|------|
| `app/page.tsx` | 히어로/피처/CTA 텍스트 → `t()` |
| `app/login/page.tsx` | 로그인 텍스트 → `t()` |
| `app/explore/page.tsx` | 메타데이터 → `t()` |
| `app/[handle]/page.tsx` | 메타데이터 fallback → `t()` |
| `app/u/[handle]/page.tsx` | 푸터 텍스트 → `t()` |

### 클라이언트 컴포넌트
| 파일 | 변경 |
|------|------|
| `components/public/top-nav.tsx` | 네비 링크 텍스트 + LanguageSwitcher 추가 |
| `components/auth/login-button.tsx` | "Google 계정으로 로그인" → `t()` |
| `components/admin/dashboard.tsx` | 대시보드 모든 텍스트 → `t()`, `badgeLabel()` → locale 기반 |
| `components/admin/create-profile-dialog.tsx` | 폼 라벨, 타입 이름, 에러 메시지 → `t()` |
| `components/editor/editor-content.tsx` | 탭 이름, 저장 버튼, 스타일 라벨 → `t()` |
| `components/explore/explore-view.tsx` | 탐색 UI 텍스트 + `badgeLabel()` → `t()` |
| `components/public/block-renderer.tsx` | "영업시간", 요일 이름, FAQ 등 → `t()` |
| `components/public/visitor-count.tsx` | "visitors" → `t()` |

### 설정 파일
| 파일 | 변경 |
|------|------|
| `lib/block-configs.ts` | `labelKo`/`descriptionKo` → `label: {ko,en,ja}` / `description: {ko,en,ja}` |
| `lib/themes.ts` | `nameKo` → `name: {ko,en,ja}` (또는 별도 lookup) |
| `lib/fonts.ts` | `nameKo`/`previewTextKo` → locale 대응 |

---

## 구현 순서

### Phase 1: i18n 코어 (파일 생성)
1. `lib/i18n/types.ts` — `Locale = 'ko' | 'en' | 'ja'`, `LOCALES`, `DEFAULT_LOCALE`
2. `lib/i18n/dictionaries/ko.ts` — 모든 한국어 문자열 수집하여 flat key-value로 정리
3. `lib/i18n/dictionaries/en.ts` — 영어 번역
4. `lib/i18n/dictionaries/ja.ts` — 일본어 번역
5. `lib/i18n/server.ts` — `getLocale()` (cookies 읽기), `getT()` (서버용 번역 함수)
6. `lib/i18n/client.tsx` — `LocaleProvider`, `useLocale()`, `useT()` (클라이언트용)

### Phase 2: 인프라 연결
7. `app/layout.tsx` — `getLocale()` 호출, `<html lang={locale}>`, `LocaleProvider` 래핑
8. `middleware.ts` — Accept-Language 감지, locale 쿠키 초기화
9. `components/public/language-switcher.tsx` — KO/EN/JA 전환 버튼, 쿠키 설정 + 페이지 리로드

### Phase 3: 공개 페이지 마이그레이션
10. `app/page.tsx` — 히어로 텍스트 교체
11. `app/login/page.tsx`
12. `components/public/top-nav.tsx` — LanguageSwitcher 추가
13. `components/auth/login-button.tsx`
14. `components/public/visitor-count.tsx`
15. `components/public/block-renderer.tsx` — 요일, 영업시간 등
16. `app/explore/page.tsx` + `components/explore/explore-view.tsx`
17. `app/u/[handle]/page.tsx`, `app/[handle]/page.tsx`

### Phase 4: 관리자/에디터 마이그레이션
18. `components/admin/dashboard.tsx`
19. `components/admin/create-profile-dialog.tsx`
20. `components/editor/editor-content.tsx`
21. `lib/block-configs.ts` — 다국어 라벨

### Phase 5: 설정 파일 + 검증
22. `lib/themes.ts` — 테마 이름 다국어
23. `lib/fonts.ts` — 폰트 이름 다국어
24. `npm run build` — 빌드 확인
25. 프리뷰에서 3개 국어 전환 테스트

---

## 핵심 코드 패턴

### 서버 컴포넌트에서 사용
```tsx
import { getT } from '@/lib/i18n/server';

export default async function Page() {
  const t = await getT();
  return <h1>{t('home.hero.title')}</h1>;
}
```

### 클라이언트 컴포넌트에서 사용
```tsx
'use client';
import { useT } from '@/lib/i18n/client';

export function MyComponent() {
  const t = useT();
  return <button>{t('common.save')}</button>;
}
```

### 딕셔너리 구조
```ts
// lib/i18n/dictionaries/ko.ts
export const ko = {
  'common.save': '저장',
  'common.cancel': '취소',
  'common.logout': '로그아웃',
  'home.hero.title': '나의 세계,',
  'home.hero.subtitle': '하나의 링크.',
  'admin.welcome': '돌아오셨군요, {name}님',
  // ... ~200 keys
} as const;
```

### 언어 전환 (쿠키 + 리로드)
```tsx
function switchLocale(locale: Locale) {
  document.cookie = `locale=${locale};path=/;max-age=31536000`;
  window.location.reload(); // 서버 컴포넌트도 갱신되도록
}
```

---

## 검증
1. `npm run build` 성공
2. 프리뷰에서 KO/EN/JA 전환 버튼 클릭 → 모든 텍스트 전환 확인
3. 페이지 새로고침 → 쿠키에서 locale 유지 확인
4. 새 브라우저(쿠키 없음) → Accept-Language 기반 자동 감지 확인
5. 관리자 대시보드, 에디터, 프로필 생성 다이얼로그 모두 3개 국어 동작
6. SSR 메타데이터(title, description)도 locale 반영
