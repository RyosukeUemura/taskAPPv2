import React from 'react'
import { WeatherData } from '../types/task'

type Props = {
  weather: WeatherData | null
  today: string
}

export const WeatherCard: React.FC<Props> = ({ weather, today }) => {
  return (
    <div className="bg-white rounded-xl shadow p-4 mb-6">
      <div className="flex items-center gap-6">

        {/* 今日の日付（左側） */}
        <div className="text-center border-r border-gray-200 pr-6 shrink-0">
          <div className="text-xs text-gray-400 mb-0.5">今日</div>
          <div className="text-base font-bold text-gray-800">{today}</div>
        </div>

        {/* 天気情報（右側） */}
        {weather ? (
          <div className="flex flex-1 items-center justify-between">

            {/* 現在の天気 */}
            <div className="flex items-center gap-3">
              <div className="text-4xl">🌤️</div>
              <div>
                <div className="text-sm text-gray-500">📍 {weather.city}の現在の天気</div>
                <div className="text-lg font-semibold text-gray-800">{weather.condition}</div>
                <div className="text-gray-600">🌡️ 気温：{weather.temperature}℃</div>
              </div>
            </div>

            {/* 機能2：自転車通勤判定 */}
            <div className={`text-center px-4 py-2 rounded-lg border-2 ${
              weather.bicycle_ok
                ? 'border-green-300 bg-green-50'
                : 'border-red-300 bg-red-50'
            }`}>
              <div className="text-2xl mb-0.5">
                {weather.bicycle_ok ? '🚲' : '☔️'}
              </div>
              <div className={`text-sm font-bold ${
                weather.bicycle_ok ? 'text-green-700' : 'text-red-600'
              }`}>
                自転車通勤
              </div>
              <div className={`text-xs font-bold ${
                weather.bicycle_ok ? 'text-green-600' : 'text-red-500'
              }`}>
                {weather.bicycle_ok ? 'OK' : 'NG'}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-gray-400">天気を取得中...</div>
        )}
      </div>
    </div>
  )
}
