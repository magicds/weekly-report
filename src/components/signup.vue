<template>
  <div class="signup-wrap">
    <div class="signup-box">
      <i-form :model="user" :rules="relues" ref="form">
        <FormItem prop="name">
          <i-input placeholder="请输入您的姓名" type="text" v-model="user.name"></i-input>
        </FormItem>
        <FormItem prop="pwd">
          <i-input placeholder="请输入密码" type="password" v-model="user.pwd"></i-input>
        </FormItem>
        <FormItem prop="email">
          <i-input placeholder="请输入邮箱" type="text" v-model="user.email"></i-input>
        </FormItem>
        <Form-item v-if="groups.length">
          <i-select style="margin-bottom:10px;" v-model="user.groupId">
            <!-- <i-option value="-1">请选择所在小组</i-option> -->
            <i-option :key="item.name" :value="item.id" v-for="item in groups">{{ item.name }}</i-option>
          </i-select>
        </Form-item>
        <FormItem style="text-align:center;">
          <ButtonGroup>
            <i-button @click="signup" type="primary">注册并登录</i-button>
            <i-button @click="login" type="default">已有账号，去登录</i-button>
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
import Message from 'iview/src/components/message';
import api from '@/api/index.js';

window.api = api;

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
        field: 'index'
      })
      .then(result => {
        result.forEach(item => {
          const group = item.attributes;
          group.id = item.id;
          this.groups.push(group);
          this.$data._groups[item.id] = item;
        });
        this.user.groupId = result[0].id;
      });
  },
  data() {
    return {
      user: {
        name: '',
        pwd: '',
        email: '',
        groupId: ''
      },
      groups: [],
      _groups: {},
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
  methods: {
    signup() {
      const that = this;
      this.$refs.form.validate(isValidated => {
        if (!isValidated) return;

        let user = {
          name: this.user.name,
          pwd: this.user.pwd,
          email: this.user.email,
          group: that.$data._groups[this.user.groupId]
        };

        // 注册成功后自动跳转到登录
        api.signUp(user).then(u => {
          console.log(u);
          Modal.info({
            title: '系统提醒',
            loading: true,
            content:
              '注册成功，需要上级成员通过验证后才能正常使用系统。<br>点击确定给所有管理员发送邮件。',
            onOk: function() {
              api
                .requestVerify()
                .then(() => {
                  Message.success({
                    content: '提醒验证邮件发送成功，请等待验证通过后，重新登录',
                    closable: true,
                    duration: 10
                  });
                  Modal.remove();
                  that.$router.push('/');
                })
                .catch(err => {
                  Message.error({
                    content: `${err.message}`,
                    closable: true,
                    duration: 50
                  });
                });
            }
          });
        });
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

