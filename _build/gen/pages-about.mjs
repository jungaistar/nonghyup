/* 페이지 생성기 (3/3) — 제작 의도 · 강사 소개 · 회사 소개
   강사 정보는 원본(이애본) 대신 첨부된 이력서(정동엽)로 교체했다.       */
import { esc } from './blocks.mjs';
import { SITE, sbAbout } from './shell.mjs';

const crumb = (items) => `<ol class="crumb">${items.map((it, i) =>
  i === items.length - 1 ? `<li>${esc(it[0])}</li>`
    : `<li><a href="${it[1]}">${esc(it[0])}</a></li>`).join('')}</ol>`;

const ph = (eyebrow, title, lead) => `<div class="ph">
${eyebrow ? `  <span class="ph__eyebrow">${esc(eyebrow)}</span>` : ''}
  <h1>${esc(title)}</h1>
${lead ? `  <p>${esc(lead)}</p>` : ''}
</div>`;

const rows = (list) => `<div class="table-wrap"><table class="kv"><tbody>${
  list.map(([k, v]) => `<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`).join('')}</tbody></table></div>`;

/* ============ 강사 이력 — 첨부 이력서(2026-08) 기준 ============
   개인 휴대폰 번호는 넣지 않는다. 공개 사이트라 학교 이메일만 싣는다.
   (이 저장소 주인의 다른 프로젝트에서도 같은 이유로 번호를 뺀 전례가 있다) */
const INSTRUCTOR = {
  name: '정동엽',
  en: 'JEONG DONG-YEOP',
  role: '커리어 전략가 · 미래예측 전문가 · 대학 겸임교수',
  email: 'newjob4u@kyonggi.ac.kr',
  profile: [
    '‘인간중심 AI 기본사회’로의 이행을 설계하는 커리어 전략가입니다. 대학 겸임교수로서 생성형 AI 강의와 청소년·청년·성인·베이비부머의 상담, 경력 재설계·전직·면접 코칭을 지원합니다.',
    '미래예측 전문가로서 20년간의 IT 교육정보화·이러닝 구축 경험을 기반으로 AI 시대의 직업 패러다임 전환을 견인하고 있습니다.',
  ],
  keyInfo: [
    ['소속', 'AI미래직업연구소 소장'],
    ['겸임', '동아예술방송대학교 교양융합학부 겸임교수'],
    ['전문', '생성형 AI · 미래예측 · 커리어 설계'],
    ['교육 대상', '대학 · 기업 · 공공기관 · 교육지원청'],
  ],
  education: [
    ['2026.05', '경기대학교 일반대학원 직업학과 박사과정 수료'],
    ['2014.08', '가천대학교 경영대학원 고용 및 직업상담학과 석사'],
    ['2012.02', '국제문화대학원대학교 학습코칭 전공 · 교육학석사'],
    ['2012.02', '사회복지사 졸업 · 행정학학사 (교육과학기술부)'],
    ['1994.08', '부산외국어대학교 컴퓨터공학 졸업 · 공학사'],
  ],
  career: [
    'AI미래직업연구소 소장',
    '키다리진로직업협동조합 이사장(대표)',
    '사단법인 기본사회 AI기본사회 교육센터장',
    '(전) 아시아미래인재연구소 실장',
    '한국뉴욕주립대학교 Futures Master & Futures Coach',
    '와우캠프 대표 강사 · 경기·인천 진로지도 특강',
    '서울시 산업진흥원 IT 플랫폼 전문컨설턴트 · 창업전문위원(창업닥터) · 신직업 전문코치',
  ],
  competency: [
    {
      title: '미래 진로지도 · 창업 · 창직 · 빅데이터 · 전직지원 강의',
      items: [
        '한국기술교육대학교 능력개발원 · 「4차 산업혁명시대 일과 직업의 변화」 전임교수 (2016–2020)',
        '동아예술방송대학교 교양융합학부 겸임교수 · 문화예술콘텐츠 창업, 취업과 경력개발 외 (2017–현재)',
        '전남대학교 · 생성형 AI ADVANCED 과정 (교수 대상) · 생성형 AI 기반 문서/인사행정 실무자동화 과정',
        '동신대학교 · 클로드 기반 교수 설계 강의 (교수 대상)',
        '조선대학교 · 클로드를 활용한 업무자동화 강의 (교수 대상)',
        'K-Digital 양성과정 · 빅데이터 개론 및 데이터 전처리 강의',
        'SKALA 4기 AI 캠퍼스 및 K-뉴딜 과정 실기 강사',
        '8개 교육지원청(금산·논산·음성·서산·공주 등) · 「4차 산업혁명과 진로지도」 특강',
      ],
    },
    {
      title: '직업 · 진로 · 창업 · 학습 분야 강의',
      items: [
        '미래학 기반 전략컨설팅 및 진로지도 (전략컨설팅 · 비전수립)',
        '전 연령층 대상 직업상담 및 전직 강의',
        '자기주도적 학습코칭 강의 · 학부모 코칭 (감정코칭 · 자녀 진로지도)',
        '직무스트레스 관리 워크샵 (NLP 기반 스트레스 조절)',
        '시뮬레이션형 창업 컨설팅 (미래예측기법) · 미래전략 컨설턴트 및 비전코칭',
      ],
    },
  ],
  certs: [
    { title: '직업심리 전문가 · 한국고용정보원', items: [
      '직업심리전문가 (청소년 · 대학생 · 성인 부문)',
      '청소년 온라인 직업상담원 · 온라인 직업심리전문가',
      '희망취업프로그램 · 취업성공패키지 운영자 · CAP+ 진행자',
    ] },
    { title: '미래학 분야', items: [
      '미래학 마스터 6학기 졸업 (한국뉴욕주립대 아시아미래인재연구소)',
      'Futures Master & Futures Coach · 미래준비학교 Master Coach',
    ] },
    { title: '창업 · 창직 · 직업상담', items: [
      '신직업 전문코칭 · EduTool KIT 디자이너 · IT 플랫폼 컨설턴트 (서울시 산업진흥원)',
      '제3기 희망설계아카데미(서울시 청년 창업닥터) · 커리어 컨설턴트(삼성SDS 멀티캠퍼스)',
    ] },
    { title: '국가 · 민간 공인', items: [
      '사회복지사 2급 · 평생교육사 2급 · 외국인을 위한 한국어교사 2급',
      '직업훈련교사 3급 — 마케팅 / 정보기술전략·계획(빅데이터), 고용노동부',
      '국제공인 NLP Practitioner · 프레디저 전문강사 · 모금전문가 수료(희망제작소)',
    ] },
  ],
  books: [
    ['『생각의 미래』', '지식노마드 · 2016.12'],
    ['『강서구 사회적 경제』', '고등학교 교재 집필'],
  ],
  vision: '미래예측 전문가로서 20년의 IT 교육정보화 경험을 토대로, 인간중심 AI 기본사회로의 이행을 설계하는 커리어 전략가로 활동하고 있습니다.',
};

