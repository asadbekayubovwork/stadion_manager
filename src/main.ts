import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import { useAuthStore } from './stores/auth'
import { useStadiumsStore } from './stores/stadiums'
import { setUnauthorizedHandler } from './api/http'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(i18n)

const auth = useAuthStore()
auth.init()

setUnauthorizedHandler(() => {
  auth.logout()
  router.push({ name: 'login' })
})

// Preload core data if already logged in.
if (auth.isLoggedIn) {
  const stadiums = useStadiumsStore()
  stadiums.loadAll().catch(() => {})
}

app.mount('#app')
