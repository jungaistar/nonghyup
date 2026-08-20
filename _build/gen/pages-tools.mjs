/* 페이지 생성기 (2/2) — AI 도구 · 프롬프트 실습실 · 소개 · 강사 · 회사 · 부록 */
import { esc, renderBlock } from './blocks.mjs';
import { SITE, sbTools, sbAbout, sbAppendix } from './shell.mjs';
import { scoringSection, SCORING_STYLE, scoringScript } from './scoring.mjs';

const crumb = (items) => `<ol class="crumb">${items.map((it, i) =>
  i === items.length - 1 ? `<li>${esc(it[0])}</li>`
    : `<li><a href="${it[1]}">${esc(it[0])}</a></li>`).join('')}</ol>`;

const ph = (eyebrow, title, lead) => `<div class="ph">
${eyebrow ? `  <span class="ph__eyebrow">${esc(eyebrow)}</span>` : ''}
  <h1>${esc(title)}</h1>
${lead ? `  <p>${esc(lead)}</p>` : ''}
</div>`;

const prompt = (text, caption) => renderBlock({ type: 'promptbox', text, caption });
const ul = (items, cls = 'b-bullets') =>
  `<ul class="${cls}">${(items || []).map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`;

/* 차시 링크(/vol/course/part/5 → part-5.html) */
const refHref = (to) => `part-${String(to).split('/').pop()}.html`;

/* ---------------- AI 도구 홈 ---------------- */
export function toolsHome(d) {
  const { tools, toolMenu, promptGuide } = d.tools;
  return {
    key: 'tools', file: 'tools.html', mode: 'tools',
    title: `AI 도구 가이드 · ${SITE.short}`,
    desc: '이 과정에서 쓰는 무료 AI 도구 6종과 프롬프트 작성법 가이드.',
    sidebar: sbTools(toolMenu, null),
    body: `${crumb([['홈', 'index.html'], ['AI 도구']])}
${ph('Tools', 'AI 도구 가이드', '별도 유료 구독 없이 쓸 수 있는 무료 도구를 중심으로 정리했습니다.')}

<a class="card tool-lead" href="promptlab.html">
  <h3>${esc(promptGuide.name)}</h3>
  <p>${esc(promptGuide.tagline)}</p>
  <span class="bdg bdg--gold">프롬프트 실습실 열기 →</span>
</a>

<h2 class="sec-h"><span class="sec-h__n">■</span>무료 AI 도구 ${tools.length}종</h2>
<div class="grid g2">
${tools.map((t) => `  <a class="card" href="tool-${t.id}.html">
    <h3>${esc(t.name)} <span class="bdg bdg--gray">${esc(t.vendor)}</span></h3>
    <p>${esc(t.tagline)}</p>
    <p style="margin-top:11px"><span class="bdg bdg--green">강점 ${(t.strengths || []).length}</span>
      <span class="bdg bdg--gray">실습 ${(t.practices || []).length}</span>
      <span class="bdg bdg--gray">사례 ${(t.cases || []).length}</span></p>
  </a>`).join('\n')}
</div>`,
    style: `
.tool-lead{display:block; background:linear-gradient(135deg,var(--b800),var(--b600)); color:#fff; border:0}
.tool-lead h3{color:#fff; font-size:19px}
.tool-lead p{color:rgba(255,255,255,.88); font-size:14.5px; margin-bottom:12px}`,
  };
}

