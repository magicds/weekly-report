<template>
  <div class="user-editor" :user="user" :userId="userId" :isAdmin="isAdmin" :groups="groups">
    <i-form ref="form" v-model="curruser" label-position="right" :label-width="80">
      <Form-item label="姓名">
        <i-input v-model="curruser.username" icon="person"></i-input>
      </Form-item>
      <Form-item label="备注信息">
        <i-input v-model="curruser.extInfo" icon="ios-information" :disabled="!curruser.isAdmin"></i-input>
      </Form-item>
      <Form-item label="邮件地址">
        <i-input v-model="curruser.email" icon="email"></i-input>
      </Form-item>
      <Form-item label="所在小组">
        <i-select v-model="curruser.groupIndex">
          <i-option v-for="item in groups" :key="item.index" :value="item.index">{{item.name}}</i-option>
        </i-select>
      </Form-item>
      <Form-item label="排序值" v-if="curruser.isAdmin">
        <i-input v-model="curruser.memberIndex" number="true" icon="sort" title="数值越小越靠前"></i-input>
      </Form-item>
      <Form-item label="重置密码" v-if="!curruser.isAdmin">
        <i-button @click="resetPwd">重置密码</i-button>
      </Form-item>
    </i-form>
  </div>
</template>

<script>
import Form from 'iview/src/components/form/form';
import FormItem from 'iview/src/components/form/form-item';
import Input from 'iview/src/components/input/input';
import Button from 'iview/src/components/button/button';
import { Select, Option } from 'iview/src/components/select';
import Message from 'iview/src/components/message';
import Icon from 'iview/src/components/icon';
import AV from 'leancloud-storage';

export default {
  name: 'userEditor',
  components: {
    'i-form': Form,
    FormItem,
    Icon,
    'i-button': Button,
    'i-input': Input,
    'i-select': Select,
    'i-option': Option
  },
  props: {
    user: Object,
    userId: String,
    isAdmin: {
      default: false,
      type: Boolean
    },
    groups: Array
  },
  data() {
    return {
      // 克隆一份作为编辑使用
      curruser: JSON.parse(JSON.stringify(this.user))
    };
  },
  methods: {
    resetPwd() {
      if (this.user.email) {
        AV.User.requestPasswordReset(this.user.email).then((d) => {
          Message.info({
            content: '重置密码邮件已经发送至 ' + this.user.email,
            closable: true,
            duration: 3
          });
        });
      }
    }
  }
};
</script>

<style>

</style>
