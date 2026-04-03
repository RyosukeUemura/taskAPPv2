import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Docker コンテナ内でアクセスできるよう全インターフェースで待ち受ける
    host: '0.0.0.0',
    port: 5173,
    // Nginx 経由でアクセスしたときに HMR（ホットリロード）が動くよう設定
    hmr: {
      clientPort: 80, // ブラウザからは Nginx のポート(80)経由でアクセスするため
    },
  },
})
