import { TASK_STATUSES, type MoveTaskInput, type Task, type TaskStatus } from './task.types'

export function orderedByStatus(tasks: Task[], status: TaskStatus): Task[] {
  return tasks.filter((task) => task.status === status).sort((a, b) => a.position - b.position)
}

export function normalizeAll(tasks: Task[]): Task[] {
  return TASK_STATUSES.flatMap((status) =>
    orderedByStatus(tasks, status).map((task, position) => ({ ...task, position })),
  )
}

export function replaceColumn(tasks: Task[], status: TaskStatus, column: Task[]): Task[] {
  const rest = tasks.filter((task) => task.status !== status)
  const normalized = column.map((task, position) => ({ ...task, status, position }))
  return normalizeAll([...rest, ...normalized])
}

export function moveTask(tasks: Task[], input: MoveTaskInput): Task[] {
  const task = tasks.find((item) => item.id === input.id)
  if (!task) throw new Error('找不到要移动的任务。')

  const source = orderedByStatus(tasks, task.status).filter((item) => item.id !== task.id)
  const target = task.status === input.toStatus
    ? source
    : orderedByStatus(tasks, input.toStatus).filter((item) => item.id !== task.id)
  const insertionIndex = Math.max(0, Math.min(input.toIndex, target.length))
  target.splice(insertionIndex, 0, { ...task, status: input.toStatus })

  const untouched = tasks.filter(
    (item) => item.status !== task.status && item.status !== input.toStatus,
  )
  const sourceNormalized = source.map((item, position) => ({ ...item, position }))
  const targetNormalized = target.map((item, position) => ({ ...item, position }))
  const changed = task.status === input.toStatus ? targetNormalized : [...sourceNormalized, ...targetNormalized]
  return normalizeAll([...untouched, ...changed])
}

