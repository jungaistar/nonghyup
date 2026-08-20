import { useEffect } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import Layout from '../components/Layout'
import Icon from '../components/Icon'
import CopyButton from '../components/CopyButton'
import { labsByVol } from '../data/labs'
import { useProgress } from '../context/ProgressContext'

const VOLS = [
  { id: 'course', short: '본 과정' },
]
const LEVEL_STYLE = {
  입문: 'bg-emerald-100 text-emerald-700',
  실전: 'bg-sky-100 text-sky-700',
  심화: 'bg-violet-100 text-violet-700',
}


export default function Labs() {
  const { volId = 'course', day } = useParams()
  const data = labsByVol[volId]

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [volId, day])

  if (!data) return <Navigate to="/labs/course" replace />

  if (day) {
    const dayData = data.days.find((d) => String(d.day) === String(day))
    if (!dayData) return <Navigate to={`/labs/${volId}`} replace />
    return <DayPage volId={volId} data={data} dayData={dayData} />
  }
  return <IndexPage volId={volId} data={data} />
}

/* ---------------- 실습 인덱스 (DAY 카드) ---------------- */
function IndexPage({ volId, data }) {
  return (
    <Layout>
      <div className="mx-auto max-w-screen-xl px-5 py-8">
        <div className="mb-4 flex items-center gap-1.5 text-[12.5px] text-slate-400">
          <Link to="/" className="hover:text-brand-700">홈</Link>
          <span>/</span>
          <span className="text-slate-600">실습 · 따라하기</span>
        </div>

        <div className="mb-7 rounded-2xl bg-brand-900 p-7 text-white">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[12px] font-bold text-signal-300">
            <Icon name="fa-solid fa-flask-vial" /> 실습 · 따라하기
          </div>
          <h1 className="mt-3 text-2xl font-extrabold leading-snug">{data.title}</h1>
          <p className="mt-2 text-[14px] text-brand-100">
            차시를 선택하면 단계별로 여유 있게 따라 하는 실습이 열립니다. 프롬프트는 “평가하기” 기준(5요소·80점+)으로 준비했어요.
          </p>
        </div>

        <h2 className="mb-3 text-lg font-bold text-brand-900">차시를 선택하세요</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {data.days.map((d) => {
            const totalLabs = d.labs.length
            return (
              <Link
                key={d.day}
                to={`/labs/${volId}/${d.day}`}
                className="group flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md"
              >
                <span className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-brand-800 text-white">
                  <span className="text-lg font-extrabold leading-none">{d.day}</span>
                  <span className="mt-0.5 text-[8px] font-semibold leading-none">차시</span>
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-[14.5px] font-extrabold text-brand-900">{d.subject}</div>
                  <div className="mt-1 text-[12px] font-bold text-brand-600">실습 {totalLabs}개 →</div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </Layout>
  )
}

/* ---------------- DAY별 실습 페이지 ---------------- */
function DayPage({ volId, data, dayData }) {
  const idx = data.days.findIndex((d) => d.day === dayData.day)
  const prev = data.days[idx - 1]
  const next = data.days[idx + 1]
  const { isLabDone, toggleLab, countLabsDone } = useProgress()
  const dayDoneCount = countLabsDone(dayData.labs.map((_, i) => `${volId}/${dayData.day}/${i}`))

  return (
    <Layout>
      <div className="mx-auto max-w-screen-xl px-5 py-8">
        <div className="mb-4 flex items-center gap-1.5 text-[12.5px] text-slate-400">
          <Link to="/" className="hover:text-brand-700">홈</Link>
          <span>/</span>
          <Link to={`/labs/${volId}`} className="hover:text-brand-700">실습 · 따라하기</Link>
          <span>/</span>
          <span className="text-slate-600">{dayData.day}차시</span>
        </div>

        {/* DAY 칩 */}
        <div className="mb-6 flex flex-wrap gap-1.5">
          {data.days.map((d) => (
            <Link
              key={d.day}
              to={`/labs/${volId}/${d.day}`}
              className={`rounded-full px-3 py-1.5 text-[12.5px] font-semibold transition ${
                d.day === dayData.day ? 'bg-brand-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >{d.day}차시</Link>
          ))}
        </div>

        {/* Hero */}
        <div className="mb-7 rounded-2xl bg-gradient-to-br from-brand-700 to-brand-800 p-7 text-white shadow-sm">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-white/15 text-signal-300">
              <span className="text-2xl font-extrabold leading-none">{dayData.day}</span>
              <span className="mt-0.5 text-[9px] font-semibold leading-none">차시</span>
            </span>
            <div>
              <div className="text-[12px] font-bold text-signal-300">{data.label} · 실습 따라하기</div>
              <h1 className="mt-0.5 text-[22px] font-extrabold leading-snug">{dayData.subject}</h1>
              <div className="mt-1 text-[13px] text-brand-100">
                실습 {dayData.labs.length}개 · 시간별 진행 가이드 · <span className="font-bold text-signal-300">완료 {dayDoneCount}/{dayData.labs.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 실습들 */}
        <div className="space-y-5">
          {dayData.labs.map((lab, li) => {
            const done = isLabDone(volId, dayData.day, li)
            return (
            <div key={li} className={`overflow-hidden rounded-2xl border bg-white shadow-sm ${done ? 'border-emerald-300' : 'border-slate-200'}`}>
              <div className="flex flex-wrap items-center gap-2.5 border-b border-slate-100 bg-slate-50 px-5 py-3.5">
                <span className="shrink-0 rounded-md bg-brand-100 px-2 py-0.5 text-[11px] font-bold text-brand-700">{lab.code}</span>
                {lab.level && (
                  <span className={`shrink-0 rounded-md px-2 py-0.5 text-[11px] font-bold ${LEVEL_STYLE[lab.level] || 'bg-slate-200 text-slate-600'}`}>{lab.level}</span>
                )}
                {lab.duration && (
                  <span className="shrink-0 rounded-md bg-signal-100 px-2 py-0.5 text-[11px] font-bold text-signal-700">
                    <Icon name="fa-regular fa-clock" /> {lab.duration}
                  </span>
                )}
                <span className="text-[11px] text-slate-400">{lab.tool}</span>
                <button
                  onClick={() => toggleLab(volId, dayData.day, li)}
                  className={`ml-auto shrink-0 rounded-lg px-3 py-1 text-[11.5px] font-bold transition ${
                    done ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'border border-slate-300 text-slate-600 hover:bg-white'
                  }`}
                >
                  <Icon name={done ? 'fa-solid fa-circle-check' : 'fa-regular fa-circle'} /> {done ? '실습 완료' : '실습 완료 체크'}
                </button>
              </div>

              <div className="p-5">
                <h3 className="text-[16px] font-extrabold text-brand-900">{lab.title}</h3>
                <p className="mt-1 mb-4 text-[13px] text-slate-500"><b className="text-brand-700">목표</b> {lab.goal}</p>

                <ol className="space-y-4">
                  {lab.steps.map((s, si) => (
                    <li key={si} className="relative border-l-2 border-brand-100 pl-5">
                      <span className="absolute -left-[11px] top-0 flex h-5 w-5 items-center justify-center rounded-full bg-brand-800 text-[10.5px] font-bold text-white">
                        {si + 1}
                      </span>
                      <div className="flex flex-wrap items-center gap-2">
                        {s.time && (
                          <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] font-bold text-slate-500">
                            <Icon name="fa-regular fa-clock" /> {s.time}
                          </span>
                        )}
                        <p className="text-[14px] font-semibold leading-relaxed text-slate-800">{s.instruction}</p>
                      </div>
                      {s.prompt && (
                        <div className="mt-2 rounded-xl border border-slate-700 bg-slate-900 p-3.5">
                          <div className="mb-1 flex items-center justify-between">
                            <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">붙여넣을 프롬프트</span>
                            <CopyButton text={s.prompt} />
                          </div>
                          <pre className="whitespace-pre-wrap break-words font-mono text-[12.5px] leading-relaxed text-slate-100">{s.prompt}</pre>
                        </div>
                      )}
                      {s.expected && (
                        <div className="mt-2 flex items-start gap-2 rounded-lg bg-emerald-50 p-2.5 text-[12.5px] text-slate-700">
                          <Icon name="fa-solid fa-arrow-right" className="mt-0.5 shrink-0 text-emerald-500" />
                          <span><b className="text-emerald-700">결과</b> {s.expected}</span>
                        </div>
                      )}
                    </li>
                  ))}
                </ol>

                {lab.deliverable && (
                  <div className="mt-4 flex items-start gap-2 rounded-lg bg-signal-50 p-3 text-[13px] text-slate-700">
                    <Icon name="fa-solid fa-box-archive" className="mt-0.5 shrink-0 text-signal-600" />
                    <span><b className="text-signal-700">산출물</b> {lab.deliverable}</span>
                  </div>
                )}
                {lab.evalNote && (
                  <div className="mt-2 flex items-start gap-2 rounded-lg bg-sky-50 p-3 text-[12.5px] text-slate-700">
                    <Icon name="fa-solid fa-circle-check" className="mt-0.5 shrink-0 text-sky-500" />
                    <span><b className="text-sky-700">평가 포인트</b> {lab.evalNote}</span>
                  </div>
                )}
              </div>
            </div>
            )
          })}
        </div>

        {/* 이전/다음 DAY */}
        <nav className="mt-8 grid grid-cols-2 gap-3 border-t border-slate-200 pt-6">
          {prev ? (
            <Link to={`/labs/${volId}/${prev.day}`} className="rounded-xl border border-slate-200 p-4 text-left transition hover:border-brand-300 hover:bg-slate-50">
              <div className="text-[11.5px] text-slate-400">← 이전 {prev.day}차시</div>
              <div className="truncate text-[13.5px] font-semibold text-brand-800">{prev.subject}</div>
            </Link>
          ) : <span />}
          {next ? (
            <Link to={`/labs/${volId}/${next.day}`} className="rounded-xl border border-slate-200 p-4 text-right transition hover:border-brand-300 hover:bg-slate-50">
              <div className="text-[11.5px] text-slate-400">다음 {next.day}차시 →</div>
              <div className="truncate text-[13.5px] font-semibold text-brand-800">{next.subject}</div>
            </Link>
          ) : <span />}
        </nav>
      </div>
    </Layout>
  )
}
