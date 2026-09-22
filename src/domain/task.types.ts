export type TaskStatus = 'todo' | 'in-progress' | 'done'
export type TaskPriority = 'high' | 'medium' | 'low'

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  position: number
}

export interface BoardSnapshotV1 {
  schemaVersion: 1
  tasks: Task[]
}

export interface ExportDocumentV1 extends BoardSnapshotV1 {
  exportedAt: string
}

export interface CreateTaskInput {
  title: string
  description: string
  priority: TaskPriority
}

export interface UpdateTaskInput {
  title: string
  description: string
  priority: TaskPriority
  status: TaskStatus
}

export interface MoveTaskInput {
  id: string
  toStatus: TaskStatus
  toIndex: number
}

export const TASK_STATUSES: TaskStatus[] = ['todo', 'in-progress', 'done']
export const TASK_PRIORITIES: TaskPriority[] = ['high', 'medium', 'low']

export const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: '待办',
  'in-progress': '进行中',
  done: '完成',
}

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  high: '高',
  medium: '中',
  low: '低',
}

