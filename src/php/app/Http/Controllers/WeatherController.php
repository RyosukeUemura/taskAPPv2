<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Http;

class WeatherController extends Controller
{
    // 天気コード（WMOコード）→ 日本語の対応表
    private array $weatherConditions = [
        0  => '快晴',
        1  => '晴れ',
        2  => '一部曇り',
        3  => '曇り',
        45 => '霧',
        48 => '霧',
        51 => '霧雨',
        61 => '小雨',
        63 => '雨',
        65 => '大雨',
        71 => '小雪',
        73 => '雪',
        75 => '大雪',
        80 => 'にわか雨',
        95 => '雷雨',
    ];

    public function sapporo()
    {
        // current（今の天気）と daily（7日間予報）を1回で取得
        $response = Http::get('https://api.open-meteo.com/v1/forecast', [
            'latitude'      => 43.0618,
            'longitude'     => 141.3545,
            'current'       => 'temperature_2m,weathercode',
            'daily'         => 'weathercode,precipitation_probability_max',
            'timezone'      => 'Asia/Tokyo',
            'forecast_days' => 7,
        ]);

        $current = $response->json('current');
        $daily   = $response->json('daily');

        // ── 機能2：自転車通勤判定 ─────────────────────────────────
        // 今日の最大降水確率が 40% 以下なら OK
        $todayPrecipitation = $daily['precipitation_probability_max'][0] ?? 0;
        $bicycleOk = $todayPrecipitation <= 40;

        // ── 機能1：7日間予報を整形 ────────────────────────────────
        $dailyForecast = [];
        foreach ($daily['time'] as $i => $date) {
            $code = $daily['weathercode'][$i];
            $dailyForecast[] = [
                'date'             => $date,
                'weathercode'      => $code,
                'condition'        => $this->weatherConditions[$code] ?? '不明',
                'precipitation_max' => $daily['precipitation_probability_max'][$i],
            ];
        }

        return response()->json([
            'city'           => '札幌',
            'temperature'    => $current['temperature_2m'],
            'condition'      => $this->weatherConditions[$current['weathercode']] ?? '不明',
            'bicycle_ok'     => $bicycleOk,       // 自転車通勤の可否
            'daily_forecast' => $dailyForecast,   // 7日間の予報配列
        ], 200, [], JSON_UNESCAPED_UNICODE);
    }
}
