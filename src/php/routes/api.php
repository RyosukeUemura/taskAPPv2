<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\RegisteredUserController;
use App\Http\Controllers\WeatherController;
use App\Http\Controllers\TaskController;

// ── 認証不要のルート ────────────────────────────────────────────
Route::post('/register', [RegisteredUserController::class, 'store']);
Route::post('/login',    [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);
Route::get('/me',      [AuthController::class, 'me']);

// ── 要認証のルート（auth:sanctum ミドルウェアで保護） ──────────
// このグループ内のルートはログイン済みでないと 401 が返る
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/weather/sapporo', [WeatherController::class, 'sapporo']);
    Route::apiResource('tasks', TaskController::class);
});
