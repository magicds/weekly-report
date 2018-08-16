<template>
    <div class="login-wrap">
      <div class="login-box">
        <h2 class="login-box-title">重置密码</h2>
        <i-form ref="form" :rules="relues" :model="user" @submit.native.prevent>
          <FormItem prop="email">
            <i-input type="text" v-model="user.email" placeholder="请输入您注册的邮箱"></i-input>
          </FormItem>
          <FormItem class="text-center">
            <i-button type="primary" @click="resetPwd" :loading="loading" style="width:100%">重置密码</i-button>
          </FormItem>
        </i-form>
      </div>
  </div>
</template>

<script>
import Form from 'iview/src/components/form/form';
import FormItem from 'iview/src/components/form/form-item';
import Input from 'iview/src/components/input/input';
import Button from 'iview/src/components/button/button';
import Message from 'iview/src/components/message';
import AV from 'leancloud-storage';

export default {
  name: 'forgetPwd',
  components: {
    'i-form': Form,
    FormItem,
    'i-input': Input,
    'i-button': Button
  },
  data() {
    return {
      loading: false,
      user: {
        email: ''
      },
      relues: {
        email: [
          {
            required: true,
            message: '请填写邮箱',
            trigger: 'blur'
          },
          {
            type: 'email',
            message: '邮箱格式不正确',
            trigger: 'blur'
          }
        ]
      }
    };
  },
  methods: {
    resetPwd() {
      this.$refs.form.validate(isValidated => {
        if (!isValidated) return;
        this.loading = true;
        AV.User.requestPasswordReset(this.user.email)
          .then(() => {
            this.loading = false;
            Message.success({
              content: '重置密码邮件已经发送，请注意查收！',
              closable: true,
              duration: 10
            });
          })
          .catch(err => {
            this.loading = false;
            Message.error({
              content: err.message || err,
              closable: true,
              duration: 10
            });
          });
      });
    }
  }
};
</script>

<style>
.login-wrap {
  padding: 20px 0;
}
.login-box {
  width: 300px;
  margin-top: calc(30% - 120px);
  margin-left: auto;
  margin-right: auto;
}
.login-box-title {
  text-align: center;
  padding-bottom: 10px;
  margin-bottom: 20px;;
  color:#666;
  border-bottom: 1px solid #ddd;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
}
</style>
