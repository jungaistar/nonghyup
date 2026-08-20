import { useEffect, useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import Layout from '../components/Layout'
import Icon from '../components/Icon'
import CopyButton from '../components/CopyButton'
import { promptGuide } from '../data/tools'
import {
  scoreCriteria,
  gradeTable,
  GRADE_COLOR,
  techniques,
  scoreSample,
  scenarios,
  evaluatePrompt,
  promptLibrary,
  commonMistakes,
  followTutorials,
  PROMPT_SECTIONS,
} from '../data/promptLab'

const LEVEL_STYLE = {
  입문: 'bg-emerald-100 text-emerald-700',
  실전: 'bg-sky-100 text-sky-700',
  심화: 'bg-violet-100 text-violet-700',
}

export default function PromptLab() {
  const { section = 'learn' } = useParams()
  const meta = PROMPT_SECTIONS.find((s) => s.id === section)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [section])

  if (!meta) return <Navigate to="/tools/prompt/learn" replace />

  return (
    <Layout>
      <div className="mx-auto max-w-screen-xl px-5 py-8">
        <div className="mb-4 flex items-center gap-1.5 text-[12.5px] text-slate-400">
          <Link to="/" className="hover:text-brand-700">홈</Link>
          <span>/</span>
          <Link to="/tools" className="hover:text-brand-700">AI 도구 가이드</Link>
          <span>/</span>
          <span className="text-slate-600">프롬프트 · {meta.short}</span>
        </div>

        {/* Hero */}
        <div className="mb-6 rounded-2xl bg-gradient-to-br from-signal-400 to-signal-500 p-7 text-brand-950 shadow-sm">
          <div className="flex items-center gap-4">
            <span className="text-4xl"><Icon name={meta.icon} /></span>
            <div>
              <h1 className="text-[26px] font-extrabold leading-none">{meta.label}</h1>
              <div className="mt-1.5 text-[13px] font-semibold opacity-80">PromptLab · {meta.desc}</div>
            </div>
          </div>
        </div>

        {/* 하위 메뉴(가로 칩 — 모바일/빠른 이동용) */}
        <div className="mb-6 flex flex-wrap gap-1.5">
          {PROMPT_SECTIONS.map((s) => (
            <Link
              key={s.id}
              to={`/tools/prompt/${s.id}`}
              className={`rounded-full px-3 py-1.5 text-[12.5px] font-semibold transition ${
                s.id === section ? 'bg-brand-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Icon name={s.icon} /> {s.short}
            </Link>
          ))}
        </div>

        {section === 'learn' && <LearnTab />}
        {section === 'pattern' && <PatternTab />}
        {section === 'library' && <LibraryTab />}
        {section === 'practice' && <PracticeTab />}
        {section === 'follow' && <FollowTab />}
      </div>
    </Layout>
  )
}

function Card({ title, icon, children, className = '' }) {
  return (
    <section className={`mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}>
      {title && (
        <h2 className="mb-4 flex items-center gap-2 text-[17px] font-extrabold text-brand-900">
          <Icon name={icon} className="text-brand-600" />
          {title}
        </h2>
      )}
      {children}
    </section>
  )
}

function Badge({ grade }) {
  return (
    <span
      className="flex h-7 w-7 items-center justify-center rounded-lg text-[12px] font-extrabold text-white"
      style={{ background: GRADE_COLOR[grade] }}
    >
      {grade}
    </span>
  )
}


/* ---------------- 학습하기 ---------------- */
function LearnTab() {
  return (
    <>
      <Card title="좋은 프롬프트의 5요소" icon="fa-solid fa-bullseye">
        <p className="mb-4 text-[14px] text-slate-600">
          프롬프트 품질을 객관적으로 보는 5대 기준입니다. 각 20점, 합계 100점 — ‘평가 실습’에서 이 기준으로 채점됩니다.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {scoreCriteria.map((c) => (
            <div key={c.key} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <div className="mb-1 flex items-center justify-between">
                <span className="flex items-center gap-2 text-[15px] font-bold text-brand-800">
                  <span className="w-5 text-center text-brand-600"><Icon name={c.icon} /></span>
                  {c.key}
                  <span className="rounded bg-brand-100 px-1.5 text-[11px] font-mono font-bold text-brand-700">{c.code}</span>
                </span>
                <span className="text-[12px] font-bold text-signal-600">{c.max}점</span>
              </div>
              <p className="text-[13px] font-semibold text-slate-700">{c.desc}</p>
              <p className="mt-1 text-[12.5px] leading-relaxed text-slate-500">{c.detail}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 space-y-2">
          {gradeTable.map((g) => (
            <div key={g.grade} className="flex items-center gap-3 rounded-lg bg-slate-50 px-3 py-2">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[14px] font-extrabold text-white" style={{ background: GRADE_COLOR[g.grade] }}>
                {g.grade}
              </span>
              <div className="flex flex-1 items-baseline gap-2">
                <strong className="text-[13.5px] text-brand-900">{g.label}</strong>
                <span className="font-mono text-[12px] text-slate-400">{g.range}</span>
              </div>
              <span className="text-[12.5px] text-slate-500">{g.desc}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card title="점수를 올리는 5가지 기법" icon="fa-solid fa-screwdriver-wrench">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {techniques.map((t) => (
            <div key={t.title} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <div className="text-2xl text-brand-600"><Icon name={t.icon} /></div>
              <div className="mt-1.5 text-[14px] font-bold text-brand-800">{t.title}</div>
              <div className="mt-1 text-[12.5px] leading-relaxed text-slate-600">{t.desc}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="흔한 실수와 개선" icon="fa-solid fa-circle-xmark">
        <div className="space-y-3">
          {commonMistakes.map((m, i) => (
            <div key={i} className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-start gap-2 text-[13.5px]">
                <span className="shrink-0 rounded bg-rose-100 px-1.5 py-0.5 text-[11px] font-bold text-rose-600">이렇게 X</span>
                <span className="font-mono text-slate-700">{m.bad}</span>
              </div>
              <div className="mt-1.5 text-[12.5px] text-slate-500">→ {m.why}</div>
              <div className="mt-2 flex items-start gap-2 text-[13.5px]">
                <span className="shrink-0 rounded bg-emerald-100 px-1.5 py-0.5 text-[11px] font-bold text-emerald-700">이렇게 O</span>
                <span className="font-mono text-slate-700">{m.fix}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="개선 전 → 후 (채점 예시)" icon="fa-solid fa-chart-line">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Badge grade={scoreSample.before.grade} />
              <span className="text-[13px] text-slate-500">개선 전 · <b className="font-mono text-rose-600">{scoreSample.before.total}/100</b></span>
            </div>
            <pre className="whitespace-pre-wrap break-words rounded-xl border border-rose-200 bg-rose-50 p-4 font-mono text-[12.5px] leading-relaxed text-slate-700">{scoreSample.before.prompt}</pre>
          </div>
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Badge grade={scoreSample.after.grade} />
              <span className="text-[13px] text-slate-500">개선 후 · <b className="font-mono text-emerald-600">{scoreSample.after.total}/100</b></span>
            </div>
            <pre className="whitespace-pre-wrap break-words rounded-xl border border-emerald-200 bg-emerald-50 p-4 font-mono text-[12.5px] leading-relaxed text-slate-700">{scoreSample.after.prompt}</pre>
          </div>
        </div>
        <div className="mt-5 text-center">
          <Link to="/tools/prompt/practice" className="inline-block rounded-xl bg-brand-800 px-5 py-2.5 text-[13.5px] font-bold text-white transition hover:bg-brand-700">
            직접 써보고 점수 받기 →
          </Link>
        </div>
      </Card>
    </>
  )
}

/* ---------------- 실전 패턴 ---------------- */
function PatternTab() {
  return (
    <>
      <Card title="바로 쓰는 프롬프트 패턴" icon="fa-solid fa-puzzle-piece">
        <p className="-mt-2 mb-4 text-[13.5px] text-slate-600">
          상황별로 검증된 템플릿입니다. <b>[대괄호]</b>만 바꿔 사용하세요.
        </p>
        <div className="space-y-5">
          {promptGuide.patterns.map((p, i) => (
            <div key={i}>
              <div className="mb-2 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-800 text-[11px] font-bold text-white">{i + 1}</span>
                <span className="text-[14.5px] font-bold text-brand-800">{p.name}</span>
              </div>
              <div className="mb-2 rounded-xl border border-slate-700 bg-slate-900 p-4">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">템플릿</span>
                  <CopyButton text={p.template} />
                </div>
                <pre className="whitespace-pre-wrap break-words font-mono text-[12.5px] leading-relaxed text-slate-100">{p.template}</pre>
              </div>
              <div className="rounded-xl bg-emerald-50 p-3">
                <div className="mb-1 text-[11px] font-bold text-emerald-700">사무관리 예시</div>
                <p className="text-[13.5px] leading-relaxed text-slate-700">{p.example}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="사무관리 활용 유의점" icon="fa-solid fa-triangle-exclamation">
        <p className="rounded-xl bg-rose-50 p-4 text-[14px] leading-relaxed text-slate-700">{promptGuide.domainNote}</p>
      </Card>

      <Card title="도구별 프롬프트 팁" icon="fa-solid fa-toolbox">
        <ul className="space-y-2">
          {promptGuide.toolTips.map((t, i) => (
            <li key={i} className="flex gap-2.5 text-[14px] text-slate-700">
              <span className="shrink-0 rounded-md bg-brand-100 px-2 py-0.5 text-[11.5px] font-bold text-brand-700">{t.tool}</span>
              <span>{t.tip}</span>
            </li>
          ))}
        </ul>
      </Card>
    </>
  )
}

/* ---------------- 과목별 프롬프트 예제 ---------------- */
function LibraryTab() {
  return (
    <>
      <Card title="과목별 프롬프트 예제" icon="fa-solid fa-folder-tree">
        <p className="-mt-2 text-[13.5px] leading-relaxed text-slate-600">
          강의 커리큘럼(1일 8차시)에 맞춘 즉시 사용 프롬프트입니다. <b>[대괄호]</b> 부분만 우리 상황에 맞게 바꿔
          ChatGPT·Claude·Gemini 등에 붙여 넣으세요.
        </p>
      </Card>

      {promptLibrary.map((group) => (
        <Card key={group.subject} title={group.subject} icon={group.icon}>
          <div className="space-y-4">
            {group.prompts.map((p, i) => (
              <div key={i} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-1 flex items-start justify-between gap-3">
                  <div className="text-[14px] font-bold text-brand-900">{p.title}</div>
                  <CopyButton text={p.prompt} />
                </div>
                <div className="mb-2 text-[12.5px] text-slate-500">{p.use}</div>
                <pre className="whitespace-pre-wrap break-words rounded-lg border border-slate-700 bg-slate-900 p-3.5 font-mono text-[12.5px] leading-relaxed text-slate-100">{p.prompt}</pre>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </>
  )
}

/* ---------------- 따라하기 ---------------- */
function FollowTab() {
  return (
    <>
      <Card title="프롬프트 따라하기" icon="fa-solid fa-shoe-prints">
        <p className="-mt-2 text-[13.5px] leading-relaxed text-slate-600">
          실제 업무를 단계별로 따라 하며 익히는 가이드입니다. 각 단계의 프롬프트를 순서대로 복사해 직접 실행해 보세요.
        </p>
      </Card>

      {followTutorials.map((tut) => (
        <Card key={tut.id} title={tut.title} icon="fa-solid fa-list-check">
          <div className="-mt-2 mb-4 flex flex-wrap items-center gap-2">
            <span className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${LEVEL_STYLE[tut.level] || 'bg-slate-200 text-slate-600'}`}>{tut.level}</span>
            <span className="rounded-md bg-brand-100 px-2 py-0.5 text-[11.5px] font-bold text-brand-700">{tut.tool}</span>
          </div>
          <div className="mb-4 rounded-lg bg-slate-50 p-3 text-[13.5px] text-slate-700 ring-1 ring-slate-100">
            <b className="text-brand-700">목표</b> {tut.goal}
          </div>

          <ol className="space-y-4">
            {tut.steps.map((s, i) => (
              <li key={i} className="relative border-l-2 border-brand-100 pl-5">
                <span className="absolute -left-[11px] top-0 flex h-5 w-5 items-center justify-center rounded-full bg-brand-800 text-[10.5px] font-bold text-white">
                  {i + 1}
                </span>
                <p className="text-[13.5px] font-semibold leading-relaxed text-slate-800">{s.instruction}</p>
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
        </Card>
      ))}

      <div className="text-center">
        <Link to="/tools/prompt/practice" className="inline-block rounded-xl bg-brand-800 px-5 py-2.5 text-[13.5px] font-bold text-white transition hover:bg-brand-700">
          이제 직접 써보고 점수 받기 →
        </Link>
      </div>
    </>
  )
}

/* ---------------- 평가 실습 ---------------- */
function PracticeTab() {
  const [scenario, setScenario] = useState(scenarios[0])
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)
  const [showAnswer, setShowAnswer] = useState(false)

  const pick = (s) => {
    setScenario(s)
    setInput('')
    setResult(null)
    setShowAnswer(false)
  }
  const evaluate = () => {
    if (input.trim()) setResult(evaluatePrompt(input, scenario))
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[240px_1fr]">
      <aside className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <p className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">시나리오</p>
        <div className="space-y-1">
          {scenarios.map((s) => (
            <button
              key={s.id}
              onClick={() => pick(s)}
              className={`block w-full rounded-lg px-3 py-2 text-left transition ${
                scenario.id === s.id ? 'bg-brand-50 ring-1 ring-brand-200' : 'hover:bg-slate-50'
              }`}
            >
              <span className="block text-[10.5px] font-semibold text-slate-400">{s.category}</span>
              <span className={`block text-[13px] font-semibold ${scenario.id === s.id ? 'text-brand-900' : 'text-slate-600'}`}>{s.title}</span>
            </button>
          ))}
        </div>
      </aside>

      <div>
        <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-[16px] font-extrabold text-brand-900">{scenario.title}</h3>
          <p className="mt-2 text-[13.5px] text-slate-600"><b className="text-brand-700">상황</b> {scenario.situation}</p>
          <p className="mt-1 text-[13.5px] text-slate-600"><b className="text-brand-700">목표</b> {scenario.goal}</p>
        </div>

        <textarea
          value={input}
          onChange={(e) => { setInput(e.target.value); setResult(null) }}
          rows={10}
          placeholder="여기에 프롬프트를 작성하세요. (역할·맥락·과제·제약·출력형식을 모두 담아보세요)"
          className="w-full resize-y rounded-xl border border-slate-300 p-4 font-mono text-[13px] leading-relaxed text-slate-800 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />

        <div className="mt-3 flex items-center justify-between">
          <span className="font-mono text-[12.5px] text-slate-400">{input.trim().length}자</span>
          <div className="flex gap-2">
            <button onClick={() => setShowAnswer((v) => !v)} className="rounded-lg border border-slate-300 px-3 py-2 text-[13px] font-semibold text-slate-600 transition hover:bg-slate-50">
              {showAnswer ? '모범답안 숨기기' : '모범답안 보기'}
            </button>
            <button onClick={evaluate} disabled={!input.trim()} className="rounded-lg bg-brand-800 px-4 py-2 text-[13px] font-bold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-40">
              <Icon name="fa-solid fa-gauge-high" /> 평가받기
            </button>
          </div>
        </div>

        {result && (
          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-xl text-2xl font-extrabold text-white" style={{ background: GRADE_COLOR[result.grade] }}>
                {result.grade}
              </span>
              <div>
                <div className="font-mono text-[26px] font-extrabold leading-none text-brand-900">{result.total}<span className="text-[15px] text-slate-400"> / 100</span></div>
                <div className="mt-1 text-[12.5px] text-slate-500">5요소 종합 점수</div>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {scoreCriteria.map((c) => {
                const v = result.scores[c.key]
                return (
                  <div key={c.key} className="flex items-center gap-3">
                    <span className="w-16 shrink-0 text-[12.5px] font-semibold text-slate-600">{c.key}</span>
                    <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-brand-500 transition-all" style={{ width: `${(v / 20) * 100}%` }} />
                    </div>
                    <span className="w-12 shrink-0 text-right font-mono text-[12px] text-slate-500">{v}/20</span>
                  </div>
                )
              })}
            </div>
            {result.feedback.length > 0 && (
              <div className="mt-4 rounded-xl bg-amber-50 p-4">
                <strong className="text-[13px] text-amber-800"><Icon name="fa-solid fa-comment-dots" /> 개선 피드백</strong>
                <ul className="mt-1.5 space-y-1">
                  {result.feedback.map((f, i) => (
                    <li key={i} className="flex gap-2 text-[13px] text-slate-700"><span className="text-amber-500">•</span><span>{f}</span></li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {showAnswer && (
          <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <p className="mb-2 text-[13px] font-bold text-emerald-700"><Icon name="fa-solid fa-circle-check" /> 모범 프롬프트 예시</p>
            <pre className="whitespace-pre-wrap break-words rounded-xl border border-emerald-200 bg-white p-4 font-mono text-[12.5px] leading-relaxed text-slate-700">{scenario.exampleAnswer}</pre>
          </div>
        )}

        <p className="mt-4 font-mono text-[11.5px] text-slate-400">
          ⓘ 점수는 키워드·구조 기반 자동 추정입니다. 실제 결과는 ChatGPT·Claude 등에서 직접 받아보세요.
        </p>
      </div>
    </div>
  )
}
