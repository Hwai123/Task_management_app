import { describe, expect, it } from 'vitest'
import { migrateSnapshot, validateCreateInput, ValidationError } from '@/domain/task.validation'

describe('task validation', () => {
  it('trims a valid title', () => {
    expect(validateCreateInput({ title: '  写报告  ', description: '', priority: 'medium' }).title).toBe('写报告')
  })

  it('rejects a blank title', () => {
    expect(() => validateCreateInput({ title: '   ', description: '', priority: 'medium' })).toThrow(ValidationError)
  })

  it('rejects titles longer than 50 Unicode characters', () => {
    expect(() => validateCreateInput({ title: '任'.repeat(51), description: '', priority: 'medium' })).toThrow('标题不能超过 50 个字符')
  })

  it('rejects the whole snapshot when IDs repeat', () => {
    const task = { id: 'same', title: '任务', description: '', status: 'todo', priority: 'low', position: 0 }
    expect(() => migrateSnapshot({ schemaVersion: 1, tasks: [task, task] })).toThrow('重复')
  })

  it('renumbers imported positions stably', () => {
    const snapshot = migrateSnapshot({
      schemaVersion: 1,
      tasks: [
        { id: 'b', title: 'B', description: '', status: 'todo', priority: 'low', position: 5 },
        { id: 'a', title: 'A', description: '', status: 'todo', priority: 'high', position: 2 },
      ],
    })
    expect(snapshot.tasks.map(({ id, position }) => [id, position])).toEqual([['a', 0], ['b', 1]])
  })
})

