<template>
  <div class="signup-wrap">
      <div class="signup-box">
          <i-form ref="form" :model="user" :rules="relues">
            <FormItem prop="name">
              <i-input type="text" v-model="user.name" placeholder="请输入您的姓名"></i-input>
            </FormItem>
            <FormItem prop="pwd">
              <i-input type="password" v-model="user.pwd" placeholder="请输入密码"></i-input>
            </FormItem>
            <FormItem prop="email">
              <i-input type="text" v-model="user.email" placeholder="请输入邮箱"></i-input>
            </FormItem>
            <Form-item v-if="groups.length">
              <i-select v-model="user.groupIndex" style="margin-bottom:10px;">
                <!-- <i-option value="-1">请选择所在小组</i-option> -->
                <i-option v-for="item in groups" :key="item.name" :value="item.index">{{ item.name }}</i-option>
              </i-select>
            </Form-item>
            <FormItem style="text-align:center;">
              <ButtonGroup>
                <i-button type="primary" @click="signup">注册并登录</i-button>
                <i-button type="default" @click="login">已有账号，去登录</i-button>
              </ButtonGroup>
            </FormItem>
          </i-form>
      </div>
  </div>
</template>

<script>
import Form from 'iview/src/components/form/form';
import FormItem from 'iview/src/components/form/form-item';
import Input from 'iview/src/components/input/input';
import Button from 'iview/src/components/button/';
import { Select, Option } from 'iview/src/components/select';
import Modal from 'iview/src/components/Modal/index.js';
import api from '@/api/index.js';

window.api = api;

console.log(api);

export default {
  name: 'signup',
  components: {
    'i-form': Form,
    FormItem,
    ButtonGroup: Button.Group,
    'i-input': Input,
    'i-button': Button,
    'i-select': Select,
    'i-option': Option
  },
  created() {
    // 创建完成后获取小组数据
    api
      .getData('Group', false, {
        sort: 'asc',
        field: 'groupIndex'
      })
      .then(result => {
        result.forEach(item => {
          this.groups.push(item.attributes);
        });
      });
  },
  data() {
    return {
      user: {
        name: '',
        pwd: '',
        email: '',
        groupIndex: -1
      },
      groups: [],
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
    };
  },
  computed: {
    groupName() {
      if (!this.groups.length) return '';
      return this.groups.filter(item => item.index === this.user.groupIndex)[0]
        .name;
    }
  },
  methods: {
    signup() {
      this.$refs.form.validate(isValidated => {
        if (!isValidated) return;

        let user = {
          name: this.user.name,
          pwd: this.user.pwd,
          email: this.user.email,
          groupName: this.groupName,
          groupIndex: this.user.groupIndex
        };

        // 检查有无选择小组
        if (this.groups.length && this.user.groupIndex === -1) {
          Modal.confirm({
            title: '提醒',
            content:
              '确认不选择所在小组？不选择所在小组将无法录入个人工作周报？',
            onOk: () => {
              // 登录成功后自动跳转到登录
              api.signUp(user).then(() => {
                this.$router.push('/');
              });
            }
          });
        } else {
          // 登录成功后自动跳转到登录
          api.signUp(user).then(() => {
            this.$router.push('/');
          });
        }
      });
    },
    login() {
      this.$router.push('/');
    }
  }
};
</script>

<style>
.signup-box {
  width: 300px;
  margin-top: -webkit-calc(30% - 120px);
  margin-top: calc(30% - 120px);
  margin-left: auto;
  margin-right: auto;
}
</style>

