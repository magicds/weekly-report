<template>
  <div class="signup-wrap">
      <div class="signup-box">
          <i-form ref="form" :rules="relues">
            <FormItem prop="name">
              <i-input type="text" v-model="username" placeholder="请输入用户名"></i-input>
            </FormItem>
            <FormItem prop="pwd">
              <i-input type="password" v-model="pwd" placeholder="请输入密码"></i-input>
            </FormItem>
            <FormItem prop="email">
              <i-input type="text" v-model="email" placeholder="请输入邮箱"></i-input>
            </FormItem>
            <Form-item v-if="groups.length">
              <i-select v-model="groupIndex" style="margin-bottom:10px;">
                <!-- <i-option value="-1">请选择所在小组</i-option> -->
                <i-option v-for="item in groups" :value="item.index">{{ item.name }}</i-option>
              </i-select>
            </Form-item>
            <FormItem>
              <i-button type="primary" @click="signup">注册并登录</i-button>
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
import Modal from 'iview/src/components/Modal/index.js';
import api from '@/api/index.js';

console.log(api);

export default {
  name: 'signup',
  components: {
    'i-form': Form,
    FormItem,
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
        console.log(result);
        result.forEach(item => {
          this.groups.push(item.attributes);
        });
      });
  },
  data() {
    return {
      username: '',
      pwd: '',
      email: '',
      groupIndex: -1,
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
      return this.groups.filter(item => item.groupIndex === this.groupIndex)[0];
    }
  },
  methods: {
    signup() {
      this.$refs.form.validate(isValidated => {
        let user = {
          name: this.username,
          pwd: this.pwd,
          email: this.email,
          groupName: this.groupName,
          groupIndex: this.groupIndex
        };

        // 检查有无选择小组
        if (this.groups.length && this.user.groupIndex == -1) {
          Modal.confirm({
            title: '提醒',
            content: '确认不选择所在小组？不选择所在小组将无法录入个人工作周报？',
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
    }
  }
};
</script>

<style>

</style>

