<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name'     => 'テストユーザー',
            'email'    => 'test@example.com',
            'password' => Hash::make('password'), // ログイン時は password を使用
        ]);
    }
}
