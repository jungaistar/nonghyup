// =========================================================================
// 프롬프트 학습 & 평가 — 데이터 + SCORE 채점 엔진
// (contents 프로젝트 PromptLab 패턴 이식, 예시는 사무관리 실무로 적응)
// 평가 기준 = 프롬프트 5요소(역할·맥락·과제·제약·출력형식), 각 20점, 합계 100점.
// 채점은 키워드·구조 기반 클라이언트 추정(학습용, 실제 LLM 채점 아님).
// =========================================================================

// 5대 평가 기준 (각 20점)
export const scoreCriteria = [
  { key: '역할', code: 'R', max: 20, icon: 'fa-solid fa-user-tie',
    desc: '적절한 전문가 역할을 지정했는가',
    detail: '"너는 15년차 사무관리 실무 전문가야"처럼 역할을 부여하면 답변의 전문성·어조가 안정된다.' },
  { key: '맥락', code: 'C', max: 20, icon: 'fa-solid fa-layer-group',
    desc: '문서·대상·상황 배경을 충분히 줬는가',
    detail: '문서 종류·목적·독자(임직원/거래처/경영진)·수치 등 구체적 배경이 많을수록 환각이 줄고 정확해진다.' },
  { key: '과제', code: 'T', max: 20, icon: 'fa-solid fa-pen-ruler',
    desc: '무엇을 만들지 명확히 지시했는가',
    detail: '"~를 작성해줘"처럼 동작이 분명해야 한다. 작업이 여러 개면 나눠 지시한다.' },
  { key: '제약', code: 'Co', max: 20, icon: 'fa-solid fa-ruler-combined',
    desc: '길이·톤·금지·안전 등 조건을 명시했는가',
    detail: '분량·말투·금지어·안전문구 유지 등을 정하지 않으면 매번 결과가 달라진다.' },
  { key: '출력형식', code: 'F', max: 20, icon: 'fa-solid fa-table-list',
    desc: '결과를 어떤 구조·형태로 받을지 지정했는가',
    detail: '표·목록·섹션 구조를 지정하면 현업에 바로 쓸 수 있는 결과가 나온다.' },
]

export const gradeTable = [
  { grade: 'S', range: '90–100', label: '탁월', desc: '5요소가 완벽하게 갖춰진 프롬프트' },
  { grade: 'A', range: '80–89', label: '우수', desc: '대부분의 요소가 잘 갖춰짐' },
  { grade: 'B', range: '65–79', label: '보통', desc: '기본 요소는 있으나 개선 여지' },
  { grade: 'C', range: '50–64', label: '미흡', desc: '핵심 요소가 부족해 결과가 불안정' },
  { grade: 'D', range: '0–49', label: '부족', desc: '프롬프트로서 기본 기능을 못 함' },
]

export const GRADE_COLOR = { S: '#1D7A4F', A: '#1D4E89', B: '#3D6FE0', C: '#D4760A', D: '#C8102E' }

// 점수를 올리는 5가지 기법
export const techniques = [
  { icon: 'fa-solid fa-user-tie', title: '역할 부여(Role)', desc: '"너는 ~ 전문가야"로 시작하면 답변의 톤과 전문성이 올라간다.' },
  { icon: 'fa-solid fa-clone', title: '예시 제공(Few-shot)', desc: '원하는 형식의 예시 1~3개를 주면 모델이 그 구조를 모방한다.' },
  { icon: 'fa-solid fa-ruler-combined', title: '제약 명시', desc: '분량·말투·금지어·안전문구 유지를 못 박아 재작업을 줄인다.' },
  { icon: 'fa-solid fa-list-ol', title: '단계 분해', desc: '복잡한 작업은 1)…2)…로 쪼개 지시하면 누락이 줄어든다.' },
  { icon: 'fa-solid fa-table-list', title: '출력형식 지정', desc: '표·목록·섹션 구조를 지정해 바로 쓰는 결과를 받는다.' },
]

// 채점 예시 (개선 전/후)
export const scoreSample = {
  before: { prompt: '공지문 정리해줘', total: 20, grade: 'D' },
  after: {
    prompt: `[역할] 너는 15년차 사무관리 실무 전문가야.
[맥락] 대상은 사내 전 임직원, 하계 휴가 신청 절차 변경 안내 공지문(시행일 7월 15일).
[과제] 변경된 신청 절차를 정확하고 이해하기 쉬운 공지문으로 작성해줘.
[제약] A4 반 장 이내, 정중한 사내 공지 톤, 확정 안 된 일정은 [확인 후 공지]로 표기.
[출력형식] "제목 / 변경 요약 / 신청 방법(단계 목록) / 문의처" 구조.`,
    total: 94, grade: 'S',
  },
}

