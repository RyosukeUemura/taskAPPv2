<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    // POST /api/login
    // メールアドレス・パスワードでログインし、セッションを開始する
    public function login(Request $request)
    {
        // バリデーション（必須チェック）
        $credentials = $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required'],
        ]);

        // 認証失敗時は 422 エラー
        if (!Auth::attempt($credentials)) {
            return response()->json(
                ['message' => 'メールアドレスまたはパスワードが正しくありません'],
                422
            );
        }

        // セッションIDを再生成（セッション固定攻撃の防止）
        $request->session()->regenerate();

        return response()->json(Auth::user());
    }

    // POST /api/logout
    // セッションを破棄してログアウトする
    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();        // セッションを無効化
        $request->session()->regenerateToken();   // CSRFトークンを再生成

        return response()->json(['message' => 'ログアウトしました']);
    }

    // GET /api/me
    // 現在ログイン中のユーザー情報を返す（未ログインの場合は 401）
    public function me(Request $request)
    {
        $user = $request->user();

        if (! $user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        return response()->json($user);
    }
}
