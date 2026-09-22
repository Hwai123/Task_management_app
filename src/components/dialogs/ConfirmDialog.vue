<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  danger?: boolean
}>(), { confirmLabel: '确认', danger: false })

const emit = defineEmits<{ close: []; confirm: [] }>()
const cancelButton = ref<HTMLButtonElement | null>(null)
let previousFocus: HTMLElement | null = null

watch(() => props.open, async (open) => {
  if (open) {
    previousFocus = document.activeElement as HTMLElement | null
    await nextTick()
    cancelButton.value?.focus()
  } else {
    previousFocus?.focus()
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition name="dialog">
      <div v-if="open" class="dialog-backdrop" @mousedown.self="emit('close')" @keydown.esc="emit('close')">
        <section role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-message" class="dialog-panel max-w-md p-6">
          <div class="mb-4 grid h-11 w-11 place-items-center rounded-xl" :class="danger ? 'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400' : 'bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400'">
            <svg aria-hidden="true" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 8v5m0 4h.01"/><path d="M10.3 3.9 2.4 17.5A2 2 0 0 0 4.1 20h15.8a2 2 0 0 0 1.7-2.5L13.7 3.9a2 2 0 0 0-3.4 0Z"/></svg>
          </div>
          <h2 id="confirm-title" class="text-xl font-bold text-slate-950 dark:text-white">{{ title }}</h2>
          <p id="confirm-message" class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{{ message }}</p>
          <div class="mt-6 flex justify-end gap-3">
            <button ref="cancelButton" class="secondary-button" type="button" @click="emit('close')">取消</button>
            <button :class="danger ? 'danger-button' : 'primary-button'" type="button" @click="emit('confirm')">{{ confirmLabel }}</button>
          </div>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

