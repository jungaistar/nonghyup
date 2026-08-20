import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { company } from '../data/about'
import Icon from '../components/Icon'

export default function CompanyIntro() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <Layout>
      <section className="bg-brand-900 text-white">
        <div className="mx-auto max-w-screen-xl px-5 py-10">
          <div className="text-[12px] font-bold uppercase tracking-wider text-signal-300">DreamIT Biz</div>
          <h1 className="mt-2 text-3xl font-extrabold">회사 소개</h1>
          <p className="mt-1.5 text-[14px] text-brand-100">에듀테크 전문 기업 드림아이티비즈</p>
        </div>
      </section>

      <div className="mx-auto max-w-screen-xl px-5 py-10">
        {/* 소개 + 사업 정보 */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <div className="text-[12px] font-bold uppercase tracking-wider text-signal-600">About Us</div>
            <h2 className="mt-2 text-[22px] font-extrabold leading-snug text-brand-900">{company.tagline}</h2>
            <p className="mt-4 text-[14px] leading-[1.85] text-slate-600">{company.intro}</p>
          </div>

          <div className="rounded-2xl bg-brand-900 p-6 text-white">
            <div className="text-[12px] font-bold uppercase tracking-wider text-signal-300">Company Info</div>
            <div className="mt-3">
              {company.info.map(([k, v]) => (
                <div key={k} className="flex gap-3 border-b border-white/10 py-2 last:border-0">
                  <span className="w-16 shrink-0 text-[12px] font-semibold text-signal-300">{k}</span>
                  <span className="text-[13px] text-brand-100">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 운영 플랫폼 */}
        <h2 className="mb-4 mt-10 text-[20px] font-extrabold text-brand-900">운영 플랫폼</h2>
        <div className="mb-5 rounded-r-xl border-l-4 border-signal-400 bg-brand-50 px-5 py-4 text-[14px] leading-[1.8] text-slate-700">
          드림아이티비즈는 <strong>인공지능(AI)·경영·프로그래밍·자격증·인문교양·대학 교과목</strong> 등 다양한 분야의
          교육 플랫폼을 운영합니다. 각 플랫폼은 학습 대상과 목적에 맞게 독립적으로 설계되어, 대학 정규 교과목,
          기업 사내 교육, 자격증 학습, 개인 역량 개발 등 폭넓은 수요에 대응합니다.
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {company.platforms.map((p) => (
            <div key={p.title} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="text-xl text-brand-600"><Icon name={p.icon} /></div>
              <div className="mt-1.5 text-[14px] font-bold text-brand-900">{p.title}</div>
              <div className="mt-1 text-[12.5px] leading-relaxed text-slate-600">{p.desc}</div>
            </div>
          ))}
        </div>

        {/* 기술 스택 */}
        <h2 className="mb-4 mt-10 text-[20px] font-extrabold text-brand-900">기술 스택</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {company.techStack.map((t) => (
            <div key={t.name} className="rounded-xl bg-slate-50 p-4">
              <div className="text-[14px] font-bold text-brand-800">{t.name}</div>
              <div className="mt-0.5 text-[12.5px] text-slate-500">{t.desc}</div>
            </div>
          ))}
        </div>

        {/* 링크 */}
        <div className="mt-8 flex flex-wrap gap-3">
          {company.links.map((l) => (
            <a
              key={l.label}
              href={l.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-[13.5px] transition hover:bg-slate-50"
            >
              <span className="font-semibold text-slate-500">{l.label}</span>
              <span className="font-bold text-brand-700">{l.value} ↗</span>
            </a>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/about/instructor" className="rounded-xl bg-brand-800 px-5 py-3 text-[13.5px] font-bold text-white transition hover:bg-brand-700">
            강사 소개 보기 →
          </Link>
          <Link to="/about" className="rounded-xl border border-slate-300 px-5 py-3 text-[13.5px] font-bold text-slate-600 transition hover:bg-slate-50">
            ← 제작 의도
          </Link>
        </div>
      </div>
    </Layout>
  )
}
