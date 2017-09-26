<template>
  <div class="login-wrap">
      <div class="login-box">
          <form>
            <label for="user-name">姓名</label><input id="user-name" name="user-name" type="text" v-model="name" placeholder="请输入姓名">
            <label for="user-pwd">密码</label><input type="password" id="user-pwd" name="user-pwd" v-model="pwd" placeholder="请输入密码">
            <input type="button" value="登录" @click="login">
          </form>
      </div>
  </div>
</template>

<script>
export default {
  name: 'login',
  data() {
    return {
      name: '',
      pwd: ''
    }
  },
  methods:{
      login() {
          console.log(this);
          
      }
  }
}

</script>

<style >

</style>
