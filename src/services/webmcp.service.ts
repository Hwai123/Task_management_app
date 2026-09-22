import type { Pinia } from 'pinia'
import { useTaskStore } from '@/stores/task.store'
import { TASK_PRIORITIES, TASK_STATUSES, type TaskPriority, type TaskStatus } from '@/domain/task.types'

function objectInput(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('输入必须是对象。')
  return value as Record<string, unknown>
}

export function registerTaskTools(pinia: Pinia) {
  const context = document.modelContext
  if (!context?.registerTool) return () => undefined
  const controller = new AbortController()
  const store = useTaskStore(pinia)
  const options = { signal: controller.signal }
  const report = (error: unknown) => console.warn('WebMCP tool registration failed', error)

  const registrations = [
    context.registerTool({
      name: 'list_tasks',
      title: '查看任务',
      description: '读取当前看板中的全部任务及其状态、优先级和顺序。',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: true, untrustedContentHint: true },
      execute: () => ({ tasks: store.tasks.map((task) => ({ ...task })) }),
    }, options),
    context.registerTool({
      name: 'create_task',
      title: '创建任务',
      description: '在待办列顶部创建一个新任务。',
      inputSchema: {
        type: 'object',
        properties: {
          title: { type: 'string', minLength: 1, maxLength: 50 },
          description: { type: 'string', maxLength: 1000 },
          priority: { type: 'string', enum: TASK_PRIORITIES },
        },
        required: ['title'],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input) {
        const value = objectInput(input)
        const task = store.createTask({
          title: value.title as string,
          description: typeof value.description === 'string' ? value.description : '',
          priority: (value.priority ?? 'medium') as TaskPriority,
        })
        return { task: { ...task } }
      },
    }, options),
    context.registerTool({
      name: 'update_task',
      title: '更新任务',
      description: '修改指定任务的标题、描述、优先级和状态。',
      inputSchema: {
        type: 'object',
        properties: {
          id: { type: 'string', minLength: 1 },
          title: { type: 'string', minLength: 1, maxLength: 50 },
          description: { type: 'string', maxLength: 1000 },
          priority: { type: 'string', enum: TASK_PRIORITIES },
          status: { type: 'string', enum: TASK_STATUSES },
        },
        required: ['id', 'title', 'description', 'priority', 'status'],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input) {
        const value = objectInput(input)
        const task = store.updateTask(value.id as string, {
          title: value.title as string,
          description: value.description as string,
          priority: value.priority as TaskPriority,
          status: value.status as TaskStatus,
        })
        return { task: { ...task } }
      },
    }, options),
    context.registerTool({
      name: 'delete_task',
      title: '删除任务',
      description: '永久删除指定 ID 的任务。',
      inputSchema: {
        type: 'object',
        properties: { id: { type: 'string', minLength: 1 } },
        required: ['id'],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input) {
        const value = objectInput(input)
        store.deleteTask(value.id as string)
        return { deleted: true, id: value.id }
      },
    }, options),
  ]

  registrations.forEach((registration) => Promise.resolve(registration).catch(report))
  return () => controller.abort()
}

