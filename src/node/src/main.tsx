import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { LoginForm }    from './components/LoginForm.tsx'
import { RegisterForm } from './components/RegisterForm.tsx'
import { useAuth }      from './hooks/useAuth.ts'

// ── ルートコンポーネント ──────────────────────────────────────────
// 認証状態に応じて「ログイン」「新規登録」「ダッシュボード」を切り替える
function Root() {
  const { user, isLoading, login, logout, register } = useAuth()
  const [showRegister, setShowRegister] = useState(false)

  // 初期チェック中（/api/me の応答待ち）はローディング表示
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400">読み込み中...</p>
      </div>
    )
  }

  // 未ログイン：新規登録 or ログイン画面を表示
  if (!user) {
    if (showRegister) {
      return (
        <RegisterForm
          onRegister={register}
          onSwitchToLogin={() => setShowRegister(false)}
        />
      )
    }
    return (
      <LoginForm
        onLogin={login}
        onSwitchToRegister={() => setShowRegister(true)}
      />
    )
  }

  // ログイン済みならダッシュボードを表示
  return <App user={user} onLogout={logout} />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