/* ---------------- 도구 상세 ---------------- */
export function toolPage(d, t) {
  const { toolMenu } = d.tools;
  const S = (n, title, inner) => inner
    ? `<h2 class="sec-h" id="${n}"><span class="sec-h__n">■</span>${esc(title)}</h2>\n${inner}` : '';

  const cards = (arr, keyT, keyD) => arr && arr.length
    ? `<div class="grid g2">${arr.map((x) => `<div class="card"><h3>${esc(x[keyT])}</h3>
       <p>${esc(x[keyD])}</p></div>`).join('')}</div>` : '';

  return {
    key: `tool-${t.id}`, file: `tool-${t.id}.html`, mode: 'tools',
    title: `${t.name} · ${SITE.short}`,
    desc: t.tagline,
    sidebar: sbTools(toolMenu, t.id),
    body: `${crumb([['홈', 'index.html'], ['AI 도구', 'tools.html'], [t.name]])}
${ph(t.vendor, t.name, t.tagline)}
<p class="b-para" style="white-space:pre-line">${esc(t.overview)}</p>

${S('strengths', '강점', ul(t.strengths))}
${S('start', '시작하기', (t.gettingStarted || []).length
  ? `<ol class="steps">${t.gettingStarted.map((s) => `<li>${esc(s)}</li>`).join('')}</ol>` : '')}
${S('plans', '요금제', (t.plans || []).length
  ? `<div class="table-wrap"><table class="b-table__t"><thead><tr><th>구분</th><th>가격</th><th>내용</th></tr></thead>
     <tbody>${t.plans.map((p) => `<tr><td><b>${esc(p.name)}</b></td><td class="nowrap">${esc(p.price)}</td><td>${esc(p.desc)}</td></tr>`).join('')}</tbody></table></div>` : '')}
${S('features', '주요 기능', cards(t.features, 'title', 'desc'))}
${S('guide', '기능별 사용법', (t.featureGuides || []).length
  ? t.featureGuides.map((g) => `<div class="card" style="margin-bottom:14px">
      <h3>${esc(g.name)}</h3>
      <p><b style="color:var(--b700)">무엇</b> ${esc(g.what)}</p>
      ${g.how ? `<p style="margin-top:7px"><b style="color:var(--b700)">방법</b> ${esc(g.how)}</p>` : ''}
      ${g.tip ? `<p style="margin-top:7px"><b style="color:var(--s700)">Tip</b> ${esc(g.tip)}</p>` : ''}
    </div>`).join('') : '')}
${S('usecases', '사무관리 활용', cards(t.useCases, 'title', 'desc'))}
${S('practices', '실습', (t.practices || []).map((p) => `
  <article class="lab">
    <div class="lab__h"><span class="bdg bdg--solid">${esc(p.level)}</span><h3>${esc(p.title)}</h3></div>
    <p class="lab__goal"><b>목표</b> ${esc(p.goal)}</p>
    ${(p.steps || []).length ? `<ol class="steps">${p.steps.map((s) => `<li>${esc(s)}</li>`).join('')}</ol>` : ''}
    ${p.output ? `<p class="lab__out"><b>산출물</b> ${esc(p.output)}</p>` : ''}
  </article>`).join('\n'))}
${S('prompts', '추천 프롬프트', (t.recommendedPrompts || [])
  .map((p) => prompt(p.prompt, p.title)).join('\n'))}
${S('cases', '활용 사례', (t.cases || []).map((c) => `<div class="card" style="margin-bottom:14px">
    <h3>${esc(c.title)} <span class="bdg bdg--gray">${esc(c.sector || '')}</span></h3>
    <p><b style="color:#b45309">문제</b> ${esc(c.problem)}</p>
    <p style="margin-top:7px"><b style="color:var(--b700)">해결</b> ${esc(c.solution)}</p>
    ${c.result ? `<p style="margin-top:7px"><b style="color:var(--b700)">결과</b> ${esc(c.result)}</p>` : ''}
  </div>`).join(''))}
${S('tips', '프롬프트 요령', ul(t.promptTips))}
${S('limits', '한계와 유의점', ul(t.limits))}
${S('links', '링크', (t.links || []).map((l) =>
  `<a class="b-link" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)} ↗</a>`).join(''))}
${S('refs', '본 과정 연계', (t.courseRefs || []).map((r) =>
  `<a class="b-link" href="${refHref(r.to)}">${esc(r.label)} →</a>`).join(''))}`,
    style: `
.steps{counter-reset:st; margin:14px 0 18px}
.steps li{counter-increment:st; position:relative; padding-left:32px; margin-bottom:9px;
  font-size:14.5px; line-height:1.8; color:var(--g600)}
.steps li::before{content:counter(st); position:absolute; left:0; top:.15em;
  display:grid; place-items:center; width:22px; height:22px; border-radius:50%;
  background:var(--b600); color:#fff; font-size:12px; font-weight:800}
.b-table__t{background:#fff; border:1px solid var(--g200); border-radius:var(--radius);
  overflow:hidden; min-width:480px; font-size:14px}
.b-table__t thead th{background:var(--b800); color:#fff; padding:10px 13px; text-align:left}
.b-table__t td{padding:10px 13px; border-top:1px solid var(--g100); color:var(--g600)}
.b-table__t .nowrap{white-space:nowrap}
.lab{margin:14px 0 22px; border:1px solid var(--g200); border-radius:var(--radius); background:#fff; padding:18px 20px}
.lab__h{display:flex; flex-wrap:wrap; align-items:center; gap:10px; margin-bottom:11px}
.lab__h h3{font-size:16px; font-weight:800; color:var(--g900)}
.lab__goal{font-size:14.5px; color:var(--g600); line-height:1.8}
.lab__goal b,.lab__out b{color:var(--b700); font-weight:800; margin-right:5px}
.lab__out{margin-top:10px; padding:11px 14px; border-radius:10px; background:var(--s50); color:#713f12; font-size:14px}`,
  };
}

