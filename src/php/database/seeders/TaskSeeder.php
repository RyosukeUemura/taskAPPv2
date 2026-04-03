<?php

namespace Database\Seeders;

use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Seeder;

class TaskSeeder extends Seeder
{
    public function run(): void
    {
        // UserSeeder で作成したテストユーザーを取得
        $user = User::where('email', 'test@example.com')->firstOrFail();

        Task::insert([
            [
                'user_id'        => $user->id, // ← user_id を追加
                'scheduled_date' => '2026-04-05',
                'scheduled_time' => '10:00:00',
                'title'          => 'Reactの勉強',
                'description'    => 'useEffect と useState の使い方を復習する',
                'priority'       => 3, // 高
                'is_completed'   => false,
                'created_at'     => now(),
                'updated_at'     => now(),
            ],
            [
                'user_id'        => $user->id,
                'scheduled_date' => '2026-04-06',
                'scheduled_time' => null,
                'title'          => '買い物',
                'description'    => '牛乳・卵・パンを買う',
                'priority'       => 1, // 低
                'is_completed'   => false,
                'created_at'     => now(),
                'updated_at'     => now(),
            ],
            [
                'user_id'        => $user->id,
                'scheduled_date' => '2026-04-07',
                'scheduled_time' => '14:00:00',
                'title'          => 'Laravel API の復習',
                'description'    => 'Route::apiResource の仕組みをまとめる',
                'priority'       => 2, // 中
                'is_completed'   => false,
                'created_at'     => now(),
                'updated_at'     => now(),
            ],
        ]);
    }
}
