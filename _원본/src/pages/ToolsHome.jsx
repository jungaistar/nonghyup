import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { promptGuide, tools } from '../data/tools'
import Icon from '../components/Icon'

// 정적 색상 맵 (Tailwind purge 대응)
const CARD = {
  signal: 'from-signal-400 to-signal-500 text-brand-950',
  emerald: 'from-emerald-500 to-emerald-600 text-white',
  violet: 'from-violet-500 to-violet-600 text-white',
  sky: 'from-sky-500 to-sky-600 text-white',
  brand: 'from-brand-700 to-brand-800 text-white',
  rose: 'from-rose-500 to-rose-600 text-white',
}

export default function ToolsHome() {
  return (
    <Layout>
      <div className="mx-auto max-w-5xl px-5 py-9">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-[12.5px] font-bold text-brand-700">
          <Icon name="fa-solid fa-toolbox" /> AI 도구 가이드
        </div>
        <h1 className="text-[26px] font-extrabold text-brand-900">프롬프트 & 5대 AI 도구 정리</h1>
        <p className="mt-2 max-w-2xl text-[14.5px] leading-relaxed text-slate-600">
          프롬프트 작성법과 주요 AI 도구의 강점·요금제·핵심 기능·사무관리 실무 활용을 한곳에 정리했습니다.
          각 카드에서 자세한 가이드와 교재 해당 단원으로 이동할 수 있습니다.
        </p>

        {/* 프롬프트 학습 (와이드 카드) */}
        <Link
          to="/tools/prompt"
          className={`mt-7 flex items-center gap-5 rounded-2xl bg-gradient-to-br p-6 shadow-sm transition hover:shadow-md ${CARD[promptGuide.color]}`}
        >
          <span className="text-3xl"><Icon name={promptGuide.icon} /></span>
          <div className="min-w-0">
            <div className="text-[19px] font-extrabold">{promptGuide.name}</div>
            <div className="mt-0.5 text-[13.5px] opacity-90">{promptGuide.tagline}</div>
          </div>
          <span className="ml-auto shrink-0 text-2xl opacity-70">›</span>
        </Link>

        {/* 도구 그리드 */}
        <h2 className="mb-3 mt-9 text-lg font-bold text-brand-900">주요 AI 도구</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((t) => (
            <Link
              key={t.id}
              to={`/tools/${t.id}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className={`flex items-center gap-3 bg-gradient-to-br p-5 ${CARD[t.color]}`}>
                <span className="text-2xl"><Icon name={t.icon} /></span>
                <div>
                  <div className="text-[18px] font-extrabold leading-none">{t.name}</div>
                  <div className="mt-1 text-[11.5px] font-medium opacity-80">{t.vendor}</div>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="text-[13.5px] font-semibold text-brand-800">{t.tagline}</p>
                <p className="mt-2 line-clamp-3 text-[13px] leading-relaxed text-slate-500">
                  {t.overview}
                </p>
                <span className="mt-4 text-[13px] font-bold text-brand-700 group-hover:underline">
                  자세히 보기 →
                </span>
              </div>
            </Link>
          ))}
        </div>

        <p className="mt-8 rounded-xl bg-slate-100 px-4 py-3 text-[12.5px] leading-relaxed text-slate-500">
          ※ 요금제·모델명·기능은 수시로 변동됩니다. 강의 실시·실무 적용 전 각 도구 공식 사이트에서 최신 정보를 확인하세요.
          Perplexity는 교재 4대 도구 외 보조 리서치 도구로 추가 정리한 항목입니다.
        </p>
      </div>
    </Layout>
  )
}
