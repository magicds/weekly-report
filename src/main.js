// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

import 'iview/dist/styles/iview.css' // 使用 iview CSS
import 'zui/dist/css/zui.min.css' // 使用 zui-css
import '@/assets/style/style.css'

import App from './App'
import router from './router'

// AV初始化
/* global require */
require('./api/init.js')

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
