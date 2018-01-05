<template>
  <div class="login-wrap">
      <div class="login-box">
          <i-form ref="form" :model="user" :rules="relues">
            <FormItem prop="name">
              <i-input type="text" v-model="user.name" placeholder="请输入用户名"></i-input>
            </FormItem>
            <FormItem prop="pwd">
              <i-input type="password" v-model="user.pwd" placeholder="请输入密码"></i-input>
            </FormItem>
            <FormItem class="text-center">
              <i-button type="primary" @click="login" style="width:100%">登录</i-button>
            </FormItem>
            <FormItem class="text-center login-other">
              <i-button type="text" @click="signup">注册</i-button>
              <i-button type="text" @click="forgetPwd">忘记密码</i-button>
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
import AV from 'leancloud-storage';
import userApi from '@/api/user';
export default {
  name: 'login',
  components: {
    'i-form': Form,
    FormItem,
    'i-input': Input,
    'i-button': Button,
    Message
  },
  data() {
    return {
      user: {
        name: '',
        pwd: ''
      },
      relues: {
        name: [
          {
            required: true,
            message: '请填写姓名',
            trigger: 'blur'
          }
        ],
        pwd: [
          {
            required: true,
            message: '请填写密码',
            trigger: 'blur'
          }
        ]
      }
    };
  },

  created() {
    let user = AV.User.current();
    if (user !== null) {
      this.$router.push(
        user.attributes.isAdmin ? { name: 'summary' } : { name: 'input' }
      );
    }
  },

  methods: {
    login() {
      this.$refs.form.validate(isValidated => {
        if (!isValidated) return;
        return userApi
          .logIn(this.user.name, this.user.pwd)
          .then(user => {
            console.log(user);
            if (user.attributes.groupName) {
              this.$router.push('/main/input');
            } else {
              this.$router.push('/main/summary');
            }
          })
          .catch(err => {
            console.log(err);
          });
      });
    },
    signup() {
      this.$router.push('/signup');
    },
    forgetPwd() {
      this.$router.push('/forgetpwd');
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
.login-other {
  border-top: 1px solid #eee;
  margin-top: 10px;
  padding-top: 10px;
}
</style>
