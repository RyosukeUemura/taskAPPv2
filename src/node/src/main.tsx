import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { LoginForm }    from './components/LoginForm.tsx'
import { RegisterForm } from './components/RegisterForm.tsx'
import { useAuth, AuthUser } from './hooks/useAuth.ts'

// ── ローディング画面 ──────────────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-400">読み込み中...</p>
    </div>
  )
}

// ── /login ページ ─────────────────────────────────────────────────────────
// useNavigate は BrowserRouter 内でのみ使えるため、専用ラッパーで切り出す
type LoginPageProps = {
  onLogin: (email: string, password: string) => Promise<string | null>
}
function LoginPage({ onLogin }: LoginPageProps) {
  const navigate = useNavigate()
  return (
    <LoginForm
      onLogin={onLogin}
      onSwitchToRegister={() => navigate('/register')}
    />
  )
}

// ── /register ページ ──────────────────────────────────────────────────────
type RegisterPageProps = {
  onRegister: (
    name: string,
    email: string,
    password: string,
    passwordConfirmation: string,
  ) => Promise<string | null>
}
function RegisterPage({ onRegister }: RegisterPageProps) {
  const navigate = useNavigate()
  return (
    <RegisterForm
      onRegister={onRegister}
      onSwitchToLogin={() => navigate('/login')}
    />
  )
}

// ── ルートコンポーネント ──────────────────────────────────────────────────
function Root() {
  const { user, isLoading, login, logout, register } = useAuth()

  // /api/me の応答待ち中はルーティング前にローディングを返す
  // （ここで BrowserRouter に入る前に返すことで /dashboard への誤リダイレクトを防ぐ）
  if (isLoading) return <LoadingScreen />

  return (
    <BrowserRouter>
      <Routes>

        {/* / → /login へリダイレクト（常に） */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* ログイン画面：ログイン済みなら /dashboard へ */}
        <Route
          path="/login"
          element={
            user
              ? <Navigate to="/dashboard" replace />
              : <LoginPage onLogin={login} />
          }
        />

        {/* 新規登録画面：ログイン済みなら /dashboard へ */}
        <Route
          path="/register"
          element={
            user
              ? <Navigate to="/dashboard" replace />
              : <RegisterPage onRegister={register} />
          }
        />

        {/* ダッシュボード：未ログインなら /login へ */}
        <Route
          path="/dashboard"
          element={
            user
              ? <App user={user as AuthUser} onLogout={logout} />
              : <Navigate to="/login" replace />
          }
        />

        {/* 未定義ルートはすべて /login へ */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
