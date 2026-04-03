<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 開発環境のため、既存のタスクデータを一旦クリアして
        // user_id を非NULL制約で追加する（シーダーで再作成）
        DB::table('tasks')->truncate();

        Schema::table('tasks', function (Blueprint $table) {
            $table->foreignId('user_id')  // unsignedBigInteger + 外部キー制約を一括定義
                  ->after('id')
                  ->constrained()         // users テーブルの id を参照
                  ->cascadeOnDelete();    // ユーザー削除時にタスクも自動削除
        });
    }

    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');
        });
    }
};
