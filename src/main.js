// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import Table from 'iview/src/components/table'
import 'iview/dist/styles/iview.css' // 使用 CSS
import '@/assets/style/table.css' // 使用 CSS

// AV初始化
require('./api/init.js')

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
