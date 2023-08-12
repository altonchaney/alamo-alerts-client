import Vue from 'vue'
import Router from 'vue-router'
import Listing from '@/components/Listing'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/mueller'
    },
    {
      path: '/:locationslug',
      name: 'Listing',
      component: Listing
    }
  ]
})
