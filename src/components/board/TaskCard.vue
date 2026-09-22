<script setup lang="ts">
import { PRIORITY_LABELS, type Task } from '@/domain/task.types'

defineProps<{ task: Task }>()
const emit = defineEmits<{ edit: [task: Task]; delete: [task: Task] }>()

const cardTone = {
  high: 'border-rose-200 bg-rose-50 hover:border-rose-300 dark:border-rose-900/80 dark:bg-rose-950/40 dark:hover:border-rose-700',
  medium: 'border-amber-200 bg-amber-50 hover:border-amber-300 dark:border-amber-900/80 dark:bg-amber-950/40 dark:hover:border-amber-700',
  low: 'border-emerald-200 bg-emerald-50 hover:border-emerald-300 dark:border-emerald-900/80 dark:bg-emerald-950/40 dark:hover:border-emerald-700',
} satisfies Record<Task['priority'], string>
</script>

<template>
  <article
    class="group cursor-grab rounded-xl border p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-lg active:cursor-grabbing"
    :class="cardTone[task.priority]"
  >
    <div class="flex items-start gap-3">
      <div class="min-w-0 flex-1">
        <h3 class="break-words text-[15px] font-semibold leading-6 text-slate-900 dark:text-slate-50">
          {{ task.title }}
        </h3>
        <p v-if="task.description" class="mt-2 line-clamp-3 whitespace-pre-wrap break-words text-sm leading-5 text-slate-600 dark:text-slate-400">
          {{ task.description }}
        </p>
      </div>
      <svg aria-label="拖动任务" class="mt-1 h-5 w-5 shrink-0 text-slate-300 dark:text-slate-600" viewBox="0 0 20 20" fill="currentColor">
        <circle cx="7" cy="5" r="1.2"/><circle cx="13" cy="5" r="1.2"/><circle cx="7" cy="10" r="1.2"/><circle cx="13" cy="10" r="1.2"/><circle cx="7" cy="15" r="1.2"/><circle cx="13" cy="15" r="1.2"/>
      </svg>
    </div>

    <div class="mt-4 flex items-center justify-between gap-3 border-t border-black/5 pt-3 dark:border-white/10">
      <span class="priority-badge" :class="`priority-${task.priority}`">
        <span class="h-1.5 w-1.5 rounded-full bg-current" />
        {{ PRIORITY_LABELS[task.priority] }}优先级
      </span>
      <div class="flex items-center gap-1 opacity-80 transition group-hover:opacity-100 group-focus-within:opacity-100">
        <button class="card-action" type="button" :aria-label="`编辑任务：${task.title}`" @click.stop="emit('edit', task)">
          <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m4 20 4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10L4 20Z"/><path d="m14.5 7.5 3 3"/></svg>
        </button>
        <button class="card-action danger" type="button" :aria-label="`删除任务：${task.title}`" @click.stop="emit('delete', task)">
          <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 7h16M9 7V4h6v3m3 0-1 13H7L6 7m4 4v5m4-5v5"/></svg>
        </button>
      </div>
    </div>
  </article>
</template>

