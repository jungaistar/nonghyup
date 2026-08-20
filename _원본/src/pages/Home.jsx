import { Link } from 'react-router-dom'
import Header from '../components/Header'
import { volumes, partStats } from '../data/courses'
import { tools } from '../data/tools'
import Icon from '../components/Icon'
import { useProgress } from '../context/ProgressContext'

// 히어로 우측에 둥둥 떠다니는 AI 툴 로고 배치
const FLOATERS = [
  { id: 'chatgpt', cls: 'right-[26%] top-[14%] h-16 w-16 text-2xl', dur: '6s', delay: '0s', accent: 'text-emerald-300' },
  { id: 'claude', cls: 'right-[8%] top-[22%] h-20 w-20 text-3xl', dur: '7s', delay: '.6s', accent: 'text-violet-300' },
  { id: 'gemini', cls: 'right-[34%] top-[44%] h-14 w-14 text-xl', dur: '5.5s', delay: '1.1s', accent: 'text-sky-300' },
  { id: 'perplexity', cls: 'right-[18%] top-[60%] h-16 w-16 text-2xl', dur: '6.5s', delay: '.3s', accent: 'text-teal-200' },
  { id: 'sheets', cls: 'right-[6%] top-[64%] h-14 w-14 text-xl', dur: '7.5s', delay: '1.4s', accent: 'text-emerald-200' },
]

// 배경용 큰 SVG 글자 워터마크 ("AI" / "AX" / "Bulid" 등) — 글자 수에 맞춰 폭 자동 조정
function AiMark({ id, text = 'AI', from = '#fbbf24', to = '#7ea4d6', className = '' }) {
  const w = Math.max(360, text.length * 118)
  return (
    <svg viewBox={`0 0 ${w} 180`} className={className} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
      </defs>
      <text
        x={w / 2}
        y="138"
        textAnchor="middle"
        fontSize="150"
        fontWeight="900"
        letterSpacing="4"
        fontFamily="Pretendard, system-ui, sans-serif"
        fill={`url(#${id})`}
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="1.5"
      >
        {text}
      </text>
    </svg>
  )
}

