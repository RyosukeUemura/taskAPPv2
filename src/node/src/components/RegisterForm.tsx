import React, { useState } from 'react'

type Props = {
  onRegister: (
    name: string,
    email: string,
    password: string,
    passwordConfirmation: string,
  ) => Promise<string | null>
  onSwitchToLogin: () => void
}

export const RegisterForm: React.FC<Props> = ({ onRegister, onSwitchToLogin }) => {
  const [name, setName]                       = useState('')
  const [email, setEmail]                     = useState('')
  const [password, setPassword]               = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [error, setError]                     = useState<string | null>(null)
  const [isLoading, setIsLoading]             = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const errorMessage = await onRegister(name, email, password, passwordConfirmation)
    if (errorMessage) {
      setError(errorMessage)
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-sm mx-4">

        <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">
          🗂️ 気象連動タスク管理
        </h1>
        <p className="text-sm text-gray-400 text-center mb-6">アカウントを作成</p>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* 名前 */}
          <div>
            <label className="text-sm text-gray-500">名前</label>
            <input
              type="text"
              required
              autoComplete="name"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

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
            <label className="text-sm text-gray-500">パスワード（8文字以上）</label>
            <input
              type="password"
              required
              autoComplete="new-password"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          {/* パスワード確認 */}
          <div>
            <label className="text-sm text-gray-500">パスワード（確認）</label>
            <input
              type="password"
              required
              autoComplete="new-password"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={passwordConfirmation}
              onChange={e => setPasswordConfirmation(e.target.value)}
            />
          </div>

          {/* エラーメッセージ */}
          {error && (
            <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {/* 登録ボタン */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '登録中...' : 'アカウント作成'}
          </button>
        </form>

        {/* ログイン画面へ */}
        <p className="mt-5 text-center text-sm text-gray-400">
          すでにアカウントをお持ちの方は{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-blue-500 hover:underline"
          >
            ログイン
          </button>
        </p>
      </div>
    </div>
  )
}
