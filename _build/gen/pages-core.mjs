/* 페이지 생성기 (1/2) — 홈 · 교재개요 · 차시 본문 · 일정 · 실습 · 진도 */
import { esc, renderBlocks } from './blocks.mjs';
import { SITE, sbVolume, sbSimple } from './shell.mjs';

const crumb = (items) => `<ol class="crumb">${items.map((it, i) =>
  i === items.length - 1 ? `<li>${esc(it[0])}</li>`
    : `<li><a href="${it[1]}">${esc(it[0])}</a></li>`).join('')}</ol>`;

const ph = (eyebrow, title, lead) => `<div class="ph">
${eyebrow ? `  <span class="ph__eyebrow">${esc(eyebrow)}</span>` : ''}
  <h1>${esc(title)}</h1>
${lead ? `  <p>${esc(lead)}</p>` : ''}
</div>`;

/* 파트 안의 실습·표 개수 — 원본 partStats 와 같은 셈법 */
function stats(p) {
  let ex = 0, tb = 0, n = (p.intro || []).length;
  const scan = (bs) => (bs || []).forEach((b) => {
    if (b.type === 'exercise') ex++; else if (b.type === 'table') tb++;
  });
  scan(p.intro);
  for (const s of p.sections || []) {
    n += (s.blocks || []).length; scan(s.blocks);
    for (const ss of s.subsections || []) { n += (ss.blocks || []).length; scan(ss.blocks); }
  }
  return { ex, tb, n };
}

