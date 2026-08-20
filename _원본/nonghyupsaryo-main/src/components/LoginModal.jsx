import { createPortal } from 'react-dom'
import { useAuth } from '../context/AuthContext'
import Icon from './Icon'

export default function LoginModal({ open, onClose }) {
  const { signInWith } = useAuth()
  if (!open) return null

  // 헤더의 backdrop-blur가 fixed의 containing block이 되는 문제 → body로 포털 렌더
  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-7 shadow-2xl animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-1 text-center">
          <img src={`${import.meta.env.BASE_URL}nh-symbol.png`} alt="농협" className="mx-auto mb-3 h-12 w-auto" />
          <h2 className="text-lg font-bold text-brand-900">로그인 / 회원가입</h2>
          <p className="mt-1 text-[13px] text-slate-500">
            로그인하면 학습 진도가 기기 간에 동기화됩니다.
          </p>
        </div>

        <div className="mt-6 space-y-2.5">
          <button
            onClick={() => signInWith('google')}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-3 text-[14.5px] font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/>
            </svg>
            Google로 계속하기
          </button>

          <button
            onClick={() => signInWith('kakao')}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#FEE500] px-4 py-3 text-[14.5px] font-semibold text-[#191600] transition hover:brightness-95"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#191600">
              <path d="M12 3C6.48 3 2 6.48 2 10.8c0 2.78 1.86 5.22 4.66 6.6-.2.74-.74 2.66-.85 3.07-.13.51.19.5.4.36.16-.1 2.6-1.77 3.66-2.49.7.1 1.42.16 2.13.16 5.52 0 10-3.48 10-7.8S17.52 3 12 3z"/>
            </svg>
            카카오로 계속하기
          </button>
        </div>

        <p className="mt-5 text-center text-[11.5px] leading-relaxed text-slate-400">
          로그인 시 학습 진도 관리를 위한 최소한의 정보(이메일·식별자)가 저장됩니다.
        </p>

        <button
          onClick={onClose}
          className="mt-4 w-full rounded-lg py-2 text-[13px] text-slate-400 transition hover:text-slate-600"
        >
          닫기
        </button>
      </div>
    </div>,
    document.body
  )
}
