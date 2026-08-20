import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { instructor } from '../data/about'
import Icon from '../components/Icon'

export default function InstructorIntro() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <Layout>
      <section className="bg-brand-900 text-white">
        <div className="mx-auto max-w-screen-xl px-5 py-10">
          <div className="text-[12px] font-bold uppercase tracking-wider text-signal-300">Instructor</div>
          <h1 className="mt-2 text-3xl font-extrabold">강사 소개</h1>
          <p className="mt-1.5 text-[14px] text-brand-100">기업·대학 AI 교육 전문 강사 프로필</p>
        </div>
      </section>

      <div className="mx-auto max-w-screen-xl px-5 py-10">
        {/* 프로필 카드 */}
        <div className="grid gap-7 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:grid-cols-[200px_1fr]">
          <div className="flex flex-col items-center gap-3">
            <img
              src={instructor.photo}
              alt={instructor.name}
              className="h-44 w-44 rounded-2xl object-cover shadow"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
            <div className="text-center">
              <div className="text-[18px] font-extrabold text-brand-900">{instructor.name}</div>
              <div className="mt-0.5 text-[12.5px] font-semibold text-brand-600">{instructor.role}</div>
            </div>
          </div>

          <div>
            <p className="text-[14.5px] leading-[1.8] text-slate-700">{instructor.intro}</p>
            <div className="mt-5 grid grid-cols-2 gap-2">
              {instructor.keyInfo.map(([k, v]) => (
                <div key={k} className="rounded-lg bg-slate-50 px-3 py-2 text-[12.5px]">
                  <span className="text-slate-400">{k}</span>
                  <span className="ml-2 font-semibold text-brand-800">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 전문 분야 */}
        <h2 className="mb-4 mt-10 text-[20px] font-extrabold text-brand-900">전문 분야</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {instructor.expertise.map((e) => (
            <div key={e.area} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="text-xl text-brand-600"><Icon name={e.icon} /></div>
              <div className="mt-1.5 text-[14px] font-bold text-brand-900">{e.area}</div>
              <div className="mt-1 text-[12.5px] leading-relaxed text-slate-600">{e.detail}</div>
            </div>
          ))}
        </div>

        {/* 주요 경력 */}
        <h2 className="mb-4 mt-10 text-[20px] font-extrabold text-brand-900">주요 경력</h2>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {instructor.career.map((c, i) => (
            <div
              key={i}
              className={`flex gap-5 px-5 py-4 ${i < instructor.career.length - 1 ? 'border-b border-slate-100' : ''}`}
            >
              <div className="w-20 shrink-0 pt-0.5 text-[12px] font-bold text-signal-600">{c.period}</div>
              <div>
                <div className="text-[14px] font-bold text-brand-900">{c.role}</div>
                <div className="mt-0.5 text-[13px] text-slate-600">{c.detail}</div>
              </div>
            </div>
          ))}
        </div>

        {/* 교육 철학 */}
        <div className="mt-10 rounded-2xl bg-brand-900 p-7 text-white shadow-sm">
          <div className="text-[12px] font-bold uppercase tracking-wider text-signal-300">Teaching Philosophy</div>
          <blockquote className="mt-3 text-[20px] font-extrabold leading-snug">
            “{instructor.philosophy.quote}”
          </blockquote>
          <p className="mt-3 text-[14px] leading-relaxed text-brand-100">{instructor.philosophy.body}</p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/about/company" className="rounded-xl bg-brand-800 px-5 py-3 text-[13.5px] font-bold text-white transition hover:bg-brand-700">
            회사 소개 보기 →
          </Link>
          <Link to="/about" className="rounded-xl border border-slate-300 px-5 py-3 text-[13.5px] font-bold text-slate-600 transition hover:bg-slate-50">
            ← 제작 의도
          </Link>
        </div>
      </div>
    </Layout>
  )
}