/* ---------------- 홈 ---------------- */
export function home(d) {
  const vol = d.content[0];
  const tools = d.tools.tools;
  const plan = d.dayplans.dayPlans.course[1];

  return {
    key: 'home', file: 'index.html', mode: 'home',
    title: `${SITE.course} · 학습사이트`,
    desc: '농협사료 임직원 대상 1일 8차시 생성형 AI 실무 과정 학습사이트. 8차시 교재 · 실습 · AI 도구 가이드 · 업무별 프롬프트 부록.',
    sidebar: sbVolume(vol, null),
    body: `
<section class="hero">
  <div class="hero__in">
    <span class="hero__tag">농협사료 임직원 교육 · 1일 8차시</span>
    <h1>${esc(vol.title)}</h1>
    <p>${esc(vol.subtitle || SITE.sub)}</p>
    <div class="hero__cta">
      <a class="btn btn--gold" href="part-1.html">1차시부터 시작하기</a>
      <a class="btn btn--white" href="schedule.html">교육 일정 보기</a>
    </div>
    <ul class="hero__meta">
      <li><b>08:00–17:00</b><span>점심 1시간 제외</span></li>
      <li><b>8차시</b><span>이론 30 · 실습 50 · 사례 20</span></li>
      <li><b>무료 도구</b><span>ChatGPT · Claude · Gemini 외</span></li>
    </ul>
  </div>
</section>

<div class="main"><div class="wrap wrap--wide">
  <h2 class="sec-h"><span class="sec-h__n">1</span>8차시 커리큘럼</h2>
  <div class="grid g2">
    ${vol.parts.map((p) => {
      const s = stats(p);
      return `<a class="card part-card" href="part-${p.num}.html" data-done-mark="part-${p.num}">
      <div class="part-card__n">${p.num}차시</div>
      <h3>${esc(p.title)}</h3>
      <p class="part-card__badges">
        <span class="bdg bdg--gray">본문 ${s.n}</span>
        ${s.ex ? `<span class="bdg bdg--green">실습 ${s.ex}</span>` : ''}
        ${s.tb ? `<span class="bdg bdg--gold">표 ${s.tb}</span>` : ''}
      </p>
    </a>`;
    }).join('\n    ')}
  </div>

  <h2 class="sec-h"><span class="sec-h__n">2</span>이 과정에서 쓰는 무료 AI 도구</h2>
  <div class="grid g3">
    ${tools.map((t) => `<a class="card" href="tool-${t.id}.html">
      <h3>${esc(t.name)} <span class="bdg bdg--gray">${esc(t.vendor)}</span></h3>
      <p>${esc(t.tagline)}</p>
    </a>`).join('\n    ')}
  </div>

  <h2 class="sec-h"><span class="sec-h__n">3</span>바로가기</h2>
  <div class="grid g4">
    <a class="card" href="promptlab.html"><h3>프롬프트 실습실</h3><p>5요소로 프롬프트를 쓰고 점수로 확인한다.</p></a>
    <a class="card" href="labs.html"><h3>실습 모음</h3><p>8차시 실습을 단계별 지시문으로 정리했다.</p></a>
    <a class="card" href="appendix.html"><h3>업무별 프롬프트</h3><p>메일·보고서·회의록 등 바로 쓰는 예제.</p></a>
    <a class="card" href="dashboard.html"><h3>학습 진도</h3><p>어디까지 봤는지 이 브라우저에 기록된다.</p></a>
  </div>

  <h2 class="sec-h"><span class="sec-h__n">4</span>하루 흐름</h2>
  <div class="table-wrap"><table class="tl">
    <thead><tr><th>차시</th><th>시간</th><th>구분</th><th>주제</th></tr></thead>
    <tbody>${(plan.blocks || []).map((b) => `<tr>
      <td class="c"><b>${esc(b.period)}</b></td>
      <td class="c nowrap">${esc(b.start)}–${esc(b.end)}</td>
      <td class="c"><span class="bdg ${b.type === '실습' ? 'bdg--gold' : 'bdg--green'}">${esc(b.type)}</span></td>
      <td>${esc(b.title)}</td></tr>`).join('')}</tbody>
  </table></div>
  <p style="margin-top:14px"><a class="btn btn--line btn--sm" href="schedule.html">자세한 일정 보기 →</a></p>
</div></div>`,
    noMainWrap: true,
    style: `
.hero{background:linear-gradient(135deg,var(--b900) 0%,var(--b800) 45%,var(--b600) 100%);
  color:#fff; padding:56px 28px 60px; position:relative; overflow:hidden}
.hero::after{content:""; position:absolute; right:-90px; top:-90px; width:340px; height:340px;
  border-radius:50%; background:rgba(254,194,13,.12)}
.hero__in{position:relative; z-index:1; max-width:1180px; margin:0 auto}
.hero__tag{display:inline-block; padding:5px 13px; border-radius:var(--pill);
  background:rgba(255,255,255,.16); font-size:12.5px; font-weight:800; margin-bottom:14px}
.hero h1{font-size:38px; font-weight:800; letter-spacing:-.035em; line-height:1.28; max-width:20ch}
.hero p{margin-top:12px; font-size:17px; color:rgba(255,255,255,.9); max-width:52ch}
.hero__cta{display:flex; flex-wrap:wrap; gap:10px; margin-top:26px}
.hero__meta{display:flex; flex-wrap:wrap; gap:12px 32px; margin-top:32px;
  padding-top:22px; border-top:1px solid rgba(255,255,255,.18)}
.hero__meta b{display:block; font-size:19px; font-weight:800; color:var(--s300)}
.hero__meta span{font-size:13px; color:rgba(255,255,255,.75)}
.part-card__n{font-size:12px; font-weight:800; color:var(--b600); margin-bottom:5px}
.part-card__badges{display:flex; flex-wrap:wrap; gap:6px; margin-top:12px}
.part-card.is-done{border-color:var(--b400); background:var(--b50)}
.part-card.is-done .part-card__n::after{content:" ✓ 완료"; color:var(--b600)}
.tl{background:#fff; border:1px solid var(--g200); border-radius:var(--radius); overflow:hidden; min-width:560px}
.tl thead th{background:var(--b800); color:#fff; padding:11px 13px; text-align:left; font-size:13.5px}
.tl td{padding:11px 13px; border-top:1px solid var(--g100); font-size:14px}
.tl .c{text-align:center}
.tl .nowrap{white-space:nowrap; color:var(--g500)}
@media (max-width:900px){ .hero{padding:40px 20px 46px} .hero h1{font-size:26px} .hero p{font-size:15px} }
@media (max-width:640px){ .hero h1{font-size:22px} .hero__cta .btn{width:auto; flex:1} }`,
  };
}

