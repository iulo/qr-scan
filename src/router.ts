import { createRouter, createWebHashHistory } from 'vue-router'
import Home from './views/Home.vue'
import Scan from './views/Scan.vue'

const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/scan',
    component: Scan
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHashHistory(),
  routes // short for `routes: routes`
})

export { router }
