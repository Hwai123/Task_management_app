import {
  TASK_PRIORITIES,
  TASK_STATUSES,
  type BoardSnapshotV1,
  type CreateTaskInput,
  type Task,
  type TaskPriority,
  type TaskStatus,
  type UpdateTaskInput,
} from './task.types'

export class ValidationError extends Error {
  constructor(message: string, public readonly field?: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

export const unicodeLength = (value: string) => Array.from(value).length

export function validateTitle(value: unknown): string {
  if (typeof value !== 'string') throw new ValidationError('标题必须是文本。', 'title')
  const title = value.trim()
  if (!title) throw new ValidationError('请输入任务标题。', 'title')
  if (unicodeLength(title) > 50) throw new ValidationError('标题不能超过 50 个字符。', 'title')
  return title
}

export function validateDescription(value: unknown): string {
  if (typeof value !== 'string') throw new ValidationError('描述必须是文本。', 'description')
  if (unicodeLength(value) > 1000) throw new ValidationError('描述不能超过 1000 个字符。', 'description')
  return value
}

function validatePriority(value: unknown): TaskPriority {
  if (!TASK_PRIORITIES.includes(value as TaskPriority)) {
    throw new ValidationError('优先级不是允许的值。', 'priority')
  }
  return value as TaskPriority
}

function validateStatus(value: unknown): TaskStatus {
  if (!TASK_STATUSES.includes(value as TaskStatus)) {
    throw new ValidationError('状态不是允许的值。', 'status')
  }
  return value as TaskStatus
}

export function validateCreateInput(input: CreateTaskInput): CreateTaskInput {
  return {
    title: validateTitle(input.title),
    description: validateDescription(input.description),
    priority: validatePriority(input.priority),
  }
}

export function validateUpdateInput(input: UpdateTaskInput): UpdateTaskInput {
  return {
    title: validateTitle(input.title),
    description: validateDescription(input.description),
    priority: validatePriority(input.priority),
    status: validateStatus(input.status),
  }
}

function asRecord(value: unknown, path: string): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new ValidationError(`${path} 必须是对象。`)
  }
  return value as Record<string, unknown>
}

function validateTask(value: unknown, index: number): Task {
  const path = `tasks[${index}]`
  const item = asRecord(value, path)
  if (typeof item.id !== 'string' || !item.id.trim()) {
    throw new ValidationError(`${path}.id 必须是非空字符串。`)
  }
  if (!Number.isInteger(item.position) || (item.position as number) < 0) {
    throw new ValidationError(`${path}.position 必须是非负整数。`)
  }

  try {
    return {
      id: item.id,
      title: validateTitle(item.title),
      description: validateDescription(item.description),
      status: validateStatus(item.status),
      priority: validatePriority(item.priority),
      position: item.position as number,
    }
  } catch (error) {
    if (error instanceof ValidationError) {
      throw new ValidationError(`${path}.${error.field ?? 'field'}：${error.message}`)
    }
    throw error
  }
}

export function migrateSnapshot(value: unknown): BoardSnapshotV1 {
  const root = asRecord(value, '文件内容')
  if (root.schemaVersion !== 1) {
    throw new ValidationError(`不支持的 schemaVersion：${String(root.schemaVersion)}。当前仅支持版本 1。`)
  }
  if (!Array.isArray(root.tasks)) throw new ValidationError('tasks 必须是数组。')

  const tasks = root.tasks.map(validateTask)
  const ids = new Set<string>()
  for (const [index, task] of tasks.entries()) {
    if (ids.has(task.id)) throw new ValidationError(`tasks[${index}].id 与其他任务重复。`)
    ids.add(task.id)
  }

  const normalized: Task[] = []
  for (const status of TASK_STATUSES) {
    tasks
      .map((task, sourceIndex) => ({ task, sourceIndex }))
      .filter(({ task }) => task.status === status)
      .sort((a, b) => a.task.position - b.task.position || a.sourceIndex - b.sourceIndex)
      .forEach(({ task }, position) => normalized.push({ ...task, position }))
  }
  return { schemaVersion: 1, tasks: normalized }
}

