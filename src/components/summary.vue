<template>
  <div class="summary">
    <table class="table-bordered table vertical-middle table-hover" id="person-summary">
      <thead>
        <tr>
          <th v-for="column in columns">
            <span class="column-name">{{column.title}}</span>
            <span class="ivu-table-sort" v-if="column.sortable">
              <i class="ivu-icon ivu-icon-arrow-up-b"
              @click="sort(column, 'asc')"
              :class="{on: column._sortType === 'asc'}"></i>
              <i class="ivu-icon ivu-icon-arrow-down-b"
              @click="sort(column, 'desc')"
              :class="{on: column._sortType === 'desc'}"></i>
            </span>
          </th>
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
          <td>
            <ul v-if="person.leaveList.length > 0">
              <li v-for="item in person.leaveList">{{item.content}} <span v-if="item.showTime">（{{item.time}} 小时）</span><span v-else></span></li>
            </ul>
            <span v-else>无</span>
          </td>
          <td>{{person.createdAt}}</td>
        </tr>
      </tbody>
    </table>
    <i-button type="primary" @click="exportTable">导出</i-button>
  </div>
</template>

<script>
import Button from 'iview/src/components/button/button';
import api from '@/api/index.js';
import ExcellentExport from '@/assets/libs/excellentexport.js';

/**
 * [归并排序]
 * @param  {[Array]} arr   [要排序的数组]
 * @param  {[String]} prop  [排序字段，用于数组成员是对象时，按照其某个属性进行排序，简单数组直接排序忽略此参数]
 * @param  {[String]} order [排序方式]
 * @return {[Array]}       [排序后数组，新数组，并非在原数组上的修改]
 */
let mergeSort = (function() {
  // 合并
  let _merge = function(left, right, prop) {
    let result = [];

    // 对数组内成员的某个属性排序
    if (prop) {
      while (left.length && right.length) {
        if (left[0][prop] <= right[0][prop]) {
          result.push(left.shift());
        } else {
          result.push(right.shift());
        }
      }
    } else {
      // 数组成员直接排序
      while (left.length && right.length) {
        if (left[0] <= right[0]) {
          result.push(left.shift());
        } else {
          result.push(right.shift());
        }
      }
    }

    while (left.length) result.push(left.shift());

    while (right.length) result.push(right.shift());

    return result;
  };

  let _mergeSort = function(arr, prop) {
    // 采用自上而下的递归方法
    let len = arr.length;
    if (len < 2) {
      return arr;
    }
    let middle = Math.floor(len / 2),
      left = arr.slice(0, middle),
      right = arr.slice(middle);
    return _merge(_mergeSort(left, prop), _mergeSort(right, prop), prop);
  };

  return function(arr, prop, order) {
    let result = _mergeSort(arr, prop);
    if (!order || order.toLowerCase() === 'asc') {
      // 升序
      return result;
    } else {
      // 降序
      let _ = [];
      result.forEach(function(item) {
        _.unshift(item);
      });
      return _;
    }
  };
})();

export default {
  name: 'summary',
  components: {
    'i-button': Button
  },
  mounted() {

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
  created() {
    // 创建后为数据新增默认的——index 用于还原默认顺序
    this.data.forEach((item,i) =>{
      item._index = i;
    })
  },

  data() {
    return {
      columns: [
        {
          title: '姓名',
          key: 'username',
          sortable: true
        },
        {
          title: '工作内容',
          key: 'workList'
        },
        {
          title: '任务耗时',
          key: 'taskTime',
          sortable: true
        },
        {
          title: '沟通耗时',
          key: 'communicationTime',
          sortable: true
        },
        {
          title: '学习耗时',
          key: 'studyTime',
          sortable: true
        },
        {
          title: '饱和度',
          key: 'saturation',
          sortable: true
        },
        {
          title: '备注',
          key: 'leaveList'
        },
        {
          title: '提交时间',
          key: 'createdAt',
          sortable: true
        }
      ],
      data: [],
      fullTime: 40,

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
    exportTable() {
      let save_link = document.createElement('a');
      ExcellentExport.csv(save_link, 'person-summary');
      save_link.download = '周报' + '.csv';

      save_link.click();
    },

    sort(column, type) {
      if (column._sortType != type) {
        column._sortType = type;
        this.data = mergeSort(this.data, column.key, type);
      }else {
        column._sortType = 'normal';
        // 恢复默认排序
        this.data = mergeSort(this.data, '_index', type);;
      }
      console.log(column, column._sortType);
    }
  },
  watch: {
    // 周时间变化时，计算更新饱和度
    fullTime(newval, oldVal) {
      this.data.forEach(item => {
        item.saturation = item.saturation * oldVal / newval;
      });
    }
  },
  computed: {}
};
</script>

<style>
.vertical-middle td,
.vertical-middle th {
  vertical-align: middle;
}
/* .ivu-table-sort {
    visibility: hidden;
}
.vertical-middle th:hover .ivu-table-sort {
    visibility: visible;
} */
</style>


