import { ref } from 'vue'
import { defineStore } from 'pinia'

export type Theme = 'light' | 'dark'
const THEME_KEY = 'task-board.theme'

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<Theme>('light')
  const hasExplicitPreference = ref(false)

  function applyTheme() {
    document.documentElement.classList.toggle('dark', theme.value === 'dark')
    document.documentElement.style.colorScheme = theme.value
  }

  function initializeTheme() {
    let saved: string | null = null
    try {
      saved = localStorage.getItem(THEME_KEY)
    } catch {
      // The app can still use the system theme when storage is unavailable.
    }
    hasExplicitPreference.value = saved === 'light' || saved === 'dark'
    theme.value = hasExplicitPreference.value
      ? saved as Theme
      : matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    applyTheme()
  }

  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
    hasExplicitPreference.value = true
    applyTheme()
    try {
      localStorage.setItem(THEME_KEY, theme.value)
    } catch {
      // Task persistence surfaces storage failures; theme storage stays best effort.
    }
  }

  return { theme, hasExplicitPreference, initializeTheme, toggleTheme, applyTheme }
})