/* ---------------- 교재 전체 개요 ---------------- */
export function courseOverview(d) {
  const vol = d.content[0];
  return {
    key: 'course', file: 'course.html', mode: 'vol',
    title: `교재 개요 · ${SITE.short}`,
    desc: '8차시 교재의 전체 구성과 각 차시 학습 범위.',
    sidebar: sbVolume(vol, null),
    body: `${crumb([['홈', 'index.html'], ['교재 개요']])}
${ph(vol.label || '본 과정', vol.title, vol.subtitle)}
${renderBlocks(vol.intro)}

<h2 class="sec-h"><span class="sec-h__n">■</span>차시별 구성</h2>
<div class="grid g2">
${vol.parts.map((p) => {
  const s = stats(p);
  return `  <a class="card" href="part-${p.num}.html" data-done-mark="part-${p.num}">
    <div style="font-size:12px;font-weight:800;color:var(--b600);margin-bottom:5px">${p.num}차시</div>
    <h3>${esc(p.title)}</h3>
    <p style="display:flex;flex-wrap:wrap;gap:6px;margin-top:11px">
      <span class="bdg bdg--gray">절 ${(p.sections || []).length}</span>
      <span class="bdg bdg--gray">본문 ${s.n}</span>
      ${s.ex ? `<span class="bdg bdg--green">실습 ${s.ex}</span>` : ''}
      ${s.tb ? `<span class="bdg bdg--gold">표 ${s.tb}</span>` : ''}
    </p>
  </a>`;
}).join('\n')}
</div>`,
  };
}

/* ---------------- 차시 본문 ---------------- */
export function partPage(d, p) {
  const vol = d.content[0];
  const prev = vol.parts.find((x) => Number(x.num) === Number(p.num) - 1);
  const next = vol.parts.find((x) => Number(x.num) === Number(p.num) + 1);

  const sections = (p.sections || []).map((s) => `
<section id="sec-${esc(s.num)}">
  <h2 class="sec-h"><span class="sec-h__n">${esc(s.num)}</span>${esc(s.title)}</h2>
  ${renderBlocks(s.blocks)}
  ${(s.subsections || []).map((ss) => `
  <h3 class="sub-h" id="sub-${esc(ss.num)}">${esc(ss.num)} ${esc(ss.title)}</h3>
  ${renderBlocks(ss.blocks)}`).join('\n')}
</section>`).join('\n');

  return {
    key: `part-${p.num}`, file: `part-${p.num}.html`, mode: 'vol',
    title: `${p.num}차시 · ${p.title} — ${SITE.short}`,
    desc: `${p.num}차시: ${p.title}`,
    sidebar: sbVolume(vol, p.num),
    body: `${crumb([['홈', 'index.html'], ['교재', 'course.html'], [`${p.num}차시`]])}
${ph(`${p.num}차시`, p.title)}
${renderBlocks(p.intro)}
${sections}

<div class="done-bar">
  <button class="done-btn" type="button" data-done="part-${p.num}" aria-pressed="false">학습 완료로 표시</button>
  <span class="muted" style="font-size:13px;color:var(--g400)">이 브라우저에만 저장됩니다.</span>
</div>

<nav class="pn" aria-label="차시 이동">
  ${prev ? `<a class="pn__a" href="part-${prev.num}.html"><span>← ${prev.num}차시</span><b>${esc(prev.title)}</b></a>` : '<span></span>'}
  ${next ? `<a class="pn__a pn__a--r" href="part-${next.num}.html"><span>${next.num}차시 →</span><b>${esc(next.title)}</b></a>` : '<span></span>'}
</nav>`,
    style: `
.pn{display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:22px}
.pn__a{display:block; padding:15px 18px; border-radius:var(--radius);
  border:1px solid var(--g200); background:#fff; transition:border-color .2s var(--ease)}
.pn__a:hover{border-color:var(--b400)}
.pn__a span{display:block; font-size:12px; font-weight:800; color:var(--b600); margin-bottom:3px}
.pn__a b{font-size:14px; color:var(--g700); font-weight:700; line-height:1.5}
.pn__a--r{text-align:right}
@media (max-width:640px){ .pn{grid-template-columns:1fr} .pn__a--r{text-align:left} }`,
  };
}

