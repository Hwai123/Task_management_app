import { describe, expect, it } from 'vitest'
import { moveTask } from '@/domain/task.ordering'
import type { Task } from '@/domain/task.types'

const tasks: Task[] = [
  { id: 'a', title: 'A', description: '', status: 'todo', priority: 'medium', position: 0 },
  { id: 'b', title: 'B', description: '', status: 'todo', priority: 'medium', position: 1 },
  { id: 'c', title: 'C', description: '', status: 'in-progress', priority: 'high', position: 0 },
]

describe('task ordering', () => {
  it('reorders within a column', () => {
    const next = moveTask(tasks, { id: 'b', toStatus: 'todo', toIndex: 0 })
    expect(next.filter((task) => task.status === 'todo').map((task) => task.id)).toEqual(['b', 'a'])
  })

  it('moves across columns and renumbers both columns', () => {
    const next = moveTask(tasks, { id: 'a', toStatus: 'in-progress', toIndex: 1 })
    expect(next.filter((task) => task.status === 'todo').map((task) => [task.id, task.position])).toEqual([['b', 0]])
    expect(next.filter((task) => task.status === 'in-progress').map((task) => [task.id, task.position])).toEqual([['c', 0], ['a', 1]])
  })
})

