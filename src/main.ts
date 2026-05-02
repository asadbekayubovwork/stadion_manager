import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import { useAuthStore } from './stores/auth'
import { useStadiumsStore } from './stores/stadiums'
import { useBookingsStore } from './stores/bookings'
import { useClientsStore } from './stores/clients'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(i18n)

// Init stores before mount
const auth = useAuthStore()
auth.init()

const stadiums = useStadiumsStore()
stadiums.init()

const clients = useClientsStore()
clients.init()

const bookings = useBookingsStore()
bookings.init()

// Seed demo bookings once stadiums are loaded
const s = stadiums.stadiums[0]
if (s && s.fields.length >= 2) {
  bookings.seedDemoWithFields(s.fields[0].id, s.id, s.fields[1].id)
}

app.mount('#app')
