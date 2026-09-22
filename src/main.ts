import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './assets/main.css'
import { registerTaskTools } from './services/webmcp.service'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.mount('#app')
registerTaskTools(pinia)

if ('serviceWorker' in navigator && import.meta.env.PROD && window.location.protocol.startsWith('http')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').catch(() => {
      // The app remains fully usable when service worker registration is unavailable.
    })
  })
}