// 실습 시나리오 — 사무관리 6업무
export const scenarios = [
  {
    id: 1, category: '업무1 · 사내 공지', title: '공지문 작성 프롬프트',
    situation: '하계 휴가 신청 절차가 바뀌어 전 임직원에게 보낼 사내 공지문을 정확하게 작성하려 합니다.',
    goal: '오해 없이 전달되는 사내 공지문 프롬프트를 작성하세요.',
    keywords: ['공지', '안내', '임직원', '절차', '변경', '시행', '문의'],
    roleKeywords: ['사무관리', '총무', '작성자', '전문가', '담당자'],
    constraintKeywords: ['이내', '문장', '톤', '정중', '금지', '유지'],
    formatKeywords: ['표', '섹션', '목록', '항목', '형식', '구조'],
    exampleAnswer: `[역할] 너는 15년차 사무관리 실무 전문가야.
[맥락] 대상은 사내 전 임직원, 하계 휴가 신청 절차 변경(시행일 7월 15일, 결재 시스템 변경).
[과제] 변경된 신청 절차를 안내하는 사내 공지문을 작성해줘.
[제약] A4 반 장 이내, 정중한 사내 공지 톤, 확정 안 된 내용은 [확인 후 공지]로 표기.
[출력형식] "제목 / 변경 요약 / 신청 방법(단계 목록) / 시행일 / 문의처" 구조.`,
  },
  {
    id: 2, category: '업무2 · 회의록', title: '회의록 요약 프롬프트',
    situation: '주간 팀 회의 녹취/메모를 구조화된 회의록으로 정리해 공유하려 합니다.',
    goal: '결정사항·할 일이 명확한 회의록 요약 프롬프트를 작성하세요.',
    keywords: ['회의록', '요약', '결정', '논의', '할일', '담당', '기한'],
    roleKeywords: ['사무관리', '비서', '작성자', '전문가', '담당자'],
    constraintKeywords: ['사실', '추측', '금지', '이내', '근거'],
    formatKeywords: ['표', '목록', '항목', '섹션', '열', '형식'],
    exampleAnswer: `[역할] 너는 회의록 정리에 능숙한 사무관리 실무 전문가야.
[맥락] 아래는 사료 영업팀 주간 회의 메모다. 참석자는 팀장 외 5명.
[과제] 이 내용을 공유용 회의록으로 정리해줘.
[제약] 사실만 반영하고 추측은 금지, 결정사항과 할 일을 분리해서.
[출력형식] "참석자 / 주요 논의 3~5 / 결정사항 / 할 일(담당·기한 표) / 다음 회의" 구조.`,
  },
  {
    id: 3, category: '업무3 · 업계 조사', title: '시장·업계 조사 프롬프트',
    situation: '배합사료 원료가·축산 사육두수 동향 등 업계 현황을 빠르게 정리하려 합니다.',
    goal: '출처가 붙은 업계 조사 요약 프롬프트를 작성하세요.',
    keywords: ['시장', '조사', '사료', '축산', '동향', '출처', '원료'],
    roleKeywords: ['조사', '애널리스트', '리서처', '전문가', '담당자'],
    constraintKeywords: ['출처', '근거', '최신', '확인', '금지'],
    formatKeywords: ['표', '목록', '항목', '섹션', '열', '형식'],
    exampleAnswer: `[역할] 너는 축산·사료 업계를 조사하는 시장 리서처야.
[맥락] 관심 주제는 최근 배합사료 원료가(옥수수·대두박) 추이와 국내 축종별 사육두수 변화다.
[과제] 최신 동향을 출처와 함께 정리하고 시사점을 요약해줘.
[제약] 각 수치에 출처를 표기하고, 확신이 낮으면 "확인 필요"로 표기, 오래된 자료 지양.
[출력형식] "항목 / 현황 / 변화 방향 / 출처" 4열 표 + 핵심 시사점 3가지.`,
  },
  {
    id: 4, category: '업무4 · 보고서', title: '보고서 초안 프롬프트',
    situation: '분기 실적과 이슈를 담은 팀 보고서 초안을 일관된 양식으로 만들려 합니다.',
    goal: '논리적인 보고서 초안을 요청하는 프롬프트를 작성하세요.',
    keywords: ['보고서', '초안', '실적', '이슈', '현황', '개선', '제언'],
    roleKeywords: ['기획', '보고서', '작성자', '전문가', '담당자'],
    constraintKeywords: ['분량', '톤', '정중', '금지', '사실'],
    formatKeywords: ['항목', '섹션', '표', '구조', '목록', '형식'],
    exampleAnswer: `[역할] 너는 기획·보고서 작성에 능숙한 사무관리 전문가야.
[맥락] 대상은 팀 분기 실적 보고, 독자는 부서장(핵심 수치는 아래 첨부).
[과제] 보고서 초안을 작성해줘.
[제약] A4 1~2장 분량, 정중한 비즈니스 톤, 미확정 수치는 [확인]으로 표기.
[출력형식] 요약 / 실적 현황(표) / 주요 이슈 / 개선 방안 / 향후 계획 섹션.`,
  },
  {
    id: 5, category: '업무5 · 데이터 요약', title: '데이터 요약 프롬프트',
    situation: '월별 거래처 주문·매출 데이터에서 핵심 흐름을 뽑아 보고에 쓰려 합니다.',
    goal: '핵심 지표를 짚어주는 데이터 요약 프롬프트를 작성하세요.',
    keywords: ['데이터', '요약', '매출', '거래처', '추세', '지표', '분석'],
    roleKeywords: ['데이터', '애널리스트', '분석', '전문가', '담당자'],
    constraintKeywords: ['근거', '수치', '금지', '확인', '기준'],
    formatKeywords: ['표', '목록', '차트', '항목', '열', '형식'],
    exampleAnswer: `[역할] 너는 업무 데이터 분석에 능숙한 사무관리 전문가야.
[맥락] 아래는 최근 6개월 거래처별 사료 주문·매출 데이터다.
[과제] 핵심 흐름과 특이점을 요약해줘.
[제약] 데이터에 있는 사실만 근거로, 없는 값은 추정 금지, 확신 낮으면 "확인 필요".
[출력형식] "지표 / 값 / 전월 대비 / 코멘트" 표 + 눈에 띄는 점 3가지 요약.`,
  },
  {
    id: 6, category: '업무6 · 의사결정', title: '의사결정 매트릭스 프롬프트',
    situation: '신규 거래처 관리 도구 후보 3개를 기준별로 비교해 선택 근거를 만들려 합니다.',
    goal: '기준·가중치로 후보를 비교하는 의사결정 프롬프트를 작성하세요.',
    keywords: ['의사결정', '매트릭스', '비교', '기준', '가중치', '후보', '선택'],
    roleKeywords: ['기획', '컨설턴트', '분석', '전문가', '담당자'],
    constraintKeywords: ['기준', '근거', '가중치', '금지', '확인'],
    formatKeywords: ['표', '매트릭스', '점수', '열', '형식', '구조'],
    exampleAnswer: `[역할] 너는 의사결정을 돕는 기획 컨설턴트야.
[맥락] 거래처 관리 도구 후보 3개(A/B/C)를 도입하려 하고, 예산·사용성·연동성이 중요하다.
[과제] 후보를 기준별로 비교해 선택 근거를 정리해줘.
[제약] 각 기준에 가중치를 매기고 점수 산정 근거를 적어, 임의 추정은 "확인 필요"로 표기.
[출력형식] "후보 / 기준별 점수(가중치 반영) / 총점 / 강약점" 매트릭스 표 + 추천 1안.`,
  },
]

