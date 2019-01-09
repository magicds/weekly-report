<template>
  <header class="header">
    <div class="left">
      <router-link :to="{ name: 'input'}" class="nav-link" v-if="!user.noReport">周报填写</router-link>
      <router-link :to="{ name: 'summary'}" class="nav-link">本周汇总</router-link>
      <router-link :to="{ name: 'history'}" class="nav-link">历史查看</router-link>
      <router-link :to="{ name: 'report'}" class="nav-link">历史周报</router-link>
      <router-link :to="{ name: 'groupWeekReport'}" class="nav-link" v-if="isGroupLeader">小组周报</router-link>
      <router-link :to="{ name: 'groupMonthReport'}" class="nav-link" v-if="isGroupLeader">小组月报</router-link>
    </div>
    <div class="right" v-if="user.username">
      <Dropdown @on-click="itemClick" placement="bottom-end" trigger="click">
        <a class href="javascript:void(0)">
          <Avatar>{{user.username}}</Avatar>
        </a>
        <DropdownMenu slot="list">
          <DropdownItem name="userinfo">个人信息</DropdownItem>
          <DropdownItem name="admin" v-if="user.isAdmin">人员管理</DropdownItem>
          <DropdownItem name="groupAdmin" v-if="user.isAdmin">小组管理</DropdownItem>
          <DropdownItem name="verify" v-if="user.isAdmin">未验证用户</DropdownItem>
          <DropdownItem divided name="logout">注销登录</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  </header>
</template>

<script>
import AV from 'leancloud-storage';
import Dropdown from 'iview/src/components/dropdown';
import Icon from 'iview/src/components/icon';
import Avatar from 'iview/src/components/avatar';
import Modal from 'iview/src/components/modal/';
import UserInfo from './userInfo';
import userApi from '@/api/user';

export default {
  name: 'header',
  components: {
    Dropdown,
    Icon,
    DropdownMenu: Dropdown.Menu,
    DropdownItem: Dropdown.Item,
    Avatar
  },
  data() {
    return {
      user: {},
      showDialog: false,
      dialogTitle: '个人信息',
      isGroupLeader: false
    };
  },
  mounted() {
    this.getUser();
  },
  methods: {
    getUser() {
      userApi.getCurrUserAsync().then(u => {
        const user = JSON.parse(JSON.stringify(u));
        this.$set(this, 'user', user);
        if (this.user.objectId == this.user.group.leader.objectId) {
          this.isGroupLeader = true;
        }
      });
    },
    itemClick(name) {
      switch (name) {
        case 'userinfo':
          this.$router.push('/main/usersetting');
          break;
        case 'logout':
          userApi.logOut();
          this.$router.push('/');
          break;
        case 'admin':
          this.$router.push('/main/admin');
          break;
        case 'groupAdmin':
          this.$router.push('/main/groupAdmin');
          break;
        case 'verify':
          this.$router.push('/main/verify');
          break;
        default:
          break;
      }
    }
  }
};
</script>

<style scoped>
.header {
  height: 38px;
  margin-bottom: 10px;
  margin-top: 10px;

  border-bottom: 1px solid #ddd;
}

.header:after {
  display: table;
  clear: both;

  content: '';
}

.left {
  line-height: 37px;

  float: left;

  height: 38px;
}

.right {
  float: right;
}

.nav-link {
  display: block;
  float: left;

  margin-bottom: -1px;
  padding: 0 15px;

  border: 1px solid transparent;
  border-bottom: none;
  border-radius: 4px 4px 0 0;

  text-decoration: none;
  color: #353535;
}
.nav-link:hover {
  text-decoration: none;
  color: #2d8cf0;
}
.router-link-exact-active.router-link-active {
  border-color: #ddd;
  background: #fff;
  color: #2d8cf0;
}
.ivu-avatar {
  background: #2d8cf0;
}
</style>
