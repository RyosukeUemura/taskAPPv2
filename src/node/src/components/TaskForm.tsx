import React, { useState } from 'react'

type Props = {
  onAdd: (
    title: string,
    date: string,
    time: string,
    priority: 1 | 2 | 3,
    weatherCondition: string | null
  ) => void
}

export const TaskForm: React.FC<Props> = ({ onAdd }) => {
  const [title, setTitle]                   = useState('')
  const [date, setDate]                     = useState('')
  const [time, setTime]                     = useState('')
  const [priority, setPriority]             = useState<1 | 2 | 3>(1)
  const [weatherCondition, setWeatherCondition] = useState<string>('') // '' = 指定なし

  const handleAdd = () => {
    if (!title || !date) return
    onAdd(title, date, time, priority, weatherCondition || null)
    setTitle('')
    setDate('')
    setTime('')
    setPriority(1)
    setWeatherCondition('')
  }

  return (
    <div className="bg-white rounded-xl shadow p-4 mb-6">
      <h2 className="text-sm font-semibold text-gray-500 mb-3">新しいタスクを追加</h2>

      {/* 1行目：タスク名・日付 */}
      <div className="flex gap-2 mb-2">
        <input
          className="border border-gray-300 rounded-lg px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="タスク名（必須）"
          value={title}
          onChange={e => setTitle(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
        />
        <input
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
        />
      </div>

      {/* 2行目：時刻・優先度・希望天気・追加ボタン */}
      <div className="flex gap-2">
        <input
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          type="time"
          value={time}
          onChange={e => setTime(e.target.value)}
          title="実施予定時刻（任意）"
        />
        <select
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={priority}
          onChange={e => setPriority(Number(e.target.value) as 1 | 2 | 3)}
        >
          <option value={1}>🟢 低</option>
          <option value={2}>🟡 中</option>
          <option value={3}>🔴 高</option>
        </select>

        {/* 希望天気（気象連動アラート用） */}
        <select
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={weatherCondition}
          onChange={e => setWeatherCondition(e.target.value)}
          title="希望する天気（指定すると予報と合わない場合にアラートが出ます）"
        >
          <option value="">🌈 天気指定なし</option>
          <option value="晴れ">☀️ 晴れ</option>
          <option value="曇り">☁️ 曇り</option>
          <option value="雨">🌧️ 雨</option>
        </select>

        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors ml-auto"
          onClick={handleAdd}
        >
          追加
        </button>
      </div>
    </div>
  )
}