/* ---------------- 프롬프트 실습실 ---------------- */
export function promptLab(d) {
  const P = d.promptLab, { toolMenu, promptGuide } = d.tools;
  return {
    key: 'prompt', file: 'promptlab.html', mode: 'tools',
    title: `프롬프트 실습실 · ${SITE.short}`,
    desc: '프롬프트 5요소 · 점수 기준 · 업무별 예제 라이브러리 · 따라하기 실습.',
    sidebar: sbTools(toolMenu, 'prompt'),
    body: `${crumb([['홈', 'index.html'], ['AI 도구', 'tools.html'], ['프롬프트 실습실']])}
${ph('Prompt Lab', promptGuide.name, promptGuide.tagline)}
<p class="b-para" style="white-space:pre-line">${esc(promptGuide.overview)}</p>
${scoringSection(P)}

<h2 class="sec-h" id="score"><span class="sec-h__n">2</span>좋은 프롬프트의 5요소</h2>
<div class="grid g2">
${(P.scoreCriteria || []).map((c) => `  <div class="card">
    <h3>${esc(c.code)} · ${esc(c.key)} <span class="bdg bdg--green">${c.max}점</span></h3>
    <p>${esc(c.desc)}</p>
    ${c.detail ? `<p style="margin-top:8px;color:var(--g400);font-size:13.5px">${esc(c.detail)}</p>` : ''}
  </div>`).join('\n')}
</div>

<h2 class="sec-h" id="grade"><span class="sec-h__n">3</span>점수 기준</h2>
<div class="table-wrap"><table class="b-table__t">
  <thead><tr><th>등급</th><th>점수</th><th>평가</th><th>설명</th></tr></thead>
  <tbody>${(P.gradeTable || []).map((g) => `<tr><td><b>${esc(g.grade)}</b></td>
    <td class="nowrap">${esc(g.range)}</td><td>${esc(g.label)}</td><td>${esc(g.desc)}</td></tr>`).join('')}</tbody>
</table></div>

<h2 class="sec-h" id="tech"><span class="sec-h__n">4</span>고급 기법</h2>
<div class="grid g2">
${(P.techniques || []).map((t) => `  <div class="card"><h3>${esc(t.title)}</h3><p>${esc(t.desc)}</p></div>`).join('\n')}
</div>

<h2 class="sec-h" id="mistake"><span class="sec-h__n">5</span>흔한 실수</h2>
${(P.commonMistakes || []).map((m) => `<div class="card" style="margin-bottom:13px">
  <p><b style="color:#c2410c">이렇게 쓰면</b> ${esc(m.bad)}</p>
  <p style="margin-top:7px"><b style="color:var(--g500)">왜</b> ${esc(m.why)}</p>
  <p style="margin-top:7px"><b style="color:var(--b700)">이렇게</b> ${esc(m.fix)}</p>
</div>`).join('')}

<h2 class="sec-h" id="lib"><span class="sec-h__n">6</span>업무별 프롬프트 라이브러리</h2>
${(P.promptLibrary || []).map((g) => `<h3 class="sub-h">${esc(g.subject)}</h3>
${(g.prompts || []).map((p) => prompt(p.prompt || p.text || '', p.title)).join('\n')}`).join('\n')}

<h2 class="sec-h" id="follow"><span class="sec-h__n">7</span>따라하기 실습</h2>
${(P.followTutorials || []).map((t) => `<article class="lab">
  <div class="lab__h"><span class="bdg bdg--solid">${esc(t.level)}</span><h3>${esc(t.title)}</h3>
    <span class="bdg bdg--gray">${esc(t.tool)}</span></div>
  <p class="lab__goal"><b>목표</b> ${esc(t.goal)}</p>
  ${(t.steps || []).length ? `<ol class="steps">${t.steps.map((s) =>
    `<li>${esc(typeof s === 'string' ? s : (s.instruction || s.text || ''))}</li>`).join('')}</ol>` : ''}
</article>`).join('\n')}

<h2 class="sec-h" id="sc"><span class="sec-h__n">8</span>업무 상황별 연습</h2>
${(P.scenarios || []).map((s) => `<div class="card" style="margin-bottom:13px">
  <h3>${esc(s.title)} <span class="bdg bdg--gray">${esc(s.category)}</span></h3>
  <p><b style="color:var(--b700)">상황</b> ${esc(s.situation)}</p>
  <p style="margin-top:7px"><b style="color:var(--b700)">목표</b> ${esc(s.goal)}</p>
</div>`).join('')}`,
    style: `
.steps{counter-reset:st; margin:14px 0 18px}
.steps li{counter-increment:st; position:relative; padding-left:32px; margin-bottom:9px;
  font-size:14.5px; line-height:1.8; color:var(--g600)}
.steps li::before{content:counter(st); position:absolute; left:0; top:.15em;
  display:grid; place-items:center; width:22px; height:22px; border-radius:50%;
  background:var(--b600); color:#fff; font-size:12px; font-weight:800}
.b-table__t{background:#fff; border:1px solid var(--g200); border-radius:var(--radius);
  overflow:hidden; min-width:480px; font-size:14px}
.b-table__t thead th{background:var(--b800); color:#fff; padding:10px 13px; text-align:left}
.b-table__t td{padding:10px 13px; border-top:1px solid var(--g100); color:var(--g600)}
.b-table__t .nowrap{white-space:nowrap}
.lab{margin:14px 0 22px; border:1px solid var(--g200); border-radius:var(--radius); background:#fff; padding:18px 20px}
.lab__h{display:flex; flex-wrap:wrap; align-items:center; gap:10px; margin-bottom:11px}
.lab__h h3{font-size:16px; font-weight:800; color:var(--g900)}
.lab__goal{font-size:14.5px; color:var(--g600); line-height:1.8}
.lab__goal b{color:var(--b700); font-weight:800; margin-right:5px}` + SCORING_STYLE,
    script: scoringScript(P),
  };
}

