import { useEffect, useState } from 'react'
import { Task } from '../types/task'
import { authFetch } from '../lib/api'

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([])

  // GET: タスク一覧を取得する関数
  const fetchTasks = () => {
    authFetch('/api/tasks')
      .then(res => res.json())
      .then((data: Task[]) => setTasks(data))
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  // POST: タスクを新規作成
  const addTask = (
    title: string,
    date: string,
    time: string,
    priority: 1 | 2 | 3,
    weatherCondition: string | null
  ) => {
    authFetch('/api/tasks', {
      method: 'POST',
      body: JSON.stringify({
        title,
        scheduled_date:    date,
        scheduled_time:    time || null,
        priority,
        weather_condition: weatherCondition,
      }),
    }).then(() => fetchTasks())
  }

  // PATCH: 完了状態を切り替え
  const toggleComplete = (task: Task) => {
    authFetch(`/api/tasks/${task.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ is_completed: !task.is_completed }),
    }).then(() => fetchTasks())
  }

  // PATCH: 編集内容を保存
  const saveEdit = (task: Task, onDone: () => void) => {
    authFetch(`/api/tasks/${task.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        title:             task.title,
        scheduled_date:    task.scheduled_date,
        scheduled_time:    task.scheduled_time || null,
        priority:          task.priority,
        description:       task.description,
        weather_condition: task.weather_condition,
      }),
    }).then(() => {
      onDone()
      fetchTasks()
    })
  }

  // DELETE: タスクを削除
  const deleteTask = (id: number) => {
    authFetch(`/api/tasks/${id}`, { method: 'DELETE' })
      .then(() => fetchTasks())
  }

  return { tasks, addTask, toggleComplete, saveEdit, deleteTask }
}