/* ---------------- 일정 ---------------- */
export function schedule(d) {
  const plan = d.dayplans.dayPlans.course[1];
  return {
    key: 'schedule', file: 'schedule.html', mode: 'schedule',
    title: `교육 일정 · ${SITE.short}`,
    desc: '1일 8차시 교육 운영안 — 차시별 시간·구분·주제·세부내용.',
    sidebar: sbSimple('교육 일정', [
      ['schedule.html', '1일 8차시 운영안'], ['labs.html', '실습 모음'],
      ['course.html', '교재 개요'],
    ], 'schedule.html'),
    body: `${crumb([['홈', 'index.html'], ['교육 일정']])}
${ph('운영안', plan.title, '08:00 – 17:00 · 점심 1시간 제외 · 학습과 실습을 번갈아 진행합니다.')}

<ol class="tml">
${(plan.blocks || []).map((b) => `  <li class="tml__i${b.star ? ' star' : ''}">
    <div class="tml__time"><b>${esc(b.period)}</b><span>${esc(b.start)}–${esc(b.end)}</span></div>
    <div class="tml__body">
      <div class="tml__h">
        <span class="bdg ${b.type === '실습' ? 'bdg--gold' : 'bdg--green'}">${esc(b.type)}</span>
        <h3>${esc(b.title)}</h3>
      </div>
      <p>${esc(b.desc)}</p>
      ${b.partRef ? `<a class="b-link" href="part-${String(b.partRef).split('/').pop()}.html">해당 차시 교재 보기 →</a>` : ''}
    </div>
  </li>`).join('\n')}
</ol>`,
    style: `
.tml{position:relative; padding-left:20px; margin-top:8px}
.tml::before{content:""; position:absolute; left:5px; top:10px; bottom:10px; width:2px; background:var(--g200)}
.tml__i{position:relative; display:grid; grid-template-columns:104px 1fr; gap:18px; padding:14px 0}
.tml__i::before{content:""; position:absolute; left:-19px; top:24px; width:12px; height:12px;
  border-radius:50%; background:#fff; border:3px solid var(--b500)}
.tml__i.star::before{border-color:var(--s400)}
.tml__time b{display:block; font-size:15px; font-weight:800; color:var(--b800)}
.tml__time span{font-size:12.5px; color:var(--g400); white-space:nowrap}
.tml__body{background:#fff; border:1px solid var(--g200); border-radius:var(--radius); padding:16px 18px}
.tml__h{display:flex; flex-wrap:wrap; align-items:center; gap:9px; margin-bottom:7px}
.tml__h h3{font-size:16px; font-weight:800; color:var(--g900)}
.tml__body p{font-size:14.5px; color:var(--g500); line-height:1.8}
@media (max-width:640px){
  .tml__i{grid-template-columns:1fr; gap:8px}
  .tml__time{display:flex; align-items:baseline; gap:9px}
}`,
  };
}

/* ---------------- 실습 모음 ---------------- */
export function labs(d) {
  const L = d.labs.labsByVol.course;
  return {
    key: 'labs', file: 'labs.html', mode: 'labs',
    title: `실습 모음 · ${SITE.short}`,
    desc: '8차시 실습을 단계별 지시문과 기대 결과로 정리했습니다.',
    sidebar: sbSimple('실습 모음', [
      ['labs.html', '전체 실습'], ['promptlab.html', '프롬프트 실습실'],
      ['appendix.html', '업무별 프롬프트'],
    ], 'labs.html'),
    body: `${crumb([['홈', 'index.html'], ['실습 모음']])}
${ph('Labs', '실습 모음', L.title)}

${(L.days || []).map((day) => `
<section id="day-${day.day}">
  <h2 class="sec-h"><span class="sec-h__n">${day.day}</span>${esc(day.subject)}</h2>
  ${(day.labs || []).map((lb) => `
  <article class="lab">
    <div class="lab__h">
      <span class="bdg bdg--solid">${esc(lb.code)}</span>
      <h3>${esc(lb.title)}</h3>
    </div>
    <ul class="lab__meta">
      <li><b>수준</b>${esc(lb.level)}</li>
      <li><b>도구</b>${esc(lb.tool)}</li>
      <li><b>시간</b>${esc(lb.duration)}</li>
    </ul>
    <p class="lab__goal"><b>목표</b> ${esc(lb.goal)}</p>
    ${(lb.steps || []).length ? `<div class="table-wrap"><table class="lab__steps">
      <thead><tr><th style="width:64px">시간</th><th>진행</th><th style="width:32%">기대 결과</th></tr></thead>
      <tbody>${lb.steps.map((s) => `<tr>
        <td class="c">${esc(s.time || '')}</td>
        <td class="cell-pre">${esc(s.instruction || '')}</td>
        <td class="cell-pre">${esc(s.expected || '')}</td></tr>`).join('')}</tbody>
    </table></div>` : ''}
    ${lb.output ? `<p class="lab__out"><b>산출물</b> ${esc(lb.output)}</p>` : ''}
    <a class="b-link" href="part-${day.day}.html">${day.day}차시 교재 보기 →</a>
  </article>`).join('\n')}
</section>`).join('\n')}`,
    style: `
.lab{margin:16px 0 26px; border:1px solid var(--g200); border-radius:var(--radius);
  background:#fff; padding:18px 20px}
.lab__h{display:flex; flex-wrap:wrap; align-items:center; gap:10px; margin-bottom:11px}
.lab__h h3{font-size:16.5px; font-weight:800; color:var(--g900); line-height:1.45}
.lab__meta{display:flex; flex-wrap:wrap; gap:8px 18px; margin-bottom:11px;
  padding-bottom:11px; border-bottom:1px dashed var(--g200); font-size:13px; color:var(--g500)}
.lab__meta b{color:var(--b700); font-weight:800; margin-right:6px}
.lab__goal{font-size:14.5px; color:var(--g600); margin-bottom:13px; line-height:1.8}
.lab__goal b,.lab__out b{color:var(--b700); font-weight:800; margin-right:5px}
.lab__out{margin-top:11px; padding:11px 14px; border-radius:10px;
  background:var(--s50); color:#713f12; font-size:14px}
.lab__steps{min-width:600px; font-size:13.5px}
.lab__steps thead th{background:var(--b700); color:#fff; padding:9px 12px; text-align:left; font-weight:700}
.lab__steps td{padding:10px 12px; border-top:1px solid var(--g100); vertical-align:top; color:var(--g600)}
.lab__steps .c{text-align:center; white-space:nowrap; color:var(--g500)}
.lab__steps tbody tr:nth-child(even){background:var(--g50)}`,
  };
}

