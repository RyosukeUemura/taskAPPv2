<?php

use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Sanctum SPA認証（Cookie/セッションベース）に必要なミドルウェアを一括登録
        // これにより /api/* ルートでセッション・CSRFが有効になる
        $middleware->statefulApi();
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // SPA構成では未認証時に route('login') へリダイレクトせず
        // JSON で 401 を返す（Sanctum の AuthenticateSession が起こす
        // "Route [login] not defined" エラーを防ぐ）
        $exceptions->render(function (AuthenticationException $e, Request $request) {
            if ($request->expectsJson() || $request->is('api/*')) {
                return response()->json(['message' => 'Unauthenticated.'], 401);
            }
        });
    })->create();
