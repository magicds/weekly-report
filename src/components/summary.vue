<template>
  <div class="summary">
    <i-table :columns="columns" :data="data"></i-table>
  </div>
</template>

<script>
import Table from 'iview/src/components/table/table'
import api from '@/api/index.js'

export default {
  name: 'summary',
  components: {
    'i-table': Table
  },
  mounted() {
    // 创建完成后获取数据
    api.getCurrWeekData().then(result => {
      console.log(result)
    })
  },
  data() {
    return {
      data: [],
      columns: [
        {
          title: '姓名',
          key: 'username'
        },
        {
          title: '工作内容',
          key: 'workList'
        },
        {
          title: '任务耗时',
          key: 'taskTime'
        },
        {
          title: '沟通耗时',
          key: 'communicationTime'
        },
        {
          title: '学习耗时',
          key: 'studyTime'
        },
        {
          title: '饱和度',
          key: 'saturation'
        },
        {
          title: '备注',
          key: 'leaveList'
        },
        {
          title: '提交时间',
          key: 'createdAt'
        }
      ]
    }
  }
}
</script>

<style>

</style>


