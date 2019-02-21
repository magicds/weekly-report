<template>
  <Modal title="通知提醒" v-model="show">
    <p>工作太忙，想不起来；玩的太嗨，总是忘记，试试微信通知吧：</p>
    <p style="text-align:center;">
      <img ref="qrcode" v-bind:src="qrcode">
    </p>
    <p>扫码订阅即可收到微信通知提醒。</p>

    <div slot="footer">
      <Checkbox v-model="notNotify">我知道了，不再提醒</Checkbox>
      <i-button @click="ok" type="primary" style="margin-left:10px;">确定</i-button>
    </div>
  </Modal>
</template>

<script>
import Checkbox from 'iview/src/components/checkbox/checkbox';
import Button from 'iview/src/components/button/button';
import Modal from 'iview/src/components/Modal/index.js';
import config from '@/config/pushbear.config.js';

const SAVE_KEY = '_weekly-report_notNotify';

export default {
  components: {
    Checkbox,
    'i-button': Button,
    Modal
  },
  data() {
    const notNotify = localStorage.getItem(SAVE_KEY);
    const needShow = config.enable ? (JSON.parse(notNotify) ? false : true) : false;
    return {
      notNotify: notNotify === null ? false : JSON.parse(notNotify),
      show: needShow,
      qrcode: config.qrcode || ''
    };
  },
  methods: {
    ok() {
      this.show = false;
      localStorage.setItem(SAVE_KEY, this.notNotify);
    },
    cancel() {}
  }
};
</script>