export default function Home() {
  const { countDone } = useProgress()

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-900 text-white">
        <div className="absolute inset-0 opacity-20" style={heroPattern} />
        <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-signal-400/20 blur-3xl" />

        {/* 배경 "AI" / "AX" 워터마크 (lg 이상) — 떠다니는 로고 뒤 */}
        <div className="pointer-events-none absolute inset-y-0 right-[6%] hidden w-[36%] items-center justify-center lg:flex" aria-hidden="true">
          <AiMark id="aimark-desktop" text="AI" className="floaty h-[52%] w-full opacity-[0.14]" />
        </div>
        <div
          className="floaty pointer-events-none absolute right-[30%] top-[8%] hidden w-[20%] lg:block"
          style={{ animationDuration: '8s', animationDelay: '1.2s' }}
          aria-hidden="true"
        >
          <AiMark id="axmark-desktop" text="AX" from="#fcd34d" to="#4e7fc1" className="h-auto w-full opacity-[0.12]" />
        </div>
        <div
          className="floaty pointer-events-none absolute right-[22%] top-[62%] hidden w-[30%] lg:block"
          style={{ animationDuration: '9s', animationDelay: '.8s' }}
          aria-hidden="true"
        >
          <AiMark id="bulidmark-desktop" text="NH" from="#aec7e7" to="#fbbf24" className="h-auto w-full opacity-[0.10]" />
        </div>

        {/* 떠다니는 AI 툴 로고 (lg 이상) */}
        <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden="true">
          {FLOATERS.map((f) => {
            const tool = tools.find((t) => t.id === f.id)
            if (!tool) return null
            return (
              <div
                key={f.id}
                className={`floaty absolute flex items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20 backdrop-blur-sm ${f.cls} ${f.accent}`}
                style={{ animationDuration: f.dur, animationDelay: f.delay }}
                title={tool.name}
              >
                <Icon name={tool.icon} />
                <span className="absolute -bottom-5 whitespace-nowrap text-[10.5px] font-semibold text-brand-100/70">
                  {tool.name}
                </span>
              </div>
            )
          })}
        </div>

        <div className="relative mx-auto max-w-screen-xl px-5 py-12 sm:py-20">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-[11.5px] font-semibold text-signal-300 ring-1 ring-white/15 sm:text-[12.5px]">
            <Icon name="fa-solid fa-seedling" /> 농협사료 임직원 · 사무관리 업무혁신 실무
          </div>
          <h1 className="mt-5 max-w-3xl text-[28px] font-extrabold leading-tight tracking-tight sm:text-[42px]">
            생성형 <span className="text-signal-400">AI</span>로 여는 <br className="hidden sm:block" />사무관리 업무혁신
          </h1>
          <p className="mt-4 max-w-2xl text-[15.5px] leading-relaxed text-brand-100">
            무료 AI 도구로 문서 작성·자료 조사·시장 분석·기획·보고서·데이터 분석·의사결정을 자동화합니다.
            <br className="hidden sm:block" />
            프롬프트부터 현업 적용 계획까지, 1일 8차시 실습으로 바로 쓰는 역량을 완성합니다.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/vol/course"
              className="rounded-xl bg-signal-400 px-5 py-3 text-[14.5px] font-bold text-brand-950 shadow-lg transition hover:bg-signal-300"
            >
              8차시 학습 시작하기 →
            </Link>
            <Link
              to="/schedule/course"
              className="rounded-xl bg-white/10 px-5 py-3 text-[14.5px] font-bold text-white ring-1 ring-white/25 transition hover:bg-white/20"
            >
              교육 일정 보기
            </Link>
          </div>

          {/* 확정 일시·장소 */}
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[13px] text-brand-100">
            <span className="inline-flex items-center gap-1.5">
              <Icon name="fa-solid fa-calendar-check" className="text-signal-300" /> 2026. 8. 20.(목) 08:00~17:00
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Icon name="fa-solid fa-location-dot" className="text-signal-300" /> 농협사료 5층 중회의실
            </span>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-5 text-center sm:mt-10 sm:flex sm:flex-wrap sm:gap-x-6 sm:gap-y-4">
            <Stat n="8차시" l="1일 8시간 과정" />
            <Stat n="6종" l="무료 AI 도구" />
            <Stat n="7종" l="실습 산출물" />
            <Stat n="100%" l="실습 중심" />
          </div>

          {/* 모바일 전용 AI 툴 로고 행 (배경 "AI" 워터마크 위) */}
          <div className="relative mt-9 lg:hidden">
            <div className="pointer-events-none absolute inset-0 flex items-center justify-between" aria-hidden="true">
              <AiMark id="aimark-mobile" text="AI" className="h-20 w-auto opacity-[0.13]" />
              <AiMark id="bulidmark-mobile" text="NH" from="#aec7e7" to="#fbbf24" className="h-12 w-auto opacity-[0.10]" />
              <AiMark id="axmark-mobile" text="AX" from="#fcd34d" to="#4e7fc1" className="h-20 w-auto opacity-[0.11]" />
            </div>
            <div className="relative flex flex-wrap gap-3">
              {FLOATERS.map((f, i) => {
                const tool = tools.find((t) => t.id === f.id)
                if (!tool) return null
                return (
                  <div
                    key={f.id}
                    className={`floaty flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-lg ring-1 ring-white/20 ${f.accent}`}
                    style={{ animationDuration: f.dur, animationDelay: `${i * 0.25}s` }}
                    title={tool.name}
                  >
                    <Icon name={tool.icon} />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 과정 카드 */}
      <section className="mx-auto max-w-screen-xl px-5 py-14">
        <h2 className="mb-2 text-xl font-bold text-brand-900">과정 구성</h2>
        <p className="mb-7 text-[14px] text-slate-500">
          업무 흐름(프롬프트 → 조사 → 분석 → 기획 → 보고서 → 데이터 → 의사결정)에 맞춰 하루 8차시로 구성했습니다.
          이론 30% · 실습 50% · 사례 적용 20%로 진행합니다.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          {volumes.map((v, idx) => {
            const days = v.parts.filter((p) => p.kind === 'day')
            const done = countDone(
              v.id,
              days.map((d) => d.num)
            )
            return (
              <div
                key={v.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
              >
                <div className={`px-6 py-5 ${idx === 0 ? 'bg-brand-800' : 'bg-brand-700'} text-white`}>
                  <div className="text-[12px] font-bold text-signal-300">{v.label}</div>
                  <h3 className="mt-1 text-lg font-extrabold leading-snug">{v.title}</h3>
                  <div className="mt-0.5 text-[13px] text-brand-100">{v.subtitle}</div>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <p className="text-[14px] leading-relaxed text-slate-600">{v.desc}</p>

                  <div className="mt-4 mb-5">
                    <div className="mb-1 flex justify-between text-[12px] font-medium text-slate-500">
                      <span>학습 진도</span>
                      <span>
                        {done}/{days.length} 차시
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-emerald-500 transition-all"
                        style={{ width: `${(done / days.length) * 100}%` }}
                      />
                    </div>
                  </div>

                  <ul className="mb-6 space-y-1.5">
                    {days.map((p) => (
                      <li key={p.num} className="flex items-center gap-2 text-[13.5px] text-slate-600">
                        <span className="flex h-5 w-5 items-center justify-center rounded-md bg-slate-100 text-[10.5px] font-bold text-brand-700">
                          {p.day}
                        </span>
                        <span className="truncate">{p.title}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    to={`/vol/${v.id}`}
                    className="mt-auto rounded-xl bg-brand-800 py-3 text-center text-[14px] font-bold text-white transition group-hover:bg-brand-700"
                  >
                    8차시 학습하기
                  </Link>
                </div>
              </div>
            )
          })}

          {/* 과정 하이라이트 카드 */}
          <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="bg-signal-400 px-6 py-5 text-brand-950">
              <div className="text-[12px] font-bold text-brand-800">FREE AI TOOLS</div>
              <h3 className="mt-1 text-lg font-extrabold leading-snug">무료 도구로 완성하는 실습</h3>
              <div className="mt-0.5 text-[13px] text-brand-900/80">유료 구독·API 비용 없이 바로 적용</div>
            </div>
            <div className="flex flex-1 flex-col p-6">
              <ul className="space-y-2.5">
                {[
                  ['fa-solid fa-pen-nib', '프롬프트 엔지니어링', '업무 지시형 프롬프트 5요소'],
                  ['fa-solid fa-magnifying-glass', '시장·트렌드 분석', 'Perplexity 출처 기반 조사 · SWOT'],
                  ['fa-solid fa-file-lines', '보고서 자동화', '기획서·회의자료 초안 자동 작성'],
                  ['fa-solid fa-table', '데이터 분석', 'Google Sheets + AI 인사이트'],
                  ['fa-solid fa-scale-balanced', '의사결정 지원', '대안 비교 · 의사결정 매트릭스'],
                ].map(([icon, t, d]) => (
                  <li key={t} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-[13px] text-brand-700">
                      <Icon name={icon} />
                    </span>
                    <span>
                      <span className="block text-[13.5px] font-bold text-brand-900">{t}</span>
                      <span className="block text-[12px] text-slate-500">{d}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                to="/tools"
                className="mt-6 rounded-xl border border-brand-200 py-3 text-center text-[14px] font-bold text-brand-700 transition hover:bg-brand-50"
              >
                AI 도구 가이드 보기 →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* AI 도구 가이드 배너 */}
      <section className="mx-auto max-w-screen-xl px-5 pb-16">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="grid md:grid-cols-2">
            <Link
              to="/tools"
              className="group flex items-center gap-4 border-b border-slate-200 p-6 transition hover:bg-slate-50 md:border-b-0 md:border-r"
            >
              <span className="text-3xl text-brand-700"><Icon name="fa-solid fa-toolbox" /></span>
              <div>
                <div className="text-[16px] font-extrabold text-brand-900">AI 도구 가이드</div>
                <div className="mt-0.5 text-[13px] text-slate-500">
                  프롬프트 · ChatGPT · Claude · Gemini · Perplexity · Google Sheets·Docs 정리
                </div>
                <div className="mt-1.5 text-[12.5px] font-bold text-brand-700 group-hover:underline">
                  바로가기 →
                </div>
              </div>
            </Link>
            <Link
              to="/about"
              className="group flex items-center gap-4 p-6 transition hover:bg-slate-50"
            >
              <span className="text-3xl text-brand-700"><Icon name="fa-solid fa-circle-info" /></span>
              <div>
                <div className="text-[16px] font-extrabold text-brand-900">소개 (About)</div>
                <div className="mt-0.5 text-[13px] text-slate-500">
                  제작 의도 · 강사 소개 · 회사 소개
                </div>
                <div className="mt-1.5 text-[12.5px] font-bold text-brand-700 group-hover:underline">
                  바로가기 →
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="mx-auto max-w-screen-xl px-5 text-center text-[12.5px] text-slate-400">
          농협사료 · 생성형 AI 기반 사무관리 업무혁신 실무 (1일 8차시)
          <br />© DreamIT Biz · 본 학습사이트의 콘텐츠는 교육 목적 사용에 한합니다.
        </div>
      </footer>
    </div>
  )
}

function Stat({ n, l }) {
  return (
    <div>
      <div className="text-2xl font-extrabold text-signal-400">{n}</div>
      <div className="text-[12px] text-brand-200">{l}</div>
    </div>
  )
}

const heroPattern = {
  backgroundImage:
    'linear-gradient(135deg, transparent 46%, rgba(251,191,36,.5) 46%, rgba(251,191,36,.5) 54%, transparent 54%)',
  backgroundSize: '28px 28px',
}
