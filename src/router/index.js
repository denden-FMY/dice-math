import { createRouter, createWebHistory } from 'vue-router'
import TitleView        from '../views/TitleView.vue'
import ModeSelectView   from '../views/ModeSelectView.vue'

const routes = [
  { path: '/',            name: 'Title',      component: TitleView },
  { path: '/mode-select', name: 'ModeSelect', component: ModeSelectView }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})
