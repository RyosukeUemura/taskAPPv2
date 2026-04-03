import React, { useState } from 'react'
import { Task } from '../types/task'

// 親（App.tsx）から受け取るデータ・関数の型定義
type Props = {
  task:    Task                  // 編集対象のタスク（初期値として使う）
  onSave:  (task: Task) => void  // 「保存」ボタンが押されたとき
  onClose: () => void            // 「キャンセル」ボタンが押されたとき
}

export const EditModal: React.FC<Props> = ({ task, onSave, onClose }) => {
  // 編集中の一時的なデータをこのコンポーネント内で管理する
  // 親から受け取った task を初期値として設定
  const [draft, setDraft] = useState<Task>(task)

  return (
    // 背景の黒半透明オーバーレイ
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
        <h2 className="text-lg font-bold text-gray-800 mb-4">タスクを編集</h2>

        <div className="space-y-3">

          {/* タスク名 */}
          <div>
            <label className="text-sm text-gray-500">タスク名</label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={draft.title}
              onChange={e => setDraft({ ...draft, title: e.target.value })}
            />
          </div>

          {/* 実施予定日・時刻 */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-sm text-gray-500">実施予定日</label>
              <input
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                type="date"
                value={draft.scheduled_date.slice(0, 10)}
                onChange={e => setDraft({ ...draft, scheduled_date: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm text-gray-500">実施予定時刻（任意）</label>
              <input
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                type="time"
                value={draft.scheduled_time?.slice(0, 5) ?? ''}
                onChange={e => setDraft({ ...draft, scheduled_time: e.target.value || null })}
              />
            </div>
          </div>

          {/* 優先度 */}
          <div>
            <label className="text-sm text-gray-500">優先度</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={draft.priority}
              onChange={e => setDraft({ ...draft, priority: Number(e.target.value) as 1 | 2 | 3 })}
            >
              <option value={1}>🟢 低</option>
              <option value={2}>🟡 中</option>
              <option value={3}>🔴 高</option>
            </select>
          </div>

          {/* 希望天気（気象連動アラート用） */}
          <div>
            <label className="text-sm text-gray-500">希望天気（任意）</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={draft.weather_condition ?? ''}
              onChange={e => setDraft({ ...draft, weather_condition: e.target.value || null })}
            >
              <option value="">🌈 指定なし</option>
              <option value="晴れ">☀️ 晴れ</option>
              <option value="曇り">☁️ 曇り</option>
              <option value="雨">🌧️ 雨</option>
            </select>
          </div>

          {/* タスク内容（任意） */}
          <div>
            <label className="text-sm text-gray-500">タスク内容（任意）</label>
            <textarea
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows={3}
              value={draft.description ?? ''}
              onChange={e => setDraft({ ...draft, description: e.target.value || null })}
            />
          </div>
        </div>

        {/* キャンセル・保存ボタン */}
        <div className="flex gap-2 mt-5 justify-end">
          <button
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
            onClick={onClose} // 親から受け取った「閉じる」関数を呼ぶ
          >
            キャンセル
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors"
            onClick={() => onSave(draft)} // 編集中のデータを親に渡して保存
          >
            保存
          </button>
        </div>
      </div>
    </div>
  )
}
