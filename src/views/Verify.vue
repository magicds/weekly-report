<template>
  <div class="user-verify">
    <i-table :columns="tableColumns" :loading="userLoading" :data="userList" no-data-text="暂无未验证用户"></i-table>
  </div>
</template>

<script>
import Table from 'iview/src/components/table/table';
import Button from 'iview/src/components/button/';
import api from '@/api/';

export default {
  name: 'verify',
  components: {
    'i-table': Table,
    'i-button': Button
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
                    type: 'primary',
                    icon: 'ios-checkmark'
                  },
                  on: {
                    click: () => {
                      this.verifyUser(params.row);
                    }
                  }
                },
                '通过验证'
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
      logsLoading:true,
      logsData:[]
    };
  },
  beforeMount() {
    this.getUserData();
    this.getLogData();
  },
  methods: {
    getUserData() {
      this.loading = true;
      api
        .getData(
          '_User',
          [{ action: 'equalTo', field: 'verify', value: false }],
          [{ sort: 'desc', field: 'createdAt' }]
        )
        .then(result => {
          const users = [];
          result.forEach(item => {
            users.push({
              id: item.id,
              username: item.attributes.username,
              email: item.attributes.email,
              groupName: item.attributes.groupName,
              date: item.createdAt
            });
          });

          this.userList = users;
          this.loading = false;
        })
        .catch(err => {
          console.log(err);
        });
    },
    getLogData() {
      api
        .getData('UserVerifyLogs',null, [{ sort: 'desc', field: 'createdAt' }])
        .then(result => {
          console.log(result);
          const logList = [];
          // result.forEach(item =>{
          //   logList.push({

          //   })
          // });
          this.logsData = logList;
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

