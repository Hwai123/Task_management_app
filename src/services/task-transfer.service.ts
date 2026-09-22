import { migrateSnapshot } from '@/domain/task.validation'
import type { ExportDocumentV1, Task } from '@/domain/task.types'

function downloadText(text: string, filename: string, type = 'application/json') {
  const blob = new Blob([text], { type })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

export function exportTasks(tasks: Task[]) {
  const document: ExportDocumentV1 = {
    schemaVersion: 1,
    exportedAt: new Date().toISOString(),
    tasks,
  }
  const date = new Date().toISOString().slice(0, 10)
  downloadText(JSON.stringify(document, null, 2), `task-board-${date}.json`)
}

export function downloadCorruptBackup(raw: string) {
  const date = new Date().toISOString().slice(0, 10)
  downloadText(raw, `task-board-corrupt-${date}.txt`, 'text/plain')
}

export async function parseImportFile(file: File): Promise<Task[]> {
  const text = await file.text()
  let value: unknown
  try {
    value = JSON.parse(text)
  } catch {
    throw new Error('文件不是有效的 JSON。请检查文件内容后重试。')
  }
  return migrateSnapshot(value).tasks
}

