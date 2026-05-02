import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/login', name: 'login', component: () => import('../views/LoginView.vue') },
    { path: '/otp', name: 'otp', component: () => import('../views/OtpView.vue') },
    {
      path: '/',
      component: () => import('../views/AppShell.vue'),
      children: [
        { path: '', name: 'home', component: () => import('../views/HomeView.vue') },
        { path: 'schedule', name: 'schedule', component: () => import('../views/ScheduleView.vue') },
        { path: 'clients', name: 'clients', component: () => import('../views/ClientsView.vue') },
        { path: 'clients/:id', name: 'client-detail', component: () => import('../views/ClientDetailView.vue') },
        { path: 'finance', name: 'finance', component: () => import('../views/FinanceView.vue') },
        { path: 'settings', name: 'settings', component: () => import('../views/SettingsView.vue') },
      ],
      meta: { requiresAuth: true },
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return { name: 'login' }
  }
  if ((to.name === 'login' || to.name === 'otp') && auth.isLoggedIn) {
    return { name: 'home' }
  }
})

export default router
