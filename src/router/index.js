import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Login from '@/components/login/login'
import Table from "@/components/table/table";

Vue.use(Router)

export default new Router({
  routes: [
    // {
    //   path: '/',
    //   name: 'Hello',
    //   component: Hello
    // },
    {
      path:'/',
      name:'Login',
      component: Login
    },
    {
      path:'/table',
      name:'Table',
      component: Table
    }
  ]
})
