/* ==========================================================================
   빌드 — _원본(React/Vite) 의 데이터를 읽어 인라인 단일 HTML 로 만든다.
   실행:  node _build/build.mjs
   외부 패키지 없음. Node 18 이상.
   ========================================================================== */
import { readFileSync, writeFileSync, readdirSync, unlinkSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadData, ROOT } from './gen/load.mjs';
import { header, footer } from './gen/shell.mjs';
import * as core from './gen/pages-core.mjs';
import * as tools from './gen/pages-tools.mjs';
import * as about from './gen/pages-about.mjs';

const BUILD = dirname(fileURLToPath(import.meta.url));
const sharedCss = readFileSync(join(BUILD, 'parts/style.css'), 'utf8');
const sharedJs = readFileSync(join(BUILD, 'parts/common.js'), 'utf8');

/* 탭 아이콘 — 외부 요청 없이 인라인 SVG. 글자는 넣지 않는다. */
const favicon = 'data:image/svg+xml,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">' +
  '<rect width="32" height="32" rx="8" fill="#12522e"/>' +
  '<path d="M16 7c4.6 2.8 7.4 6.2 7.4 10.4a7.4 7.4 0 0 1-14.8 0C8.6 13.2 11.4 9.8 16 7Z" fill="#fec20d"/>' +
  '<path d="M16 12v11" stroke="#12522e" stroke-width="2.2" stroke-linecap="round"/></svg>');

function html(p) {
  const inner = p.noMainWrap ? p.body
    : `<div class="main"><div class="wrap${p.wide ? ' wrap--wide' : ''}">\n${p.body}\n</div></div>`;

  return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="format-detection" content="telephone=no">
<title>${p.title}</title>
<meta name="description" content="${p.desc || ''}">
<meta property="og:title" content="${p.title}">
<meta property="og:description" content="${p.desc || ''}">
<meta property="og:type" content="website">
<link rel="icon" href="${favicon}">
<style>
${sharedCss}
${p.style ? `\n/* ===== 이 페이지 전용 ===== */${p.style}` : ''}
</style>
<noscript><style>
/* 스크립트가 꺼져 있어도 목차는 보여야 한다 */
.sb{transform:none !important; position:static !important; height:auto !important}
</style></noscript>
</head>
<body data-page="${p.key}">

${header(p.mode)}

<div class="shell">
  <aside class="sb" id="sb">${p.sidebar || ''}</aside>
  <main id="main" style="flex:1;min-width:0">
${inner}
  </main>
</div>

${footer()}

<script>
${sharedJs}
</script>
${p.script ? `<script>\n${p.script}\n</script>` : ''}
</body>
</html>
`;
}

/* --- 실행 -------------------------------------------------------------- */
const d = await loadData();
const vol = d.content[0];

const pages = [
  core.home(d),
  core.courseOverview(d),
  ...vol.parts.map((p) => core.partPage(d, p)),
  core.schedule(d),
  core.labs(d),
  core.dashboard(d),
  tools.toolsHome(d),
  ...d.tools.tools.map((t) => tools.toolPage(d, t)),
  tools.promptLab(d),
  tools.appendix(d),
  about.about(d),
  about.instructor(),
  about.company(d),
];

// 이전 빌드 결과를 지운다 (원본 폴더·빌드 재료는 건드리지 않는다)
for (const f of readdirSync(ROOT)) {
  if (f.endsWith('.html')) unlinkSync(join(ROOT, f));
}

let total = 0;
for (const p of pages) {
  const out = html(p);
  writeFileSync(join(ROOT, p.file), out, 'utf8');
  total += out.length;
  console.log(`  ✓ ${p.file.padEnd(20)} ${(out.length / 1024).toFixed(1).padStart(6)} KB`);
}
console.log(`\n${pages.length}개 페이지 · 합계 ${(total / 1024).toFixed(1)} KB`);
console.log('브라우저로 index.html 을 바로 열면 된다 (서버 없이 동작).');
