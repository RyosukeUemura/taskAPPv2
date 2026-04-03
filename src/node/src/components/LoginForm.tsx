import React, { useState } from 'react'

type Props = {
  onLogin: (email: string, password: string) => Promise<string | null>
}

export const LoginForm: React.FC<Props> = ({ onLogin }) => {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()     // ページリロードを防ぐ
    setIsLoading(true)
    setError(null)

    const errorMessage = await onLogin(email, password)

    if (errorMessage) {
      setError(errorMessage) // エラーがあれば画面に表示
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-sm mx-4">

        <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">
          🗂️ 気象連動タスク管理
        </h1>
        <p className="text-sm text-gray-400 text-center mb-6">ログインしてください</p>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* メールアドレス */}
          <div>
            <label className="text-sm text-gray-500">メールアドレス</label>
            <input
              type="email"
              required
              autoComplete="email"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          {/* パスワード */}
          <div>
            <label className="text-sm text-gray-500">パスワード</label>
            <input
              type="password"
              required
              autoComplete="current-password"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          {/* エラーメッセージ */}
          {error && (
            <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {/* ログインボタン */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'ログイン中...' : 'ログイン'}
          </button>
        </form>

        {/* テスト用アカウント案内 */}
        <div className="mt-5 p-3 bg-gray-50 rounded-lg text-xs text-gray-400 text-center">
          <p className="font-medium text-gray-500 mb-1">テスト用アカウント</p>
          <p>test@example.com</p>
          <p>password</p>
        </div>
      </div>
    </div>
  )
}
