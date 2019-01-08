<template>
  <div class="login-wrap">
    <div class="login-box">
      <i-form :model="user" ref="form">
        <Form-item>
          <i-select style="margin-bottom:10px;" v-model="groupId">
            <!-- <i-option value="-1">请选择所在小组</i-option> -->
            <i-option :key="item.name" :value="item.id" v-for="item in groups">{{ item.name }}</i-option>
          </i-select>
        </Form-item>

        <Form-item>
          <i-select style="margin-bottom:10px;" v-model="user.name">
            <!-- <i-option value="-1">请选择所在小组</i-option> -->
            <i-option :key="item.id" :value="item.username" v-for="item in currGroup.member">{{ item.username }}</i-option>
          </i-select>
        </Form-item>

        <FormItem prop="pwd">
          <i-input placeholder="请输入密码" type="password" v-model="user.pwd"></i-input>
        </FormItem>
        <FormItem class="text-center">
          <i-button @click="login" style="width:100%" type="primary">登录</i-button>
        </FormItem>
        <FormItem class="text-center login-other">
          <i-button @click="signup" type="text">注册</i-button>
          <i-button @click="forgetPwd" type="text">忘记密码</i-button>
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
import { Select, Option } from 'iview/src/components/select';
import AV from 'leancloud-storage';
import api from '@/api/index';

const LOCAL_USER_KEY = '_weekly-report_localUser';

export default {
  name: 'login',
  components: {
    'i-form': Form,
    FormItem,
    'i-input': Input,
    'i-button': Button,
    'i-select': Select,
    'i-option': Option
  },
  data() {
    return {
      user: {
        name: '',
        pwd: ''
      },
      currGroup: {},
      groups: [],
      groupId: '',
      dataLoaded: false
    };
  },
  mounted() {
    this.autoLogin();
  },
  watch: {
    groupId(v) {
      for (let g of this.groups) {
        if (g.id == v) {
          this.currGroup = g;
          this.user.name = g.member[0].username;
        }
      }
    }
  },
  methods: {
    autoLogin() {
      // 已经登录则自动登录并跳转
      let user = AV.User.current();
      if (user !== null) {
        // 利用sessionToken重新登录一次，以便拉取最新信息
        return api
          .sessionTokenLogIn(user._sessionToken)
          .then(user => {
            this.$router.push(
              user.attributes.noReport ? { name: 'summary' } : { name: 'input' }
            );
          })
          .catch(() => {
            AV.User.logOut().then(() => {
              this.$router.push('/');
            });
          });
      }
      this.getData();
    },
    login() {
      const that = this;
      this.$refs.form.validate(isValidated => {
        localStorage.setItem(
          LOCAL_USER_KEY,
          JSON.stringify({
            groupId: that.groupId,
            username: this.user.name
          })
        );
        api.logIn(this.user.name, this.user.pwd).then(user => {
          console.log(user);
          if (user.attributes.groupName) {
            this.$router.push('/main/input');
          } else {
            this.$router.push('/main/summary');
          }
        });
      });
    },
    signup() {
      this.$router.push('/signup');
    },
    forgetPwd() {
      this.$router.push('/forgetpwd');
    },
    getData() {
      if (!this.dataLoaded) {
        // 未获取数据时获取数据
        api.getAllUserAsTree().then(data => {
          this.dataLoaded = true;
          // 第一次进入
          if (!data.length) {
            this.$router.push('/signup');
          } else {
            this.$set(this, 'groups', data);
            this.fillUser();
          }
        });
      }
    },
    fillUser() {
      let localUser = localStorage.getItem(LOCAL_USER_KEY);

      if (!localUser) {
        this.currGroup = this.groups[0];
        this.groupId = this.currGroup.id;
        this.user.name = this.currGroup.member[0].username;
      } else {
        localUser = JSON.parse(localUser);
        let hasGroup = false;
        let hasUser = false;
        for (let g of this.groups) {
          if (g.id == localUser.groupId) {
            this.currGroup = g;
            this.groupId = g.id;
            hasGroup = true;

            for (let u in g.member) {
              if ((localUser.username = u.username)) {
                this.user.name = u.username;
                hasUser = true;
                break;
              }
            }

            if (!hasUser) {
              this.user.name = g.member[0].username;
            }
            break;
          }
        }
        if (!hasGroup || !hasUser) {
          localStorage.removeItem(LOCAL_USER_KEY);
        }
      }
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
