import { useState } from 'react'
import Icon from './Icon'

// 프롬프트/실습 박스 우측 상단 공용 복사 버튼 (어두운 코드 박스 위에서 사용)
export default function CopyButton({ text }) {
  const [done, setDone] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setDone(true)
      setTimeout(() => setDone(false), 1500)
    } catch {
      /* ignore */
    }
  }
  return (
    <button
      onClick={copy}
      className={`shrink-0 rounded-lg px-2.5 py-1 text-[11.5px] font-bold transition ${
        done ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
      }`}
    >
      <Icon name={done ? 'fa-solid fa-check' : 'fa-regular fa-copy'} /> {done ? '복사됨' : '복사'}
    </button>
  )
}