/* ---------------- 부록 ---------------- */
export function appendix(d) {
  const { appendix: cats, appendixIntro: intro } = d.appendix;
  return {
    key: 'appendix', file: 'appendix.html', mode: 'appendix',
    title: `업무별 프롬프트 부록 · ${SITE.short}`,
    desc: intro.lead,
    sidebar: sbAppendix(cats, null),
    body: `${crumb([['홈', 'index.html'], ['부록']])}
${ph('Appendix', intro.title, intro.lead)}

<div class="b-obj">
  <div class="b-obj__t"><span aria-hidden="true">📋</span>쓰는 법</div>
  <ul>${(intro.howto || []).map((h) => `<li>${esc(h)}</li>`).join('')}</ul>
</div>

${cats.map((c) => `
<section id="cat-${esc(c.id)}">
  <h2 class="sec-h"><span class="sec-h__n">■</span>${esc(c.category)}</h2>
  <p class="b-para">${esc(c.desc)}</p>
  ${(c.prompts || []).map((p) => `
  <div class="apx">
    <div class="apx__h">
      <h3>${esc(p.title)}</h3>
      ${p.grade ? `<span class="bdg bdg--gold">${esc(p.grade)} ${p.total ?? ''}점</span>` : ''}
    </div>
    ${p.when ? `<p class="apx__when"><b>언제</b> ${esc(p.when)}</p>` : ''}
    ${prompt(p.prompt, null)}
    ${p.strength ? `<p class="apx__why"><b>왜 좋은 프롬프트인가</b> ${esc(p.strength)}</p>` : ''}
    ${p.fillGuide ? `<p class="apx__why"><b>채우는 법</b> ${esc(p.fillGuide)}</p>` : ''}
  </div>`).join('\n')}
</section>`).join('\n')}`,
    style: `
.apx{margin:16px 0 24px; padding:18px 20px; border:1px solid var(--g200);
  border-radius:var(--radius); background:#fff}
.apx__h{display:flex; flex-wrap:wrap; align-items:center; gap:10px; margin-bottom:10px}
.apx__h h3{font-size:16px; font-weight:800; color:var(--g900)}
.apx__when{font-size:14px; color:var(--g500); margin-bottom:6px}
.apx__when b,.apx__why b{color:var(--b700); font-weight:800; margin-right:6px}
.apx__why{margin-top:11px; padding:11px 14px; border-radius:10px;
  background:var(--b50); color:var(--b900); font-size:14px; line-height:1.8}`,
  };
}
