import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { purpose } from '../data/about'
import Icon from '../components/Icon'

export default function About() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-900 text-white">
        <div className="absolute -right-16 -top-20 h-72 w-72 rounded-full bg-signal-400/20 blur-3xl" />
        <div className="relative mx-auto max-w-screen-xl px-5 py-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-[12.5px] font-semibold text-signal-300 ring-1 ring-white/15">
            <Icon name="fa-solid fa-circle-info" /> About · 제작 의도
          </div>
          <h1 className="mt-4 text-3xl font-extrabold">{purpose.title}</h1>
          <p className="mt-2 text-[15px] text-brand-100">{purpose.lead}</p>
        </div>
      </section>

      <div className="mx-auto max-w-screen-xl px-5 py-12">
        <div className="space-y-3.5">
          {purpose.paragraphs.map((p, i) => (
            <p key={i} className="text-[15px] leading-[1.85] text-slate-700">{p}</p>
          ))}
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          {purpose.points.map((pt, i) => (
            <div key={i} className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <span className="text-xl text-brand-600"><Icon name={pt.icon} /></span>
              <div>
                <div className="text-[14px] font-bold text-brand-900">{pt.title}</div>
                <div className="mt-0.5 text-[13px] leading-relaxed text-slate-600">{pt.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* 강사·회사 페이지 링크 */}
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Link
            to="/about/instructor"
            className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-brand-300 hover:shadow-md"
          >
            <span className="text-2xl text-brand-700"><Icon name="fa-solid fa-chalkboard-user" /></span>
            <div>
              <div className="text-[15px] font-extrabold text-brand-900">강사 소개</div>
              <div className="text-[12.5px] text-slate-500">강사 프로필·경력·전문 분야</div>
            </div>
            <span className="ml-auto text-slate-300 group-hover:text-brand-500">›</span>
          </Link>
          <Link
            to="/about/company"
            className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-brand-300 hover:shadow-md"
          >
            <span className="text-2xl text-brand-700"><Icon name="fa-solid fa-building" /></span>
            <div>
              <div className="text-[15px] font-extrabold text-brand-900">회사 소개</div>
              <div className="text-[12.5px] text-slate-500">DreamIT Biz 소개·사업 정보</div>
            </div>
            <span className="ml-auto text-slate-300 group-hover:text-brand-500">›</span>
          </Link>
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/"
            className="inline-block rounded-xl bg-brand-800 px-6 py-3 text-[14px] font-bold text-white transition hover:bg-brand-700"
          >
            학습 시작하기 →
          </Link>
        </div>
      </div>
    </Layout>
  )
}
