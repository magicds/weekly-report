<template>
  <div class="login-wrap">
      <div class="login-box">
          <i-form ref="form" :model="user" :rules="relues">
            <FormItem prop="name">
              <i-input type="text" v-model="user.name" placeholder="请输入用户名" style="width: 300px"></i-input>
            </FormItem>
            <FormItem prop="pwd">
              <i-input type="password" v-model="user.pwd" placeholder="请输入密码" style="width: 300px"></i-input>
            </FormItem>
            <FormItem>
              <i-button type="primary" @click="login">登录</i-button>
            </FormItem>
          </i-form>
      </div>
  </div>
</template>

<script>
import Form from 'iview/src/components/form/form'
import FormItem from 'iview/src/components/form/form-item'
import Input from 'iview/src/components/input/input'
import Button from 'iview/src/components/button/button'
import AV from 'leancloud-storage'

export default {
  name: 'login',
  components: {
    'i-form': Form,
    FormItem,
    'i-input': Input,
    'i-button': Button
  },
  data() {
    return {
      user: {
        name: '',
        pwd: ''
      },
      relues: {
        name: [{ required: true, message: '请填写用户名', trigger: 'blur' }],
        pwd: [
          { required: true, message: '请填写密码', trigger: 'blur' }
          // ,
          // { type: 'string', min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
        ]
      }
    }
  },

  created() {
    if (AV.User.current() !== null) {
      this.$router.push('/table')
    }
  },

  methods: {
    login() {
      this.$refs.form.validate(isValidated => {
        console.log(isValidated)
        console.log(this.user)
      })
    }
  }
}
</script>

<style>
.login-wrap {
  padding: 20px 0;
}
.login-box {
  width: 300px;
  margin: 0 auto;
}
</style>
