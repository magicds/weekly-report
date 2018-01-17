<template>
  <div class="user-setting" >
    <UserInfo :user="user" :userId="userId" @startEdit="startEdit"></UserInfo>

    <Modal v-model="showEditor" title="信息编辑" >
      <UserEditor :user="user" :userId="userId" :groups="groups"></UserEditor>
    </Modal>
  </div>
</template>

<script>
import Modal from 'iview/src/components/modal/';
import UserInfo from './userinfo';
import UserEditor from './usereditor';
// import Card from 'iview/src/components/card/';
// import Avatar from 'iview/src/components/avatar';
// import Icon from 'iview/src/components/icon';
// import Button from 'iview/src/components/button';
// import Input from 'iview/src/components/input';
// import { Select, Option } from 'iview/src/components/select';
// import Checkbox from 'iview/src/components/checkbox/checkbox';
import AV from 'leancloud-storage';
import api from '@/api/';

export default {
  name: 'usersetting',
  components: {
    Modal,
    UserInfo,
    UserEditor
  },
  created() {
    // if
  },
  data() {
    return {
      user: api.getCurrUser().attributes,
      userId: api.getCurrUser().id,
      showEditor: false,
      groups: []
    };
  },
  mounted() {
    // 重新拉取信息
    AV.User.become(api.getCurrUser()._sessionToken)
      .then(r => {
        this.$set(this, 'user', r.attributes);
      })
      .catch(() => {
        AV.User.logOut().then(() => {
          this.$router.push('/');
        });
      });
    api.getData('Group', null, { sort: 'asc', field: 'index' }).then(r => {
      r.forEach(item => {
        this.groups.push(item.attributes);
      });
    });
  },
  methods: {
    startEdit(user, id) {
      // alert('editor\n'+ JSON.stringify(user, 0, 4));
      this.showEditor = true;
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
