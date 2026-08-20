/* ==========================================================================
   블록 렌더러 — 원본 BlockRenderer.jsx 의 14종 분기를 정적 HTML 로 옮긴 것.
   원본의 라벨 추출 규칙(대괄호 접두사, 이모지 제거)까지 그대로 따른다.
   ========================================================================== */

export function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// 원본 stripBracketPrefix — "[실습 1-1] 본문" 에서 라벨과 본문을 가른다
function bracket(text, fallback) {
  const m = String(text || '').match(/^\[([^\]]+)\]\s*([\s\S]*)$/);
  return m ? { label: m[1], body: m[2] } : { label: fallback, body: text || '' };
}

const ICON = {
  tip: '💡', warning: '⚠️', outcome: '📦', case: '📌',
  link: '🔗', exercise: '✏️', objectives: '🎯', keywords: '🔑',
};

function note(tone, label, body, icon) {
  return `<div class="b-note b-${tone}">
  <div class="b-note__t"><span aria-hidden="true">${icon}</span>${esc(label)}</div>
  <p style="white-space:pre-line">${esc(body)}</p>
</div>`;
}

/* 표 — 첫 줄이 머리글 */
function table(b) {
  const rows = b.rows || [];
  if (!rows.length) return '';
  const [head, ...body] = rows;
  return `<div class="b-table">
${b.caption ? `  <p class="b-table__cap">${esc(b.caption)}</p>` : ''}
  <div class="table-wrap"><table>
    <thead><tr>${head.map((c) => `<th class="cell-pre">${esc(c)}</th>`).join('')}</tr></thead>
    <tbody>${body.map((r) =>
      `<tr>${head.map((_, i) => `<td class="cell-pre">${esc(r[i] ?? '')}</td>`).join('')}</tr>`
    ).join('')}</tbody>
  </table></div>
</div>`;
}

/* 프롬프트 상자 — 복사 버튼이 붙는다 */
function promptbox(b) {
  return `<div class="b-prompt">
${b.caption ? `  <p class="b-prompt__cap">${esc(b.caption)}</p>` : ''}
  <div class="b-prompt__box">
    <div class="b-prompt__bar"><span>Prompt</span>
      <button class="copy-btn" type="button">복사</button></div>
    <pre>${esc(b.text)}</pre>
  </div>
</div>`;
}

/* 자료 내려받기 — 원본은 GitHub raw 를 가리킨다(외부 요청) */
const DL_BASE = 'https://raw.githubusercontent.com/aebonlee/materials/main/nonghyupsaryo/';
function download(b) {
  const files = (b.files || []).map((f) => {
    const name = typeof f === 'string' ? f : (f.file || f.name || '');
    const label = typeof f === 'string' ? f : (f.label || f.name || name);
    return `<a class="b-dl" href="${DL_BASE}${encodeURIComponent(name)}"
       target="_blank" rel="noopener">⬇ ${esc(label)}</a>`;
  }).join('\n');
  return `<div class="blk">
${b.caption ? `  <p class="b-label">${esc(b.caption)}</p>` : ''}
${files}
${b.note ? `  <p class="b-source">${esc(b.note)}</p>` : ''}
</div>`;
}

/* --- 블록 하나 --------------------------------------------------------- */
export function renderBlock(b) {
  switch (b.type) {
    case 'para':
      return `<p class="b-para" style="white-space:pre-line">${esc(b.text)}</p>`;

    case 'label':
      return `<p class="b-label">${esc(b.text)}</p>`;

    case 'bullets':
      return `<ul class="b-bullets">${(b.items || [])
        .map((it) => `<li>${esc(it)}</li>`).join('')}</ul>`;

    case 'objectives':
      return `<div class="b-obj">
  <div class="b-obj__t"><span aria-hidden="true">${ICON.objectives}</span>학습 목표</div>
  <ul>${(b.items || []).map((it) => `<li>${esc(it)}</li>`).join('')}</ul>
</div>`;

    case 'keywords':
      return `<div class="b-keywords">${String(b.text || '')
        .split(/[,·]/).map((k) => k.trim()).filter(Boolean)
        .map((k) => `<span>${esc(k)}</span>`).join('')}</div>`;

    case 'table':      return table(b);
    case 'table-cap':  return `<p class="b-table__cap">${esc(b.text)}</p>`;
    case 'promptbox':  return promptbox(b);
    case 'download':   return download(b);

    case 'tip': {
      const { body } = bracket(b.text, 'Tip');
      return note('tip', 'Tip', body, ICON.tip);
    }
    case 'exercise': {
      // 원본과 같은 규칙 — "[실습 3-1]" 처럼 대괄호가 없어도 "실습"으로 시작하면 라벨로 뗀다
      const m = String(b.text || '').match(/^\[?(실습[^\]\n]*)\]?\s*([\s\S]*)$/);
      const label = m ? m[1].trim() : '실습';
      const body = m ? m[2] : (b.text || '');
      return `<div class="b-ex">
  <div class="b-ex__h"><span aria-hidden="true">${ICON.exercise}</span>${esc(label)}</div>
  <div class="b-ex__b" style="white-space:pre-line">${esc(body)}</div>
</div>`;
    }
    case 'case': {
      const { label, body } = bracket(b.text, '사례');
      return note('case', label, body, ICON.case);
    }
    case 'link':
      return note('case', '연계 학습', String(b.text || '').replace(/^📖\s*/, ''), ICON.link);
    case 'warning':
      return note('warn', '유의', String(b.text || '').replace(/^⚠️\s*/, ''), ICON.warning);
    case 'outcome':
      return note('out', '핵심 산출물', String(b.text || '').replace(/^▶\s*/, ''), ICON.outcome);
    case 'source':
      return `<p class="b-source">${esc(b.text)}</p>`;

    default:
      return `<p class="b-para">${esc(b.text || '')}</p>`;
  }
}

export function renderBlocks(blocks) {
  return (blocks || []).map(renderBlock).join('\n');
}
