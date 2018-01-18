<template>
  <div class="user-setting" >
    <UserInfo :user="user" :userId="userId" @startEdit="startEdit"></UserInfo>

    <Modal v-model="showEditor" title="个人信息" :footerHide="true" :maskClosable="false" :loading="inSaveing">
      <UserEditor :user="user" :userId="userId" :groups="groups" :isAdmin="user.isAdmin" @save="save" @cancel="cancel"></UserEditor>

      <!-- <div slot="footer"></div> -->
    </Modal>
  </div>
</template>

<script>
import Modal from 'iview/src/components/modal/';
import UserInfo from './userinfo';
import UserEditor from './usereditor';
import Message from 'iview/src/components/message';
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
      groups: [],
      inSaveing: false
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
    },
    save(data, id) {
      let keys = Object.keys(data);
      if (!keys.length) {
        this.showEditor = false;
      } else {
        this.inSaveing = true;
        console.log(id, data);
        let person = AV.Object.createWithoutData('_User', id);
        keys.forEach(k => {
          person.set(k, data[k]);
        });
        person
          .save()
          .then(r => {
            Message.success({
              content: '保存成功 ',
              closable: true,
              duration: 3
            });

            this.inSaveing = false;
            this.showEditor = false;
          })
          .catch(e => {
            Message.error({
              content:
                '保存失败<br><pre style="text-align:left;">' + JSON.stringify({ code: e.code, message: e.message }, 0, 4) + '</pre>',
              closable: true,
              duration: 10
            });

            this.inSaveing = false;
            this.showEditor = false;
          });
      }
    },
    cancel() {
      this.showEditor = false;
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
