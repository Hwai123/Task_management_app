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

