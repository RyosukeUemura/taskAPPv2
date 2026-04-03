import { useEffect, useState } from 'react'
import { authFetch } from '../lib/api'

// ログイン中のユーザー情報の型
export type AuthUser = {
  id:    number
  name:  string
  email: string
}

// ── 認証状態を管理するカスタムフック ─────────────────────────────
// App.tsx・main.tsx は「誰がログイン中か」を知るためだけにこのフックを使う。
// 実際の通信処理はここに閉じ込める。
export const useAuth = () => {
  const [user, setUser]           = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true) // 初期チェック中フラグ

  // マウント時：すでにログイン済みかどうかサーバーに確認
  // （ページリロードしてもログイン状態を維持するため）
  useEffect(() => {
    authFetch('/api/me')
      .then(res => (res.ok ? res.json() : null))
      .then((data: AuthUser | null) => {
        setUser(data)
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

  // ── ログイン処理 ─────────────────────────────────────────────
  // Sanctum SPA認証の流れ：
  //   Step1: /sanctum/csrf-cookie にGET → XSRF-TOKEN Cookieがセットされる
  //   Step2: /api/login にPOST → セッションCookieがセットされる
  const login = async (email: string, password: string): Promise<string | null> => {
    // Step1: CSRFトークンを取得（これを先にやらないとStep2でCSRFエラーになる）
    await fetch('/sanctum/csrf-cookie', { credentials: 'include' })

    // Step2: ログインAPIを呼ぶ（X-XSRF-TOKENはauthFetch内で自動付与）
    const res = await authFetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })

    if (!res.ok) {
      const err = await res.json()
      return err.message ?? 'ログインに失敗しました' // エラーメッセージを返す
    }

    const userData: AuthUser = await res.json()
    setUser(userData) // ログイン成功：ユーザー情報をstateに保存
    return null        // null = エラーなし
  }

  // ── ログアウト処理 ───────────────────────────────────────────
  const logout = async () => {
    await authFetch('/api/logout', { method: 'POST' })
    setUser(null) // stateをクリアするとLoginFormが表示される
  }

  return { user, isLoading, login, logout }
}
