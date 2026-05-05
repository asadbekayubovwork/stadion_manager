import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/login', name: 'login', component: () => import('../views/LoginView.vue') },
    { path: '/register', name: 'register', component: () => import('../views/RegisterView.vue') },
    { path: '/onboarding', name: 'onboarding', component: () => import('../views/OnboardingView.vue') },
    {
      path: '/',
      component: () => import('../views/AppShell.vue'),
      children: [
        { path: '', name: 'home', component: () => import('../views/HomeView.vue') },
        { path: 'schedule', name: 'schedule', component: () => import('../views/ScheduleView.vue') },
        { path: 'fields', name: 'multi-field', component: () => import('../views/MultiFieldView.vue') },
        { path: 'bookings/:id', name: 'booking-detail', component: () => import('../views/BookingDetailView.vue') },
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
  if ((to.name === 'login' || to.name === 'register') && auth.isLoggedIn) {
    return { name: 'home' }
  }
})

export default router
