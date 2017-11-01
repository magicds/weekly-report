<template>
  <header class="header">
    <div class="left">
      <router-link class="nav-link" :to="{ name: 'input'}">周报填写</router-link>
      <router-link class="nav-link" :to="{ name: 'summary'}">周报汇总</router-link>

    </div>
    <div class="right">
      <Dropdown :on-click="itemClick" placement="bottom-end">
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
import AV from 'leancloud-storage'
import Dropdown from 'iview/src/components/dropdown'
import Icon from 'iview/src/components/icon'
import Avatar from 'iview/src/components/avatar'
import userApi from '@/api/user'

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
    }
  },
  methods: {
    itemClick(name) {
      console.log(name)
    }
  }
}
</script>

<style>
.header:after {
    display: table;
    clear: both;

    content: "";
}
.left {
    float: left;
}
.right {
    float: right;
}

</style>

