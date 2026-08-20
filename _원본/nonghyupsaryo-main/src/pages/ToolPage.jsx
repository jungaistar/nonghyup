import { Link, useParams, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import Layout from '../components/Layout'
import { getTool, TOOL_PAGES } from '../data/tools'
import Icon from '../components/Icon'
import CopyButton from '../components/CopyButton'

const HERO = {
  signal: 'from-signal-400 to-signal-500 text-brand-950',
  emerald: 'from-emerald-500 to-emerald-600 text-white',
  violet: 'from-violet-500 to-violet-600 text-white',
  sky: 'from-sky-500 to-sky-600 text-white',
  brand: 'from-brand-700 to-brand-800 text-white',
  rose: 'from-rose-500 to-rose-600 text-white',
}

const LEVEL_STYLE = {
  입문: 'bg-emerald-100 text-emerald-700',
  실전: 'bg-sky-100 text-sky-700',
  심화: 'bg-violet-100 text-violet-700',
}

function Card({ title, icon, children }) {
  return (
    <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {title && (
        <h2 className="mb-4 flex items-center gap-2 text-[17px] font-extrabold text-brand-900">
          <Icon name={icon} className="text-brand-600" />
          {title}
        </h2>
      )}
      {children}
    </section>
  )
}

export default function ToolPage() {
  const { toolId, section = 'overview' } = useParams()
  const tool = getTool(toolId)
  const meta = TOOL_PAGES.find((p) => p.id === section)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [toolId, section])

  if (!tool || tool.id === 'prompt') return <Navigate to="/tools" replace />
  if (!meta) return <Navigate to={`/tools/${toolId}/overview`} replace />

  return (
    <Layout>
      <div className="mx-auto max-w-screen-xl px-5 py-8">
        <div className="mb-4 flex items-center gap-1.5 text-[12.5px] text-slate-400">
          <Link to="/" className="hover:text-brand-700">홈</Link>
          <span>/</span>
          <Link to="/tools" className="hover:text-brand-700">AI 도구</Link>
          <span>/</span>
          <span className="text-slate-600">{tool.name} · {meta.short}</span>
        </div>

        {/* Hero */}
        <div className={`mb-5 rounded-2xl bg-gradient-to-br p-7 shadow-sm ${HERO[tool.color]}`}>
          <div className="flex items-center gap-4">
            <span className="text-4xl"><Icon name={tool.icon} /></span>
            <div>
              <h1 className="text-[28px] font-extrabold leading-none">{tool.name}</h1>
              {tool.vendor && <div className="mt-1.5 text-[13px] font-medium opacity-85">{tool.vendor}</div>}
            </div>
          </div>
          <p className="mt-4 text-[15px] font-semibold opacity-95">{tool.tagline}</p>
        </div>

        {/* 하위 페이지 칩 */}
        <div className="mb-6 flex flex-wrap gap-1.5">
          {TOOL_PAGES.map((p) => (
            <Link
              key={p.id}
              to={`/tools/${tool.id}/${p.id}`}
              className={`rounded-full px-3 py-1.5 text-[12.5px] font-semibold transition ${
                p.id === section ? 'bg-brand-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Icon name={p.icon} /> {p.short}
            </Link>
          ))}
        </div>

        {section === 'overview' && <OverviewPage tool={tool} />}
        {section === 'features' && <FeaturesPage tool={tool} />}
        {section === 'practice' && <PracticePage tool={tool} />}
        {section === 'cases' && <CasesPage tool={tool} />}
        {section === 'prompts' && <PromptsPage tool={tool} />}

        {/* 하위 페이지 이동 */}
        <PageNav toolId={tool.id} section={section} />
      </div>
    </Layout>
  )
}

/* ---------------- 개요 · 시작하기 ---------------- */
function OverviewPage({ tool }) {
  return (
    <>
      <Card title="개요" icon="fa-solid fa-book-open">
        <p className="text-[15px] leading-[1.8] text-slate-700">{tool.overview}</p>
      </Card>

      {tool.gettingStarted?.length > 0 && (
        <Card title="시작하기" icon="fa-solid fa-circle-play">
          <ol className="space-y-2.5">
            {tool.gettingStarted.map((s, i) => (
              <li key={i} className="flex gap-3 text-[14px] leading-relaxed text-slate-700">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-800 text-[11px] font-bold text-white">{i + 1}</span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card title="강점" icon="fa-solid fa-award">
          <ul className="space-y-2">
            {tool.strengths.map((s, i) => (
              <li key={i} className="flex gap-2.5 text-[14px] leading-relaxed text-slate-700">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-signal-400" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card title="요금제" icon="fa-solid fa-credit-card">
          <div className="space-y-2.5">
            {tool.plans.map((p, i) => (
              <div key={i} className="flex items-start justify-between gap-3 rounded-lg bg-slate-50 p-3">
                <div>
                  <div className="text-[13.5px] font-bold text-brand-800">{p.name}</div>
                  <div className="text-[12.5px] text-slate-500">{p.desc}</div>
                </div>
                <div className="shrink-0 text-[12.5px] font-bold text-brand-700">{p.price}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  )
}

/* ---------------- 기능 상세 ---------------- */
function FeaturesPage({ tool }) {
  return (
    <>
      <Card title="핵심 기능 한눈에" icon="fa-solid fa-wand-magic-sparkles">
        <div className="grid gap-3 sm:grid-cols-2">
          {tool.features.map((f, i) => (
            <div key={i} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <div className="text-[14px] font-bold text-brand-800">{f.title}</div>
              <div className="mt-1 text-[13px] leading-relaxed text-slate-600">{f.desc}</div>
            </div>
          ))}
        </div>
      </Card>

      {tool.featureGuides?.length > 0 && (
        <Card title="기능 상세 가이드" icon="fa-solid fa-book-open-reader">
          <p className="-mt-2 mb-4 text-[13px] text-slate-500">기능별로 무엇인지·어떻게 쓰는지·실무 팁을 정리했습니다.</p>
          <div className="space-y-4">
            {tool.featureGuides.map((g, i) => (
              <div key={i} className="rounded-xl border border-slate-200 p-5">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-[16px] text-brand-700">
                    <Icon name={g.icon} />
                  </span>
                  <h3 className="text-[15.5px] font-extrabold text-brand-900">{g.name}</h3>
                </div>
                <p className="mt-2.5 text-[13.5px] leading-relaxed text-slate-700">{g.what}</p>
                {g.how?.length > 0 && (
                  <div className="mt-3">
                    <div className="mb-1.5 text-[11.5px] font-bold text-slate-500">사용 방법</div>
                    <ol className="space-y-1">
                      {g.how.map((h, hi) => (
                        <li key={hi} className="flex gap-2 text-[13px] leading-relaxed text-slate-600">
                          <span className="font-mono text-[11px] font-bold text-brand-500">{hi + 1}.</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
                {g.tip && (
                  <div className="mt-3 flex items-start gap-2 rounded-lg bg-emerald-50 p-2.5 text-[12.5px] leading-relaxed text-slate-700">
                    <Icon name="fa-solid fa-lightbulb" className="mt-0.5 shrink-0 text-emerald-500" />
                    <span>{g.tip}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </>
  )
}

/* ---------------- 실무 · 실습 ---------------- */
function PracticePage({ tool }) {
  return (
    <>
      <Card title="사무관리 실무 활용" icon="fa-solid fa-briefcase">
        <div className="space-y-3">
          {tool.useCases.map((u, i) => (
            <div key={i} className="flex gap-3 rounded-xl bg-brand-50/60 p-4">
              <span className="shrink-0 text-[13px] font-extrabold text-brand-700">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <div className="text-[14px] font-bold text-brand-900">{u.title}</div>
                <div className="mt-0.5 text-[13.5px] leading-relaxed text-slate-600">{u.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {tool.practices?.length > 0 && (
        <Card title="세부 실습 사례" icon="fa-solid fa-flask">
          <p className="-mt-2 mb-4 text-[13px] text-slate-500">단계별로 따라 하며 익히는 실무 실습입니다. 프롬프트 예시를 복사해 바로 사용해 보세요.</p>
          <div className="space-y-4">
            {tool.practices.map((p, i) => (
              <details key={i} open={i === 0} className="group rounded-xl border border-slate-200 bg-slate-50 [&_summary]:list-none">
                <summary className="flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3.5 hover:bg-slate-100">
                  {p.level && (
                    <span className={`shrink-0 rounded-md px-2 py-0.5 text-[11px] font-bold ${LEVEL_STYLE[p.level] || 'bg-slate-200 text-slate-600'}`}>{p.level}</span>
                  )}
                  <span className="flex-1 text-[14.5px] font-bold text-brand-900">{p.title}</span>
                  <Icon name="fa-solid fa-chevron-down" className="shrink-0 text-slate-400 transition group-open:rotate-180" />
                </summary>
                <div className="space-y-4 px-4 pb-4">
                  {p.goal && (
                    <div className="rounded-lg bg-white p-3 text-[13.5px] text-slate-700 ring-1 ring-slate-100"><b className="text-brand-700">목표</b> {p.goal}</div>
                  )}
                  {p.steps?.length > 0 && (
                    <div>
                      <div className="mb-1.5 text-[12px] font-bold text-slate-500">진행 단계</div>
                      <ol className="space-y-1.5">
                        {p.steps.map((s, si) => (
                          <li key={si} className="flex gap-2.5 text-[13.5px] leading-relaxed text-slate-700">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-800 text-[10.5px] font-bold text-white">{si + 1}</span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                  {p.prompt && (
                    <div className="rounded-xl border border-slate-700 bg-slate-900 p-4">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">프롬프트 예시</span>
                        <CopyButton text={p.prompt} />
                      </div>
                      <pre className="whitespace-pre-wrap break-words font-mono text-[12.5px] leading-relaxed text-slate-100">{p.prompt}</pre>
                    </div>
                  )}
                  {p.result && (
                    <div className="rounded-lg bg-emerald-50 p-3 text-[13px] leading-relaxed text-slate-700"><b className="text-emerald-700">결과·효과</b> {p.result}</div>
                  )}
                </div>
              </details>
            ))}
          </div>
        </Card>
      )}
    </>
  )
}

/* ---------------- 사례집 ---------------- */
function CasesPage({ tool }) {
  if (!tool.cases?.length) {
    return (
      <Card title="사례집" icon="fa-solid fa-folder-open">
        <p className="text-[14px] text-slate-500">준비 중입니다.</p>
      </Card>
    )
  }
  return (
    <Card title={`${tool.name} 도입 사례집`} icon="fa-solid fa-folder-open">
      <p className="-mt-2 mb-4 text-[13px] text-slate-500">
        사무관리 업무에서 {tool.name}를 활용한 사례입니다. 문제 → 해결 → 성과 흐름으로 정리했습니다.
      </p>
      <div className="space-y-4">
        {tool.cases.map((c, i) => (
          <div key={i} className="overflow-hidden rounded-xl border border-slate-200">
            <div className="flex items-center gap-2.5 bg-brand-50 px-4 py-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-800 text-[12px] font-bold text-white">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="flex-1 text-[14.5px] font-extrabold text-brand-900">{c.title}</h3>
              {c.sector && (
                <span className="shrink-0 rounded-md bg-white px-2 py-0.5 text-[11px] font-bold text-brand-700 ring-1 ring-brand-200">
                  {c.sector}
                </span>
              )}
            </div>
            <div className="space-y-2.5 p-4">
              <CaseRow icon="fa-solid fa-circle-question" tone="rose" label="문제" text={c.problem} />
              <CaseRow icon="fa-solid fa-lightbulb" tone="sky" label="해결" text={c.solution} />
              <CaseRow icon="fa-solid fa-arrow-trend-up" tone="emerald" label="성과" text={c.result} />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 rounded-lg bg-slate-100 px-3 py-2.5 text-[11.5px] leading-relaxed text-slate-500">
        ※ 사례의 효과(절감률 등)는 일반적 참고치이며, 실제 결과는 데이터·운영 환경에 따라 달라집니다.
      </p>
    </Card>
  )
}

function CaseRow({ icon, tone, label, text }) {
  const tones = {
    rose: 'bg-rose-50 text-rose-600',
    sky: 'bg-sky-50 text-sky-600',
    emerald: 'bg-emerald-50 text-emerald-600',
  }
  return (
    <div className="flex gap-2.5">
      <span className={`flex h-6 shrink-0 items-center gap-1 rounded-md px-2 text-[11px] font-bold ${tones[tone]}`}>
        <Icon name={icon} /> {label}
      </span>
      <span className="flex-1 text-[13.5px] leading-relaxed text-slate-700">{text}</span>
    </div>
  )
}

/* ---------------- 프롬프트 · 팁 ---------------- */
function PromptsPage({ tool }) {
  return (
    <>
      {tool.recommendedPrompts?.length > 0 && (
        <Card title="이 과정용 추천 프롬프트" icon="fa-solid fa-terminal">
          <p className="-mt-2 mb-4 text-[13px] text-slate-500">본 과정에 바로 쓰는 프롬프트입니다. <b>[대괄호]</b>만 상황에 맞게 바꿔 사용하세요.</p>
          <div className="space-y-3">
            {tool.recommendedPrompts.map((p, i) => (
              <div key={i} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <span className="text-[13.5px] font-bold text-brand-900">{p.title}</span>
                  <CopyButton text={p.prompt} />
                </div>
                <pre className="whitespace-pre-wrap break-words rounded-lg border border-slate-700 bg-slate-900 p-3.5 font-mono text-[12.5px] leading-relaxed text-slate-100">{p.prompt}</pre>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card title="활용 팁" icon="fa-solid fa-lightbulb">
        <ul className="space-y-2">
          {tool.promptTips.map((t, i) => (
            <li key={i} className="flex gap-2.5 text-[14px] leading-relaxed text-slate-700">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </Card>

      {tool.limits?.length > 0 && (
        <Card title="한계와 주의점" icon="fa-solid fa-triangle-exclamation">
          <ul className="space-y-2">
            {tool.limits.map((l, i) => (
              <li key={i} className="flex gap-2.5 rounded-lg bg-rose-50 p-3 text-[14px] leading-relaxed text-slate-700">
                <Icon name="fa-solid fa-circle-exclamation" className="mt-0.5 shrink-0 text-rose-500" />
                <span>{l}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card title="공식 링크" icon="fa-solid fa-link">
          <div className="flex flex-wrap gap-2">
            {tool.links.map((l, i) => (
              <a key={i} href={l.url} target="_blank" rel="noreferrer" className="rounded-lg border border-slate-300 px-3 py-2 text-[13px] font-semibold text-brand-700 transition hover:bg-slate-50">
                {l.label} ↗
              </a>
            ))}
          </div>
        </Card>
        <Card title="교재에서 더 배우기" icon="fa-solid fa-book">
          <div className="space-y-2">
            {tool.courseRefs.map((c, i) => (
              <Link key={i} to={c.to} className="block rounded-lg bg-slate-50 px-3 py-2.5 text-[13.5px] font-semibold text-brand-800 transition hover:bg-brand-50">
                <Icon name="fa-solid fa-book-open" /> {c.label} →
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </>
  )
}

/* ---------------- 하위 페이지 이전/다음 ---------------- */
function PageNav({ toolId, section }) {
  const idx = TOOL_PAGES.findIndex((p) => p.id === section)
  const prev = TOOL_PAGES[idx - 1]
  const next = TOOL_PAGES[idx + 1]
  return (
    <nav className="mt-8 grid grid-cols-2 gap-3 border-t border-slate-200 pt-6">
      {prev ? (
        <Link to={`/tools/${toolId}/${prev.id}`} className="rounded-xl border border-slate-200 p-4 text-left transition hover:border-brand-300 hover:bg-slate-50">
          <div className="text-[11.5px] text-slate-400">← 이전</div>
          <div className="text-[13.5px] font-semibold text-brand-800">{prev.label}</div>
        </Link>
      ) : <span />}
      {next ? (
        <Link to={`/tools/${toolId}/${next.id}`} className="rounded-xl border border-slate-200 p-4 text-right transition hover:border-brand-300 hover:bg-slate-50">
          <div className="text-[11.5px] text-slate-400">다음 →</div>
          <div className="text-[13.5px] font-semibold text-brand-800">{next.label}</div>
        </Link>
      ) : <span />}
    </nav>
  )
}
