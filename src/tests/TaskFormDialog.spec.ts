import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import TaskFormDialog from '@/components/dialogs/TaskFormDialog.vue'

describe('TaskFormDialog', () => {
  it('hides status in create mode and keeps invalid input visible', async () => {
    const wrapper = mount(TaskFormDialog, { props: { open: true, task: null }, attachTo: document.body })
    expect(document.querySelector('#task-status')).toBeNull()
    const input = document.querySelector('#task-title') as HTMLInputElement
    input.value = '   '
    input.dispatchEvent(new Event('input'))
    ;(document.querySelector('form') as HTMLFormElement).dispatchEvent(new Event('submit'))
    await wrapper.vm.$nextTick()
    expect(document.body.textContent).toContain('请输入任务标题')
    expect(input.value).toBe('   ')
    wrapper.unmount()
  })

  it('shows status in edit mode', () => {
    const wrapper = mount(TaskFormDialog, {
      props: {
        open: true,
        task: { id: '1', title: '任务', description: '', priority: 'medium', status: 'todo', position: 0 },
      },
      attachTo: document.body,
    })
    expect(document.querySelector('#task-status')).not.toBeNull()
    wrapper.unmount()
  })
})

