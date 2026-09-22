<script setup lang="ts">
import type { PersistenceState } from '@/stores/task.store'

defineProps<{ state: PersistenceState; message: string | null }>()
const emit = defineEmits<{ retry: []; export: []; backup: []; reset: [] }>()
</script>

<template>
  <div v-if="state !== 'ready'" class="border-b px-6 py-3" :class="state === 'corrupt' ? 'border-rose-200 bg-rose-50 text-rose-950 dark:border-rose-900 dark:bg-rose-950/60 dark:text-rose-100' : 'border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-900 dark:bg-amber-950/60 dark:text-amber-100'">
    <div class="mx-auto flex max-w-[1600px] flex-wrap items-center gap-3">
      <svg aria-hidden="true" class="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v4m0 4h.01"/><circle cx="12" cy="12" r="9"/></svg>
      <p class="min-w-0 flex-1 text-sm font-medium">{{ message }}</p>
      <div class="flex flex-wrap gap-2">
        <template v-if="state === 'unsaved'">
          <button class="banner-button" type="button" @click="emit('retry')">重试保存</button>
          <button class="banner-button" type="button" @click="emit('export')">导出当前任务</button>
        </template>
        <template v-else>
          <button class="banner-button" type="button" @click="emit('backup')">下载原始备份</button>
          <button class="banner-button" type="button" @click="emit('reset')">重置数据</button>
        </template>
      </div>
    </div>
  </div>
</template>

