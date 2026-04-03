import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { LoginForm } from './components/LoginForm.tsx'
import { useAuth }   from './hooks/useAuth.ts'

// ── ルートコンポーネント ──────────────────────────────────────────
// 認証状態に応じて「ログイン画面」か「ダッシュボード」を切り替える
// App.tsx はダッシュボードの描画に専念できる
function Root() {
  const { user, isLoading, login, logout } = useAuth()

  // 初期チェック中（/api/me の応答待ち）はローディング表示
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400">読み込み中...</p>
      </div>
    )
  }

  // 未ログインならログイン画面を表示
  if (!user) {
    return <LoginForm onLogin={login} />
  }

  // ログイン済みならダッシュボードを表示（ユーザー情報とログアウト関数を渡す）
  return <App user={user} onLogout={logout} />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
