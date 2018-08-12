import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/components/selectlogin';
import Signup from '@/components/signup';
import Main from '@/components/main';
import Input from '@/components/input';
import CurrWeekSummary from '@/components/currweek-summary';
import HistorySummary from '@/components/history-summary';
import UserSetting from '@/components/usersetting';
import Admin from '@/components/admin';

import Message from 'iview/src/components/message';
import AV from 'leancloud-storage';

// 验证通过要求
function verifyRequired(to, from, next) {
  const user = AV.User.current();
  // 未登录或未验证禁止访问
  if (!user || user.attributes.verify !== true) {
    next('/');
  }else{
    next();
  }
}

// admin require
function adminRequired(to, from, next) {
  const user = AV.User.current();
  // 未登录或未验证禁止访问
  if (!user || user.attributes.isAdmin !== true) {
    // next('/');
  }else{
    next();
  }
}

Vue.use(Router);

const router = new Router({
  // 切换时滚动处理
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return {
        x: 0,
        y: 0
      };
    }
  },
  routes: [{
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/main',
      name: 'main',
      component: Main,
      beforeEnter: verifyRequired,
      children: [{
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
        },
        {
          path: 'usersetting',
          name: 'usersetting',
          component: UserSetting
        },
        {
          path: 'admin',
          name: 'admin',
          component: Admin,
          beforeEnter: adminRequired
        }
      ]
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup
    }
  ]
});

// router.beforeEach((to, from, next) => {
//   console.log('before');
//   console.log(to, from, next);
//   next();
// });
// router.afterEach((to, from) => {
//   console.log('after');
//   console.log(to, from);
// });
export default router;
