import { useState } from 'react'
import { Task } from './types/task'
import { AuthUser } from './hooks/useAuth'
import { useWeather } from './hooks/useWeather'
import { useTasks }   from './hooks/useTasks'
import { WeatherCard } from './components/WeatherCard'
import { TaskForm }    from './components/TaskForm'
import { TaskList }    from './components/TaskList'
import { EditModal }   from './components/EditModal'

// 今日の日付を「2026年4月2日（木）」形式で生成
const today = new Date().toLocaleDateString('ja-JP', {
  year: 'numeric', month: 'long', day: 'numeric', weekday: 'short',
})

// main.tsx からログイン済みユーザー情報とログアウト関数を受け取る
type Props = {
  user:     AuthUser
  onLogout: () => void
}

function App({ user, onLogout }: Props) {
  const { weather }                                              = useWeather()
  const { tasks, addTask, toggleComplete, saveEdit, deleteTask } = useTasks()
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  return (
    <div className="max-w-2xl mx-auto p-6">

      {/* ヘッダー：タイトル＋ユーザー名＋ログアウトボタン */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800">
          🗂️ 気象連動タスク管理
        </h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">{user.name}</span>
          <button
            onClick={onLogout}
            className="text-sm text-gray-400 hover:text-red-500 transition-colors"
          >
            ログアウト
          </button>
        </div>
      </div>

      <WeatherCard weather={weather} today={today} />
      <TaskForm onAdd={addTask} />
      <TaskList
        tasks={tasks}
        forecast={weather?.daily_forecast ?? []}
        onToggle={toggleComplete}
        onEdit={setEditingTask}
        onDelete={deleteTask}
      />

      {editingTask && (
        <EditModal
          task={editingTask}
          onSave={task => saveEdit(task, () => setEditingTask(null))}
          onClose={() => setEditingTask(null)}
        />
      )}
    </div>
  )
}

export default App
