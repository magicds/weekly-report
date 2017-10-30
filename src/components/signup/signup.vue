<template>
  <div class="signup-wrap">
      <div class="signup-box">
          <i-form ref="form" :model="user" :rules="relues">
            <FormItem prop="name">
              <i-input type="text" v-model="user.name" placeholder="请输入用户名" style="width: 300px"></i-input>
            </FormItem>
            <FormItem prop="pwd">
              <i-input type="password" v-model="user.pwd" placeholder="请输入密码" style="width: 300px"></i-input>
            </FormItem>
            <FormItem prop="email">
              <i-input type="text" v-model="user.email" placeholder="请输入邮箱" style="width: 300px"></i-input>
            </FormItem>
            <FormItem>
              <i-button type="primary" @click="signup">登录</i-button>
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
import Api from '@/api/index.js'

console.log(Api)

export default {
  name: 'signup',
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
        pwd: '',
        email: ''
      },
      relues: {
        name: [
          {
            required: true,
            message: '请填写用户名',
            trigger: 'blur'
          }
        ],
        pwd: [
          {
            required: true,
            message: '请填写密码',
            trigger: 'blur'
          }
        ],
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
    }
  },
  methods: {
    signup() {
      this.$refs.form.validate(isValidated => {
        console.log(isValidated)
        console.log(this.user)
        let user = this.user
        Api.signup(user.name, user.pwd, user.email)
      })
    }
  }
}
</script>

<style>

</style>

