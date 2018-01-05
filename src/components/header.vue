<template>
  <header class="header">
    <div class="left">
      <router-link class="nav-link" :to="{ name: 'input'}" v-if="user.groupName">周报填写</router-link>
      <router-link class="nav-link" :to="{ name: 'summary'}">周报汇总</router-link>
      <router-link class="nav-link" :to="{ name: 'history'}">历史查看</router-link>
    </div>
    <div class="right">
      <Dropdown @on-click="itemClick" placement="bottom-end">
        <a class href="javascript:void(0)">
          <Avatar>{{user.username}}</Avatar>
          <!-- <Icon type="arrow-down-b"></Icon> -->
        </a>
        <DropdownMenu slot="list">
            <DropdownItem name="userinfo">个人信息</DropdownItem>
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
      user: userApi.getCurrUser().attributes
    };
  },
  mounted() {},
  methods: {
    itemClick(name) {
      switch (name) {
        case 'userifo':
          break;
        case 'logout':
          userApi.logOut();
          this.$router.push('/');
          break;
        default:
          break;
      }
    }
  }
};
</script>

<style>
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

