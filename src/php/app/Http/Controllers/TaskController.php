<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    // GET /api/tasks → ログイン中ユーザーのタスク一覧を返す（実施予定日の昇順）
    public function index()
    {
        return response()->json(
            auth()->user()->tasks()->orderBy('scheduled_date')->get()
        );
    }

    // POST /api/tasks → ログイン中ユーザーのタスクを新規作成
    public function store(Request $request)
    {
        // リレーション経由で作成すると user_id が自動でセットされる
        $task = auth()->user()->tasks()->create($request->only([
            'scheduled_date',
            'scheduled_time',
            'title',
            'description',
            'priority',
            'weather_condition',
        ]));

        return response()->json($task, 201);
    }

    // GET /api/tasks/{id} → 指定IDのタスクを1件返す（所有者チェック付き）
    public function show(Task $task)
    {
        abort_if($task->user_id !== auth()->id(), 403); // 他人のタスクは403

        return response()->json($task);
    }

    // PATCH /api/tasks/{id} → 指定IDのタスクを更新（所有者チェック付き）
    public function update(Request $request, Task $task)
    {
        abort_if($task->user_id !== auth()->id(), 403);

        $task->update($request->only([
            'scheduled_date',
            'scheduled_time',
            'title',
            'description',
            'priority',
            'is_completed',
            'weather_condition',
        ]));

        return response()->json($task);
    }

    // DELETE /api/tasks/{id} → 指定IDのタスクを削除（所有者チェック付き）
    public function destroy(Task $task)
    {
        abort_if($task->user_id !== auth()->id(), 403);

        $task->delete();

        return response()->json(null, 204);
    }
}
