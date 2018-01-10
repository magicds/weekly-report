import Vue from 'vue';
import Router from 'vue-router';
import Hello from '@/components/Hello';
// import Login from '@/components/login';
import Login from '@/components/selectlogin';
import Signup from '@/components/signup';
import Main from '@/components/main';
import Input from '@/components/input';
// import Summary from '@/components/summary';
import CurrWeekSummary from '@/components/currweek-summary';
import HistorySummary from '@/components/history-summary';
import UserSetting from '@/components/usersetting';


Vue.use(Router);

const router = new Router({
  // 切换时滚动处理
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  },
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/main',
      name: 'main',
      component: Main,
      children: [
        {
          path: 'input',
          name: 'input',
          component: Input
        },
        {
          path: 'summary',
          name: 'summary',
          component: CurrWeekSummary
        },
        {
          path: 'history',
          name: 'history',
          component: HistorySummary
        }
      ]
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup
    },
    {
      path: '/setting',
      name: 'userSetting',
      component: UserSetting
    }
  ]
});
export default router;
