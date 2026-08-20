/* ==========================================================================
   프롬프트 자동 채점 — 원본 promptLab.js 의 evaluatePrompt() 를
   React 없이 브라우저에서 그대로 돌도록 옮긴 것.
   점수 배분(각 20점)·가점 조건·피드백 문구·등급 구간을 원본과 동일하게 유지한다.
   ========================================================================== */
import { esc } from './blocks.mjs';

/* 데이터를 <script> 안에 안전하게 심는다 ( </script> 조기 종료 방지 ) */
const json = (v) => JSON.stringify(v).replace(/</g, '\\u003c');

export function scoringSection(P) {
  const sc = P.scoreCriteria || [];
  const sample = P.scoreSample || {};

  return `
<h2 class="sec-h" id="score-lab"><span class="sec-h__n">1</span>프롬프트 자동 채점</h2>
<p class="b-para">아래에 프롬프트를 직접 써 보세요. 5요소(역할 · 맥락 · 과제 · 제약 · 출력형식)를
얼마나 갖췄는지 <b>100점 만점</b>으로 즉시 채점합니다. 채점은 이 브라우저 안에서만
이뤄지고 어디로도 전송되지 않습니다.</p>

<div class="lab-box">
  <div class="lab-box__pick">
    <label for="sc-sel"><b>업무 상황 고르기</b></label>
    <select class="sel" id="sc-sel" data-sc-sel></select>
  </div>

  <div class="sc-brief" data-sc-brief></div>

  <label class="sr-only" for="sc-input">프롬프트 입력</label>
  <textarea class="ta" id="sc-input" data-sc-input rows="9"
    placeholder="예) [역할] 너는 15년차 사무관리 실무 전문가야.&#10;[맥락] 대상은 …&#10;[과제] …&#10;[제약] …&#10;[출력형식] …"></textarea>

  <div class="sc-actions">
    <span class="sc-len"><b data-sc-len>0</b>자</span>
    <button class="btn btn--line btn--sm" type="button" data-sc-example>예시 답안 넣기</button>
    <button class="btn btn--line btn--sm" type="button" data-sc-clear>지우기</button>
  </div>

  <div class="sc-result" data-sc-result hidden>
    <div class="sc-head">
      <div class="sc-grade" data-sc-grade>D</div>
      <div class="sc-total">
        <b data-sc-total>0</b><span>/ 100점</span>
        <p data-sc-label>아직 채점 전입니다</p>
      </div>
    </div>

    <ul class="sc-bars">
      ${sc.map((c) => `<li data-sc-bar="${esc(c.key)}">
        <span class="sc-bars__k">${esc(c.code)} · ${esc(c.key)}</span>
        <span class="sc-bars__t"><i style="width:0%"></i></span>
        <span class="sc-bars__v"><b>0</b>/${c.max}</span>
      </li>`).join('\n      ')}
    </ul>

    <div class="sc-fb" data-sc-fb></div>
  </div>
</div>

${sample.before && sample.after ? `
<h3 class="sub-h">같은 업무, 프롬프트만 바꿨을 때</h3>
<div class="grid g2">
  <div class="card sc-cmp sc-cmp--bad">
    <h3>다듬기 전 <span class="bdg bdg--gray">${esc(sample.before.grade)} · ${sample.before.total}점</span></h3>
    <pre>${esc(sample.before.prompt)}</pre>
  </div>
  <div class="card sc-cmp sc-cmp--good">
    <h3>다듬은 뒤 <span class="bdg bdg--gold">${esc(sample.after.grade)} · ${sample.after.total}점</span></h3>
    <pre>${esc(sample.after.prompt)}</pre>
  </div>
</div>
<p class="b-source">위 두 예시를 채점기에 그대로 넣어 보면 점수 차이를 확인할 수 있습니다.</p>
` : ''}`;
}

