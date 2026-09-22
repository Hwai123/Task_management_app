import { describe, expect, it, vi } from 'vitest'
import { loadSnapshot, saveSnapshot, SNAPSHOT_KEY } from '@/services/task-storage.service'

describe('task storage', () => {
  it('returns an empty board when storage has no snapshot', () => {
    expect(loadSnapshot()).toEqual({ ok: true, tasks: [] })
  })

  it('loads a valid versioned snapshot', () => {
    localStorage.setItem(SNAPSHOT_KEY, JSON.stringify({ schemaVersion: 1, tasks: [] }))
    expect(loadSnapshot()).toEqual({ ok: true, tasks: [] })
  })

  it('does not overwrite corrupt data', () => {
    localStorage.setItem(SNAPSHOT_KEY, '{bad json')
    const result = loadSnapshot()
    expect(result.ok).toBe(false)
    expect(localStorage.getItem(SNAPSHOT_KEY)).toBe('{bad json')
  })

  it('turns write exceptions into a recoverable result', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('quota') })
    expect(saveSnapshot([])).toEqual({ ok: false, message: expect.stringContaining('未能保存') })
    spy.mockRestore()
  })
})

