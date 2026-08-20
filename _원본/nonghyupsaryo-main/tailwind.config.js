/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Pretendard', 'Pretendard Variable', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'Roboto', 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', 'sans-serif'],
      },
      colors: {
        // 농협(NH) 아이덴티티 — 신뢰의 딥 그린 + 결실의 골드
        brand: {
          50: '#edfaf1',
          100: '#d2f2dd',
          200: '#a6e5bd',
          300: '#6fd196',
          400: '#3cb96f',
          500: '#1fa054',  // NH 그린
          600: '#158043',
          700: '#136637',
          800: '#12522e',  // 메인 딥 그린
          900: '#0d3b21',
          950: '#072414',
        },
        signal: {
          50: '#fffaeb',
          100: '#fef0c7',
          200: '#fde08a',
          300: '#fccb4d',
          400: '#fec20d',  // 농협 심볼 골드(공식 CI 컬러)
          500: '#e09a0b',
          600: '#c17706',
          700: '#a05a0a',
        },
      },
      typography: {},
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out',
      },
    },
  },
  plugins: [],
}
