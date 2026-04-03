<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 順番が重要：UserSeeder → TaskSeeder（外部キー制約のため）
        $this->call([
            UserSeeder::class,
            TaskSeeder::class,
        ]);
    }
}
