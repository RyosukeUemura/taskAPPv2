<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            // 希望する天気（"晴れ" / "曇り" / "雨" / null=指定なし）
            $table->string('weather_condition')->nullable()->after('is_completed');
        });
    }

    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropColumn('weather_condition');
        });
    }
};