const ABOUT_STYLE = `
.kv{background:#fff; border:1px solid var(--g200); border-radius:var(--radius); overflow:hidden; min-width:420px}
.kv th{width:132px; background:var(--g50); color:var(--g700); font-weight:800; text-align:left;
  padding:11px 14px; border-top:1px solid var(--g100); font-size:14px}
.kv td{padding:11px 14px; border-top:1px solid var(--g100); color:var(--g600); font-size:14.5px}
.kv tr:first-child th,.kv tr:first-child td{border-top:0}
.prof{display:grid; grid-template-columns:150px 1fr; gap:26px; align-items:start; margin-bottom:26px}
.prof__ava{aspect-ratio:1; border-radius:var(--radius-lg); display:grid; place-items:center;
  background:linear-gradient(140deg,var(--b800),var(--b500)); color:#fff;
  font-size:40px; font-weight:800; letter-spacing:-.04em}
.prof h2{font-size:25px; font-weight:800; color:var(--g900); letter-spacing:-.03em}
.prof__en{font-size:12px; font-weight:700; letter-spacing:.16em; color:var(--b600); margin-top:5px}
.prof__role{margin-top:9px; font-size:15px; color:var(--g500); line-height:1.7}
.prof__mail{display:inline-flex; align-items:center; gap:7px; margin-top:12px; padding:7px 14px;
  border-radius:var(--pill); background:var(--b50); color:var(--b700); font-size:13.5px; font-weight:700}
.tl2{position:relative; padding-left:22px; margin:14px 0 6px}
.tl2::before{content:""; position:absolute; left:5px; top:8px; bottom:8px; width:2px; background:var(--g200)}
.tl2 li{position:relative; display:grid; grid-template-columns:96px 1fr; gap:16px; padding:9px 0}
.tl2 li::before{content:""; position:absolute; left:-21px; top:17px; width:11px; height:11px;
  border-radius:50%; background:#fff; border:3px solid var(--b500)}
.tl2 b{font-size:14px; font-weight:800; color:var(--b700); white-space:nowrap}
.tl2 span{font-size:14.5px; color:var(--g600); line-height:1.75}
.vision{margin-top:30px; padding:26px 28px; border-radius:var(--radius-lg); color:#fff;
  background:linear-gradient(135deg,var(--b900),var(--b600))}
.vision b{display:block; font-size:12px; font-weight:800; letter-spacing:.18em; color:var(--s300); margin-bottom:9px}
.vision p{font-size:16px; line-height:1.85}
@media (max-width:640px){
  .prof{grid-template-columns:1fr; gap:16px}
  .prof__ava{max-width:120px; font-size:32px}
  .tl2 li{grid-template-columns:1fr; gap:2px}
}`;

