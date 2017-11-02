<template>
  <div class="summary">
    <table class="table" id="person-summary">
      <thead>
        <tr>
          <th>姓名</th>
          <th>工作内容</th>
          <th>任务耗时</th>
          <th>沟通耗时</th>
          <th>学习耗时</th>
          <th>饱和度</th>
          <th>备注</th>
          <th>提交时间</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="person in data">
          <td>{{person.username}}</td>
          <td>
            <ul v-if="person.workList.length > 0">
              <li v-for="item in person.workList">{{item.content}} <span v-if="item.showTime">（{{item.time}} 小时）</span><span v-else></span></li>
            </ul>
          </td>
          <td>{{person.taskTime}}</td>
          <td>{{person.communicationTime}}</td>
          <td>{{person.studyTime}}</td>
          <td :class="getSaturationStyle(person.saturation)">{{person.saturation | getProportion}}</td>
          <!-- <td :class="getSaturationStyle(person)">{{gets(person)}}</td>
          <td> -->
            <ul v-if="person.leaveList.length > 0">
              <li v-for="item in person.leaveList">{{item.content}} <span v-if="item.showTime">（{{item.time}} 小时）</span><span v-else></span></li>
            </ul>
            <span v-else>无</span>
          </td>
          <td>{{person.createdAt}}</td>
        </tr>
      </tbody>
    </table>
    <i-button @click="exportTable">导出</i-button>
  </div>
</template>

<script>
import Button from 'iview/src/components/button/button';
import api from '@/api/index.js';
import ExcellentExport from '@/assets/libs/excellentexport.js';

export default {
  name: 'summary',
  components: {
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
      createdAt: '2017-11-1',
      saturation: (8 + 16) / this.fullTime
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
      createdAt: '2017-11-2',
      saturation: (10 + 10) / this.fullTime
    });
  },

  data() {
    return {
      data: [],
      fullTime: 40
    };
  },
  filters: {
    getProportion(v) {
      return (v * 100).toFixed(2) + '%';
    }
  },
  methods: {
    // 设置饱和度样式
    // 0.9~1.2                  绿色
    // 1.2~1.4 或 0.7~0.9       黄色
    // 1.4+ 0.7-                红色 加粗
    getSaturationStyle(v) {
      // let v = (person.taskTime + person.communicationTime) / this.fullTime;
      if (v >= 1.4 || v < 0.7) {
        return 'text-danger text-bold';
      } else if (v >= 1.2) {
        return 'text-warning';
      } else if (v >= 0.9) {
        return 'text-success';
      } else {
        return 'text-warning';
      }
    },
    // 计算饱和度

    exportTable() {
      let save_link = document.createElement('a');
      ExcellentExport.csv(save_link, 'person-summary');
      save_link.download = '周报' + '.csv';

      save_link.click();
    }
  },
  watch: {
    fullTime() {}
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