export const SCORING_STYLE = `
.lab-box{margin:16px 0 24px; padding:20px; border:1px solid var(--g200);
  border-radius:var(--radius-lg); background:#fff}
.lab-box__pick{margin-bottom:14px}
.lab-box__pick label{display:block; margin-bottom:7px; font-size:14px; color:var(--g600)}
.sel,.ta{width:100%; font-family:inherit; font-size:16px; color:var(--g800);
  background:#fff; border:1px solid var(--g200); border-radius:10px; padding:12px 14px}
.sel{min-height:48px}
.ta{min-height:190px; line-height:1.8; resize:vertical}
.sel:focus,.ta:focus{border-color:var(--b500); box-shadow:0 0 0 3px rgba(31,160,84,.16); outline:none}
.sc-brief{margin-bottom:14px; padding:14px 16px; border-radius:10px;
  background:var(--b50); border:1px solid var(--b100); font-size:14.5px; line-height:1.8; color:var(--b900)}
.sc-brief b{color:var(--b700)}
.sc-brief .kw{display:flex; flex-wrap:wrap; gap:6px; margin-top:9px}
.sc-brief .kw span{padding:3px 10px; border-radius:var(--pill); background:#fff;
  border:1px solid var(--b200); font-size:12px; font-weight:700; color:var(--b700)}
.sc-actions{display:flex; flex-wrap:wrap; align-items:center; gap:9px; margin-top:11px}
.sc-len{margin-right:auto; font-size:13px; color:var(--g400)}
.sc-len b{color:var(--b700); font-weight:800}

.sc-result{margin-top:20px; padding-top:18px; border-top:1px dashed var(--g200)}
.sc-head{display:flex; align-items:center; gap:16px; margin-bottom:16px}
.sc-grade{flex:none; display:grid; place-items:center; width:66px; height:66px; border-radius:18px;
  background:var(--g400); color:#fff; font-size:30px; font-weight:800; transition:background .3s var(--ease)}
.sc-total b{font-size:32px; font-weight:800; color:var(--g900); line-height:1}
.sc-total span{margin-left:5px; font-size:14px; color:var(--g400)}
.sc-total p{margin-top:5px; font-size:14px; color:var(--g500)}

.sc-bars li{display:grid; grid-template-columns:104px 1fr 58px; align-items:center; gap:11px; margin-bottom:9px}
.sc-bars__k{font-size:13px; font-weight:700; color:var(--g600)}
.sc-bars__t{height:9px; border-radius:var(--pill); background:var(--g200); overflow:hidden}
.sc-bars__t i{display:block; height:100%; border-radius:var(--pill);
  background:linear-gradient(90deg,var(--b600),var(--b400)); transition:width .45s var(--ease)}
.sc-bars li.low .sc-bars__t i{background:linear-gradient(90deg,#d97706,var(--s400))}
.sc-bars__v{font-size:13px; color:var(--g400); text-align:right; font-variant-numeric:tabular-nums}
.sc-bars__v b{color:var(--g700); font-weight:800}

.sc-fb{margin-top:15px}
.sc-fb li{position:relative; padding:9px 13px 9px 34px; margin-bottom:7px; border-radius:10px;
  background:var(--s50); color:#713f12; font-size:14px; line-height:1.75}
.sc-fb li::before{content:"→"; position:absolute; left:13px; top:9px; font-weight:800; color:var(--s600)}
.sc-fb li.ok{background:var(--b50); color:var(--b900)}
.sc-fb li.ok::before{content:"✓"; color:var(--b600)}

.sc-cmp pre{margin:10px 0 0; padding:13px 15px; border-radius:10px; background:var(--g50);
  border:1px solid var(--g200); font-size:13px; line-height:1.8; white-space:pre-wrap;
  word-break:break-word; color:var(--g700); max-height:250px; overflow:auto}
.sc-cmp--bad{border-color:#fca5a5}
.sc-cmp--good{border-color:var(--b400)}
@media (max-width:640px){
  .sc-bars li{grid-template-columns:80px 1fr 52px; gap:8px}
  .sc-bars__k{font-size:12px}
  .sc-grade{width:54px; height:54px; font-size:24px}
  .sc-total b{font-size:26px}
}`;

