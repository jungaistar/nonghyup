// About 콘텐츠 (제작의도 · 강사소개 · 회사소개)
// 강사·회사 정보는 DreamIT Biz 실제 정보 기준. 필요 시 수정하세요.

export const ABOUT_PAGES = [
  { id: 'purpose', to: '/about', label: '제작 의도', icon: 'fa-solid fa-bullseye' },
  { id: 'instructor', to: '/about/instructor', label: '강사 소개', icon: 'fa-solid fa-chalkboard-user' },
  { id: 'company', to: '/about/company', label: '회사 소개', icon: 'fa-solid fa-building' },
]

export const purpose = {
  title: '제작 의도',
  lead: '「생성형 AI 기반 사무관리 업무혁신 실무」 과정의 학습을, 강의실 밖에서도 이어가도록.',
  paragraphs: [
    '이 학습사이트는 농협사료 임직원을 위한 「생성형 AI 기반 사무관리 업무혁신 실무」 1일 8차시 과정의 커리큘럼을 온라인으로 옮겨, 수강생이 언제 어디서나 복습하고 실습할 수 있도록 제작되었습니다.',
    '생성형 AI는 “한 번 듣고 끝나는 지식”이 아니라 “매일 쓰면서 익히는 기술”입니다. 그래서 8차시 학습 내용뿐 아니라, 프롬프트 작성법과 무료 AI 도구 가이드, 업무별 프롬프트 부록을 함께 정리하여 현업에 바로 적용할 수 있게 구성했습니다.',
    '특히 별도 유료 구독 없이 쓸 수 있는 무료 도구(ChatGPT·Claude·Gemini·Perplexity·Google Sheets·Docs)를 중심으로, 문서 작성 → 자료 조사 → 분석 → 기획 → 보고서 → 데이터 분석 → 의사결정 지원의 실제 사무관리 업무 흐름에 맞춰 “무엇을, 어떤 도구로, 어떻게” 효율화할지에 초점을 맞췄습니다.',
  ],
  points: [
    { icon: 'fa-solid fa-book', title: '8차시 학습 내용', desc: '프롬프트부터 종합 실습까지 8차시를 그대로 — 세부내용·실습·산출물까지.' },
    { icon: 'fa-solid fa-pen-nib', title: '프롬프트 & 도구 가이드', desc: 'ChatGPT·Claude·Gemini·Perplexity·Google Sheets·Docs와 프롬프트 작성법·실습 사례 정리.' },
    { icon: 'fa-solid fa-briefcase', title: '사무관리 직무 중심', desc: '문서·조사·분석·기획·보고·의사결정 등 사무관리 업무 자동화에 초점을 맞춘 활용 사례.' },
    { icon: 'fa-solid fa-chart-line', title: '학습 진도 관리', desc: '로그인하면 어디서나 진도가 동기화되어 끝까지 완주.' },
  ],
}

export const instructor = {
  name: '이애본 (Ph.D)',
  role: 'DreamIT Biz 대표 · 기업·대학 AI 교육 전문',
  photo: `${import.meta.env.BASE_URL}aebon.jpeg`,
  intro:
    '생성형 AI를 실무에 접목하는 업무 자동화·데이터 활용 교육을 전문으로 합니다. 다수의 교육 사이트를 직접 설계·개발·운영하며, 대학교(경기대·한신대·한국기술교육대·서울대·한국외대·한라대·조선대 등)와 기업(KDN·KOMIPO 등)에서 AI 활용 교육을 진행하고 있습니다.',
  keyInfo: [
    ['직위', '드림아이티비즈 대표'],
    ['학위', '정보관리박사 (Ph.D)'],
    ['전공', '컴퓨터 / 직업학 / 정보관리'],
    ['교육 대상', '대학·기업·공공기관'],
  ],
  expertise: [
    { area: '생성형 AI 교육', detail: 'ChatGPT·Gemini·Claude·Perplexity 등 AI 도구 활용 교육', icon: 'fa-solid fa-robot' },
    { area: '프롬프트 엔지니어링', detail: '5요소·SCORE 프레임워크, Few-shot 등 고급 기법', icon: 'fa-solid fa-wand-magic-sparkles' },
    { area: '에듀테크 플랫폼', detail: 'React + Supabase 기반 교육 사이트 설계·개발·운영', icon: 'fa-solid fa-laptop-code' },
    { area: 'IT/디지털 전환', detail: '기업 DX 컨설팅, 웹 시스템 구축, 데이터 분석', icon: 'fa-solid fa-chart-line' },
    { area: '대학 교육', detail: 'AI·SW개론, 컴퓨팅 사고 등 대학 교과목 강의', icon: 'fa-solid fa-graduation-cap' },
    { area: '출판/콘텐츠', detail: 'AI·IT·경영 분야 전문 도서 기획·출판', icon: 'fa-solid fa-book' },
  ],
  career: [
    { period: '현재', role: '드림아이티비즈(DreamIT Biz) 대표', detail: '에듀테크 전문 기업 경영, 다수 교육 사이트 운영' },
    { period: '현재', role: '한신대학교 AI·SW대학 겸임교수', detail: 'AI·SW개론, 공학설계입문, 자바·웹프로그래밍 담당' },
    { period: '현재', role: '한국기술교육대학교 외래교수', detail: '“컴퓨팅 사고” 교과목 담당' },
    { period: '2018~2023', role: '경기대학교 겸임교수', detail: '소프트웨어 기초 및 파이썬 프로그래밍 담당' },
    { period: '2001~', role: '기업 AI 교육 전문 강사', detail: '고용노동부 직업능력개발훈련교사 — 인공지능·프로그래밍·UI/UX 외 다수' },
  ],
  philosophy: {
    quote: 'AI는 도구이고, 진짜 혁신은 사람이 만듭니다.',
    body: '도구 사용법을 넘어, 현장의 문제를 스스로 정의하고 AI로 해결하는 역량을 길러주는 것을 목표로 합니다.',
  },
}

