<script setup lang="ts">
import { nextTick, reactive, ref, watch } from 'vue'
import { PRIORITY_LABELS, STATUS_LABELS, type Task, type TaskPriority, type TaskStatus, type UpdateTaskInput } from '@/domain/task.types'
import { unicodeLength, validateUpdateInput, ValidationError } from '@/domain/task.validation'

const props = defineProps<{ open: boolean; task: Task | null }>()
const emit = defineEmits<{ close: []; submit: [value: UpdateTaskInput] }>()

const titleInput = ref<HTMLInputElement | null>(null)
let previousFocus: HTMLElement | null = null
const form = reactive<UpdateTaskInput>({ title: '', description: '', priority: 'medium', status: 'todo' })
const errors = reactive<{ title?: string; description?: string; priority?: string; status?: string }>({})

watch(() => props.open, async (open) => {
  if (open) {
    previousFocus = document.activeElement as HTMLElement | null
    Object.assign(form, props.task ?? { title: '', description: '', priority: 'medium', status: 'todo' })
    Object.keys(errors).forEach((key) => delete errors[key as keyof typeof errors])
    await nextTick()
    titleInput.value?.focus()
  } else {
    previousFocus?.focus()
  }
})

function close() {
  emit('close')
}

function submit() {
  Object.keys(errors).forEach((key) => delete errors[key as keyof typeof errors])
  try {
    const valid = validateUpdateInput({ ...form, status: props.task ? form.status : 'todo' })
    emit('submit', valid)
  } catch (error) {
    if (error instanceof ValidationError) {
      errors[(error.field ?? 'title') as keyof typeof errors] = error.message
    }
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="dialog">
      <div v-if="open" class="dialog-backdrop" @mousedown.self="close" @keydown.esc="close">
        <section role="dialog" aria-modal="true" :aria-labelledby="task ? 'dialog-edit-title' : 'dialog-create-title'" class="dialog-panel">
          <div class="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5 dark:border-slate-800">
            <div>
              <h2 :id="task ? 'dialog-edit-title' : 'dialog-create-title'" class="text-xl font-bold text-slate-950 dark:text-white">
                {{ task ? '编辑任务' : '新建任务' }}
              </h2>
              <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">{{ task ? '修改内容或将任务移到其他状态。' : '新任务会出现在待办列顶部。' }}</p>
            </div>
            <button class="icon-button" type="button" aria-label="关闭弹窗" @click="close">
              <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18" /></svg>
            </button>
          </div>

          <form class="space-y-5 px-6 py-5" novalidate @submit.prevent="submit">
            <div>
              <div class="flex items-center justify-between gap-3">
                <label class="field-label" for="task-title">标题 <span class="text-rose-500">*</span></label>
                <span class="field-count" :class="unicodeLength(form.title) > 50 && 'text-rose-600'">{{ unicodeLength(form.title) }}/50</span>
              </div>
              <input id="task-title" ref="titleInput" v-model="form.title" class="field-input" :class="errors.title && 'field-error'" type="text" autocomplete="off" aria-required="true" :aria-invalid="!!errors.title" :aria-describedby="errors.title ? 'title-error' : undefined" />
              <p v-if="errors.title" id="title-error" class="error-text">{{ errors.title }}</p>
            </div>

            <div>
              <div class="flex items-center justify-between gap-3">
                <label class="field-label" for="task-description">描述 <span class="font-normal text-slate-400">（选填）</span></label>
                <span class="field-count" :class="unicodeLength(form.description) > 1000 && 'text-rose-600'">{{ unicodeLength(form.description) }}/1000</span>
              </div>
              <textarea id="task-description" v-model="form.description" class="field-input min-h-32 resize-y" :class="errors.description && 'field-error'" :aria-invalid="!!errors.description" :aria-describedby="errors.description ? 'description-error' : undefined" placeholder="补充任务背景、目标或要点……" />
              <p v-if="errors.description" id="description-error" class="error-text">{{ errors.description }}</p>
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <label class="field-label" for="task-priority">优先级</label>
                <select id="task-priority" v-model="form.priority" class="field-input">
                  <option v-for="priority in (['high', 'medium', 'low'] as TaskPriority[])" :key="priority" :value="priority">{{ PRIORITY_LABELS[priority] }}</option>
                </select>
              </div>
              <div v-if="task">
                <label class="field-label" for="task-status">状态</label>
                <select id="task-status" v-model="form.status" class="field-input">
                  <option v-for="status in (['todo', 'in-progress', 'done'] as TaskStatus[])" :key="status" :value="status">{{ STATUS_LABELS[status] }}</option>
                </select>
              </div>
            </div>

            <div class="flex justify-end gap-3 border-t border-slate-200 pt-5 dark:border-slate-800">
              <button class="secondary-button" type="button" @click="close">取消</button>
              <button class="primary-button" type="submit">{{ task ? '保存修改' : '创建任务' }}</button>
            </div>
          </form>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

