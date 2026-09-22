import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { moveTask as calculateMove, normalizeAll, orderedByStatus } from '@/domain/task.ordering'
import { validateCreateInput, validateUpdateInput } from '@/domain/task.validation'
import type {
  CreateTaskInput,
  MoveTaskInput,
  Task,
  TaskStatus,
  UpdateTaskInput,
} from '@/domain/task.types'
import {
  loadSnapshot,
  removeSnapshot,
  saveSnapshot,
} from '@/services/task-storage.service'

export type PersistenceState = 'ready' | 'unsaved' | 'corrupt'

function createId() {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export const useTaskStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([])
  const persistenceState = ref<PersistenceState>('ready')
  const persistenceMessage = ref<string | null>(null)
  const corruptRaw = ref<string | null>(null)

  const todoTasks = computed(() => orderedByStatus(tasks.value, 'todo'))
  const inProgressTasks = computed(() => orderedByStatus(tasks.value, 'in-progress'))
  const doneTasks = computed(() => orderedByStatus(tasks.value, 'done'))
  const taskCountByStatus = computed<Record<TaskStatus, number>>(() => ({
    todo: todoTasks.value.length,
    'in-progress': inProgressTasks.value.length,
    done: doneTasks.value.length,
  }))

  function persist(forceCorruptReplacement = false) {
    if (persistenceState.value === 'corrupt' && corruptRaw.value !== null && !forceCorruptReplacement) {
      return false
    }
    const result = saveSnapshot(tasks.value)
    if (result.ok) {
      persistenceState.value = 'ready'
      persistenceMessage.value = null
      corruptRaw.value = null
    } else {
      persistenceState.value = 'unsaved'
      persistenceMessage.value = result.message
    }
    return result.ok
  }

  function commit(next: Task[], forceCorruptReplacement = false) {
    tasks.value = normalizeAll(next)
    persist(forceCorruptReplacement)
  }

  function initialize() {
    const result = loadSnapshot()
    if (result.ok) {
      tasks.value = result.tasks
      persistenceState.value = 'ready'
      return
    }
    tasks.value = []
    corruptRaw.value = result.raw
    persistenceState.value = 'corrupt'
    persistenceMessage.value = result.message
  }

  function createTask(input: CreateTaskInput): Task {
    const valid = validateCreateInput(input)
    const task: Task = {
      id: createId(),
      ...valid,
      status: 'todo',
      position: 0,
    }
    const todo = [task, ...todoTasks.value]
    const rest = tasks.value.filter((item) => item.status !== 'todo')
    commit([...rest, ...todo])
    return task
  }

  function updateTask(id: string, input: UpdateTaskInput): Task {
    const valid = validateUpdateInput(input)
    const current = tasks.value.find((task) => task.id === id)
    if (!current) throw new Error('找不到要编辑的任务。')

    if (current.status !== valid.status) {
      const withoutCurrent = tasks.value.filter((task) => task.id !== id)
      const target = orderedByStatus(withoutCurrent, valid.status)
      const updated = { ...current, ...valid, position: 0 }
      commit([updated, ...target, ...withoutCurrent.filter((task) => task.status !== valid.status)])
      return updated
    }

    const updated = { ...current, ...valid }
    commit(tasks.value.map((task) => task.id === id ? updated : task))
    return updated
  }

  function deleteTask(id: string) {
    if (!tasks.value.some((task) => task.id === id)) throw new Error('找不到要删除的任务。')
    commit(tasks.value.filter((task) => task.id !== id))
  }

  function moveTask(input: MoveTaskInput) {
    commit(calculateMove(tasks.value, input))
  }

  function replaceTasks(next: Task[]) {
    commit(next, true)
  }

  function retrySave() {
    return persist()
  }

  function resetCorruptData() {
    const removed = removeSnapshot()
    if (!removed.ok) {
      persistenceMessage.value = removed.message
      return false
    }
    tasks.value = []
    corruptRaw.value = null
    return persist()
  }

  return {
    tasks,
    todoTasks,
    inProgressTasks,
    doneTasks,
    taskCountByStatus,
    persistenceState,
    persistenceMessage,
    corruptRaw,
    initialize,
    createTask,
    updateTask,
    deleteTask,
    moveTask,
    replaceTasks,
    retrySave,
    resetCorruptData,
  }
})

