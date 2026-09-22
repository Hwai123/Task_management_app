<script setup lang="ts">
defineProps<{ message: string; tone: 'success' | 'error' }>()
</script>

<template>
  <Transition name="toast">
    <div v-if="message" class="fixed bottom-6 left-1/2 z-[70] flex -translate-x-1/2 items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-dialog" :class="tone === 'success' ? 'bg-slate-900 dark:bg-slate-100 dark:text-slate-900' : 'bg-rose-600'" role="status" aria-live="polite">
      <svg v-if="tone === 'success'" aria-hidden="true" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m5 12 4 4L19 6"/></svg>
      <svg v-else aria-hidden="true" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="m9 9 6 6m0-6-6 6"/></svg>
      {{ message }}
    </div>
  </Transition>
</template>

