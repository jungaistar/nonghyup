# 농협사료 · 생성형 AI 사무관리 업무혁신 학습사이트

농협사료 사무관리직 임직원을 위한 **「생성형 AI 기반 사무관리 업무혁신 실무」** 1일 8차시 과정 학습사이트입니다.

🔗 **배포 주소**: https://nonghyupsaryo.dreamitbiz.com

## 과정 구성

- **1일 8차시** · 08:00~17:00 (점심 1시간 제외) · 이론 30% + 실습 50% + 사례 20%
- 무료 AI 도구: **ChatGPT · Claude · Gemini · Perplexity · Google Sheets · Google Docs**
- 업무 흐름 커리큘럼

| 차시 | 주제 |
|------|------|
| 1 | 프롬프트 엔지니어링 이해 |
| 2 | 사무관리 업무별 AI 활용 구조 이해 |
| 3 | AI 기반 시장분석 및 트렌드 도출 |
| 4 | AI 활용 전략 기획 및 아이디어션 |
| 5 | GPT 활용 기획 문서 및 보고서 자동화 |
| 6 | AI 기반 데이터 분석 |
| 7 | AI 활용 의사결정 지원 시스템 구축 |
| 8 | 종합 실습 및 현업 적용 계획 수립 |

## 기술 스택

- **React 18** + **Vite 5** + **Tailwind CSS 3** + React Router 6
- **Supabase** — 구글/카카오 OAuth 로그인 + 학습 진도 동기화 (`nonghyupsaryo_` 접두사)
- 진도: 비로그인 시 localStorage, 로그인 시 Supabase 동기화 (테이블 없어도 graceful degrade)

## 로컬 개발

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # dist/ 생성
npm run preview  # 빌드 결과 미리보기
```

> `src/lib/supabase.js`에 URL/anon key fallback 하드코딩이 있어 환경변수 없이도 빌드/동작합니다.

## 구조

- `src/data/` — `content.json`(8차시)·`dayplans`·`tools`·`labs`·`appendix`·`promptLab`·`about`
- `src/pages/`, `src/components/` — 페이지·UI (블록 렌더링 기반)
- `public/nh-symbol.png` — 농협 공식 심볼마크(CI에서 추출)
- `Dev_md/` — 개발일지
- `reference/` — 원본 교육 제안서(docx)·농협 CI 자료(ai)

## 배포

`main` 브랜치 푸시 시 GitHub Actions(`.github/workflows/deploy.yml`)가 빌드 후 GitHub Pages로 자동 배포합니다.
- **Settings → Pages → Source = "GitHub Actions"** 로 설정되어 있어야 합니다.
- 커스텀 도메인(`public/CNAME`, `nonghyupsaryo.dreamitbiz.com`)을 사용하므로 Vite `base: '/'`.

© DreamIT Biz · 본 학습사이트의 콘텐츠는 교육 목적 사용에 한합니다.
