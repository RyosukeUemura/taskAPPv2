<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();                                    // 主キー（自動連番）
            $table->date('scheduled_date');                  // 実施予定日
            $table->time('scheduled_time')->nullable();      // 実施予定時刻（任意）
            $table->string('title');                         // タイトル
            $table->text('description')->nullable();         // タスク内容（任意）
            $table->integer('priority')->default(1);         // 優先度（1:低 2:中 3:高）
            $table->boolean('is_completed')->default(false); // 完了済みフラグ
            $table->timestamps();                            // created_at / updated_at（自動）
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
