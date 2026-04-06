<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules;

class RegisteredUserController extends Controller
{
    // POST /api/register
    // 新規ユーザーを登録し、自動ログイン状態にして返す
    public function store(Request $request)
    {
        $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        // User モデルの 'password' => 'hashed' キャストが自動でハッシュ化するため
        // Hash::make() は呼ばない（二重ハッシュになりログインできなくなる）
        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => $request->password,
        ]);

        // Auth::login() は内部で session->migrate(true) を呼ぶため
        // 外側で regenerate() を重ねて呼ぶ必要はない
        Auth::login($user);

        return response()->json($user, 201);
    }
}
