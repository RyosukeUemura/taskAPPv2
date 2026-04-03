import React from 'react'
import { Task, DailyForecast } from '../types/task'

// 優先度の数字 → ラベル変換
const priorityLabel = (p: number) =>
  p === 3 ? '🔴 高' : p === 2 ? '🟡 中' : '🟢 低'

// WMOコードを「晴れ / 曇り / 雨」の3カテゴリに分類
// WeatherController.php の $weatherConditions と対応
const getCategory = (code: number): string => {
  if (code <= 2)  return '晴れ'   // 0:快晴, 1:晴れ, 2:一部曇り
  if (code <= 48) return '曇り'   // 3:曇り, 45/48:霧
  return '雨'                      // 51以上：霧雨・雨・雪・雷雨
}

// 親（TaskList.tsx）から受け取るデータ・関数の型定義
type Props = {
  task:     Task
  forecast: DailyForecast[]        // 週間予報（アラート判定に使う）
  onToggle: (task: Task) => void   // チェックボックスが押されたとき
  onEdit:   (task: Task) => void   // 編集ボタンが押されたとき
  onDelete: (id: number) => void   // 削除ボタンが押されたとき
}

export const TaskItem: React.FC<Props> = ({ task, forecast, onToggle, onEdit, onDelete }) => {
  // ── 気象アラート判定 ────────────────────────────────────────────
  // タスクの日付に一致する予報を探す
  const forecastForTask = forecast.find(
    f => f.date === task.scheduled_date.slice(0, 10)
  )
  // 希望天気が設定されていて、予報のカテゴリと一致しない場合にアラート
  const hasAlert =
    task.weather_condition !== null &&
    forecastForTask !== undefined &&
    task.weather_condition !== getCategory(forecastForTask.weathercode)

  return (
    <li className="flex items-center justify-between p-4">

      {/* 左側：チェックボックス + タスク情報 */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={task.is_completed}
          onChange={() => onToggle(task)} // 親から受け取った関数を呼び出す
          className="w-4 h-4 cursor-pointer accent-blue-500"
        />
        <div>
          {/* タスク名：完了済みは取り消し線 */}
          <div className="flex items-center gap-2">
            <span className={`font-medium ${task.is_completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
              {task.title}
            </span>
            {/* 気象アラート：希望天気と予報が合わない場合に表示 */}
            {hasAlert && (
              <span
                className="text-yellow-500 text-sm"
                title={`希望：${task.weather_condition} / 予報：${getCategory(forecastForTask!.weathercode)}`}
              >
                ⚠️ 天気が合いません
              </span>
            )}
          </div>
          <div className="flex gap-2 mt-0.5">
            <span className="text-xs text-gray-400">
              📅 {task.scheduled_date.slice(0, 10)}
              {/* 時刻があれば併記 */}
              {task.scheduled_time && ` ${task.scheduled_time.slice(0, 5)}`}
            </span>
            <span className="text-xs">{priorityLabel(task.priority)}</span>
            {/* 希望天気が設定されている場合に表示 */}
            {task.weather_condition && (
              <span className="text-xs text-gray-400">
                🌈 {task.weather_condition}希望
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 右側：編集・削除ボタン */}
      <div className="flex gap-2">
        <button
          className="text-sm text-blue-400 hover:text-blue-600 transition-colors"
          onClick={() => onEdit(task)} // 親から受け取った関数を呼び出す
        >
          編集
        </button>
        <button
          className="text-sm text-red-400 hover:text-red-600 transition-colors"
          onClick={() => onDelete(task.id)} // 親から受け取った関数を呼び出す
        >
          削除
        </button>
      </div>
    </li>
  )
}