export function scoringScript(P) {
  return `
/* ---- 프롬프트 자동 채점 (원본 evaluatePrompt 이식) ---- */
(function () {
  var $ = NH.$, $$ = NH.$$;
  var SCENARIOS = ${json(P.scenarios || [])};
  var GRADE_COLOR = ${json(P.GRADE_COLOR || {})};
  var LABEL = ${json((P.gradeTable || []).reduce((a, g) => (a[g.grade] = g.label, a), {}))};

  var sel = $('[data-sc-sel]'), ta = $('[data-sc-input]'),
      brief = $('[data-sc-brief]'), result = $('[data-sc-result]');
  if (!sel || !ta) return;

  SCENARIOS.forEach(function (s, i) {
    sel.appendChild(new Option(s.category + ' — ' + s.title, String(i)));
  });

  function cur() { return SCENARIOS[Number(sel.value) || 0]; }

  function paintBrief() {
    var s = cur();
    brief.innerHTML =
      '<p><b>상황</b> ' + esc(s.situation) + '</p>' +
      '<p style="margin-top:6px"><b>목표</b> ' + esc(s.goal) + '</p>' +
      '<div class="kw">' + (s.keywords || []).map(function (k) {
        return '<span>' + esc(k) + '</span>'; }).join('') + '</div>';
  }

  /* ===== 원본 evaluatePrompt 와 같은 셈법 ===== */
  function evaluatePrompt(input, s) {
    var text = input.toLowerCase().replace(/\\s+/g, ' ');
    var len = input.trim().length;
    var fb = [];
    var has = function (list) {
      return (list || []).filter(function (k) { return text.indexOf(k.toLowerCase()) > -1; }).length;
    };

    // 역할
    var role = 0;
    if (/(너는|당신은|역할|전문가|담당자|으로서|act as|you are)/.test(input)) role += 12;
    if (has(s.roleKeywords) > 0) role += 8;
    role = Math.min(role, 20);
    if (role < 12) fb.push('역할을 지정하세요 — 예: "너는 15년차 사무관리 실무 전문가야"');

    // 맥락
    var context = 0, ctxHit = has(s.keywords);
    if (ctxHit >= 5) context += 12;
    else if (ctxHit >= 3) context += 9;
    else if (ctxHit >= 2) context += 6;
    else if (ctxHit >= 1) context += 3;
    if (/\\d/.test(input)) context += 3;
    if (/\\[.+\\]|"""|타깃|대상|문서|보고서|고객|거래처/.test(input)) context += 5;
    context = Math.min(context, 20);
    if (context < 12) fb.push('맥락(문서·대상·상황)을 더 담으세요 — 예: ' + (s.keywords || []).slice(0, 3).join(', '));

    // 과제
    var task = 0;
    var actionRe = /(작성|만들|써|분석|정리|요약|생성|제안|기획|설계|평가|비교|추천|도출|변주|번역|진단|검토)/;
    var actionCount = (input.match(/(작성|만들|써|분석|정리|요약|생성|제안|기획|설계|평가|비교|추천|도출|변주|번역|진단|검토)/g) || []).length;
    if (actionRe.test(input)) task += 10;
    if (actionCount >= 2) task += 5;
    if (len >= 120) task += 5;
    task = Math.min(task, 20);
    if (task < 12) fb.push('무엇을 만들지 명확한 지시문을 넣으세요 — 예: "~를 작성해줘"');

    // 제약
    var constraint = 0;
    if (/(자 이내|이내|글자|단어|분량|줄|문단|페이지|a4)/i.test(input)) constraint += 7;
    if (/(톤|말투|어투|존댓말|반말|친근|정중|위트)/.test(input)) constraint += 6;
    if (/(금지|하지 ?마|제외|제한|단,|주의|없이|유지|안전)/.test(input)) constraint += 4;
    if (has(s.constraintKeywords) > 0) constraint += 3;
    constraint = Math.min(constraint, 20);
    if (constraint < 10) fb.push('제약(길이·톤·금지어·안전문구 유지)을 명시하면 결과가 안정됩니다');

    // 출력형식
    var format = 0, fmtHit = has(s.formatKeywords);
    if (fmtHit >= 2) format += 8;
    else if (fmtHit >= 1) format += 4;
    if (/[1-9][.)]\\s|[-·•]\\s|#{1,3}\\s|\\[출력|\\[형식|①②③/.test(input)) format += 7;
    if (/(표|목록|불릿|json|마크다운|구조|칼럼|열)/i.test(input)) format += 5;
    format = Math.min(format, 20);
    if (format < 10) fb.push('출력형식(표·목록·섹션 구조)을 지정하세요');

    var total = role + context + task + constraint + format;
    if (len < 50) fb.unshift('프롬프트가 너무 짧습니다. 100자 이상으로 5요소를 모두 담아보세요.');
    if (total >= 85) fb.push('5요소가 균형 있게 잘 갖춰졌습니다! 👍');

    var grade = 'D';
    if (total >= 90) grade = 'S';
    else if (total >= 80) grade = 'A';
    else if (total >= 65) grade = 'B';
    else if (total >= 50) grade = 'C';

    return { total: total, grade: grade, feedback: fb,
      scores: { '역할': role, '맥락': context, '과제': task, '제약': constraint, '출력형식': format } };
  }

  function esc(t) {
    return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function paint() {
    var v = ta.value;
    $('[data-sc-len]').textContent = v.length;
    if (!v.trim()) { result.hidden = true; return; }
    result.hidden = false;

    var r = evaluatePrompt(v, cur());
    $('[data-sc-total]').textContent = r.total;
    var g = $('[data-sc-grade]');
    g.textContent = r.grade;
    g.style.background = GRADE_COLOR[r.grade] || 'var(--g400)';
    $('[data-sc-label]').textContent = LABEL[r.grade] || '';

    $$('[data-sc-bar]').forEach(function (li) {
      var v2 = r.scores[li.dataset.scBar] || 0;
      li.querySelector('i').style.width = (v2 / 20 * 100) + '%';
      li.querySelector('b').textContent = v2;
      li.classList.toggle('low', v2 < 12);
    });

    $('[data-sc-fb]').innerHTML = '<ul>' + r.feedback.map(function (f) {
      var ok = f.indexOf('잘 갖춰졌습니다') > -1;
      return '<li class="' + (ok ? 'ok' : '') + '">' + esc(f) + '</li>';
    }).join('') + '</ul>';
  }

  sel.addEventListener('change', function () { paintBrief(); paint(); });
  ta.addEventListener('input', paint);
  $('[data-sc-example]').addEventListener('click', function () {
    ta.value = cur().exampleAnswer || ''; paint(); ta.focus();
  });
  $('[data-sc-clear]').addEventListener('click', function () {
    ta.value = ''; paint(); ta.focus();
  });

  paintBrief(); paint();
})();`;
}
