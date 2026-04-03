<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Task extends Model
{
    protected $fillable = [
        'user_id',           // ← 追加：誰のタスクか
        'scheduled_date',
        'scheduled_time',
        'title',
        'description',
        'priority',
        'is_completed',
        'weather_condition',
    ];

    protected $casts = [
        'scheduled_date' => 'date',
        'is_completed'   => 'boolean',
        'priority'       => 'integer',
    ];

    // 「1つのタスクは1人のユーザーに属する」リレーション
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
