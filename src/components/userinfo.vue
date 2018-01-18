<template>
  <div class="user-info" :user="user" :userId="userId" >
    <Card :dis-hover="true" class="clearfix" style="min-height:160px">
      <div class="left">
        <label for="useravatar"  class="upload-avatar">
          <Avatar size="large" class="user-avatar" :style="{background: '#64b1ca',color:'#fff'}" :src="avatar" ref="avatar">{{user.username | getAvatarText}}</Avatar>
        </label><p v-if="avatar">{{user.username}}</p>
        <input type="file" style="position:absolute;top:100%;left:100%;opacity:0;" name="useravatar" id="useravatar" @change="savePhoto" accept=".jpg,.png">
      </div>
      <div class="right">
        <div class="detail-title">详细信息<i-button @click="startEdit" class="edit-btn-wrap" type="text"><Icon style="margin-right:5px;" type="edit"></Icon>编辑</i-button></div>

        <hr class="hr">

        <div class="item">
          <Icon style="margin-right:5px;" type="person"></Icon>
          <span>{{fullName}}</span>
          <Tag v-if="user.isAdmin" color="green">管理员</Tag>
          <Tag v-if="user.noReport" color="blue">免填周报</Tag>
        </div>

        <div class="item">
          <Icon style="margin-right:5px;" type="email"></Icon>
          <span>{{user.email}}</span>
          <span v-if="user.email">
            <Tag v-if="user.emailVerified" color="green">已验证</Tag>
            <i-button v-else @click="verifyEmail" type="text" style="padding:0;"><Tag color="red" >未验证</Tag></i-button>
          </span>
        </div>

        <div class="item">
          <Icon style="margin-right:5px;" type="person-stalker"></Icon>
          <span>{{user.groupName}}</span>
        </div>

      </div>
    </Card>
  </div>
</template>

<script>
import Card from 'iview/src/components/card/';
import Avatar from 'iview/src/components/avatar';
import Tag from 'iview/src/components/tag';
import Icon from 'iview/src/components/icon';
import Button from 'iview/src/components/button';
import Message from 'iview/src/components/message';
import AV from 'leancloud-storage';
import api from '@/api/';

export default {
  name: 'userinfo',
  components: {
    Card,
    Avatar,
    Icon,
    Tag,
    'i-button': Button
  },
  filters: {
    getAvatarText(v) {
      return v.substr(-2);
    }
  },
  props: {
    user: Object,
    userId: String
  },
  computed: {
    fullName() {
      if (!this.user.extInfo) return this.user.username;

      return this.user.username + '(' + this.user.extInfo + ')';
    }
  },
  mounted() {
    this.avatar = localStorage.getItem('userAvatar_' + this.userId);
    let span = this.$refs.avatar.$el.getElementsByTagName('span')[0];
    if (span && parseInt(span.style.lineHeight, 10) != 80) {
      span.style.lineHeight = '80px';
    }
  },
  data() {
    return {
      avatar: ''
    };
  },
  methods: {
    startEdit() {
      this.$emit('startEdit', this.user, this.userId);
    },
    verifyEmail() {
      // 只有自己才能验证邮件
      if(this.userId != AV.User.current().id) return;

      AV.User.requestEmailVerify(this.user.email).then(() => {
        Message.info({
          content: '验证邮件已经发送至 ' + this.user.email,
          closable: true,
          duration: 3
        });
      });
    },
    savePhoto(event) {
      let file = event.target.files[0];
      let reader = new FileReader();
      reader.onload = e => {
        localStorage.setItem('userAvatar_' + this.userId, e.target.result);
        this.avatar = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
};
</script>

<style scoped>
.user-info {
  padding: 10px;
}
.left {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  text-align: center;
}
.right {
  margin-left: 100px;
}
.hr {
  margin-top: 5px;
  margin-bottom: 10px;
}
.detail-title,
.item {
  padding-left: 10px;
  line-height: 28px;
  height: 28px;
}
.edit-btn-wrap {
  /* display: block; */
}
.user-avatar {
  width: 80px;
  height: 80px;

  line-height: 80px;

  border-radius: 40px;
}
.upload-avatar {
  position: relative;

  overflow: hidden;

  width: 80px;
  height: 80px;
  margin: 0;

  border-radius: 50%;
}
.upload-avatar::after {
  position: absolute;
  bottom: 0;
  left: 0;
  padding:3px 0 5px;

  display: block;

  width: 100%;

  font-size: 12px;

  content: '更换头像';

  color: #ccc;
  background: rgba(0, 0, 0, 0.3);

  opacity: 0;
  cursor: pointer;
  transition: opacity 0.2s linear;
}
.upload-avatar:hover::after {
  opacity: 1;
}
</style>