// =========================================================================
// SCORE 채점 엔진 — 입력 프롬프트를 5요소 기준으로 0~20점씩 추정(휴리스틱).
// =========================================================================
export function evaluatePrompt(input, scenario) {
  const text = input.toLowerCase().replace(/\s+/g, ' ')
  const len = input.trim().length
  const feedback = []

  // 역할 (Role)
  let role = 0
  const roleHit = scenario.roleKeywords.filter((k) => text.includes(k.toLowerCase())).length
  const hasRole = /(너는|당신은|역할|전문가|담당자|으로서|act as|you are)/.test(input)
  if (hasRole) role += 12
  if (roleHit > 0) role += 8
  role = Math.min(role, 20)
  if (role < 12) feedback.push('역할을 지정하세요 — 예: "너는 15년차 사무관리 실무 전문가야"')

  // 맥락 (Context)
  let context = 0
  const ctxHit = scenario.keywords.filter((k) => text.includes(k.toLowerCase())).length
  if (ctxHit >= 5) context += 12
  else if (ctxHit >= 3) context += 9
  else if (ctxHit >= 2) context += 6
  else if (ctxHit >= 1) context += 3
  if (/\d/.test(input)) context += 3
  if (/\[.+\]|"""|타깃|대상|문서|보고서|고객|거래처/.test(input)) context += 5
  context = Math.min(context, 20)
  if (context < 12) feedback.push(`맥락(문서·대상·상황)을 더 담으세요 — 예: ${scenario.keywords.slice(0, 3).join(', ')}`)

  // 과제 (Task)
  let task = 0
  const actionRe = /(작성|만들|써|분석|정리|요약|생성|제안|기획|설계|평가|비교|추천|도출|변주|번역|진단|검토)/
  const actionCount = (input.match(new RegExp(actionRe, 'g')) || []).length
  if (actionRe.test(input)) task += 10
  if (actionCount >= 2) task += 5
  if (len >= 120) task += 5
  task = Math.min(task, 20)
  if (task < 12) feedback.push('무엇을 만들지 명확한 지시문을 넣으세요 — 예: "~를 작성해줘"')

  // 제약 (Constraints)
  let constraint = 0
  const conHit = (scenario.constraintKeywords || []).filter((k) => text.includes(k.toLowerCase())).length
  if (/(자 이내|이내|글자|단어|분량|줄|문단|페이지|a4)/i.test(input)) constraint += 7
  if (/(톤|말투|어투|존댓말|반말|친근|정중|위트)/.test(input)) constraint += 6
  if (/(금지|하지 ?마|제외|제한|단,|주의|없이|유지|안전)/.test(input)) constraint += 4
  if (conHit > 0) constraint += 3
  constraint = Math.min(constraint, 20)
  if (constraint < 10) feedback.push('제약(길이·톤·금지어·안전문구 유지)을 명시하면 결과가 안정됩니다')

  // 출력형식 (Format)
  let format = 0
  const fmtHit = scenario.formatKeywords.filter((k) => text.includes(k.toLowerCase())).length
  if (fmtHit >= 2) format += 8
  else if (fmtHit >= 1) format += 4
  if (/[1-9][.)]\s|[-·•]\s|#{1,3}\s|\[출력|\[형식|①②③/.test(input)) format += 7
  if (/(표|목록|불릿|json|마크다운|구조|칼럼|열)/i.test(input)) format += 5
  format = Math.min(format, 20)
  if (format < 10) feedback.push('출력형식(표·목록·섹션 구조)을 지정하세요')

  const total = role + context + task + constraint + format
  if (len < 50) feedback.unshift('프롬프트가 너무 짧습니다. 100자 이상으로 5요소를 모두 담아보세요.')
  if (total >= 85) feedback.push('5요소가 균형 있게 잘 갖춰졌습니다! 👍')

  let grade = 'D'
  if (total >= 90) grade = 'S'
  else if (total >= 80) grade = 'A'
  else if (total >= 65) grade = 'B'
  else if (total >= 50) grade = 'C'

  return {
    total, grade, feedback,
    scores: { 역할: role, 맥락: context, 과제: task, 제약: constraint, 출력형식: format },
  }
}

// =========================================================================
// 과목별 프롬프트 라이브러리 — 강의 커리큘럼(제1·2권)에 맞춘 즉시 사용 프롬프트
// =========================================================================
export const promptLibrary = [
  {
    subject: '실무 공통 · 문서/메일 자동화',
    icon: 'fa-solid fa-file-pen',
    prompts: [
      {
        title: '회의록 자동 정리',
        use: '회의 메모/녹취를 구조화된 회의록으로.',
        prompt:
          '아래 회의 내용을 회의록으로 정리해줘. [참석자]/[주요 논의 3~5]/[결정 사항]/[할 일(담당·기한 표)]/[다음 회의]. 사실만, 추측 금지.\n\n[여기에 회의 내용 붙여넣기]',
      },
      {
        title: '정중한 안내 메일',
        use: '거래처·고객에게 보낼 메일 초안.',
        prompt:
          '너는 비즈니스 메일 전문가야. [받는 사람]에게 [목적]을 알리는 정중한 메일을 6문장 이내로 써줘. 확정 안 된 내용은 [확인 후 회신]으로 표시. 제목/본문/맺음말 형식으로.',
      },
      {
        title: '긴 문서 핵심 요약',
        use: '긴 자료를 빠르게 이해.',
        prompt:
          '아래 자료를 [독자] 눈높이로 요약해줘. ① 한 문장 요약 ② 핵심 3가지 ③ 어려운 용어 2개 쉬운 설명. 추측 금지.\n\n[여기에 자료 붙여넣기]',
      },
    ],
  },
  {
    subject: '검수 · 품질관리',
    icon: 'fa-solid fa-clipboard-check',
    prompts: [
      {
        title: 'AI 생성물 팩트체크',
        use: 'AI가 만든 초안의 오류를 잡을 때.',
        prompt:
          '아래 문서를 검토해줘. 사실 오류·수치 오류·원문에 없는 추정을 찾아 "항목/문제/수정안/위험도" 표로 정리하고, 확신이 낮으면 "확인 필요"로 표기해줘.\n\n[여기에 검토할 문서 붙여넣기]',
      },
      {
        title: '데이터 품질 점검',
        use: '데이터셋의 품질을 기준대로 점검.',
        prompt:
          '내 [데이터셋]을 품질 6대 차원(정확성·완전성·일관성·적시성·유효성·유일성)으로 점검하는 체크리스트를 표로 만들어줘. 각 항목에 측정 방법과 합격 기준을 적어줘.',
      },
    ],
  },
  {
    subject: '모듈 1 · 업무 이해 & 도구 선택',
    icon: 'fa-solid fa-briefcase',
    prompts: [
      {
        title: '내 업무 AI 적용 후보 도출',
        use: '자기 업무 흐름에서 AI로 자동화할 후보를 찾는다.',
        prompt:
          '너는 사무관리 업무혁신 컨설턴트다. 내 직무는 [직무]이고 주요 업무는 [업무1, 업무2, 업무3]이다. 각 업무를 ① AI 적용 가능성(상/중/하), ② 기대 효과, ③ 추천 도구로 정리한 표를 만들고, 가장 먼저 시작할 업무 1가지를 근거와 함께 추천해줘.',
      },
      {
        title: '도구 선택 매트릭스',
        use: '업무 특성에 맞는 AI 도구 조합을 고른다.',
        prompt:
          '아래 업무들을 ChatGPT·Claude·Gemini·Perplexity·Google Sheets·Google Docs 중 어떤 도구가 가장 적합한지 "업무 / 추천 도구 / 이유 / 대안" 표로 정리해줘. 업무: [① 공지문 작성 ② 업계 시장 조사 ③ 발표자료 제작 ④ 장문 자료 요약 ⑤ 데이터 집계·분석].',
      },
    ],
  },
  {
    subject: '모듈 2 · ChatGPT & Custom GPT',
    icon: 'fa-solid fa-comment-dots',
    prompts: [
      {
        title: 'Custom GPT 지시문(Instruction) 설계',
        use: '부서 전용 GPT의 역할·규칙을 정의한다.',
        prompt:
          '너는 [부서] 업무를 돕는 어시스턴트다. 다음 규칙을 지켜라: ① 업로드된 사내 자료에 근거해 답하고 근거가 없으면 "확인 필요"로 표기, ② 답변은 표/체크리스트로 구조화, ③ 규정·수치 문구는 임의로 바꾸지 않는다. 첫 인사로 어떤 정보를 주면 되는지 안내해줘.',
      },
      {
        title: '거래처 매출 데이터 분석(Code Interpreter)',
        use: '엑셀/CSV를 올려 패턴을 분석한다.',
        prompt:
          '첨부한 거래처 매출 데이터를 분석해줘. ① 거래처별 매출 TOP10 막대그래프, ② 월별 매출 추세선(이상치 표시), ③ 관리가 필요한 거래처와 근거를 표로 제시해줘.',
      },
    ],
  },
  {
    subject: '모듈 3 · Gemini & Claude 심화',
    icon: 'fa-solid fa-layer-group',
    prompts: [
      {
        title: '장문 문서 요약·검토(Claude)',
        use: '수십 페이지 자료의 핵심과 쟁점을 뽑는다.',
        prompt:
          '아래 사업계획서를 검토해줘. 검토가 필요한 쟁점을 "항목 / 내용 / 리스크(상중하) / 보완 제안" 표로 정리하고, 각 항목에 원문 위치를 인용해줘. 확신이 낮으면 "확인 필요"로 표기해줘.',
      },
      {
        title: '출처 인용 업계 보고서(Gemini Deep Research)',
        use: '근거가 붙은 조사 보고서를 만든다.',
        prompt:
          '국내 배합사료·축산 시장을 조사해줘. 시장 규모·성장률, 주요 원료가 동향, 축종별 사육두수, 관련 규제·정책을 출처와 함께 정리하고 시사점을 요약해줘.',
      },
    ],
  },
  {
    subject: '모듈 4 · Perplexity & 리서치',
    icon: 'fa-solid fa-magnifying-glass',
    prompts: [
      {
        title: '실시간 업계 동향 조사(Perplexity)',
        use: '최신 뉴스·자료를 출처와 함께 모은다.',
        prompt:
          '최근 3개월 국내 사료·축산 업계 주요 이슈를 조사해줘. ① 원료가 변동 → ② 정책·규제 변화 → ③ 주요 기업 동향 순으로 정리하고, 각 항목에 출처 링크를 표기해줘.',
      },
      {
        title: '발표자료 초안 자동 생성(AI Slides)',
        use: '내용만 주고 발표 덱 초안을 만든다.',
        prompt:
          '분기 실적 공유 슬라이드 10장을 만들어줘. 청중은 부서 임직원, 구성: 요약 → 실적 현황 → 주요 이슈 → 개선 방안 → 향후 계획. 비즈니스 톤.',
      },
    ],
  },
  {
    subject: '모듈 5 · 문서·이미지 활용',
    icon: 'fa-solid fa-photo-film',
    prompts: [
      {
        title: '표·양식 이미지 분석(Vision)',
        use: '사진/스캔 문서에서 정보를 추출한다.',
        prompt:
          '이 거래명세서 이미지를 분석해 거래처·품목·수량·금액을 표로 정리해줘. 판독이 불확실한 항목은 "확인 필요"로 표기해줘.',
      },
      {
        title: '회의 녹취 → 단계별 정리',
        use: '녹취 내용을 실행 항목으로 변환한다.',
        prompt:
          '이 회의 녹취를 분석해 논의를 안건별로 정리하고, 각 안건의 결정사항과 할 일(담당·기한)을 표로 정리해줘.',
      },
    ],
  },
  {
    subject: '모듈 6 · 업무별 프로토타입',
    icon: 'fa-solid fa-diagram-project',
    prompts: [
      {
        title: '6업무 프로토타입 설계',
        use: '자기 업무용 AI 자동화 프로토타입을 설계한다.',
        prompt:
          '내 업무는 [공지문/회의록/업계조사/보고서/데이터요약/의사결정 중 택1]이다. 이 업무의 반복 작업 1개를 AI로 자동화하는 프로토타입을 설계해줘. ① 입력 → ② AI 처리 → ③ 사람 검수 → ④ 산출물 단계로 나누고, 각 단계의 도구·프롬프트·검수 기준을 표로 제시해줘.',
      },
    ],
  },
  {
    subject: '심화 1 · 회의·인터뷰 정리',
    icon: 'fa-solid fa-microphone-lines',
    prompts: [
      {
        title: '실무 인터뷰 질문 설계',
        use: '담당자 노하우를 끌어내는 질문지를 만든다.',
        prompt:
          '너는 업무분석 전문가다. [영업/총무/구매 중 택1] 담당자의 실무 노하우를 끌어내는 인터뷰 질문지를 만들어줘. 5W1H + Why-5 기법으로 15문항을 작성하고, 각 문항의 목적을 괄호로 표기해줘.',
      },
      {
        title: '1주일 문서 수집 체계 설계',
        use: '부서의 자료 수집·정리 체계를 잡는다.',
        prompt:
          '내 부서 [부서명]의 1주일 문서·데이터 수집 체계를 설계해줘. 요일별 수집 대상(보고·회의록·데이터)·도구·담당·보안등급을 표로 정리하고, 24시간 정리 룰을 반영해줘.',
      },
    ],
  },
  {
    subject: '심화 2 · 문서 디지털화',
    icon: 'fa-solid fa-file-lines',
    prompts: [
      {
        title: '종이 양식 OCR → 표 변환',
        use: '종이 문서를 디지털 표로 변환한다.',
        prompt:
          '이 손글씨 신청서 이미지를 디지털 표로 변환해줘. 컬럼은 [접수일/신청자/항목/내용/특이사항]으로 하고, 판독이 불확실한 칸은 "[?]"로 표기해줘.',
      },
      {
        title: '회의·인터뷰 STT → 회의록',
        use: '녹취를 구조화된 회의록으로 만든다.',
        prompt:
          '아래 회의 녹취록(STT 결과)을 정리해줘. ① 3줄 요약, ② 핵심 결정사항, ③ 할 일(담당·기한 표), ④ 후속 논의 안건으로 구조화해줘.',
      },
    ],
  },
  {
    subject: '심화 3 · 구조화·품질·자산화',
    icon: 'fa-solid fa-database',
    prompts: [
      {
        title: '메타데이터 표준 양식 설계',
        use: '문서 자산화를 위한 관리 체계를 만든다.',
        prompt:
          '내 부서 문서에 적용할 메타데이터 표준 양식을 설계해줘. 15개 항목(제목·작성일·작성자·분류·보안등급 등)을 표로 정의하고, 각 항목의 입력 규칙과 예시를 함께 제시해줘.',
      },
      {
        title: '데이터 품질 점검 체크리스트',
        use: 'GIGO 방지를 위한 품질 기준을 만든다.',
        prompt:
          '데이터 품질 6대 차원(정확성·완전성·일관성·적시성·유효성·유일성) 기준으로 우리 [데이터셋명]을 점검하는 체크리스트를 표로 만들어줘. 각 항목에 측정 방법과 합격 기준을 적어줘.',
      },
      {
        title: 'KPI 업무 개선 ROI 보고',
        use: '경영진 보고용 ROI 논리를 만든다.',
        prompt:
          'AI 업무 자동화 프로젝트의 ROI를 임원 보고용으로 정리해줘. 투입(시간·비용) 대비 효과(시간 절감·품질·재사용)를 정량화하고, 90일 로드맵(4단계)과 핵심 KPI를 표로 제시해줘.',
      },
    ],
  },
]

// =========================================================================
// 프롬프트 하위 메뉴 정의
// =========================================================================
export const PROMPT_SECTIONS = [
  { id: 'learn', label: '프롬프트 학습하기', short: '학습하기', icon: 'fa-solid fa-book', desc: '5요소·등급·기법 기초' },
  { id: 'pattern', label: '프롬프트 실전패턴', short: '실전패턴', icon: 'fa-solid fa-puzzle-piece', desc: '바로 쓰는 7가지 패턴' },
  { id: 'library', label: '과목별 프롬프트 예제', short: '과목별 예제', icon: 'fa-solid fa-folder-tree', desc: '커리큘럼별 예제 모음' },
  { id: 'practice', label: '프롬프트 평가 실습', short: '평가 실습', icon: 'fa-solid fa-bullseye', desc: '직접 쓰고 SCORE 채점' },
  { id: 'follow', label: '프롬프트 따라하기', short: '따라하기', icon: 'fa-solid fa-shoe-prints', desc: '단계별 가이드 실습' },
]

// 흔한 실수 (학습하기 보강)
export const commonMistakes = [
  {
    bad: '공지문 정리해줘',
    why: '역할·맥락·형식이 모두 빠져 매번 다른 결과가 나온다.',
    fix: '너는 사무관리 실무 전문가다. 하계 휴가 신청 절차 변경 사항을 "제목/변경 요약/신청 방법/문의처" 구조의 사내 공지문으로 작성해줘.',
  },
  {
    bad: '좋은 안내문 써줘',
    why: '"좋은"은 기준이 없어 평가가 불가능하다. 대상·톤·길이를 줘야 한다.',
    fix: '전 임직원 대상, 300자 이내, 정중한 사내 공지 톤으로 사내 교육 신청 안내문을 써줘.',
  },
  {
    bad: '이 데이터 분석해줘 (파일만 첨부)',
    why: '무엇을 보고 싶은지 없으면 일반적인 요약만 나온다.',
    fix: '이 거래처 주문 데이터에서 거래처별 매출 TOP10과 월별 매출 추세를 차트로 보여줘.',
  },
  {
    bad: '이 보고서 검토해줘 (수십 장 붙여넣기)',
    why: '판단 기준이 없으면 단순 요약에 그친다. 관점을 줘야 한다.',
    fix: '보완이 필요한 쟁점만 찾아 "항목/내용/리스크/보완안" 표로, 원문 위치를 인용해 정리해줘.',
  },
  {
    bad: '요약해줘',
    why: '독자·분량·형식 기준이 없으면 그대로 보고에 쓸 수 없다.',
    fix: '부서장이 30초에 파악하도록 한 문장 요약 + 핵심 3가지 + 후속 조치로 정리해줘.',
  },
]

// =========================================================================
// 프롬프트 따라하기 — 단계별 가이드 실습
// =========================================================================
export const followTutorials = [
  {
    id: 'excel-analysis',
    title: '엑셀 데이터 분석 자동화 따라하기',
    tool: 'ChatGPT (Code Interpreter)',
    level: '입문',
    goal: '엑셀/CSV를 올려 코딩 없이 분석·차트·요약까지 만든다.',
    steps: [
      { instruction: '분석할 엑셀/CSV 파일을 ChatGPT 입력창에 업로드하세요.', prompt: null, expected: 'AI가 표 구조를 인식합니다.' },
      { instruction: '원하는 분석을 자연어로 요청하세요.',
        prompt: '방금 올린 데이터를 분석해줘. ① 상위 항목 TOP10 막대그래프 ② 월별 추세 선그래프 ③ 눈에 띄는 점 3가지를 쉬운 말로. 표·그래프 함께.',
        expected: '그래프와 핵심 설명이 나옵니다.' },
      { instruction: '보고용으로 정리하세요.',
        prompt: '위 분석을 임원 보고용 한 장 요약으로 만들어줘. 핵심 수치 3가지와 권고 1가지만.',
        expected: '한 장 요약 보고를 얻습니다.' },
      { instruction: '결과의 수치는 원본과 대조해 검수하세요.', prompt: null, expected: '신뢰할 수 있는 분석 완성.' },
    ],
  },
  {
    id: 'manual-bot',
    title: '사내 규정 안내 봇 만들기',
    tool: 'ChatGPT (Custom GPT)',
    level: '입문',
    goal: '사내 규정을 근거로만 답하는 전용 어시스턴트를 5단계로 완성한다.',
    steps: [
      { instruction: 'ChatGPT에서 [GPT 만들기 → Configure]로 들어가, 아래 지시문을 Instructions에 붙여 넣으세요.',
        prompt: '너는 사내 규정 안내 어시스턴트다. 업로드된 규정 문서에 근거해서만 답하고, 근거가 없으면 "규정 확인 필요"라고 답해줘. 모든 답변 끝에 근거 위치(조항/페이지)를 표기해줘.',
        expected: '봇의 역할과 답변 규칙이 고정됩니다.' },
      { instruction: 'Knowledge 영역에 사내 규정·복무 지침 PDF를 업로드하세요. (없으면 샘플 PDF로 연습)',
        prompt: null,
        expected: '봇이 그 문서 내용을 근거로 사용할 수 있게 됩니다.' },
      { instruction: '미리보기 대화창에 아래 질문을 입력해 동작을 확인하세요.',
        prompt: '연차 휴가 신청은 며칠 전까지 해야 하나요? 근거 위치도 알려줘.',
        expected: '규정 근거와 함께 답이 나오고, 없으면 "확인 필요"로 답합니다.' },
      { instruction: '답이 너무 길면 형식을 고정하도록 지시를 보강하세요.',
        prompt: '앞으로 모든 답은 3줄 이내 요약 + 근거 표 형식으로 답해줘.',
        expected: '일관된 형식의 답변이 나옵니다.' },
      { instruction: '완성되면 [공유]로 링크를 만들어 부서원과 공유하세요.',
        prompt: null,
        expected: '누구나 같은 규칙의 규정 안내 봇을 사용할 수 있습니다.' },
    ],
  },
  {
    id: 'spec-review',
    title: '보고서 쟁점 검토 따라하기',
    tool: 'Claude',
    level: '실전',
    goal: '장문 보고서에서 보완할 쟁점을 찾아 표로 받는 과정을 익힌다.',
    steps: [
      { instruction: 'Claude 새 대화에 보고서/사업계획서 전문을 붙여 넣거나 파일로 업로드하세요.',
        prompt: null,
        expected: '긴 문서를 한 번에 인식합니다.' },
      { instruction: '검토 관점을 명확히 준 아래 프롬프트를 입력하세요.',
        prompt: '아래 사업계획서를 검토해줘. 보완이 필요한 쟁점을 "항목/내용/리스크(상중하)/보완 제안" 표로 정리하고, 각 항목에 원문 위치를 인용해줘. 확신이 낮으면 "확인 필요"로 표기해줘.',
        expected: '보완 쟁점이 표로 정리되고 근거가 인용됩니다.' },
      { instruction: '우선순위가 필요하면 후속 질문으로 좁히세요.',
        prompt: '위 표에서 리스크 "상"인 항목만 추려, 보고 시 우선 다룰 순서로 다시 정리해줘.',
        expected: '핵심 쟁점만 우선순위로 정렬됩니다.' },
      { instruction: '결과는 사람이 최종 검수합니다. 확신 낮음 항목은 담당자에게 확인하세요.',
        prompt: null,
        expected: 'AI는 1차 검토, 최종 판단은 사람이 — 책임 있는 활용.' },
    ],
  },
  {
    id: 'market-research',
    title: '업계 시장 조사 보고서 따라하기',
    tool: 'Gemini Deep Research / Perplexity',
    level: '실전',
    goal: '출처가 붙은 업계 조사 보고서를 만들고 검수하는 흐름을 익힌다.',
    steps: [
      { instruction: 'Gemini에서 Deep Research(또는 Perplexity Pro Search)를 선택하세요.',
        prompt: null,
        expected: '다단계로 깊게 조사하는 모드가 켜집니다.' },
      { instruction: '조사 범위를 구체적으로 지정한 프롬프트를 입력하세요.',
        prompt: '국내 배합사료·축산 시장을 조사해줘. 시장 규모·성장률, 주요 원료가(옥수수·대두박) 동향, 축종별 사육두수, 관련 규제·정책을 출처와 함께 정리하고 시사점을 요약해줘.',
        expected: '출처 각주가 달린 보고서 초안이 생성됩니다.' },
      { instruction: '핵심 수치의 각주를 클릭해 원문으로 사실을 확인하세요.',
        prompt: null,
        expected: '환각·오래된 수치를 걸러냅니다.' },
      { instruction: '보고서를 발표용으로 다듬도록 요청하세요.',
        prompt: '위 내용을 의사결정용 1페이지 요약(핵심 3가지 + 리스크 + 권고)으로 다시 정리해줘.',
        expected: '경영 보고용 요약본을 얻습니다.' },
    ],
  },
]
