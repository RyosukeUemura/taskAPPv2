// ── Sanctum SPA認証用の共通fetchヘルパー ─────────────────────────
//
// Sanctumのセッション認証では以下が必要：
//   1. credentials: 'include'  → CookieをリクエストへSanctumのに含める
//   2. X-XSRF-TOKEN ヘッダー   → CSRF攻撃を防ぐトークン（Cookieから読む）
//
// すべての fetch をこのヘルパー経由にすることで、
// 各フック・コンポーネントでの重複をなくす。

// ブラウザの Cookie から XSRF-TOKEN を読み取る
// （Sanctumが /sanctum/csrf-cookie で自動セットする Cookie）
const getCsrfToken = (): string => {
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/)
  return match ? decodeURIComponent(match[1]) : ''
}

// 認証付きfetch：全リクエストにCookie + X-XSRF-TOKENを自動付与
export const authFetch = (url: string, options: RequestInit = {}): Promise<Response> => {
  return fetch(url, {
    ...options,
    credentials: 'include', // セッションCookieを送受信する
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',   // LaravelにJSONレスポンスを強制（HTMLエラーを防ぐ）
      'X-XSRF-TOKEN': getCsrfToken(), // CSRFトークンをヘッダーに付与
      ...(options.headers ?? {}),     // 呼び出し元からの追加ヘッダーをマージ
    },
  })
}