export const company = {
  name: '드림아이티비즈 (DreamIT Biz)',
  tagline: '교육의 미래를 기술로 설계합니다',
  intro:
    '드림아이티비즈(DreamIT Biz)는 대학교·기업·공공기관을 대상으로 맞춤형 교육 플랫폼을 설계·개발·운영하는 에듀테크 전문 기업입니다. AI 교육, 경영, 코딩, 자격증, 인문교양 등 다양한 분야의 교육 사이트를 *.dreamitbiz.com 도메인 하에 운영하며, 각 교육 대상에 맞춘 최적의 학습 경험을 제공합니다.',
  info: [
    ['대표', '이애본 (Ph.D)'],
    ['사업자', '601-45-20154'],
    ['통신판매', '제2024-수원팔달-0584호'],
    ['출판사', '제2026-000026호'],
    ['소재지', '경기도 수원시 팔달구 매산로 45, 419호'],
    ['이메일', 'aebon@dreamitbiz.com'],
    ['도메인', 'www.dreamitbiz.com'],
  ],
  platforms: [
    { icon: 'fa-solid fa-robot', title: 'AI / 인공지능', desc: 'ChatGPT·Gemini·Claude·Perplexity, 프롬프트 엔지니어링, AI 리터러시 등' },
    { icon: 'fa-solid fa-briefcase', title: '경영 전공', desc: 'HRM·마케팅·회계·기획·디지털비즈니스·UX디자인 등' },
    { icon: 'fa-solid fa-code', title: '코딩 / 프로그래밍', desc: 'HTML·React·C·Java·Python·알고리즘·데이터베이스 등' },
    { icon: 'fa-solid fa-graduation-cap', title: '대학 교과목', desc: 'AI·SW개론(한신대), 컴퓨팅 사고(한국기술교육대) 등 정규 교과목' },
    { icon: 'fa-solid fa-award', title: '자격증 / 취업', desc: '정보처리기사·리눅스·SQLD·AWS·취업 지원 등' },
    { icon: 'fa-solid fa-book-open', title: '교양 / 인문', desc: '통계·외국어·프레젠테이션·안전·ESG 등 교양 교육' },
  ],
  techStack: [
    { name: 'React 18/19', desc: '최신 React로 사이트 구축' },
    { name: 'Vite', desc: '초고속 빌드 도구' },
    { name: 'Tailwind CSS', desc: '일관된 디자인 시스템' },
    { name: 'Supabase', desc: '클라우드 백엔드·인증' },
    { name: 'GitHub Pages', desc: '자동 배포 플랫폼' },
    { name: 'OpenAI / Claude', desc: 'AI 기능 연동' },
  ],
  links: [
    { label: '대표 도메인', value: 'dreamitbiz.com', url: 'https://dreamitbiz.com' },
    { label: '이 사이트', value: 'nonghyupsaryo.dreamitbiz.com', url: 'https://nonghyupsaryo.dreamitbiz.com' },
  ],
}
