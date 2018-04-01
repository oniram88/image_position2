import Vue from 'vue'
import Router from 'vue-router'
import ImageSelector from '@/components/ImageSelector'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'ImageSelector',
      component: ImageSelector
    }
  ]
})
