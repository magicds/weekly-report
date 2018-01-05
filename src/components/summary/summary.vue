<template>
  <div class="summary" :data="cloneData" :isloading="isloading">
    <div class="summary-loading" v-show="isloading">
      <div class="ivu-spin ivu-spin-large ivu-spin-fix">
        <div class="ivu-spin-main">
          <span class="ivu-spin-dot"></span>
          <div class="ivu-spin-text">加载中</div>
        </div>
      </div>
    </div>
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
        <tr v-for="person in cloneData">
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
          <td>
            <span v-if="person.uncommitted">未提交</span>
            <span v-else :title="getTimeTitle(person)">{{person.createdAt | formatTime}}</span>
          </td>
        </tr>
      </tbody>
    </table>
    <i-button type="primary" @click="exportTable">导出</i-button>
    <div ref="person-charts" style="width:100%;height:400px;margin-top:20px"></div>
    <div ref="group-charts" style="width:100%;height:300px;"></div>
  </div>
</template>

<script>
import Button from 'iview/src/components/button/button';
import api from '@/api/index.js';
import ExcellentExport from '@/assets/libs/excellentexport.js';
import moment from 'moment';
import renderCharts from './rendercharts.js';

const WEEKNAMES = ['一', '二', '三', '四', '五', '六', '日'];

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

/**
 * 克隆数据 并添加默认的排序标识_index
 * 简单通过json转化实现
 * @param {Array} data    原数组
 * @return {Array}     克隆后数组
 */
function getCloneData(data) {
  let d = JSON.parse(JSON.stringify(data));
  d.forEach((item, i) => {
    item._index = i;
  });
  return d;
}

export default {
  name: 'summary',
  components: {
    'i-button': Button
  },
  props: {
    data: Array,
    isloading: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    renderCharts(
      this.cloneData,
      this.$refs['person-charts'],
      this.$refs['group-charts']
    );
  },
  created() {},
  updated() {
    if (this.cloneData && this.cloneData.length) {
      renderCharts(
        this.cloneData,
        this.$refs['person-charts'],
        this.$refs['group-charts']
      );
    }
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
      cloneData: getCloneData(this.data)
    };
  },
  filters: {
    getProportion(v) {
      return (v * 100).toFixed(2) + '%';
    },
    formatTime(v) {
      let c = moment(v);
      return c.format('MM-DD HH:mm') + ' 周' + WEEKNAMES[c.isoWeekday() - 1];
    }
  },
  methods: {
    // 设置饱和度样式
    // 0.9~1.2                  绿色
    // 1.2~1.4 或 0.7~0.9       黄色
    // 1.4+ 0.7-                红色 加粗
    getSaturationStyle(v) {
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
        this.cloneData = mergeSort(this.cloneData, column.key, type);
      } else {
        column._sortType = 'normal';
        // 恢复默认排序
        this.cloneData = mergeSort(this.cloneData, '_index', type);
      }
      console.log(column, column._sortType);
    },
    getTimeTitle(person) {
      let c = moment(person.createdAt);
      let u = moment(person.updatedAt);
      let title =
        '提交时间' + c.format('MM-DD HH:mm') + ' 周' + WEEKNAMES[c.isoWeekday() - 1];

      if (c.isSame(u)) {
        return title;
      } else {
        return (
          title +
          '\r\n最后更新时间' +
          u.format('MM-DD HH:mm') +
          ' 周' +
          WEEKNAMES[u.isoWeekday() - 1]
        );
      }
    }
  },
  watch: {
    // 周时间变化时，计算更新饱和度
    // fullTime(newVal, oldVal) {
    //   this.cloneData.forEach(item => {
    //     item.saturation = item.saturation * oldVal / newVal;
    //   });
    // },
    // 数据变化时更新表格数据
    data(newVal) {
      this.$set(this, 'cloneData', getCloneData(newVal));
    }
  }
};
</script>

<style>
.summary {
  position: relative;
}
.vertical-middle td,
.vertical-middle th {
  vertical-align: middle;
}
.summary-loading {
  position: absolute;
  width: 100%;
  height: 100%;
}
.summary-loading .ivu-spin-fix .ivu-spin-main {
  position: fixed;
}
.summary-loading  .ivu-spin-text {
   display: block;
}
/* .ivu-table-sort {
    visibility: hidden;
}
.vertical-middle th:hover .ivu-table-sort {
    visibility: visible;
} */
</style>


