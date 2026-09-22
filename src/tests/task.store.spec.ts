import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useTaskStore } from '@/stores/task.store'

describe('task store', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('creates a medium-priority task at the top of todo', () => {
    const store = useTaskStore()
    store.initialize()
    store.createTask({ title: '第一个', description: '', priority: 'medium' })
    store.createTask({ title: '第二个', description: '', priority: 'medium' })
    expect(store.todoTasks.map((task) => task.title)).toEqual(['第二个', '第一个'])
    expect(store.todoTasks[0].priority).toBe('medium')
  })

  it('keeps task ID while editing and can change status', () => {
    const store = useTaskStore()
    store.initialize()
    const created = store.createTask({ title: '任务', description: '', priority: 'low' })
    const updated = store.updateTask(created.id, { title: '已更新', description: '说明', priority: 'high', status: 'done' })
    expect(updated.id).toBe(created.id)
    expect(store.doneTasks[0].title).toBe('已更新')
  })

  it('marks current memory as unsaved when persistence fails', () => {
    const store = useTaskStore()
    store.initialize()
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('quota') })
    store.createTask({ title: '仍在内存中', description: '', priority: 'medium' })
    expect(store.persistenceState).toBe('unsaved')
    expect(store.tasks).toHaveLength(1)
    spy.mockRestore()
  })

  it('does not overwrite corrupt storage during ordinary edits', () => {
    localStorage.setItem('task-board.snapshot', '{bad json')
    const store = useTaskStore()
    store.initialize()
    store.createTask({ title: '内存任务', description: '', priority: 'medium' })
    expect(store.persistenceState).toBe('corrupt')
    expect(localStorage.getItem('task-board.snapshot')).toBe('{bad json')
  })
})

