import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/customerPost',
    name: 'customerPost',
    component: () => import('../views/customerPost.vue')
  },
  {
    path: '/customerLocationPost',
    name: 'customerLocationPost',
    component: () => import('../views/customerLocationPost.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
