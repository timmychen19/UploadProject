import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('@/views/DashboardView.vue'),
  },
  {
    path: '/project/:id',
    name: 'ProjectWorkspace',
    component: () => import('@/views/ProjectWorkspaceView.vue'),
    props: true,
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('@/views/SearchView.vue'),
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/SettingsView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
