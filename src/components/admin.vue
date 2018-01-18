<template>
  <div class="user-admin" type="flex" align="top">
    <Row class="row" v-for="group in groups" :key="group.index">
      <i-col :xs="{span:24}" :sm="{span:12}" :md="{span:8}" :lg="{span:8}" v-for="member in group.member" :key="member.id">
        <UserInfo  :userId="member.id" :user="member.data" @startEdit="startEdit"></UserInfo>
      </i-col>
    </Row>

    <Modal v-model="showEditor" title="个人信息" :footerHide="true" :maskClosable="false" :loading="inSaveing">
      <UserEditor :user="user" :userId="userId" :groups="groups"  :isAdmin="isAdmin" @save="save" @cancel="cancel"></UserEditor>
    </Modal>
  </div>
</template>

<script>
import Modal from 'iview/src/components/modal/';
import UserInfo from './userinfo';
import UserEditor from './usereditor';
import Message from 'iview/src/components/message';
import { Row, Col } from 'iview/src/components/grid/';
import Promise from 'bluebird';
import AV from 'leancloud-storage';
import api from '@/api/';

function getAllUser() {
  return Promise.all([
    api.getData('Group', false, {
      sort: 'asc',
      field: 'index'
    }),
    api.getAllUser()
  ]).then(result => {
    let groups = [];
    let users = [];

    result[0].forEach(item => {
      groups.push({
        id: item.id,
        name: item.attributes.name,
        index: item.attributes.index,
        member: []
      });
    });

    result[1].forEach(item => {
      let i = users.push({
        id: item.id,
        data: item.attributes
      });

      groups[item.attributes.groupIndex].member.push(users[i - 1]);
    });

    return groups;
  });
}
export default {
  name: 'admin',
  components: {
    Row,
    'i-col': Col,
    UserInfo,
    UserEditor,
    Modal
  },
  data() {
    return {
      isAdmin:AV.User.current().attributes.isAdmin,
      showEditor: false,
      groups: [],
      inSaveing: false,
      user: {},
      userId: ''
    };
  },
  mounted() {
    getAllUser().then(g => {
      this.$set(this, 'groups', g);
    });
  },
  methods: {
    startEdit(user, id) {
      // alert('editor\n'+ JSON.stringify(user, 0, 4));
      console.log(user,id);
      this.$set(this,'user',user);
      this.userId = id;
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
              content: '保存失败<br>' + JSON.stringify(e, 0, 2),
              closable: true,
              duration: 3
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

</style>
