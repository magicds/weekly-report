<template>
  <div class="login-wrap">
    <div class="login-box">
      <i-form :model="user" ref="form">
        <Form-item>
          <i-select style="margin-bottom:10px;" v-model="groupIndex">
            <!-- <i-option value="-1">请选择所在小组</i-option> -->
            <i-option :key="item.name" :value="item.index" v-for="item in groups">{{ item.name }}</i-option>
          </i-select>
        </Form-item>

        <Form-item>
          <i-select style="margin-bottom:10px;" v-model="user.name">
            <!-- <i-option value="-1">请选择所在小组</i-option> -->
            <i-option :key="item.name" :value="item.name" v-for="item in group.member">{{ item.name }}</i-option>
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
import Promise from 'bluebird';

function getAllUser() {
  return Promise.all([
    api.getData('Group', false, {
      sort: 'asc',
      field: 'index'
    }),
    api.getAllUser(true, true)
  ]).then(result => {
    let groups = [];
    let users = [];

    result[0].forEach(item => {
      groups.push({
        id: item.id,
        name: item.attributes.name,
        index: item.attributes.index,
        member: []
      });
    });

    result[1].forEach(item => {
      let i = users.push({
        id: item.id,
        name: item.attributes.username
      });
      let aimGroup = groups[item.attributes.groupIndex];
      aimGroup && aimGroup.member.push(users[i - 1]);
    });

    return {
      users,
      groups
    };
  });
}

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
        name: localStorage.getItem('localUserName') || '',
        pwd: ''
      },
      groups: [],
      groupIndex: 0,
      users: [],
      dataLoaded: false
    };
  },
  computed: {
    group() {
      return this.groups[this.groupIndex] || {};
    }
  },
  watch: {
    groupIndex() {
      if (this.group.member && this.group.member.length) {
        // this.user.name = this.group.member[0].name;
        this.fillUser();
      }
    }
  },
  mounted() {
    this.autoLogin();
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
      this.$refs.form.validate(isValidated => {
        localStorage.setItem('localGroupIndex', this.groupIndex);
        localStorage.setItem('localUserName', this.user.name);
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
        getAllUser().then(data => {
          this.dataLoaded = true;
          // 第一次进入
          if (!data.groups.length) {
            this.$router.push('/signup');
          } else {
            this.$set(this, 'groups', data.groups);
            this.$set(this, 'users', data.users);
            this.groupIndex =
              parseInt(localStorage.getItem('localGroupIndex'), 10) || 0;
            this.$nextTick(() => {
              this.fillUser();
            });
          }
        });
      }
    },
    fillUser() {
      var localUser = localStorage.getItem('localUserName');

      if (!localUser) {
        this.user.name = this.group.member[0].name;
      } else {
        let hasLocal = false;
        this.group.member.forEach(item => {
          if (item.name == localUser) {
            hasLocal = true;
          }
        });
        if (hasLocal) {
          this.user.name = localUser;
        } else {
          this.user.name = this.group.member[0].name;
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
