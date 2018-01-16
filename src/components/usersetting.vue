<template>
  <div class="user-setting" >
    <UserInfo :user="user" :userId="userId" @startEdit="startEdit"></UserInfo>
  </div>
</template>

<script>
import Modal from 'iview/src/components/modal/';
import UserInfo from './userinfo';
// import Card from 'iview/src/components/card/';
// import Avatar from 'iview/src/components/avatar';
// import Icon from 'iview/src/components/icon';
// import Button from 'iview/src/components/button';
// import Input from 'iview/src/components/input';
// import { Select, Option } from 'iview/src/components/select';
// import Checkbox from 'iview/src/components/checkbox/checkbox';
import api from '@/api/';

export default {
  name: 'usersetting',
  components: {
    Modal,
    UserInfo
  },
  created() {
    // if
  },
  data() {
    return {
      user: api.getCurrUser().attributes,
      userId: api.getCurrUser().id,
      groups: [],
      inEdit: false,
      noInput: true
    };
  },
  methods: {
    startEdit(user, id) {
      alert('editor\n'+ JSON.stringify(user, 0, 4));
    }
  }
};
</script>

<style scoped>
.user-setting {
  max-width: 400px;
  margin: 0 auto;
}
</style>
