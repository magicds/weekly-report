<template>
  <header class="header">
    <div class="left"></div>
    <div class="right">.
      <Dropdown >
        <a class href="javascript:void(0)">
          <Avatar>{{user.username}}</Avatar>
          <Icon type="arrow-down-b"></Icon>
        </a>
        <DropdownMenu slot="list">
            <DropdownItem >注销登录</DropdownItem>
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
      user: AV.User.current().attributes
    }
  },
  methods: {}
}
</script>

<style>

</style>

