<template>
  <div class="user-setting" >
    <Card :dis-hover="true">
      <Avatar size="large" :style="{background: '#64b1ca',color:'#fff'}">{{user.username | getAvatarText}}</Avatar>
      <div class="group">{{user.groupName | showGroupName}}</div>

      <i-button @click="startEdit" class="edit-btn-wrap" type="text"><Icon style="margin-right:5px;" type="edit"></Icon>编辑</i-button>

      <transition name="slide">
        <div class="userinfo-edit">
          <i-input v-modal="user.username" placeholder="请输入姓名">
            <span slot="prepend">姓名</span>
          </i-input>
          <i-select v-model="user.groupIndex" >
            <i-option v-for="item in groups" :value="item.index">{{ item.name }}</i-option>
          </i-select>
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
    'i-option': Option
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
      inEdit: false
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
