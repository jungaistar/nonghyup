import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 커스텀 도메인(bulid.dreamitbiz.com) 사용 → base '/'
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1500,
  },
})
