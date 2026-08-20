import { IMG_BASE } from '../data/courses'
import Icon from './Icon'
import CopyButton from './CopyButton'

function Figure({ block }) {
  const { caption, img, source } = block
  return (
    <figure className="my-6">
      {img && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <img
            src={IMG_BASE + img}
            alt={caption || '교재 그림'}
            loading="lazy"
            className="mx-auto block max-h-[560px] w-full object-contain"
          />
        </div>
      )}
      {caption && (
        <figcaption className="mt-2 text-center text-[13px] font-medium text-brand-700">
          {caption}
        </figcaption>
      )}
      {source && (
        <p className="mt-1 text-center text-[11.5px] text-slate-400">{source}</p>
      )}
    </figure>
  )
}

function DataTable({ block }) {
  const { rows, caption } = block
  if (!rows?.length) return null
  const [head, ...body] = rows
  return (
    <div className="my-6">
      {caption && (
        <p className="mb-2 text-[13px] font-semibold text-brand-700">{caption}</p>
      )}
      <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
        <table className="w-full border-collapse text-[13.5px]">
          <thead>
            <tr className="bg-brand-800 text-white">
              {head.map((c, i) => (
                <th
                  key={i}
                  className="cell-pre border-r border-brand-700/40 px-3 py-2.5 text-left font-semibold last:border-r-0"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {body.map((r, ri) => (
              <tr
                key={ri}
                className={ri % 2 ? 'bg-slate-50' : 'bg-white'}
              >
                {head.map((_, ci) => (
                  <td
                    key={ci}
                    className="cell-pre border-r border-t border-slate-100 px-3 py-2.5 align-top text-slate-700 last:border-r-0"
                  >
                    {r[ci] ?? ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function PromptBox({ block }) {
  return (
    <div className="my-5">
      {block.caption && (
        <p className="mb-2 text-[13px] font-semibold text-brand-700">{block.caption}</p>
      )}
      <div className="rounded-xl border border-slate-700 bg-slate-900 p-4 shadow-sm">
        <div className="mb-2 flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
          <span className="ml-2 text-[11px] font-medium uppercase tracking-wider text-slate-400">
            프롬프트 예시
          </span>
          <span className="ml-auto">
            <CopyButton text={block.text} />
          </span>
        </div>
        <pre className="whitespace-pre-wrap break-words font-mono text-[13px] leading-relaxed text-slate-100">
          {block.text}
        </pre>
      </div>
    </div>
  )
}

// 실습 자료 다운로드 박스
function DownloadBox({ block }) {
  const base = import.meta.env.BASE_URL
  return (
    <div className="my-6 rounded-2xl border border-brand-200 bg-brand-50/60 p-5">
      <div className="mb-3 flex items-center gap-2 text-[13.5px] font-bold text-brand-800">
        <Icon name="fa-solid fa-download" /> {block.caption || '실습 자료 다운로드'}
      </div>
      <div className="grid gap-2.5 sm:grid-cols-2">
        {(block.files || []).map((f, i) => (
          <a
            key={i}
            href={`https://raw.githubusercontent.com/aebonlee/materials/main/nonghyupsaryo/${encodeURIComponent(f.file)}`}
            download={f.file}
            className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm transition hover:border-brand-300 hover:shadow-md"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-[16px] text-emerald-700">
              <Icon name="fa-solid fa-file-csv" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13.5px] font-bold text-brand-900">{f.name}</span>
              {f.desc && <span className="block truncate text-[12px] text-slate-500">{f.desc}</span>}
            </span>
            <span className="shrink-0 rounded-lg bg-brand-800 px-2.5 py-1.5 text-[11.5px] font-bold text-white transition group-hover:bg-brand-700">
              <Icon name="fa-solid fa-download" /> 받기
            </span>
          </a>
        ))}
      </div>
      {block.note && <p className="mt-3 text-[12px] leading-relaxed text-slate-500">{block.note}</p>}
    </div>
  )
}

function Callout({ tone, label, icon, children }) {
  const tones = {
    tip: 'border-emerald-200 bg-emerald-50',
    exercise: 'border-signal-300 bg-signal-50',
    case: 'border-sky-200 bg-sky-50',
    link: 'border-violet-200 bg-violet-50',
    warning: 'border-rose-200 bg-rose-50',
    outcome: 'border-brand-200 bg-brand-50',
  }
  const labelTones = {
    tip: 'text-emerald-700',
    exercise: 'text-signal-700',
    case: 'text-sky-700',
    link: 'text-violet-700',
    warning: 'text-rose-700',
    outcome: 'text-brand-700',
  }
  return (
    <div className={`my-4 rounded-xl border px-4 py-3 ${tones[tone]}`}>
      {label && (
        <div className={`mb-1 flex items-center gap-1.5 text-[12.5px] font-bold ${labelTones[tone]}`}>
          <Icon name={icon} />
          <span>{label}</span>
        </div>
      )}
      <div className="whitespace-pre-line text-[14.5px] leading-relaxed text-slate-700">{children}</div>
    </div>
  )
}

// 본문 강조: 끝의 "[xxx]" 접두 라벨 제거용
function stripBracketPrefix(text) {
  const m = text.match(/^\[([^\]]+)\]\s*(.*)$/s)
  return m ? { label: m[1], body: m[2] } : { label: null, body: text }
}

// 마침표 뒤 줄바꿈 — 소수점/약어(예: 6.7%, v.0.5)는 보호(마침표+공백만 분리)
function br(text) {
  if (!text) return text
  return text.replace(/([^0-9])\.\s+/g, '$1.\n')
}

export default function BlockRenderer({ blocks }) {
  if (!blocks?.length) return null
  return (
    <div className="prose-ko">
      {blocks.map((b, i) => {
        switch (b.type) {
          case 'para':
            return (
              <p key={i} className="my-3.5 whitespace-pre-line leading-[1.9] text-[16.5px] text-slate-700">
                {br(b.text)}
              </p>
            )

          case 'keywords':
            return (
              <div
                key={i}
                className="my-4 flex flex-wrap items-center gap-2 rounded-lg bg-slate-100 px-4 py-3"
              >
                <span className="mr-1 text-[12px] font-bold text-brand-700"><Icon name="fa-solid fa-key" /> 핵심 키워드</span>
                {b.text.split(/[,·]/).map((k, ki) =>
                  k.trim() ? (
                    <span
                      key={ki}
                      className="rounded-full bg-white px-2.5 py-1 text-[12.5px] font-medium text-slate-600 ring-1 ring-slate-200"
                    >
                      {k.trim()}
                    </span>
                  ) : null
                )}
              </div>
            )

          case 'objectives':
            return (
              <div
                key={i}
                className="my-5 rounded-xl border border-brand-200 bg-brand-50/60 p-5"
              >
                <div className="mb-2 flex items-center gap-2 text-[13.5px] font-bold text-brand-800">
                  <Icon name="fa-solid fa-bullseye" /> 학습 목표
                </div>
                <ul className="space-y-1.5">
                  {b.items.map((it, ii) => (
                    <li key={ii} className="flex gap-2 text-[14.5px] text-slate-700">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )

          case 'bullets':
            return (
              <ul key={i} className="my-3.5 space-y-1.5">
                {b.items.map((it, ii) => (
                  <li key={ii} className="flex gap-2.5 text-[16px] leading-relaxed text-slate-700">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-signal-400" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            )

          case 'figure':
            return <Figure key={i} block={b} />

          case 'table':
            return <DataTable key={i} block={b} />

          case 'table-cap':
            return (
              <p key={i} className="my-2 text-[13px] font-semibold text-brand-700">
                {b.text}
              </p>
            )

          case 'promptbox':
            return <PromptBox key={i} block={b} />

          case 'download':
            return <DownloadBox key={i} block={b} />

          case 'tip': {
            const { body } = stripBracketPrefix(b.text)
            return (
              <Callout key={i} tone="tip" label="Tip" icon="fa-solid fa-lightbulb">
                {br(body)}
              </Callout>
            )
          }

          case 'exercise': {
            const { body } = stripBracketPrefix(b.text)
            const m = b.text.match(/^\[?(실습[^\]]*)\]?\s*(.*)$/s)
            return (
              <Callout key={i} tone="exercise" label={m ? m[1] : '실습'} icon="fa-solid fa-pen">
                {br(m ? m[2] : body)}
              </Callout>
            )
          }

          case 'case': {
            const m = b.text.match(/^\[([^\]]+)\]\s*(.*)$/s)
            return (
              <Callout key={i} tone="case" label={m ? m[1] : '사례'} icon="fa-solid fa-thumbtack">
                {br(m ? m[2] : b.text)}
              </Callout>
            )
          }

          case 'link':
            return (
              <Callout key={i} tone="link" label="연계 학습" icon="fa-solid fa-link">
                {br(b.text.replace(/^📖\s*/, ''))}
              </Callout>
            )

          case 'warning':
            return (
              <Callout key={i} tone="warning" label="유의" icon="fa-solid fa-triangle-exclamation">
                {br(b.text.replace(/^⚠️\s*/, ''))}
              </Callout>
            )

          case 'outcome':
            return (
              <Callout key={i} tone="outcome" label="핵심 산출물" icon="fa-solid fa-box">
                {br(b.text.replace(/^▶\s*/, ''))}
              </Callout>
            )

          case 'label':
            return (
              <p key={i} className="mt-5 mb-1 text-[14px] font-bold text-brand-800">
                {b.text}
              </p>
            )

          case 'source':
            return (
              <p key={i} className="my-1 text-[11.5px] text-slate-400">
                {b.text}
              </p>
            )

          default:
            return (
              <p key={i} className="my-3 text-[15px] text-slate-700">
                {b.text || ''}
              </p>
            )
        }
      })}
    </div>
  )
}
