// Laravel の API レスポンスの「形」を TypeScript に教える型定義

export type Task = {
  id: number
  scheduled_date: string
  scheduled_time: string | null
  title: string
  description: string | null
  priority: 1 | 2 | 3          // 1:低 2:中 3:高 の3択のみ許可
  is_completed: boolean
  weather_condition: string | null  // 希望する天気（"晴れ"/"曇り"/"雨"/null=指定なし）
  created_at: string
  updated_at: string
}

// 1日分の天気予報
export type DailyForecast = {
  date: string             // "2026-04-05" 形式
  weathercode: number      // WMOコード
  condition: string        // "晴れ" / "曇り" など日本語
  precipitation_max: number // 最大降水確率（%）
}

export type WeatherData = {
  city: string
  temperature: number
  condition: string
  bicycle_ok: boolean          // 自転車通勤の可否
  daily_forecast: DailyForecast[]  // 7日間の予報
}
