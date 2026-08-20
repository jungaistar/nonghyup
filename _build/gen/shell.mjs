/* ==========================================================================
   공통 골격 — 헤더 · 사이드바 · 푸터
   사이드바는 원본 Sidebar.jsx 처럼 화면 종류에 따라 모드가 바뀐다.
   ========================================================================== */
import { esc } from './blocks.mjs';

export const SITE = {
  title: '농협사료 · 생성형 AI 사무관리 업무혁신',
  short: '농협사료 AI 실무',
  course: '생성형 AI 기반 사무관리 업무혁신 실무',
  sub: '무료 AI 도구로 완성하는 1일 8차시 실습 과정',
};

const NAV = [
  ['index.html',     '홈',    'home'],
  ['course.html',    '교재',  'vol'],
  ['schedule.html',  '일정',  'schedule'],
  ['labs.html',      '실습',  'labs'],
  ['tools.html',     'AI 도구', 'tools'],
  ['appendix.html',  '부록',  'appendix'],
  ['about.html',     '소개',  'about'],
  ['dashboard.html', '진도',  'dash'],
];

export function header(mode) {
  return `<a class="skip-link" href="#main">본문 바로가기</a>
<header class="hd">
  <button class="hd__burger" type="button" aria-expanded="false" aria-controls="sb" aria-label="목차 열기">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
  </button>
  <a class="hd__logo" href="index.html">
    <span class="hd__mark" aria-hidden="true">NH</span>
    <span>농협사료<small>AI 사무관리 업무혁신</small></span>
  </a>
  <nav class="hd__nav" aria-label="주 메뉴">
    ${NAV.map(([href, label, key]) =>
      `<a href="${href}"${key === mode ? ' class="on" aria-current="page"' : ''}>${label}</a>`
    ).join('\n    ')}
  </nav>
</header>`;
}

/* --- 사이드바 --------------------------------------------------------- */
function item(href, label, { num, on, mark } = {}) {
  return `<a class="sb__item${on ? ' on' : ''}" href="${href}"${
    mark ? ` data-done-mark="${esc(mark)}"` : ''}>${
    num != null ? `<span class="sb__num">${esc(num)}</span>` : ''}<span>${esc(label)}</span></a>`;
}

/* 교재 목차 — 현재 PART 는 절 목록까지 펼친다 */
export function sbVolume(vol, curPart) {
  let h = `<div class="sb__title">${esc(vol.title)}</div>
<a class="sb__cta" href="schedule.html">📅 8차시 교육 일정 보기</a>
<div class="sb__label">학습 목차</div>
${item('course.html', '교재 전체 개요', { on: curPart == null })}`;

  for (const p of vol.parts) {
    const on = String(p.num) === String(curPart);
    h += '\n' + item(`part-${p.num}.html`, p.title, { num: p.num, on, mark: `part-${p.num}` });
    if (on && (p.sections || []).length) {
      h += `\n<div class="sb__sub">${(p.sections || [])
        .map((s) => `<a href="#sec-${s.num}">${esc(s.num)}. ${esc(s.title)}</a>`).join('\n')}</div>`;
    }
  }
  return h;
}

export function sbTools(toolMenu, curId) {
  return `<div class="sb__title">AI 도구 가이드</div>
<div class="sb__label">무료 AI 도구</div>
${item('promptlab.html', '프롬프트 실습실', { on: curId === 'prompt' })}
${toolMenu.filter((t) => t.id !== 'prompt')
  .map((t) => item(`tool-${t.id}.html`, t.name, { on: t.id === curId })).join('\n')}`;
}

export function sbAbout(cur) {
  return `<div class="sb__title">소개</div>
<div class="sb__label">사이트 안내</div>
${item('about.html', '제작 의도', { on: cur === 'purpose' })}
${item('instructor.html', '강사 소개', { on: cur === 'instructor' })}
${item('company.html', '회사 소개', { on: cur === 'company' })}`;
}

export function sbAppendix(cats, cur) {
  return `<div class="sb__title">업무별 프롬프트 부록</div>
<div class="sb__label">분류</div>
${item('appendix.html', '전체 보기', { on: !cur })}
${cats.map((c) => item(`appendix.html#cat-${c.id}`, c.category, { on: c.id === cur })).join('\n')}`;
}

export function sbSimple(title, links, cur) {
  return `<div class="sb__title">${esc(title)}</div>
<div class="sb__label">바로가기</div>
${links.map(([href, label]) => item(href, label, { on: href === cur })).join('\n')}`;
}

/* --- 푸터 ------------------------------------------------------------- */
export function footer() {
  return `<footer class="ft">
  <div class="ft__in">
    <div class="ft__top">
      <a href="about.html">제작 의도</a>
      <a href="instructor.html">강사 소개</a>
      <a href="company.html">회사 소개</a>
      <a href="appendix.html">프롬프트 부록</a>
      <a href="dashboard.html">학습 진도</a>
    </div>
    <div class="ft__body">
      <strong>${esc(SITE.course)}</strong><br>
      농협사료 사무관리직 임직원 대상 · 1일 8차시 (08:00–17:00)<br>
      이론 30% + 실습 50% + 사례 20% · 무료 AI 도구 중심
      <p class="ft__note">
        이 사이트는 <strong>강의용 학습자료</strong>입니다. 네트워크 없이 동작하도록
        모든 스타일과 스크립트를 파일 안에 넣었고, 학습 진도는 이 브라우저에만 저장됩니다.
      </p>
    </div>
  </div>
</footer>`;
}
