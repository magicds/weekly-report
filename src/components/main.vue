<template>
<div class="maim">
  <my-header></my-header>

  <keep-alive>
    <router-view></router-view>
  </keep-alive>

  <BackTop :height="200" :bottom="90" @on-click="toTop">
    <Tooltip content="回顶部" placement="top">
      <div class="ivu-back-top-inner">
        <i class="ivu-icon ivu-icon-chevron-up"></i>
      </div>
    </Tooltip>
  </BackTop>

  <BackTop v-show="hasChatrs" :height="1" :bottom="40" @on-click="toCharts">
    <!-- <div class="tocharts">查看图表</div> -->
    <Tooltip content="查看图表" placement="bottom">
      <div class="ivu-back-top-inner">
        <i class="ivu-icon ivu-icon-chevron-down"></i>
      </div>
    </Tooltip>
  </BackTop>
</div>
</template>

<script>
import Header from './header';
import Tooltip from 'iview/src/components/tooltip';
import BackTop from './back-top';
import easeout from '@/util/easeout.js';

let doc = document.body.scrollTop ? document.body : document.documentElement;
export default {
  name: 'main',
  components: {
    BackTop,
    Tooltip,
    'my-header': Header
  },
  data() {
    return {
      hasChatrs: false
    };
  },
  mounted() {
    this.hasChatrs = this.$route.name == 'input' ? false : true;
  },
  watch: {
    $route(v) {
      this.hasChatrs = v.name == 'input' ? false : true;
    }
  },
  methods: {
    toTop() {
      easeout(doc.scrollTop, 0, 8, function(value) {
        doc.scrollTop = value;
      });
    },
    toCharts() {
      easeout(doc.scrollTop, doc.offsetHeight - doc.clientHeight, 8, function(
        value
      ) {
        doc.scrollTop = value;
      });
    }
  }
};
</script>

<style>

</style>

