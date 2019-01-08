<template>
  <div :groups="groups" :isAdmin="isAdmin" :user="user" :userId="userId" class="user-editor">
    <i-form :label-width="80" :model="curruser" :rules="rules" label-position="right" ref="form">
      <Form-item label="姓名" prop="username">
        <i-input icon="person" v-model="curruser.username"></i-input>
      </Form-item>
      <Form-item label="备注信息">
        <i-input icon="ios-information" v-model="curruser.extInfo"></i-input>
      </Form-item>
      <Form-item label="邮件地址" prop="email">
        <i-input icon="email" v-model="curruser.email"></i-input>
      </Form-item>
      <Form-item label="所在小组">
        <i-select :label-in-value="true" @on-change="groupChange" v-if="curruser.group.id" v-model="curruser.group.id">
          <i-option :key="item.id" :value="item.id" v-for="item in groups">{{item.attributes.name}}</i-option>
        </i-select>
      </Form-item>
      <Form-item label="排序值" v-if="isAdmin">
        <i-input :number="true" icon="sort" title="数值越小越靠前" v-model="curruser.memberIndex"></i-input>
      </Form-item>
      <Form-item label="重置密码">
        <i-button @click="resetPwd">重置密码</i-button>
      </Form-item>
      <Form-item label="免填周报" v-if="isAdmin">
        <Checkbox label="admin" v-model="curruser.noReport">
          <Icon type="coffee"></Icon>
          <span>免填周报</span>
        </Checkbox>
      </Form-item>
      <Form-item label="管理员" v-if="isAdmin">
        <Checkbox :disabled="isSelf" label="admin" v-model="curruser.isAdmin">
          <Icon type="settings"></Icon>
          <span>设为管理员</span>
        </Checkbox>
      </Form-item>
      <Form-item>
        <i-button @click="save" type="primary">保存</i-button>
        <i-button @click="cancel">取消</i-button>
      </Form-item>
    </i-form>
  </div>
</template>

<script>
import Form from 'iview/src/components/form/form';
import FormItem from 'iview/src/components/form/form-item';
import Input from 'iview/src/components/input/input';
import Button from 'iview/src/components/button/button';
import { Select, Option } from 'iview/src/components/select';
import Checkbox from 'iview/src/components/checkbox/';
import Message from 'iview/src/components/message';
import Icon from 'iview/src/components/icon';
import AV from 'leancloud-storage';

export default {
  name: 'userEditor',
  components: {
    'i-form': Form,
    FormItem,
    Icon,
    'i-button': Button,
    'i-input': Input,
    'i-select': Select,
    'i-option': Option,
    Checkbox
  },
  props: {
    user: Object,
    userId: String,
    isAdmin: {
      default: false,
      type: Boolean
    },
    groups: Array
  },
  data() {
    return {
      origionData: {},
      rules: {
        username: [
          {
            required: true,
            message: '请填姓名',
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
  mounted() {
    this.user && this.$set(this, 'origionData', JSON.parse(JSON.stringify(this.user)));
  },
  // watch: {
  //   user() {
  //     this.user && this.$set(this, 'origionData', JSON.parse this.user);
  //   }
  // },
  computed: {
    curruser() {
      return this.user;
    },

    // 是否为自己
    isSelf() {
      return this.userId === AV.User.current().id;
    }
  },
  methods: {
    groupChange(g) {
      for (let group of this.groups) {
        if (g.value == group.id) {
          this.curruser.group = group;
          break;
        }
      }
    },
    resetPwd() {
      if (this.user.email) {
        AV.User.requestPasswordReset(this.user.email).then(d => {
          Message.info({
            content: '重置密码邮件已经发送至 ' + this.user.email,
            closable: true,
            duration: 3
          });
        });
      }
    },
    save() {
      this.$refs.form.validate(isValidated => {
        if (!isValidated) return;
        let o = this.origionData;
        let c = this.curruser;
        let data = {};

        if (o.username !== c.username) data.username = c.username;
        if (o.email !== c.email) data.email = c.email;

        if (this.isAdmin) {
          if (o.extInfo !== c.extInfo) data.extInfo = c.extInfo;
          if (o.memberIndex !== c.memberIndex) data.memberIndex = c.memberIndex;
          if (o.isAdmin !== c.isAdmin) data.isAdmin = c.isAdmin;
          if (o.noReport !== c.noReport) data.noReport = c.noReport;
        }
        if (o.group.id != c.group.id) {
          data.group = c.group.id;
        }

        this.$emit('save', data, this.userId);
      });
    },
    cancel() {
      this.$emit('cancel');
    }
  }
};
</script>

<style>
</style>
