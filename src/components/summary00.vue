<template>
  <div class="summary">
    <i-table id="person-summary" ref="table" :columns="columns" :data="data"></i-table>
    <i-button @click="exportTable">导出</i-button>
  </div>
</template>

<script>
import Table from 'iview/src/components/table/table';
import Button from 'iview/src/components/button/button';
import api from '@/api/index.js';

export default {
  name: 'summary',
  components: {
    'i-table': Table,
    'i-button': Button
  },
  mounted() {
    // 创建完成后获取数据
    // api.getCurrWeekData().then(result => {
    //   console.log(result);
    // });
    this.data.push({
      username: 'admin',
      workList: [
        {
          id: '1',
          content: '任务1',
          time: 2,
          type: 'task',
          showTime: true
        },
        {
          id: '1-1',
          content: '任务1-1',
          time: 2,
          type: 'task',
          showTime: false
        },
        {
          id: '1-2',
          content: '任务1-2',
          time: 2,
          type: 'task',
          showTime: false
        },
        {
          id: '2',
          content: '学习',
          time: 10,
          type: 'study',
          showTime: true
        },
        {
          id: '3',
          content: '沟通',
          time: 10,
          type: 'communication',
          showTime: true
        }
      ],
      leaveList: [],
      studyTime: 18,
      taskTime: 8,
      communicationTime: 16,
      leaveTime: 0,
      saturation: '80%',
      createdAt: '2017-11-1'
    });
    this.data.push({
      username: 'admin2',
      workList: [
        {
          id: '1',
          content: '任务1',
          time: 12,
          type: 'task',
          showTime: true
        },
        {
          id: '1-1',
          content: '任务1-1',
          time: 3,
          type: 'task',
          showTime: false
        },
        {
          id: '1-2',
          content: '任务1-2',
          time: 3,
          type: 'task',
          showTime: false
        },
        {
          id: '2',
          content: '学习',
          time: 8,
          type: 'study',
          showTime: true
        },
        {
          id: '3',
          content: '沟通',
          time: 16,
          type: 'communication',
          showTime: true
        }
      ],
      leaveList: [],
      studyTime: 6,
      taskTime: 10,
      communicationTime: 10,
      leaveTime: 0,
      saturation: '90%',
      createdAt: '2017-11-2'
    });
  },
  data() {
    return {
      data: [],
      fullTime: 40,
      columns: [
        {
          title: '姓名',
          key: 'username',
          sortable: true
        },
        {
          title: '工作内容',
          key: 'workList',
          render: (h, params) => {
            let items = [];
            params.row.workList.forEach(item => {
              items.push(
                h(
                  'li',
                  item.content + (item.showTime ? `（${item.time}小时）` : '')
                )
              );
            });

            return h('ul', items);
          }
        },
        {
          title: '任务耗时',
          key: 'taskTime',
          sortable: true
          // ,
          // render: (h, params) => {
          //   let time = 0;
          //   params.row.reportList.forEach(item => {
          //     time += item.type == 'task' ? item.time : 0;
          //   });
          //   // return h('span', time ? time + '小时' : '-')
          //   return h('span', time);
          // }
        },
        {
          title: '沟通耗时',
          key: 'communicationTime',
          sortable: true
          // ,
          // render: (h, params) => {
          //   let time = 0
          //   params.row.reportList.forEach(item => {
          //     time += item.type == 'communication' ? item.time : 0
          //   })
          //   return h('span', time ? time + '小时' : '-')
          // }
        },
        {
          title: '学习耗时',
          key: 'studyTime',
          sortable: true
          // ,
          // render: (h, params) => {
          //   let time = 0
          //   params.row.reportList.forEach(item => {
          //     time += item.type == 'study' ? item.time : 0
          //   })
          //   return h('span', time ? time + '小时' : '-')
          // }
        },
        {
          title: '饱和度',
          key: 'saturation',
          sortable: true
          // ,
          // render:(h,params) => {
          //   let saturation
          // }
        },
        {
          title: '备注',
          key: 'leaveList',
          render: (h, params) => {
            let items = [];
            params.row.leaveList.forEach(item => {
              items.push(
                h(
                  'li',
                  item.content + (item.showTime ? `（${item.time}小时）` : '')
                )
              );
            });

            return h('ul', items);
          }
        },
        {
          title: '提交时间',
          key: 'createdAt',
          sortable: true
        }
      ]
    };
  },
  methods: {
    exportTable() {
      this.$refs.table.exportCsv({ filename: '周报导出测试', original: false });
      // 表格的导出功能无法使用
    }
  },
  computed: {}
};
</script>

<style>
/* 重写排序样式hover可见 */
.ivu-table-sort {
    visibility: hidden;
}
th {
    cursor: default;
}
th:hover .ivu-table-sort {
    visibility: visible;
}

</style>


