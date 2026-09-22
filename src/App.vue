<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import BoardView from '@/components/board/BoardView.vue'
import TaskFormDialog from '@/components/dialogs/TaskFormDialog.vue'
import ConfirmDialog from '@/components/dialogs/ConfirmDialog.vue'
import PersistenceBanner from '@/components/feedback/PersistenceBanner.vue'
import FeedbackToast from '@/components/feedback/FeedbackToast.vue'
import type { MoveTaskInput, Task, UpdateTaskInput } from '@/domain/task.types'
import { useTaskStore } from '@/stores/task.store'
import { useThemeStore } from '@/stores/theme.store'
import { downloadCorruptBackup, exportTasks, parseImportFile } from '@/services/task-transfer.service'

const taskStore = useTaskStore()
const themeStore = useThemeStore()
const formOpen = ref(false)
const editingTask = ref<Task | null>(null)
const confirmMode = ref<'delete' | 'import' | 'reset' | null>(null)
const selectedTask = ref<Task | null>(null)
const pendingImport = ref<Task[] | null>(null)
const toastMessage = ref('')
const toastTone = ref<'success' | 'error'>('success')
let toastTimer: number | undefined

const total = computed(() => taskStore.tasks.length)
const confirmTitle = computed(() => {
  if (confirmMode.value === 'delete') return '删除这个任务？'
  if (confirmMode.value === 'import') return '替换当前全部任务？'
  return '重置损坏的数据？'
})
const confirmMessage = computed(() => {
  if (confirmMode.value === 'delete') return `“${selectedTask.value?.title ?? ''}”将被永久删除，此操作无法撤销。`
  if (confirmMode.value === 'import') return `文件校验通过，包含 ${pendingImport.value?.length ?? 0} 个任务。确认后将完全替换当前 ${total.value} 个任务。`
  return '确认后将删除浏览器中的损坏数据并创建一个空看板。建议先下载原始备份。'
})

onMounted(() => {
  themeStore.initializeTheme()
  taskStore.initialize()
})

function toast(message: string, tone: 'success' | 'error' = 'success') {
  window.clearTimeout(toastTimer)
  toastMessage.value = message
  toastTone.value = tone
  toastTimer = window.setTimeout(() => { toastMessage.value = '' }, 3200)
}

function openCreate() {
  editingTask.value = null
  formOpen.value = true
}

function openEdit(task: Task) {
  editingTask.value = task
  formOpen.value = true
}

function submitTask(value: UpdateTaskInput) {
  try {
    if (editingTask.value) {
      taskStore.updateTask(editingTask.value.id, value)
      toast('任务已更新')
    } else {
      taskStore.createTask({ title: value.title, description: value.description, priority: value.priority })
      toast('任务已创建')
    }
    formOpen.value = false
  } catch (error) {
    toast(error instanceof Error ? error.message : '操作失败，请重试。', 'error')
  }
}

function moveTask(input: MoveTaskInput) {
  try {
    taskStore.moveTask(input)
  } catch (error) {
    toast(error instanceof Error ? error.message : '拖动失败，任务位置未改变。', 'error')
  }
}

function askDelete(task: Task) {
  selectedTask.value = task
  confirmMode.value = 'delete'
}

async function importFile(file: File) {
  try {
    pendingImport.value = await parseImportFile(file)
    confirmMode.value = 'import'
  } catch (error) {
    toast(error instanceof Error ? error.message : '导入失败，当前任务未改变。', 'error')
  }
}

function closeConfirm() {
  confirmMode.value = null
  selectedTask.value = null
  pendingImport.value = null
}

function confirmAction() {
  const mode = confirmMode.value
  try {
    if (mode === 'delete' && selectedTask.value) {
      taskStore.deleteTask(selectedTask.value.id)
      toast('任务已删除')
    } else if (mode === 'import' && pendingImport.value) {
      taskStore.replaceTasks(pendingImport.value)
      toast(`已导入 ${pendingImport.value.length} 个任务`)
    } else if (mode === 'reset') {
      if (!taskStore.resetCorruptData()) throw new Error(taskStore.persistenceMessage ?? '重置失败。')
      toast('数据已重置')
    }
    closeConfirm()
  } catch (error) {
    toast(error instanceof Error ? error.message : '操作失败，请重试。', 'error')
  }
}

function retrySave() {
  toast(taskStore.retrySave() ? '保存成功' : (taskStore.persistenceMessage ?? '保存仍然失败。'), taskStore.persistenceState === 'ready' ? 'success' : 'error')
}

function exportCurrent() {
  exportTasks(taskStore.tasks)
  toast('备份文件已生成')
}

function backupCorrupt() {
  if (taskStore.corruptRaw !== null) {
    downloadCorruptBackup(taskStore.corruptRaw)
    toast('原始数据备份已生成')
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
    <AppHeader :total="total" :done="taskStore.doneTasks.length" :theme="themeStore.theme" @create="openCreate" @import="importFile" @export="exportCurrent" @toggle-theme="themeStore.toggleTheme" />
    <PersistenceBanner :state="taskStore.persistenceState" :message="taskStore.persistenceMessage" @retry="retrySave" @export="exportCurrent" @backup="backupCorrupt" @reset="confirmMode = 'reset'" />
    <BoardView :todo="taskStore.todoTasks" :in-progress="taskStore.inProgressTasks" :done="taskStore.doneTasks" @move="moveTask" @edit="openEdit" @delete="askDelete" @create="openCreate" />

    <TaskFormDialog :open="formOpen" :task="editingTask" @close="formOpen = false" @submit="submitTask" />
    <ConfirmDialog :open="confirmMode !== null" :title="confirmTitle" :message="confirmMessage" :confirm-label="confirmMode === 'delete' ? '确认删除' : confirmMode === 'import' ? '替换任务' : '确认重置'" :danger="confirmMode !== 'import'" @close="closeConfirm" @confirm="confirmAction" />
    <FeedbackToast :message="toastMessage" :tone="toastTone" />
  </div>
</template>