/* ---------------- 제작 의도 ---------------- */
export function about(d) {
  const p = d.about.purpose;
  return {
    key: 'about', file: 'about.html', mode: 'about',
    title: `제작 의도 · ${SITE.short}`,
    desc: p.lead,
    sidebar: sbAbout('purpose'),
    body: `${crumb([['홈', 'index.html'], ['소개', 'about.html'], ['제작 의도']])}
${ph('About', p.title, p.lead)}
${(p.paragraphs || []).map((t) => `<p class="b-para">${esc(t)}</p>`).join('\n')}

<h2 class="sec-h"><span class="sec-h__n">■</span>이 사이트가 담은 것</h2>
<div class="grid g2">
${(p.points || []).map((x) => `  <div class="card"><h3>${esc(x.title)}</h3><p>${esc(x.desc)}</p></div>`).join('\n')}
</div>`,
    style: ABOUT_STYLE,
  };
}

/* ---------------- 강사 소개 ---------------- */
export function instructor() {
  const I = INSTRUCTOR;
  return {
    key: 'instructor', file: 'instructor.html', mode: 'about',
    title: `강사 소개 · ${SITE.short}`,
    desc: `${I.name} — ${I.role}`,
    sidebar: sbAbout('instructor'),
    body: `${crumb([['홈', 'index.html'], ['소개', 'about.html'], ['강사 소개']])}
${ph('Instructor', '강사 소개')}

<div class="prof">
  <div class="prof__ava" aria-hidden="true">${esc(I.name.slice(0, 1))}</div>
  <div>
    <h2>${esc(I.name)}</h2>
    <p class="prof__en">${esc(I.en)}</p>
    <p class="prof__role">${esc(I.role)}</p>
    <a class="prof__mail" href="mailto:${esc(I.email)}">✉ ${esc(I.email)}</a>
  </div>
</div>

${I.profile.map((t) => `<p class="b-para">${esc(t)}</p>`).join('\n')}
${rows(I.keyInfo)}

<h2 class="sec-h"><span class="sec-h__n">1</span>학력</h2>
<ul class="tl2">${I.education.map(([y, t]) =>
  `<li><b>${esc(y)}</b><span>${esc(t)}</span></li>`).join('')}</ul>

<h2 class="sec-h"><span class="sec-h__n">2</span>주요 경력</h2>
<ul class="b-bullets">${I.career.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>

<h2 class="sec-h"><span class="sec-h__n">3</span>핵심 역량</h2>
${I.competency.map((g) => `<h3 class="sub-h">${esc(g.title)}</h3>
<ul class="b-bullets">${g.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`).join('\n')}

<h2 class="sec-h"><span class="sec-h__n">4</span>자격</h2>
<div class="grid g2">
${I.certs.map((c) => `  <div class="card"><h3>${esc(c.title)}</h3>
    <ul class="b-bullets" style="margin-bottom:0">${c.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>
  </div>`).join('\n')}
</div>

<h2 class="sec-h"><span class="sec-h__n">5</span>저서</h2>
${rows(I.books)}

<div class="vision"><b>VISION</b><p>${esc(I.vision)}</p></div>`,
    style: ABOUT_STYLE,
  };
}

/* ---------------- 회사 소개 ---------------- */
export function company(d) {
  const c = d.about.company;
  return {
    key: 'company', file: 'company.html', mode: 'about',
    title: `회사 소개 · ${SITE.short}`,
    desc: c.tagline,
    sidebar: sbAbout('company'),
    body: `${crumb([['홈', 'index.html'], ['소개', 'about.html'], ['회사 소개']])}
${ph('Company', c.name, c.tagline)}
<p class="b-para">${esc(c.intro)}</p>
${rows(c.info)}

<h2 class="sec-h"><span class="sec-h__n">■</span>교육 분야</h2>
<div class="grid g2">
${(c.platforms || []).map((p) => `  <div class="card"><h3>${esc(p.title)}</h3><p>${esc(p.desc)}</p></div>`).join('\n')}
</div>

<h2 class="sec-h"><span class="sec-h__n">■</span>기술 스택</h2>
<div class="grid g3">
${(c.techStack || []).map((t) => `  <div class="card"><h3>${esc(t.name)}</h3><p>${esc(t.desc)}</p></div>`).join('\n')}
</div>

<h2 class="sec-h"><span class="sec-h__n">■</span>링크</h2>
${(c.links || []).map((l) => `<a class="b-link" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)} · ${esc(l.value)} ↗</a>`).join('\n')}`,
    style: ABOUT_STYLE,
  };
}