/* ---------------- 학습 진도 ---------------- */
export function dashboard(d) {
  const vol = d.content[0];
  return {
    key: 'dash', file: 'dashboard.html', mode: 'dash',
    title: `학습 진도 · ${SITE.short}`,
    desc: '어디까지 학습했는지 확인합니다. 진도는 이 브라우저에만 저장됩니다.',
    sidebar: sbVolume(vol, null),
    body: `${crumb([['홈', 'index.html'], ['학습 진도']])}
${ph('Progress', '학습 진도', '완료 표시는 이 브라우저(localStorage)에만 저장됩니다. 서버로 보내지 않습니다.')}

<div class="card" style="margin-bottom:22px">
  <div style="display:flex;align-items:baseline;gap:10px;margin-bottom:11px">
    <b style="font-size:30px;color:var(--b700);font-weight:800" data-pct>0%</b>
    <span style="font-size:14px;color:var(--g500)"><b data-cnt>0</b> / ${vol.parts.length}차시 완료</span>
  </div>
  <div class="prog"><div class="prog__fill" data-fill style="width:0%"></div></div>
</div>

<div class="grid g2">
${vol.parts.map((p) => `  <div class="card dash-i" data-row="part-${p.num}">
    <div style="display:flex;align-items:center;gap:10px">
      <span class="dash-i__n">${p.num}</span>
      <h3 style="flex:1"><a href="part-${p.num}.html">${esc(p.title)}</a></h3>
      <span class="dash-i__s">미완료</span>
    </div>
  </div>`).join('\n')}
</div>

<div class="done-bar" style="margin-top:24px">
  <button class="btn btn--line btn--sm" type="button" data-reset>진도 기록 지우기</button>
  <span style="font-size:13px;color:var(--g400)">되돌릴 수 없습니다.</span>
</div>`,
    style: `
.dash-i__n{flex:none; display:grid; place-items:center; width:30px; height:30px; border-radius:8px;
  background:var(--g100); color:var(--g500); font-size:13px; font-weight:800}
.dash-i h3{font-size:15px; font-weight:700; color:var(--g700); line-height:1.5}
.dash-i__s{flex:none; font-size:12px; font-weight:800; color:var(--g400)}
.dash-i.on{border-color:var(--b400); background:var(--b50)}
.dash-i.on .dash-i__n{background:var(--b600); color:#fff}
.dash-i.on .dash-i__s{color:var(--b600)}`,
    script: `
(function () {
  var $ = NH.$, $$ = NH.$$;
  var total = ${vol.parts.length};
  function paint() {
    var p = NH.readProgress(), n = 0;
    $$('[data-row]').forEach(function (el) {
      var on = !!p[el.dataset.row];
      if (on) n++;
      el.classList.toggle('on', on);
      $('.dash-i__s', el).textContent = on ? '✓ 완료' : '미완료';
    });
    var pct = total ? Math.round((n / total) * 100) : 0;
    $('[data-pct]').textContent = pct + '%';
    $('[data-cnt]').textContent = n;
    $('[data-fill]').style.width = pct + '%';
  }
  $('[data-reset]').addEventListener('click', function () {
    if (!confirm('진도 기록을 모두 지웁니다. 계속할까요?')) return;
    localStorage.removeItem(NH.STORE);
    paint();
  });
  paint();
})();`,
  };
}
