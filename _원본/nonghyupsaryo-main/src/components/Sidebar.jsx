import { Link, useParams, useLocation } from 'react-router-dom'
import { getVolume, volumes } from '../data/courses'
import { toolMenu, getTool, TOOL_PAGES } from '../data/tools'
import { ABOUT_PAGES } from '../data/about'
import { dayPlans } from '../data/dayplans'
import { labsByVol } from '../data/labs'
import { PROMPT_SECTIONS } from '../data/promptLab'
import { appendix } from '../data/appendix'
import Icon from './Icon'
import { useProgress } from '../context/ProgressContext'

export default function Sidebar({ open, onClose }) {
  const loc = useLocation()
  const mode = loc.pathname.startsWith('/tools')
    ? 'tools'
    : loc.pathname.startsWith('/about')
    ? 'about'
    : loc.pathname.startsWith('/schedule')
    ? 'schedule'
    : loc.pathname.startsWith('/labs')
    ? 'labs'
    : loc.pathname.startsWith('/appendix')
    ? 'appendix'
    : 'vol'

  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden" onClick={onClose} />}

      <aside
        className={`sidebar-scroll fixed left-0 top-14 z-30 h-[calc(100vh-3.5rem)] w-72 overflow-y-auto border-r border-slate-200 bg-white transition-transform lg:sticky lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4">
          {mode === 'vol' && <VolumeNav onClose={onClose} />}
          {mode === 'tools' && <ToolsNav onClose={onClose} />}
          {mode === 'about' && <AboutNav onClose={onClose} />}
          {mode === 'schedule' && <ScheduleNav onClose={onClose} />}
          {mode === 'labs' && <LabsNav onClose={onClose} />}
          {mode === 'appendix' && <AppendixNav onClose={onClose} />}
        </div>
      </aside>
    </>
  )
}

function SectionLabel({ children, className = '' }) {
  return (
    <div className={`px-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 ${className}`}>
      {children}
    </div>
  )
}

/* ---------------- 제1·2권 교재 전체 목차 ---------------- */
function VolumeNav({ onClose }) {
  const { volId, partNum } = useParams()
  const vol = getVolume(volId) || volumes[0]
  const { isDone } = useProgress()

  // 절 클릭: 해당 PART로 이동 후 절 위치로 스크롤
  const goSection = (pnum, snum, e) => {
    const samePart = String(pnum) === String(partNum)
    if (samePart) {
      e.preventDefault()
      document.getElementById(`sec-${snum}`)?.scrollIntoView({ behavior: 'smooth' })
      onClose?.()
    } else {
      // Link 기본 이동 → 이동 후 스크롤
      setTimeout(() => document.getElementById(`sec-${snum}`)?.scrollIntoView({ behavior: 'smooth' }), 400)
      onClose?.()
    }
  }

  return (
    <>
      <div className="mb-3 rounded-xl bg-brand-800 px-3 py-2.5 text-center text-[12.5px] font-bold text-white">
        {vol.title}
      </div>

      <Link
        to={`/schedule/${vol.id}`}
        onClick={onClose}
        className="mb-3 block rounded-lg bg-signal-50 px-2.5 py-2 text-[12px] font-semibold text-signal-700 hover:bg-signal-100"
      >
        <Icon name="fa-solid fa-calendar-days" /> 8차시 교육 일정 보기
      </Link>

      <SectionLabel>학습 목차 (Contents)</SectionLabel>
      <nav className="mt-1.5 space-y-0.5">
        {vol.parts.map((p) => {
          const active = String(p.num) === String(partNum)
          const done = p.kind === 'day' && isDone(vol.id, p.num)
          const label = p.kind === 'day' ? `${p.day}차시` : `PART ${String(p.num).padStart(2, '0')} · 부록`
          return (
            <details key={p.num} open={active} className="group [&_summary]:list-none">
              <summary className="flex cursor-pointer items-start gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-50">
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[10px] font-bold ${
                    done ? 'bg-emerald-500 text-white' : active ? 'bg-brand-800 text-white' : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {done ? <Icon name="fa-solid fa-check" /> : p.kind === 'day' ? p.day : p.num}
                </span>
                <span className="min-w-0 flex-1">
                  <span className={`block text-[10px] font-semibold ${active ? 'text-brand-600' : 'text-slate-400'}`}>{label}</span>
                  <span className={`block text-[12.5px] leading-snug ${active ? 'font-bold text-brand-900' : 'font-semibold text-slate-700'}`}>{p.title}</span>
                </span>
                <Icon name="fa-solid fa-chevron-down" className="mt-1 shrink-0 text-[10px] text-slate-300 transition group-open:rotate-180" />
              </summary>

              {p.sections.length > 0 && (
                <ul className="mb-1 ml-7 mt-0.5 space-y-0.5 border-l border-slate-100 pl-2">
                  {p.sections.map((sec) => (
                    <li key={sec.num}>
                      <Link
                        to={`/vol/${vol.id}/part/${p.num}`}
                        onClick={(e) => goSection(p.num, sec.num, e)}
                        className="block rounded px-1.5 py-1 text-[12px] leading-snug text-slate-600 hover:bg-brand-50 hover:text-brand-700"
                      >
                        {sec.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </details>
          )
        })}
      </nav>
    </>
  )
}

/* ---------------- AI 도구 가이드 ---------------- */
function ToolsNav({ onClose }) {
  const loc = useLocation()
  const { toolId, section } = useParams()

  // 프롬프트 영역이면 5개 하위 메뉴를 보여준다
  if (loc.pathname.startsWith('/tools/prompt')) {
    return (
      <>
        <div className="mb-3 flex items-center gap-2.5 rounded-xl bg-signal-50 px-3 py-2.5">
          <span className="text-[17px] text-signal-600"><Icon name="fa-solid fa-pen-nib" /></span>
          <div className="text-[14px] font-extrabold text-brand-900">프롬프트</div>
        </div>

        <SectionLabel>프롬프트 메뉴</SectionLabel>
        <nav className="mt-1.5 space-y-0.5">
          {PROMPT_SECTIONS.map((s) => {
            const active = loc.pathname === `/tools/prompt/${s.id}`
            return (
              <Link
                key={s.id}
                to={`/tools/prompt/${s.id}`}
                onClick={onClose}
                className={`flex items-start gap-2.5 rounded-lg px-3 py-2 transition ${
                  active ? 'bg-brand-50 ring-1 ring-brand-200' : 'hover:bg-slate-50'
                }`}
              >
                <span className="mt-0.5 w-5 text-center text-brand-600"><Icon name={s.icon} /></span>
                <span className="min-w-0">
                  <span className={`block text-[13px] ${active ? 'font-bold text-brand-900' : 'font-medium text-slate-600'}`}>{s.label}</span>
                  <span className="block text-[11px] text-slate-400">{s.desc}</span>
                </span>
              </Link>
            )
          })}
        </nav>

        <SectionLabel className="mt-5">다른 도구</SectionLabel>
        <nav className="mt-1.5 space-y-0.5">
          {toolMenu.filter((t) => t.id !== 'prompt').map((t) => (
            <Link
              key={t.id}
              to={`/tools/${t.id}`}
              onClick={onClose}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 transition hover:bg-slate-50"
            >
              <span className="w-5 text-center text-slate-500"><Icon name={t.icon} /></span>
              <span className="text-[12.5px] text-slate-500">{t.name}</span>
            </Link>
          ))}
        </nav>
      </>
    )
  }

  // 개별 도구 상세 페이지면 그 도구의 하위 페이지 메뉴를 보여준다
  const tool = toolId && toolId !== 'prompt' ? getTool(toolId) : null
  const curSection = section || 'overview'

  if (tool) {
    return (
      <>
        {/* 현재 도구 헤더 */}
        <div className="mb-3 flex items-center gap-2.5 rounded-xl bg-brand-50 px-3 py-2.5">
          <span className="text-[17px] text-brand-700"><Icon name={tool.icon} /></span>
          <div className="leading-tight">
            <div className="text-[14px] font-extrabold text-brand-900">{tool.name}</div>
            <div className="text-[10.5px] text-slate-400">{tool.vendor}</div>
          </div>
        </div>

        <SectionLabel>{tool.name} 메뉴</SectionLabel>
        <nav className="mt-1.5 space-y-0.5">
          {TOOL_PAGES.map((p) => {
            const active = p.id === curSection
            return (
              <Link
                key={p.id}
                to={`/tools/${tool.id}/${p.id}`}
                onClick={onClose}
                className={`flex items-start gap-2.5 rounded-lg px-3 py-2 transition ${
                  active ? 'bg-brand-50 ring-1 ring-brand-200' : 'hover:bg-slate-50'
                }`}
              >
                <span className="mt-0.5 w-5 text-center text-brand-600"><Icon name={p.icon} /></span>
                <span className="min-w-0">
                  <span className={`block text-[13px] ${active ? 'font-bold text-brand-900' : 'font-medium text-slate-600'}`}>{p.label}</span>
                  <span className="block text-[11px] text-slate-400">{p.desc}</span>
                </span>
              </Link>
            )
          })}
        </nav>

        <SectionLabel className="mt-5">다른 도구</SectionLabel>
        <nav className="mt-1.5 space-y-0.5">
          {toolMenu.map((t) => {
            const to = t.id === 'prompt' ? '/tools/prompt' : `/tools/${t.id}`
            const active = t.id === tool.id
            return (
              <Link
                key={t.id}
                to={to}
                onClick={onClose}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 transition ${
                  active ? 'bg-brand-50 ring-1 ring-brand-200' : 'hover:bg-slate-50'
                }`}
              >
                <span className="w-5 text-center text-slate-500"><Icon name={t.icon} /></span>
                <span className={`text-[12.5px] ${active ? 'font-bold text-brand-900' : 'text-slate-500'}`}>
                  {t.name}
                </span>
              </Link>
            )
          })}
        </nav>
      </>
    )
  }

  // /tools 또는 /tools/prompt → 전체 도구 목록
  return (
    <>
      <SectionLabel>AI 도구 가이드</SectionLabel>
      <Link
        to="/tools"
        onClick={onClose}
        className={`mt-1.5 mb-2 block rounded-lg px-3 py-2 text-[13px] font-semibold transition ${
          loc.pathname === '/tools' ? 'bg-brand-50 text-brand-800 ring-1 ring-brand-200' : 'text-brand-700 hover:bg-brand-50'
        }`}
      >
        <Icon name="fa-solid fa-toolbox" /> 전체 보기
      </Link>

      <nav className="space-y-0.5">
        {toolMenu.map((t) => {
          const to = t.id === 'prompt' ? '/tools/prompt' : `/tools/${t.id}`
          const active = loc.pathname === to
          return (
            <Link
              key={t.id}
              to={to}
              onClick={onClose}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 transition ${
                active ? 'bg-brand-50 ring-1 ring-brand-200' : 'hover:bg-slate-50'
              }`}
            >
              <span className="w-5 text-center text-brand-600"><Icon name={t.icon} /></span>
              <span className={`text-[13.5px] ${active ? 'font-bold text-brand-900' : 'font-medium text-slate-600'}`}>
                {t.name}
              </span>
            </Link>
          )
        })}
      </nav>

      <div className="mt-5 rounded-xl bg-slate-50 p-3 text-[11.5px] leading-relaxed text-slate-400">
        프롬프트 작성법과 5대 AI 도구의 강점·요금제·실무 활용·실습 사례를 정리했습니다.
      </div>
    </>
  )
}

/* ---------------- 교육 일정 ---------------- */
function ScheduleNav({ onClose }) {
  const { volId } = useParams()
  const vid = getVolume(volId) ? volId : 'course'
  const plans = Object.values(dayPlans[vid] || {}).sort((a, b) => a.day - b.day)
  const go = (d) => {
    document.getElementById(`day-${d}`)?.scrollIntoView({ behavior: 'smooth' })
    onClose?.()
  }
  return (
    <>
      <div className="mb-4 rounded-xl bg-brand-800 px-3 py-2.5 text-center text-[12.5px] font-bold text-white">
        1일 8차시 교육 일정
      </div>

      <SectionLabel>교육 일정 · 차시</SectionLabel>
      <nav className="mt-1.5 space-y-0.5">
        {plans.map((p) => (
          <button
            key={p.day}
            onClick={() => go(p.day)}
            className="flex w-full items-start gap-2.5 rounded-lg px-2.5 py-2 text-left transition hover:bg-slate-50"
          >
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-brand-800 text-[10px] font-bold text-white">
              <Icon name="fa-solid fa-clock" />
            </span>
            <span className="min-w-0">
              <span className="block text-[10.5px] font-semibold text-slate-400">08:00–17:00 타임테이블</span>
              <span className="block text-[13px] leading-snug text-slate-600">{p.title}</span>
            </span>
          </button>
        ))}
      </nav>

      <Link
        to={`/vol/${vid}`}
        onClick={onClose}
        className="mt-4 block rounded-lg px-3 py-2 text-[12.5px] font-semibold text-brand-700 hover:bg-brand-50"
      >
        <Icon name="fa-solid fa-book" /> 교재 전체 목차 보기
      </Link>
    </>
  )
}

/* ---------------- 실습 따라하기 ---------------- */
function LabsNav({ onClose }) {
  const { volId, day } = useParams()
  const loc = useLocation()
  const vid = labsByVol[volId] ? volId : 'course'
  const days = labsByVol[vid]?.days || []
  return (
    <>
      <Link
        to={`/labs/${vid}`}
        onClick={onClose}
        className={`mb-2 block rounded-lg px-3 py-2 text-[12.5px] font-semibold transition ${
          loc.pathname === `/labs/${vid}` ? 'bg-brand-50 text-brand-800 ring-1 ring-brand-200' : 'text-brand-700 hover:bg-brand-50'
        }`}
      >
        <Icon name="fa-solid fa-flask-vial" /> 실습 전체 보기
      </Link>

      <SectionLabel>실습 · 차시 선택</SectionLabel>
      <nav className="mt-1.5 space-y-0.5">
        {days.map((d) => {
          const active = String(d.day) === String(day)
          return (
            <Link
              key={d.day}
              to={`/labs/${vid}/${d.day}`}
              onClick={onClose}
              className={`flex items-start gap-2.5 rounded-lg px-2.5 py-2 transition ${
                active ? 'bg-brand-50 ring-1 ring-brand-200' : 'hover:bg-slate-50'
              }`}
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-brand-800 text-[10px] font-bold text-white">{d.day}</span>
              <span className="min-w-0">
                <span className="block text-[10.5px] font-semibold text-slate-400">{d.day}차시 · 실습 {d.labs.length}개</span>
                <span className={`block text-[12.5px] leading-snug ${active ? 'font-bold text-brand-900' : 'text-slate-600'}`}>{d.subject}</span>
              </span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}

/* ---------------- 부록 ---------------- */
function AppendixNav({ onClose }) {
  const loc = useLocation()
  return (
    <>
      <Link
        to="/appendix"
        onClick={onClose}
        className={`mb-2 block rounded-lg px-3 py-2 text-[13px] font-semibold transition ${
          loc.pathname === '/appendix' ? 'bg-brand-50 text-brand-800 ring-1 ring-brand-200' : 'text-brand-700 hover:bg-brand-50'
        }`}
      >
        <Icon name="fa-solid fa-book-bookmark" /> 부록 홈
      </Link>

      <SectionLabel>업무별 프롬프트</SectionLabel>
      <nav className="mt-1.5 space-y-0.5">
        {appendix.map((cat) => {
          const active = loc.pathname === `/appendix/${cat.id}`
          return (
            <Link
              key={cat.id}
              to={`/appendix/${cat.id}`}
              onClick={onClose}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 transition ${
                active ? 'bg-brand-50 ring-1 ring-brand-200' : 'hover:bg-slate-50'
              }`}
            >
              <span className="w-5 text-center text-brand-600"><Icon name={cat.icon} /></span>
              <span className={`text-[13px] ${active ? 'font-bold text-brand-900' : 'font-medium text-slate-600'}`}>{cat.category}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}

/* ---------------- About ---------------- */
function AboutNav({ onClose }) {
  const loc = useLocation()
  return (
    <>
      <SectionLabel>About</SectionLabel>
      <nav className="mt-1.5 space-y-0.5">
        {ABOUT_PAGES.map((s) => {
          const active = loc.pathname === s.to
          return (
            <Link
              key={s.id}
              to={s.to}
              onClick={onClose}
              className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 transition ${
                active ? 'bg-brand-50 ring-1 ring-brand-200' : 'hover:bg-slate-50'
              }`}
            >
              <span className="w-5 text-center text-brand-600"><Icon name={s.icon} /></span>
              <span className={`text-[13.5px] ${active ? 'font-bold text-brand-900' : 'font-medium text-slate-600'}`}>
                {s.label}
              </span>
            </Link>
          )
        })}
      </nav>
      <Link
        to="/"
        onClick={onClose}
        className="mt-4 block rounded-lg px-3 py-2 text-[12.5px] font-semibold text-brand-700 hover:bg-brand-50"
      >
        ← 홈으로
      </Link>
    </>
  )
}
