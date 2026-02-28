# 핸들 금지어 필터 + 프로필 제한 변경 플랜

## 1. 프로필 제한 변경 (1개 → 5개, ADMIN 무제한)

### 수정 파일:
- `lib/actions/profiles.ts` — `count >= 1` → `count >= 5`
- `app/api/admin/profiles/route.ts` — 동일 변경

## 2. 핸들 금지어 필터

### 새 파일: `lib/banned-handles.ts`
금지어를 카테고리별로 관리하는 파일 생성:

- **성적/부적절** — 한국어 로마자 + 영어 (sex, porn, fuck, hentai, bitch, ssib, yadong 등)
- **유명 상표** — google, apple, samsung, nike, adidas, gucci, louis.vuitton, chanel, hermes, prada, coca.cola, pepsi, microsoft, amazon, meta, netflix, spotify, tesla, bmw, mercedes, toyota, honda, hyundai, kia 등
- **유명인/아이돌** — bts, blackpink, twice, newjeans, aespa, ive, stray.kids, exo, nct, red.velvet, itzy, gidle, seventeen, txt, enhypen, le.sserafim, babymonster 등 + 멤버 이름 (jungkook, jennie, lisa, jisoo, rose 등) + 해외 유명인 (taylorswift, elonmusk 등)
- **시스템 예약어** — 기존 RESERVED 목록에 추가 (home, explore, search, profile, account, help, about, contact, blog, news, official, verify 등)

### 수정 파일: `lib/handle.ts`
- `banned-handles.ts`에서 금지어 Set import
- `validateHandle()`에서 금지어 매칭 로직 추가:
  - 정확히 일치 (exact match)
  - 핸들이 금지어를 **포함**하는지도 체크 (substring match) — 성적 단어만
  - 예: `pornstar123` → 차단, `apple_music` → 차단

### 에러 메시지:
- `"이 핸들은 사용할 수 없습니다."` (구체적 이유 노출 안 함)
