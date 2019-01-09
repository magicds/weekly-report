<template>
  <div align="top" class="user-admin" type="flex">
    <Row :key="group.index" class="row" v-for="group in groups">
      <i-col :key="member.id" :lg="{span:8}" :md="{span:12}" :sm="{span:24}" :xs="{span:24}" v-for="member in group.member">
        <UserInfo :showDelete="isAdmin" :user="member" :userId="member.id" @startEdit="startEdit"></UserInfo>
      </i-col>
    </Row>

    <Modal :footerHide="true" :loading="inSaveing" :maskClosable="false" title="信息修改" v-model="showEditor">
      <UserEditor :groups="groupData" :isAdmin="isAdmin" :user="user" :userId="userId" @cancel="cancel" @save="save" v-if="showEditor"></UserEditor>
    </Modal>
  </div>
</template>

<script>
import Modal from 'iview/src/components/modal/';
import UserInfo from './userinfo';
import UserEditor from './usereditor';
import Message from 'iview/src/components/message';
import { Row, Col } from 'iview/src/components/grid/';
import AV from 'leancloud-storage';
import api from '@/api/';

const userMap = {};

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
      isAdmin: AV.User.current().attributes.isAdmin,
      showEditor: false,
      groups: [],
      groupData: [],
      inSaveing: false,
      user: {},
      userId: ''
    };
  },
  mounted() {
    api.getAllUserAsTree().then(g => {
      this.$set(this, 'groups', g);
    });
  },
  methods: {
    startEdit(user, id) {
      this.$set(this, 'user', user);
      this.userId = id;
      if (!this.groupData.length) {
        this.getGroups().then(r => {
          if (r && r.length) {
            this.$set(this, 'groupData', r);
            this.showEditor = true;
          }
        });
      } else {
        this.showEditor = true;
      }
    },
    save(data, id) {
      let keys = Object.keys(data);
      if (!keys.length) {
        this.showEditor = false;
        return;
      }
      this.inSaveing = true;
      console.log(id, data);
      this._update2Cloud(data, id, keys)
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
              '保存失败<br><pre style="text-align:left;">' +
              JSON.stringify(
                {
                  code: e.code,
                  message: e.message
                },
                0,
                4
              ) +
              '</pre>',
            closable: true,
            duration: 10
          });

          this.inSaveing = false;
          this.showEditor = false;
        });
    },
    cancel() {
      this.showEditor = false;
    },
    _update2Cloud(data, id, keys) {
      // 角色发生变化时 先更新角色
      if (data.isAdmin != undefined) {
        return api[data.isAdmin ? 'addRole' : 'removeRole'](
          'administrator',
          userMap[id]
        ).then(r => {
          return api.savePerson(data, id, keys);
        });
      }

      return api.savePerson(id, data);
    },
    getGroups() {
      const query = new AV.Query('Group');
      return query.find();
    }
  }
};
</script>

<style scoped>
</style>
