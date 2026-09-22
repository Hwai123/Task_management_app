import { migrateSnapshot, ValidationError } from '@/domain/task.validation'
import type { BoardSnapshotV1, Task } from '@/domain/task.types'

export const SNAPSHOT_KEY = 'task-board.snapshot'

export type LoadResult =
  | { ok: true; tasks: Task[] }
  | { ok: false; raw: string; message: string }

export type SaveResult = { ok: true } | { ok: false; message: string }

export function loadSnapshot(): LoadResult {
  let raw: string | null
  try {
    raw = localStorage.getItem(SNAPSHOT_KEY)
  } catch {
    return { ok: false, raw: '', message: '浏览器阻止了本地数据读取。你仍可继续使用并导出当前任务。' }
  }
  if (raw === null) return { ok: true, tasks: [] }
  try {
    return { ok: true, tasks: migrateSnapshot(JSON.parse(raw)).tasks }
  } catch (error) {
    const detail = error instanceof ValidationError || error instanceof SyntaxError
      ? error.message
      : '未知格式错误'
    return { ok: false, raw, message: `本地数据无法读取：${detail}` }
  }
}

export function saveSnapshot(tasks: Task[]): SaveResult {
  const snapshot: BoardSnapshotV1 = { schemaVersion: 1, tasks }
  try {
    localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(snapshot))
    return { ok: true }
  } catch {
    return { ok: false, message: '未能保存到此浏览器。请重试，或先导出 JSON 备份。' }
  }
}

export function removeSnapshot(): SaveResult {
  try {
    localStorage.removeItem(SNAPSHOT_KEY)
    return { ok: true }
  } catch {
    return { ok: false, message: '浏览器阻止了数据重置。原始数据仍然保留。' }
  }
}

