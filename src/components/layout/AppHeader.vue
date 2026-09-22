<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Theme } from '@/stores/theme.store'

const props = defineProps<{
  total: number
  done: number
  theme: Theme
  installable: boolean
}>()

const emit = defineEmits<{
  create: []
  import: [file: File]
  export: []
  install: []
  toggleTheme: []
}>()

const input = ref<HTMLInputElement | null>(null)
const completion = computed(() => props.total ? Math.round((props.done / props.total) * 100) : 0)

function selectFile(event: Event) {
  const element = event.target as HTMLInputElement
  const file = element.files?.[0]
  if (file) emit('import', file)
  element.value = ''
}
</script>

<template>
  <header class="border-b border-slate-200/80 bg-white/90 px-6 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
    <div class="mx-auto flex max-w-[1600px] flex-wrap items-center gap-4">
      <div class="flex min-w-0 items-center gap-3">
        <div class="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
          <svg aria-hidden="true" class="h-6 w-6" viewBox="0 0 24 24" fill="none">
            <path d="M5 6h14M5 12h9M5 18h5" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            <circle cx="18" cy="18" r="2.5" fill="#bef264" />
          </svg>
        </div>
        <div>
          <div class="flex items-baseline gap-2">
            <h1 class="text-xl font-bold tracking-tight text-slate-950 dark:text-white">任务流</h1>
            <span class="hidden text-sm text-slate-500 sm:inline dark:text-slate-400">个人任务看板</span>
          </div>
          <div class="mt-1 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span>{{ total }} 个任务</span>
            <span aria-hidden="true">·</span>
            <span>已完成 {{ completion }}%</span>
            <div class="h-1.5 w-20 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800" aria-hidden="true">
              <div class="h-full rounded-full bg-lime-500 transition-all" :style="{ width: `${completion}%` }" />
            </div>
          </div>
        </div>
      </div>

      <div class="ml-auto flex flex-wrap items-center justify-end gap-2">
        <input ref="input" class="sr-only" type="file" accept="application/json,.json" @change="selectFile" />
        <button class="header-button" type="button" @click="input?.click()">
          <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 3v12m0-12 4 4m-4-4L8 7M5 14v5h14v-5" /></svg>
          导入
        </button>
        <button class="header-button" type="button" @click="emit('export')">
          <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 15V3m0 12 4-4m-4 4-4-4M5 14v5h14v-5" /></svg>
          导出
        </button>
        <button v-if="installable" class="header-button" type="button" @click="emit('install')">
          <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 18v2h14v-2" /></svg>
          安装应用
        </button>
        <a
          class="header-button"
          href="https://github.com/Hwai123/Task_management_app/releases/latest"
          target="_blank"
          rel="noreferrer"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 18v2h14v-2" /></svg>
          Windows 版
        </a>
        <button
          class="icon-button"
          type="button"
          :aria-label="theme === 'dark' ? '切换到浅色模式' : '切换到深色模式'"
          :title="theme === 'dark' ? '浅色模式' : '深色模式'"
          @click="emit('toggleTheme')"
        >
          <svg v-if="theme === 'dark'" aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></svg>
          <svg v-else aria-hidden="true" viewBox="0 0 24 24"><path d="M20 15.2A8.5 8.5 0 0 1 8.8 4 8.5 8.5 0 1 0 20 15.2Z"/></svg>
        </button>
        <button class="primary-button" type="button" @click="emit('create')">
          <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>
          新建任务
        </button>
      </div>
    </div>
  </header>
</template>

