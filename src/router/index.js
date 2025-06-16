import { createRouter, createWebHistory } from 'vue-router'
import TitleView      from '../views/TitleView.vue'
import ModeSelectView from '../views/ModeSelectView.vue'
import WaitingRoom    from '../views/WaitingRoomView.vue'

const routes = [
  { path: '/',            name: 'Title',      component: TitleView },
  { path: '/mode-select', name: 'ModeSelect', component: ModeSelectView },
  {
    path: '/waiting/:roomId',
    name: 'WaitingRoom',
    component: WaitingRoom,
    props: true
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})
