<template>
  <div class="user-editor" :user="user" :userId="userId" :isAdmin="isAdmin" :groups="groups">
    <i-form ref="form" :model="curruser" :rules="rules" label-position="right" :label-width="80">
      <Form-item label="姓名" prop="username">
        <i-input v-model="curruser.username" icon="person"></i-input>
      </Form-item>
      <Form-item label="备注信息">
        <i-input v-model="curruser.extInfo" icon="ios-information"></i-input>
      </Form-item>
      <Form-item label="邮件地址" prop="email">
        <i-input v-model="curruser.email" icon="email"></i-input>
      </Form-item>
      <Form-item label="所在小组" prop="groupIndex">
        <i-select v-model="curruser.groupIndex" @on-change="groupChange" :label-in-value="true">
          <i-option v-for="item in groups" :key="item.index" :value="item.index">{{item.name}}</i-option>
        </i-select>
      </Form-item>
      <Form-item label="排序值" v-if="isAdmin">
        <i-input v-model="curruser.memberIndex" :number="true" icon="sort" title="数值越小越靠前"></i-input>
      </Form-item>
      <Form-item label="重置密码" v-if="isSelf">
        <i-button @click="resetPwd">重置密码</i-button>
      </Form-item>
      <Form-item label="免填周报" v-if="isAdmin">
        <Checkbox label="admin" v-model="curruser.noReport">
            <Icon type="coffee"></Icon>
            <span>免填周报</span>
        </Checkbox>
      </Form-item>
      <Form-item label="管理员" v-if="isAdmin">
        <Checkbox label="admin" v-model="curruser.isAdmin" :disabled="isSelf">
            <Icon type="settings"></Icon>
            <span>设为管理员</span>
        </Checkbox>
      </Form-item>
      <Form-item>
        <i-button type="primary" @click="save">保存</i-button>
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
        ],
        groupIndex: [
          {
            required: true,
            message: '必须选择所在小组'
          }
        ]
      }
    };
  },
  computed: {
    curruser() {
      return JSON.parse(JSON.stringify(this.user));
    },

    // 是否为自己
    isSelf() {
      return this.userId === AV.User.current().id;
    }
  },
  methods: {
    groupChange(currGroup) {
      this.curruser.groupName = currGroup.label;
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
        let o = this.user;
        let c = this.curruser;
        let data = {};

        if (o.username !== c.username) data.username = c.username;
        if (o.email !== c.email) data.email = c.email;
        if (o.groupIndex !== c.groupIndex) {
          data.groupIndex = c.groupIndex;
          data.groupName = c.groupName;
        }

        if (this.isAdmin) {
          if (o.extInfo !== c.extInfo) data.extInfo = c.extInfo;
          if (o.memberIndex !== c.memberIndex) data.memberIndex = c.memberIndex;
          if (o.isAdmin !== c.isAdmin) data.isAdmin = c.isAdmin;
          if (o.noReport !== c.noReport) data.noReport = c.noReport;
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
