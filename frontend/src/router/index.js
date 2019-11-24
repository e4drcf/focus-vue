import Vue from 'vue'
import VueRouter from 'vue-router'
import Start from '../views/Start.vue'
import Ringing from '../views/Ringing.vue'
import Connected from '../views/Connected.vue'
import Answered from '../views/Answered.vue'

Vue.use(VueRouter)
const routes = [
  {
    path: '*',
    name: 'start',
    component: Start
  },
  {
    path: '/ringing',
    name: 'ringing',
    component: Ringing,
    props: true
  },
  {
    path: '/connected',
    name: 'connected',
    component: Connected
    },
    {
      path: '/answered',
      name: 'answered',
      component: Answered
    },
    {
      path: '/failed',
      name: 'failed',
      component: Answered
    },
]
const router = new VueRouter({
  routes
})
export default router