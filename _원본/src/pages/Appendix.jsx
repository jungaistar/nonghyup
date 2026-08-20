import { useEffect } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import Layout from '../components/Layout'
import Icon from '../components/Icon'
import CopyButton from '../components/CopyButton'
import { appendix, appendixIntro, getAppendixCategory } from '../data/appendix'

const GRADE_COLOR = { S: '#1D7A4F', A: '#1D4E89', B: '#3D6FE0' }

export default function Appendix() {
  const { catId } = useParams()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [catId])

  if (catId) {
    const cat = getAppendixCategory(catId)
    if (!cat) return <Navigate to="/appendix" replace />
    return <CategoryPage cat={cat} />
  }
  return <IndexPage />
}

/* ---------------- 부록 인덱스 ---------------- */
function IndexPage() {
  return (
    <Layout>
      <div className="mx-auto max-w-screen-xl px-5 py-8">
        <div className="mb-4 flex items-center gap-1.5 text-[12.5px] text-slate-400">
          <Link to="/" className="hover:text-brand-700">홈</Link>
          <span>/</span>
          <span className="text-slate-600">부록</span>
        </div>

        <div className="mb-6 rounded-2xl bg-brand-900 p-7 text-white">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[12px] font-bold text-signal-300">
            <Icon name="fa-solid fa-book-bookmark" /> 부록
          </div>
          <h1 className="mt-3 text-2xl font-extrabold">{appendixIntro.title}</h1>
          <p className="mt-2 text-[14px] text-brand-100">{appendixIntro.lead}</p>
        </div>

        <div className="mb-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-3 flex items-center gap-2 text-[16px] font-extrabold text-brand-900">
            <Icon name="fa-solid fa-circle-play" className="text-brand-600" /> 처음이세요? 이렇게 쓰면 돼요
          </h2>
          <ol className="space-y-2">
            {appendixIntro.howto.map((h, i) => (
              <li key={i} className="flex gap-3 text-[14px] leading-relaxed text-slate-700">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-800 text-[11px] font-bold text-white">{i + 1}</span>
                <span>{h}</span>
              </li>
            ))}
          </ol>
        </div>

        <h2 className="mb-3 text-lg font-bold text-brand-900">업무 카테고리</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {appendix.map((cat) => (
            <Link
              key={cat.id}
              to={`/appendix/${cat.id}`}
              className="group flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-[18px] text-brand-700">
                <Icon name={cat.icon} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-[15px] font-extrabold text-brand-900">{cat.category}</div>
                <div className="mt-0.5 text-[12.5px] leading-relaxed text-slate-500">{cat.desc}</div>
                <div className="mt-2 text-[11.5px] font-bold text-brand-600">
                  프롬프트 예제 {cat.prompts.length}개 →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  )
}

/* ---------------- 카테고리별 프롬프트 페이지 ---------------- */
function CategoryPage({ cat }) {
  const idx = appendix.findIndex((c) => c.id === cat.id)
  const prev = appendix[idx - 1]
  const next = appendix[idx + 1]

  return (
    <Layout>
      <div className="mx-auto max-w-screen-xl px-5 py-8">
        <div className="mb-4 flex items-center gap-1.5 text-[12.5px] text-slate-400">
          <Link to="/" className="hover:text-brand-700">홈</Link>
          <span>/</span>
          <Link to="/appendix" className="hover:text-brand-700">부록</Link>
          <span>/</span>
          <span className="text-slate-600">{cat.category}</span>
        </div>

        {/* 카테고리 칩 */}
        <div className="mb-6 flex flex-wrap gap-1.5">
          {appendix.map((c) => (
            <Link
              key={c.id}
              to={`/appendix/${c.id}`}
              className={`rounded-full px-3 py-1.5 text-[12.5px] font-semibold transition ${
                c.id === cat.id ? 'bg-brand-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c.category}
            </Link>
          ))}
        </div>

        {/* Hero */}
        <div className="mb-6 rounded-2xl bg-gradient-to-br from-brand-700 to-brand-800 p-7 text-white shadow-sm">
          <div className="flex items-center gap-4">
            <span className="text-4xl text-signal-400"><Icon name={cat.icon} /></span>
            <div>
              <h1 className="text-[24px] font-extrabold leading-none">{cat.category}</h1>
              <div className="mt-1.5 text-[13px] text-brand-100">{cat.desc} · 80점 이상 예제 {cat.prompts.length}개</div>
            </div>
          </div>
        </div>

        {/* 프롬프트 예제들 */}
        <div className="space-y-5">
          {cat.prompts.map((p, i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-start gap-3 border-b border-slate-100 bg-slate-50 px-5 py-3.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-800 text-[12px] font-bold text-white">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-[15px] font-extrabold text-brand-900">{p.title}</div>
                  <div className="mt-0.5 flex items-start gap-1.5 text-[12.5px] text-slate-500">
                    <Icon name="fa-solid fa-circle-question" className="mt-0.5 shrink-0 text-slate-400" />
                    <span>{p.when}</span>
                  </div>
                </div>
                {p.total && (
                  <span
                    className="flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-[11.5px] font-extrabold text-white"
                    style={{ background: GRADE_COLOR[p.grade] || '#234d86' }}
                  >
                    {p.total}점 {p.grade}
                  </span>
                )}
              </div>

              <div className="space-y-4 p-5">
                {p.strength && (
                  <div className="flex items-start gap-2 rounded-lg bg-sky-50 p-3 text-[12.5px] leading-relaxed text-slate-700">
                    <Icon name="fa-solid fa-circle-check" className="mt-0.5 shrink-0 text-sky-500" />
                    <span><b className="text-sky-700">왜 좋은 프롬프트?</b> {p.strength}</span>
                  </div>
                )}

                <div className="rounded-xl border border-slate-700 bg-slate-900 p-4">
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">복사용 프롬프트 (5요소 포함)</span>
                    <CopyButton text={p.prompt} />
                  </div>
                  <pre className="whitespace-pre-wrap break-words font-mono text-[12.5px] leading-relaxed text-slate-100">{p.prompt}</pre>
                </div>

                {p.fill?.length > 0 && (
                  <div className="rounded-xl bg-amber-50 p-4">
                    <div className="mb-2 text-[12px] font-bold text-amber-800">
                      <Icon name="fa-solid fa-pen" /> 대괄호 [ ] 채우는 법
                    </div>
                    <div className="space-y-1.5">
                      {p.fill.map((f, fi) => (
                        <div key={fi} className="flex flex-wrap items-baseline gap-2 text-[13px]">
                          <span className="rounded bg-white px-1.5 py-0.5 font-mono text-[12px] font-bold text-brand-700 ring-1 ring-amber-200">{f.blank}</span>
                          <span className="text-slate-400">→ 예:</span>
                          <span className="font-medium text-slate-700">{f.example}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-2 rounded-lg bg-emerald-50 p-3 text-[13px] leading-relaxed text-slate-700">
                  <Icon name="fa-solid fa-arrow-right" className="mt-0.5 shrink-0 text-emerald-500" />
                  <span><b className="text-emerald-700">이런 결과</b> {p.result}</span>
                </div>
                {p.tip && (
                  <div className="flex items-start gap-2 text-[12.5px] leading-relaxed text-slate-500">
                    <Icon name="fa-solid fa-lightbulb" className="mt-0.5 shrink-0 text-signal-500" />
                    <span>{p.tip}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 이전/다음 카테고리 */}
        <nav className="mt-8 grid grid-cols-2 gap-3 border-t border-slate-200 pt-6">
          {prev ? (
            <Link to={`/appendix/${prev.id}`} className="rounded-xl border border-slate-200 p-4 text-left transition hover:border-brand-300 hover:bg-slate-50">
              <div className="text-[11.5px] text-slate-400">← 이전</div>
              <div className="text-[13.5px] font-semibold text-brand-800">{prev.category}</div>
            </Link>
          ) : <span />}
          {next ? (
            <Link to={`/appendix/${next.id}`} className="rounded-xl border border-slate-200 p-4 text-right transition hover:border-brand-300 hover:bg-slate-50">
              <div className="text-[11.5px] text-slate-400">다음 →</div>
              <div className="text-[13.5px] font-semibold text-brand-800">{next.category}</div>
            </Link>
          ) : <span />}
        </nav>
      </div>
    </Layout>
  )
}
