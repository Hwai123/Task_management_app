<script setup lang="ts">
import TaskColumn from './TaskColumn.vue'
import type { MoveTaskInput, Task } from '@/domain/task.types'

defineProps<{
  todo: Task[]
  inProgress: Task[]
  done: Task[]
}>()

const emit = defineEmits<{
  move: [input: MoveTaskInput]
  edit: [task: Task]
  delete: [task: Task]
  create: []
}>()
</script>

<template>
  <main class="mx-auto max-w-[1600px] px-6 py-6">
    <div class="mb-4 flex items-center justify-between gap-4">
      <div>
        <h2 class="text-lg font-bold text-slate-950 dark:text-white">我的看板</h2>
        <p class="mt-0.5 text-sm text-slate-500 dark:text-slate-400">拖动卡片调整顺序或状态，也可在编辑中直接选择状态。</p>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
      <TaskColumn status="todo" :tasks="todo" :is-board-empty="!todo.length && !inProgress.length && !done.length" @move="emit('move', $event)" @edit="emit('edit', $event)" @delete="emit('delete', $event)" @create="emit('create')" />
      <TaskColumn status="in-progress" :tasks="inProgress" :is-board-empty="false" @move="emit('move', $event)" @edit="emit('edit', $event)" @delete="emit('delete', $event)" @create="emit('create')" />
      <TaskColumn status="done" :tasks="done" :is-board-empty="false" @move="emit('move', $event)" @edit="emit('edit', $event)" @delete="emit('delete', $event)" @create="emit('create')" />
    </div>
  </main>
</template>

