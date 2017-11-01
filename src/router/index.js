import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Login from '@/components/login'
import Signup from '@/components/signup'
import Main from '@/components/main'
import Input from '@/components/input'
import Summary from '@/components/summary'

Vue.use(Router)

export default new Router({
  routes: [
    // {
    //   path: '/',
    //   name: 'Hello',
    //   component: Hello
    // },
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/main',
      name: 'Main',
      component: Main,
      children: [
        {
          path: '',
          component: Input
        },
        {
          path: 'input',
          name: 'input',
          component: Input
        },
        {
          path: 'summary',
          name: 'summary',
          component: Summary
        }
      ]
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    }
  ]
})
