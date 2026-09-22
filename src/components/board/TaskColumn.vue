<script setup lang="ts">
import draggable from 'vuedraggable'
import TaskCard from './TaskCard.vue'
import { STATUS_LABELS, type Task, type TaskStatus } from '@/domain/task.types'

const props = defineProps<{
  status: TaskStatus
  tasks: Task[]
  isBoardEmpty: boolean
}>()

const emit = defineEmits<{
  move: [input: { id: string; toStatus: TaskStatus; toIndex: number }]
  edit: [task: Task]
  delete: [task: Task]
  create: []
}>()

interface DragChangeEvent {
  added?: { element: Task; newIndex: number }
  moved?: { element: Task; newIndex: number }
}

function handleChange(event: DragChangeEvent) {
  const change = event.added ?? event.moved
  if (!change) return
  emit('move', { id: change.element.id, toStatus: props.status, toIndex: change.newIndex })
}
</script>

<template>
  <section class="flex min-h-[440px] min-w-0 flex-col rounded-2xl border border-slate-200/90 bg-slate-100/70 p-3 dark:border-slate-800 dark:bg-slate-900/50">
    <header class="flex items-center justify-between gap-3 px-1 pb-3 pt-1">
      <div class="flex items-center gap-2.5">
        <span class="status-mark" :class="`status-${status}`" />
        <h2 class="font-semibold text-slate-900 dark:text-slate-100">{{ STATUS_LABELS[status] }}</h2>
      </div>
      <span class="grid h-7 min-w-7 place-items-center rounded-full bg-white px-2 text-sm font-semibold text-slate-600 shadow-sm dark:bg-slate-800 dark:text-slate-300">
        {{ tasks.length }}
      </span>
    </header>

    <draggable
      :model-value="tasks"
      item-key="id"
      group="tasks"
      ghost-class="drag-ghost"
      chosen-class="drag-chosen"
      drag-class="drag-active"
      class="flex min-h-[360px] flex-1 flex-col gap-3 rounded-xl"
      :animation="180"
      @change="handleChange"
    >
      <template #item="{ element }">
        <TaskCard :task="element" @edit="emit('edit', $event)" @delete="emit('delete', $event)" />
      </template>

      <template #footer>
        <button
          v-if="tasks.length === 0"
          type="button"
          class="grid min-h-40 flex-1 place-items-center rounded-xl border border-dashed border-slate-300 bg-white/50 px-5 text-center transition hover:border-indigo-400 hover:bg-white dark:border-slate-700 dark:bg-slate-900/40 dark:hover:border-indigo-500 dark:hover:bg-slate-900"
          @click="status === 'todo' ? emit('create') : undefined"
        >
          <span>
            <svg aria-hidden="true" class="mx-auto h-7 w-7 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M8 12h8M12 8v8"/><rect x="4" y="4" width="16" height="16" rx="5"/></svg>
            <span class="mt-2 block text-sm font-medium text-slate-600 dark:text-slate-400">
              {{ status === 'todo' && isBoardEmpty ? '创建第一个任务' : '暂无任务' }}
            </span>
            <span v-if="status !== 'todo'" class="mt-1 block text-xs text-slate-400 dark:text-slate-500">把任务拖到这里</span>
          </span>
        </button>
      </template>
    </draggable>
  </section>
</template>

