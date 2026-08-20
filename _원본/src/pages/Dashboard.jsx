import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import Icon from '../components/Icon'
import { volumes } from '../data/courses'
import { labsByVol } from '../data/labs'
import { useProgress } from '../context/ProgressContext'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { isDone, countDone, setDone, countLabsDone } = useProgress()
  const { user } = useAuth()

  // 실습 집계
  const allLabKeys = Object.entries(labsByVol).flatMap(([vid, v]) =>
    v.days.flatMap((d) => d.labs.map((_, i) => `${vid}/${d.day}/${i}`))
  )
  const labTotal = allLabKeys.length
  const labDone = countLabsDone(allLabKeys)
  const labPct = labTotal ? Math.round((labDone / labTotal) * 100) : 0

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // 전체 차시 집계 (1일 8차시)
  const allDays = volumes.flatMap((v) =>
    v.parts.filter((p) => p.kind === 'day').map((p) => ({ volId: v.id, num: p.num }))
  )
  const total = allDays.length
  const doneCount = allDays.filter((d) => isDone(d.volId, d.num)).length
  const pct = Math.round((doneCount / total) * 100)
  const name =
    user?.user_metadata?.name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || '학습자'

  return (
    <Layout withSidebar={false}>
      <div className="mx-auto max-w-screen-xl px-5 py-8">
        <div className="mb-4 flex items-center gap-1.5 text-[12.5px] text-slate-400">
          <Link to="/" className="hover:text-brand-700">홈</Link>
          <span>/</span>
          <span className="text-slate-600">내 학습</span>
        </div>

        {/* 헤더 + 전체 진행 */}
        <div className="mb-8 flex flex-col items-center gap-6 rounded-2xl bg-brand-900 p-8 text-white sm:flex-row sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[12px] font-bold text-signal-300">
              <Icon name="fa-solid fa-stamp" /> 학습 도장깨기
            </div>
            <h1 className="mt-3 text-2xl font-extrabold">{name}님의 학습 현황</h1>
            <p className="mt-2 text-[14px] text-brand-100">
              총 {total}개 차시 중 <b className="text-signal-300">{doneCount}개</b>를 완료했어요.
              {doneCount === total ? ' 🎉 전 과정 완주!' : ' 도장을 모두 모아보세요!'}
            </p>
            {!user && (
              <p className="mt-2 text-[12px] text-brand-200">
                ※ 로그인하면 도장(진도)이 기기 간에 동기화됩니다.
              </p>
            )}
          </div>

          {/* 진행 링 */}
          <ProgressRing pct={pct} />
        </div>

        {/* 권별 도장판 */}
        <div className="space-y-7">
          {volumes.map((v) => {
            const days = v.parts.filter((p) => p.kind === 'day')
            const vDone = countDone(v.id, days.map((d) => d.num))
            return (
              <section key={v.id}>
                <div className="mb-3 flex items-end justify-between gap-3">
                  <div className="flex items-start gap-2">
                    <Icon name="fa-solid fa-book" className="mt-1 text-brand-600" />
                    <div className="leading-tight">
                      <h2 className="text-[16px] font-extrabold text-brand-900">{v.title}</h2>
                      <div className="mt-0.5 text-[12px] font-semibold text-slate-400">
                        {v.label}
                        {v.subtitle ? ` · ${v.subtitle}` : ''}
                      </div>
                    </div>
                  </div>
                  <span className="shrink-0 text-[13px] font-semibold text-slate-500">{vDone}/{days.length} 완료</span>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                  {days.map((p) => {
                    const done = isDone(v.id, p.num)
                    return (
                      <div
                        key={p.num}
                        className={`group relative overflow-hidden rounded-2xl border p-4 text-center transition ${
                          done ? 'border-emerald-300 bg-emerald-50' : 'border-dashed border-slate-300 bg-white'
                        }`}
                      >
                        <Link to={`/vol/${v.id}/part/${p.num}`} className="block">
                          {/* 도장 */}
                          <div
                            className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 ${
                              done
                                ? 'border-emerald-500 bg-emerald-500 text-white shadow-inner'
                                : 'border-slate-200 bg-slate-50 text-slate-300'
                            }`}
                          >
                            {done ? (
                              <div className="leading-none">
                                <Icon name="fa-solid fa-check" className="text-xl" />
                              </div>
                            ) : (
                              <span className="text-[11px] font-bold">{p.day}차시</span>
                            )}
                          </div>
                          <div className={`mt-2 text-[12px] font-bold ${done ? 'text-emerald-700' : 'text-slate-400'}`}>
                            {p.day}차시
                          </div>
                          <div className="mt-0.5 line-clamp-2 h-8 text-[11px] leading-tight text-slate-500">{p.title}</div>
                        </Link>

                        {/* 완료 토글 */}
                        <button
                          onClick={() => setDone(v.id, p.num, !done)}
                          className={`mt-2 w-full rounded-lg py-1.5 text-[11.5px] font-bold transition ${
                            done
                              ? 'bg-white text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100'
                              : 'bg-brand-800 text-white hover:bg-brand-700'
                          }`}
                        >
                          {done ? '완료 취소' : '학습 완료'}
                        </button>
                      </div>
                    )
                  })}
                </div>
              </section>
            )
          })}
        </div>

        {/* 실습 따라하기 진행 */}
        <section className="mt-10">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-bold text-brand-900">
              <Icon name="fa-solid fa-flask-vial" className="text-brand-600" />
              실습 따라하기 진행
            </h2>
            <span className="text-[13px] font-semibold text-slate-500">{labDone}/{labTotal} 완료 · {labPct}%</span>
          </div>
          <div className="space-y-5">
            {Object.entries(labsByVol).map(([vid, v]) => (
              <div key={vid} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-3 text-[14px] font-extrabold text-brand-900">{v.title}</div>
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
                  {v.days.map((d) => {
                    const keys = d.labs.map((_, i) => `${vid}/${d.day}/${i}`)
                    const done = countLabsDone(keys)
                    const all = done === d.labs.length && d.labs.length > 0
                    const pct = Math.round((done / d.labs.length) * 100)
                    return (
                      <Link
                        key={d.day}
                        to={`/labs/${vid}/${d.day}`}
                        className={`rounded-xl border p-3 text-center transition hover:shadow-sm ${
                          all ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 bg-white'
                        }`}
                      >
                        <div className={`text-[12px] font-bold ${all ? 'text-emerald-700' : 'text-brand-800'}`}>
                          {d.day}차시 {all && <Icon name="fa-solid fa-check" />}
                        </div>
                        <div className="mt-1 text-[11px] text-slate-500">{done}/{d.labs.length} 실습</div>
                        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
                          <div className={`h-full rounded-full ${all ? 'bg-emerald-500' : 'bg-brand-500'}`} style={{ width: `${pct}%` }} />
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 완주 배지 */}
        {doneCount === total && (
          <div className="mt-8 rounded-2xl border-2 border-signal-300 bg-signal-50 p-6 text-center">
            <div className="text-3xl text-signal-500"><Icon name="fa-solid fa-trophy" /></div>
            <div className="mt-2 text-[16px] font-extrabold text-brand-900">축하합니다! 전 과정을 완주했어요 🎉</div>
            <div className="mt-1 text-[13px] text-slate-500">8개 차시 도장을 모두 모았습니다.</div>
          </div>
        )}
      </div>
    </Layout>
  )
}

function ProgressRing({ pct }) {
  const r = 46
  const c = 2 * Math.PI * r
  const offset = c - (pct / 100) * c
  return (
    <div className="relative h-32 w-32 shrink-0">
      <svg className="h-32 w-32 -rotate-90" viewBox="0 0 110 110">
        <circle cx="55" cy="55" r={r} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="9" />
        <circle
          cx="55"
          cy="55"
          r={r}
          fill="none"
          stroke="#fbbf24"
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-2xl font-extrabold text-signal-300">{pct}%</div>
        <div className="text-[10.5px] text-brand-200">완료</div>
      </div>
    </div>
  )
}
