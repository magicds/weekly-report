<template>
  <div class="user-verify">
    <div class="alert alert-danger">
      <p>如果您确认下方用户是团队成员，请点击按钮通过验证请求。否则请忽略或删除。</p>
    </div>
    <legend class="user-verify-title">未验证成员</legend>
    <i-table :columns="tableColumns" :loading="userLoading" :data="userList" no-data-text="暂无未验证用户"></i-table>
    <legend class="user-verify-title">验证记录</legend>
    <div class="user-verify-logs">
      <ul v-if="logsData.length">
        <li class="verify-log-item" v-for="log in logsData" :key="log.id">
          <Tag :color="log.type | type2color" style="vertical-align: top;">{{log.type}}</Tag>
          <span>{{log.date}}</span>
          <span>{{log.info}}</span>
        </li>
      </ul>
      <div v-else class="no-logs"> 暂无记录 </div>
    </div>
  </div>
</template>

<script>
import Table from 'iview/src/components/table/table';
import Button from 'iview/src/components/button/';
import Tag from 'iview/src/components/tag';
import Icon from 'iview/src/components/icon';
import Message from 'iview/src/components/message';
import moment from 'moment/min/moment.min.js';
import api from '@/api/';

export default {
  name: 'verify',
  components: {
    'i-table': Table,
    'i-button': Button,
    Tag
  },
  data() {
    return {
      userLoading: true,
      tableColumns: [
        {
          title: '姓名',
          key: 'username'
        },
        {
          title: 'email',
          key: 'email'
        },
        {
          title: '小组',
          key: 'groupName'
        },
        {
          title: '注册时间',
          key: 'date'
        },
        {
          title: '操作',
          render: (h, params) => {
            return h(Button.Group, [
              h(
                Button,
                {
                  props: {
                    type: 'ghost',
                    icon: 'ios-checkmark'
                  },
                  on: {
                    click: () => {
                      this.verifyUser(params.row);
                    }
                  }
                },
                '通过'
              ),
              h(
                Button,
                {
                  props: {
                    type: 'dashed',
                    icon: 'ios-trash-outline'
                  },
                  on: {
                    click: () => {
                      this.deleteUser(params.row);
                    }
                  }
                },
                '删除'
              )
            ]);
          }
        }
      ],
      userList: [],
      logsLoading: true,
      logsData: []
    };
  },
  filters: {
    type2color(type) {
      let color = 'default';
      switch (type) {
        case 'signup':
          color = 'default';
          break;
        case 'verify':
          color = 'green';
          break;
        case 'delete':
          color = 'red';
          break;
        default:
          break;
      }
      return color;
    }
  },
  beforeMount() {
    this.getUserData();
    this.getLogData();
  },
  methods: {
    getUserData() {
      this.userLoading = true;
      api
        .getData('_User', [{ action: 'equalTo', field: 'verify', value: false }], [{ sort: 'desc', field: 'createdAt' }])
        .then(result => {
          const users = [];
          result.forEach(item => {
            users.push({
              id: item.id,
              username: item.attributes.username,
              email: item.attributes.email,
              groupName: item.attributes.groupName,
              date: moment(item.createdAt).format('YYYY-MM-DD hh:mm:ss')
            });
          });

          this.userList = users;
          this.userLoading = false;
        })
        .catch(err => {
          console.log(err);
        });
    },
    getLogData() {
      api
        .getData('UserVerifyLogs', null, [{ sort: 'desc', field: 'createdAt' }])
        .then(result => {
          console.log(result);
          const logList = [];
          result.forEach(item => {
            logList.push({
              id: item.id,
              type: item.attributes.type,
              info: item.attributes.info,
              date: moment(item.createdAt).format('YYYY-MM-DD hh:mm:ss')
            });
          });
          this.logsData = logList;
        })
        .catch(err => {
          console.log(err);
        });
    },
    verifyUser(user) {
      this.userLoading = true;
      api
        .verifyUser(user.id)
        .then(() => {
          this.userLoading = false;
          this.getUserData();
          this.getLogData();
          Message.success({
            content: '操作成功'
          });
        })
        .catch(err => {
          this.userLoading = false;
          Message.error({
            content: '操作失败' + (err.message || err)
          });
        });
    },
    deleteUser(user) {
      this.userLoading = true;
      api
        .deleteUser(user.id)
        .then(() => {
          this.userLoading = false;
          this.getUserData();
          this.getLogData();
          Message.success({
            content: '操作成功'
          });
        })
        .catch(err => {
          this.userLoading = false;
          Message.error({
            content: '操作失败' + (err.message || err)
          });
        });
    }
  }
};
</script>

<style>
.user-verify-title {
  margin-top: 20px;
}
.verify-log-item {
  line-height: 30px;
  margin-bottom: 6px;
}
.no-logs {
  text-align: center;
  padding: 20px;
}
</style>
