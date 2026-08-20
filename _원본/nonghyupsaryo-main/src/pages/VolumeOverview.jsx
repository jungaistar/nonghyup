import { Link, useParams, Navigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { getVolume, partStats } from '../data/courses'
import { useProgress } from '../context/ProgressContext'
import Icon from '../components/Icon'

export default function VolumeOverview() {
  const { volId } = useParams()
  const vol = getVolume(volId)
  const { isDone, countDone } = useProgress()

  if (!vol) return <Navigate to="/" replace />

  const days = vol.parts.filter((p) => p.kind === 'day')
  const done = countDone(vol.id, days.map((d) => d.num))

  return (
    <Layout>
      <div className="mx-auto max-w-screen-xl px-5 py-8">
        {/* 헤더 */}
        <div className="rounded-2xl bg-brand-800 p-7 text-white">
          <div className="text-[12.5px] font-bold text-signal-300">{vol.label} · 8차시 전체 목차</div>
          <h1 className="mt-1 text-2xl font-extrabold leading-snug">{vol.title}</h1>
          <div className="mt-1 text-[14px] text-brand-100">{vol.subtitle}</div>
          <p className="mt-4 max-w-2xl text-[14px] leading-relaxed text-brand-100/90">{vol.desc}</p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              to={`/schedule/${vol.id}`}
              className="inline-flex items-center gap-2 rounded-lg bg-signal-400 px-4 py-2 text-[13px] font-bold text-brand-950 transition hover:bg-signal-300"
            >
              <Icon name="fa-solid fa-calendar-days" /> 8차시 교육 일정 보기
            </Link>
            <span className="text-[12.5px] text-brand-200">학습 진도 {done}/{days.length} 차시</span>
          </div>
        </div>

        {/* 전체 목차 */}
        <div className="mt-8 flex items-center gap-2">
          <Icon name="fa-solid fa-list-ol" className="text-brand-700" />
          <h2 className="text-lg font-bold text-brand-900">전체 목차 (Contents)</h2>
        </div>

        <div className="mt-4 space-y-3">
          {vol.parts.map((p) => {
            const st = partStats(p)
            const d = p.kind === 'day' && isDone(vol.id, p.num)
            return (
              <div key={p.num} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                {/* PART 헤더 */}
                <Link
                  to={`/vol/${vol.id}/part/${p.num}`}
                  className="flex items-center gap-3 border-b border-slate-100 bg-slate-50 px-5 py-3.5 transition hover:bg-brand-50"
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[13px] font-extrabold text-white ${
                      d ? 'bg-emerald-500' : 'bg-brand-800'
                    }`}
                  >
                    {d ? <Icon name="fa-solid fa-check" /> : String(p.num).padStart(2, '0')}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] font-bold text-slate-400">
                      {p.kind === 'day' ? `${p.day}차시` : `PART ${String(p.num).padStart(2, '0')} · 부록`}
                    </div>
                    <div className="truncate text-[15px] font-bold text-brand-900">{p.title}</div>
                  </div>
                  <div className="hidden shrink-0 gap-1.5 sm:flex">
                    {st.exercises > 0 && <Badge tone="signal">실습 {st.exercises}</Badge>}
                    {st.tables > 0 && <Badge tone="sky">표 {st.tables}</Badge>}
                    {st.figures > 0 && <Badge tone="violet">그림 {st.figures}</Badge>}
                  </div>
                </Link>

                {/* 절·항 목차 */}
                {p.sections.length > 0 && (
                  <ul className="px-5 py-3">
                    {p.sections.map((sec) => (
                      <li key={sec.num} className="py-1">
                        <Link
                          to={`/vol/${vol.id}/part/${p.num}`}
                          className="text-[13.5px] font-semibold text-slate-700 hover:text-brand-700"
                        >
                          {sec.title}
                        </Link>
                        {sec.subsections.length > 0 && (
                          <ul className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 pl-3">
                            {sec.subsections.map((ss) => (
                              <li key={ss.num} className="text-[12px] text-slate-400">
                                {ss.title}
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </Layout>
  )
}

function Badge({ children, tone = 'slate' }) {
  const tones = {
    slate: 'bg-slate-100 text-slate-500',
    signal: 'bg-signal-100 text-signal-700',
    sky: 'bg-sky-100 text-sky-700',
    violet: 'bg-violet-100 text-violet-700',
  }
  return (
    <span className={`rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${tones[tone]}`}>
      {children}
    </span>
  )
}
