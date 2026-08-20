// 농협사료 학습사이트 OG 이미지 생성 (1200x630)
// 실행: node scripts/gen-og.mjs  (canvas 패키지 필요: npm i -D canvas)
import { createCanvas, loadImage } from 'canvas'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import fs from 'node:fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const W = 1200, H = 630
const canvas = createCanvas(W, H)
const ctx = canvas.getContext('2d')

// 색상 (농협 CI)
const GREEN_DARK = '#0d3b21'
const GREEN = '#12522e'
const GREEN_MID = '#158043'
const GOLD = '#fec20d'
const MINT = '#a6e5bd'

// 배경 그라디언트
const g = ctx.createLinearGradient(0, 0, W, H)
g.addColorStop(0, GREEN_DARK)
g.addColorStop(0.55, GREEN)
g.addColorStop(1, '#0a3018')
ctx.fillStyle = g
ctx.fillRect(0, 0, W, H)

// 대각 스트라이프 패턴 (은은하게)
ctx.save()
ctx.globalAlpha = 0.06
ctx.strokeStyle = GOLD
ctx.lineWidth = 14
for (let x = -H; x < W; x += 46) {
  ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + H, H); ctx.stroke()
}
ctx.restore()

// 우측 상단 골드 글로우
const glow = ctx.createRadialGradient(W - 120, 120, 20, W - 120, 120, 320)
glow.addColorStop(0, 'rgba(254,194,13,0.22)')
glow.addColorStop(1, 'rgba(254,194,13,0)')
ctx.fillStyle = glow
ctx.fillRect(0, 0, W, H)

// 배경 워터마크 "AI"
ctx.save()
ctx.globalAlpha = 0.08
ctx.fillStyle = MINT
ctx.font = 'bold 460px "Apple SD Gothic Neo", sans-serif'
ctx.textAlign = 'right'
ctx.textBaseline = 'middle'
ctx.fillText('AI', W - 40, H / 2 + 40)
ctx.restore()

const symbol = await loadImage(join(ROOT, 'public', 'nh-symbol.png'))

// ── 상단: 심볼 + 농협사료 ──
const symH = 66
const symW = symbol.width * (symH / symbol.height)
const padX = 80, topY = 74
ctx.drawImage(symbol, padX, topY, symW, symH)
ctx.textAlign = 'left'
ctx.textBaseline = 'alphabetic'
ctx.fillStyle = '#ffffff'
ctx.font = 'bold 40px "Apple SD Gothic Neo", sans-serif'
const brandX = padX + symW + 24
ctx.fillText('농협사료', brandX, topY + 48)
const brandW = ctx.measureText('농협사료').width
ctx.fillStyle = MINT
ctx.font = '600 22px "Apple SD Gothic Neo", sans-serif'
ctx.fillText('NongHyup Feed', brandX + brandW + 18, topY + 48)

// ── 메인 타이틀 ──
let ty = 300
ctx.textBaseline = 'alphabetic'
// 1행: 생성형 [AI] 기반
ctx.font = 'bold 78px "Apple SD Gothic Neo", sans-serif'
let x = padX
ctx.fillStyle = '#ffffff'; ctx.fillText('생성형 ', x, ty); x += ctx.measureText('생성형 ').width
ctx.fillStyle = GOLD; ctx.fillText('AI', x, ty); x += ctx.measureText('AI').width
ctx.fillStyle = '#ffffff'; ctx.fillText(' 기반', x, ty)
// 2행: 사무관리 업무혁신 실무
ty += 92
ctx.fillStyle = '#ffffff'
ctx.fillText('사무관리 업무혁신 실무', padX, ty)

// 골드 밑줄
ctx.fillStyle = GOLD
ctx.fillRect(padX + 2, ty + 26, 300, 8)

// ── 서브타이틀 ──
ctx.fillStyle = MINT
ctx.font = '500 30px "Apple SD Gothic Neo", sans-serif'
ctx.fillText('무료 AI 도구로 완성하는 1일 8차시 실습 과정', padX, ty + 82)

// ── 도구 칩 ──
const tools = ['ChatGPT', 'Claude', 'Gemini', 'Perplexity', 'Sheets', 'Docs']
let cx = padX
const cy = ty + 122
ctx.font = '600 22px "Apple SD Gothic Neo", sans-serif'
for (const t of tools) {
  const tw = ctx.measureText(t).width
  const cw = tw + 34
  ctx.fillStyle = 'rgba(255,255,255,0.10)'
  roundRect(ctx, cx, cy, cw, 40, 20); ctx.fill()
  ctx.strokeStyle = 'rgba(255,255,255,0.20)'; ctx.lineWidth = 1.5
  roundRect(ctx, cx, cy, cw, 40, 20); ctx.stroke()
  ctx.fillStyle = '#eafff2'
  ctx.fillText(t, cx + 17, cy + 27)
  cx += cw + 12
}

// ── 하단 도메인 ──
ctx.fillStyle = 'rgba(230,255,240,0.72)'
ctx.font = '600 24px "Apple SD Gothic Neo", sans-serif'
ctx.textAlign = 'right'
ctx.fillText('nonghyupsaryo.dreamitbiz.com', W - 80, H - 46)

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

// 캐시 무력화를 위해 버전 파일명 사용 (카카오/페북 이미지 프록시 캐시 회피)
const buf = canvas.toBuffer('image/png')
for (const name of ['og.png', 'og-image.png']) {
  const out = join(ROOT, 'public', name)
  fs.writeFileSync(out, buf)
  console.log('OG 이미지 생성 완료:', out)
}
