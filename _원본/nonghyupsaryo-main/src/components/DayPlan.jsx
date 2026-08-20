import { Link } from 'react-router-dom'
import Icon from './Icon'

const BLOCK_STYLE = {
  도입: { dot: 'bg-slate-400', tag: 'bg-slate-100 text-slate-600' },
  학습: { dot: 'bg-sky-500', tag: 'bg-sky-100 text-sky-700' },
  실습: { dot: 'bg-signal-500', tag: 'bg-signal-100 text-signal-700' },
  점심: { dot: 'bg-slate-300', tag: 'bg-slate-100 text-slate-400' },
  정리: { dot: 'bg-emerald-500', tag: 'bg-emerald-100 text-emerald-700' },
}

// plan: { day, title, partNum, blocks:[{start,end,type,title,desc,star,partRef}] }
export default function DayPlan({ plan, defaultOpen = true }) {
  if (!plan) return null
  return (
    <details
      open={defaultOpen}
      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm [&_summary]:list-none"
    >
      <summary className="flex cursor-pointer items-center gap-3 bg-brand-50 px-5 py-4 hover:bg-brand-100/60">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-800 text-[15px] text-signal-400">
          <Icon name="fa-solid fa-calendar-day" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[15px] font-extrabold text-brand-900">{plan.title}</div>
          <div className="text-[12px] text-slate-500">8차시 교육 운영안 (08:00–17:00, 점심 1시간 제외 · 학습+실습 병행)</div>
        </div>
        <Icon name="fa-solid fa-chevron-down" className="shrink-0 text-slate-400 transition group-open:rotate-180" />
      </summary>

      <div className="divide-y divide-slate-100 px-2 py-2">
        {plan.blocks.map((b, i) => {
          const st = BLOCK_STYLE[b.type] || BLOCK_STYLE['학습']
          return (
            <div key={i} className="flex items-start gap-3 px-3 py-2.5">
              <div className="w-[96px] shrink-0 pt-0.5">
                {b.period && (
                  <div className="text-[11px] font-bold text-brand-700">{b.period}</div>
                )}
                <div className="font-mono text-[11.5px] font-semibold text-slate-500">
                  {b.start}–{b.end}
                </div>
              </div>
              <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${st.dot}`} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded px-1.5 py-0.5 text-[10.5px] font-bold ${st.tag}`}>{b.type}</span>
                  {b.partRef ? (
                    <Link to={b.partRef} className="text-[14px] font-bold text-brand-900 hover:text-brand-600 hover:underline">
                      {b.title}
                    </Link>
                  ) : (
                    <span className="text-[14px] font-bold text-brand-900">{b.title}</span>
                  )}
                  {b.star && <span className="text-[11px] font-bold text-signal-600">★ BIG WIN</span>}
                </div>
                {b.desc && <div className="mt-0.5 text-[12.5px] leading-relaxed text-slate-500">{b.desc}</div>}
              </div>
            </div>
          )
        })}
      </div>
    </details>
  )
}
