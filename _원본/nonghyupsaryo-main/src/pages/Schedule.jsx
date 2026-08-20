import { useEffect } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import Layout from '../components/Layout'
import Icon from '../components/Icon'
import DayPlan from '../components/DayPlan'
import { getVolume, volumes } from '../data/courses'
import { dayPlans } from '../data/dayplans'

export default function Schedule() {
  const { volId } = useParams()
  const vol = getVolume(volId)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [volId])

  if (!vol) return <Navigate to="/schedule/course" replace />

  const plans = dayPlans[vol.id] || {}
  const days = Object.values(plans).sort((a, b) => a.day - b.day)

  return (
    <Layout>
      <div className="mx-auto max-w-screen-xl px-5 py-8">
        <div className="mb-4 flex items-center gap-1.5 text-[12.5px] text-slate-400">
          <Link to="/" className="hover:text-brand-700">홈</Link>
          <span>/</span>
          <span className="text-slate-600">교육 일정</span>
        </div>

        {/* 헤더 */}
        <div className="mb-7 rounded-2xl bg-brand-900 p-7 text-white">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[12px] font-bold text-signal-300">
            <Icon name="fa-solid fa-calendar-days" /> 교육 일정 · 타임테이블
          </div>
          <h1 className="mt-3 text-2xl font-extrabold leading-snug">{vol.title}</h1>
          <p className="mt-2 text-[14px] text-brand-100">
            1일 8차시 · 학습과 실습을 병행합니다. 각 일정 항목을 누르면 해당 차시 학습으로 이동합니다.
          </p>

          {/* 확정 일시·장소 */}
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-xl bg-white/10 px-4 py-3 ring-1 ring-white/15">
              <span className="mt-0.5 text-signal-300"><Icon name="fa-solid fa-clock" /></span>
              <div>
                <div className="text-[11.5px] font-bold text-signal-300">일시</div>
                <div className="text-[14px] font-semibold text-white">2026. 8. 20.(목) 08:00 ~ 17:00</div>
                <div className="text-[12px] text-brand-100">점심시간 1시간 제외 · 총 8시간</div>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl bg-white/10 px-4 py-3 ring-1 ring-white/15">
              <span className="mt-0.5 text-signal-300"><Icon name="fa-solid fa-location-dot" /></span>
              <div>
                <div className="text-[11.5px] font-bold text-signal-300">장소</div>
                <div className="text-[14px] font-semibold text-white">농협사료 5층 중회의실</div>
                <div className="text-[12px] text-brand-100">서울시 강동구 올림픽로 528</div>
              </div>
            </div>
          </div>
        </div>

        {/* 차시별 타임테이블 */}
        <div className="space-y-4">
          {days.map((plan) => (
            <div key={plan.day} id={`day-${plan.day}`} className="scroll-mt-20">
              <DayPlan plan={plan} defaultOpen={plan.day === 1} />
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-xl bg-slate-100 px-4 py-3 text-[12.5px] leading-relaxed text-slate-500">
          ※ 시간 배분은 표준 운영안이며, 현장 상황·수강생 수준에 따라 조정할 수 있습니다.
          전체 학습 목차는 <Link to={`/vol/${vol.id}`} className="font-semibold text-brand-700 hover:underline">8차시 학습 보기</Link>에서 확인하세요.
        </div>
      </div>
    </Layout>
  )
}
