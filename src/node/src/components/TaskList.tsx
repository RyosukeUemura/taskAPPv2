import React from 'react'
import { Task, DailyForecast } from '../types/task'
import { TaskItem } from './TaskItem'

type Props = {
  tasks:    Task[]
  forecast: DailyForecast[]  // 週間予報（TaskItem のアラート判定に使う）
  onToggle: (task: Task) => void
  onEdit:   (task: Task) => void
  onDelete: (id: number) => void
}

export const TaskList: React.FC<Props> = ({ tasks, forecast, onToggle, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow">
      <h2 className="text-sm font-semibold text-gray-500 p-4 border-b">
        タスク一覧（{tasks.length}件）
      </h2>

      {tasks.length === 0 ? (
        <div className="text-center text-gray-400 py-8">タスクがありません</div>
      ) : (
        <ul className="divide-y">
          {tasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              forecast={forecast}   // 予報データを TaskItem に流す
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}
    </div>
  )
}
