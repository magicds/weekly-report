<template>
  <div class="user-setting" >
    <Card :dis-hover="true">
      <Avatar size="large" :style="{background: '#64b1ca',color:'#fff'}">{{user.username | getAvatarText}}</Avatar>
      <div class="group">{{user.groupName | showGroupName}}</div>

      <i-button @click="startEdit" class="edit-btn-wrap" type="text"><Icon style="margin-right:5px;" type="edit"></Icon>编辑</i-button>

      <transition name="slide">
        <div class="userinfo-edit">
          <i-input v-modal="user.username" placeholder="请输入姓名" style="margin-bottom:10px;">
            <span slot="prepend">姓名</span>
          </i-input>

          <!-- 不填写周报则无需选择所在小组 -->
          <i-select v-if="!user.onInput" v-model="user.groupIndex" style="margin-bottom:10px;">
            <i-option value="-1">请选择所在小组</i-option>
            <i-option v-for="item in groups" :value="item.index">{{ item.name }}</i-option>
          </i-select>

          <!-- 管理角色可以选择不填写周报 -->
          <Checkbox v-if="isAdmin" v-model="user.noInput" style="margin-bottom:10px;">管理员，不填写周报</Checkbox>
          <br>
          <i-button @click="save" type="primary">保存</i-button>
          <i-button @click="end">取消</i-button>
        </div>
      </transition>
    </Card>
  </div>
</template>

<script>
import Card from 'iview/src/components/card/';
import Avatar from 'iview/src/components/avatar';
import Icon from 'iview/src/components/icon';
import Button from 'iview/src/components/button';
import Input from 'iview/src/components/input';
import { Select, Option } from 'iview/src/components/select';
import Checkbox from 'iview/src/components/checkbox/checkbox';
import api from '@/api/';

export default {
  name: 'usersetting',
  components: {
    Card,
    Avatar,
    Icon,
    'i-button': Button,
    'i-input': Input,
    'i-select': Select,
    'i-option': Option,
    Checkbox
  },
  filters: {
    getAvatarText(v) {
      return v.substr(-2);
    },
    showGroupName(v) {
      return v ? v : '请点击编辑选择自己所属的小组';
    }
  },
  created() {
    // if
  },
  data() {
    return {
      user: api.getCurrUser().attributes,
      groups: [
        {
          index: 0,
          name: 'Front End Support'
        },
        {
          index: 1,
          name: 'Front End PC'
        },
        {
          index: 2,
          name: 'Front End Mobile'
        }
      ],
      inEdit: false,
      noInput: true,
      isAdmin: true
    };
  },
  methods: {
    startEdit() {
      this.inEdit = true;
    }
  }
};
</script>

<style>
.user-setting {
  max-width: 400px;
  margin: 0 auto;
  text-align: center;
}
.edit-btn-wrap {
  /* display: block; */
}
</style>
