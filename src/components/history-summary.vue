<template>
  <div class="histroysmmmary">
    请选择要查看的时间范围
    <DatePicker type="daterange" v-model="date" :options="rangeSettings" placement="bottom-start" placeholder="请选择一个时间段" style="width: 200px"></DatePicker>
    <i-button @click="search">查询</i-button>
    <p v-show="rangeInfo" class="range-info">{{rangeInfo}}</p>
    <my-summary v-if="isShow" :data="data" :export-name="fileName" :isloading="inGetData"></my-summary>
  </div>
</template>
<script>
import mySummary from './summary/summary.vue';
import api from '@/api/index.js';
// import { Select, Option } from 'iview/src/components/select';
import DatePicker from 'iview/src/components/date-picker/';
import Button from 'iview/src/components/button/';
import Promise from 'bluebird';
import moment from 'moment/min/moment.min.js';
import mergeSort from '@/util/sort.js';

// 获取两个日期之间的星期数目
function getWeeks(strat, end) {
  let s = moment(strat);
  let e = moment(end);

  // return Math.ceil((e.dayOfYear() - s.dayOfYear()) / 7);
  return Math.ceil(e.diff(s, 'days', true) / 7);
}
// 获取数据
function getData(start, end, weeks) {
  return Promise.all([
    api.getAllUser(),
    api.getDataByRange(start, end, { sort: 'asc', field: 'createdAt' })
  ]).then(results => {
    console.log(results);

    window.results = results;

    let reports = dealReports(results[1], results[0], weeks);
    window.reports = reports;

    return reports;
  });
}
// uses转化为map形式
function toMap(users) {
  let user = {};
  users.forEach(item => {
    user[item.id] = item.attributes;
    user[item.id].userId = item.id;
  });
  return user;
}
// logs转为map
function logToMap(logs) {
  let map = {};
  let attrs, id, reportData;
  let weeks = 0;
  logs.forEach(item => {
    attrs = item.attributes;
    reportData = JSON.parse(attrs.report);
    id = attrs.userId;
    // 第一个时直接赋值，后面进行合并
    if (!map[id]) {
      map[id] = Object.assign(
        {
          createdAt: item.createdAt,
          updatedAt: item.updatedAt
        },
        reportData
      );
    } else {
      // 时间以新的为准
      map[id].createdAt = item.createdAt;
      map[id].updatedAt = item.updatedAt;
      // 周报提交数据合并
      map[id].workList.push(...reportData.workList);
      map[id].leaveList.push(...reportData.leaveList);
      map[id].leaveTime += reportData.leaveTime;
      map[id].studyTime += reportData.studyTime;
      map[id].taskTime += reportData.taskTime;
      map[id].communicationTime += reportData.communicationTime;
      map[id].saturation += reportData.saturation;
    }
  });

  return map;
}

// 处理为显示需要的数据
function dealReports(data, users, weeks) {
  let reports = [];
  let userMap = toMap(users);
  let reportMap = logToMap(data);
  // 已经提交人人员集合
  let submitedUsers = {};

  for (let uid in reportMap) {
    if (
      Object.prototype.hasOwnProperty.call(reportMap, uid) &&
      !userMap[uid].noReport
    ) {
      submitedUsers[uid] = true;
      reports.push(Object.assign(userMap[uid], reportMap[uid]));
    }
  }

  // 补上未提交人员的
  for (let i = 0, l = users.length; i < l; ++i) {
    if (!users[i].attributes.noReport && !submitedUsers[users[i].id]) {
      reports.push(
        Object.assign(
          {
            // 标识此用户未提交 并补充默认数据
            uncommitted: true,
            updatedAt: new Date(2050, 11, 11),
            userId: users[i].id,
            workList: [],
            leaveList: [],
            studyTime: 0,
            taskTime: 0,
            communicationTime: 0,
            leaveTime: 0,
            saturation: 0
          },
          users[i].attributes
        )
      );
    }
  }
  // 组合排序标识 并 调整饱和度为平均饱和度
  reports.forEach(item => {
    item._index = item.groupIndex * 100 + item.memberIndex;
    item.saturation = item.saturation / weeks;
  });

  return mergeSort(reports, '_index', 'asc');
}
/**
 * 获取日期范围
 *
 * @param {String} unit 单位 可选 week / month
 * @param {Number} size 往前推算多久
 * @returns {Array} 一个数组，第一个值为开始日期，第二个为结束日期，计算失败范围一个空数组
 */
function getDateRange(unit, size) {
  let t = moment()
    .hour(0)
    .minute(0)
    .second(0)
    .millisecond(0);
  let day = t.isoWeekday();

  if (unit === 'week') {
    return [
      t
        .clone()
        .subtract(7 * size + day - 1, 'days')
        .toDate(),
      t.subtract(day - 1 + 7 * (size - 1), 'days').toDate()
    ];
  }

  if (unit === 'month') {
    return (function() {
      let aim_m = moment(t.subtract(size, 'month'), 'YYYY-MM');
      let start = aim_m.clone().startOf('month');
      let start_day = start.isoWeekday();
      let end = aim_m.clone().endOf('month');
      let end_day = end.isoWeekday();

      return [
        start.add(start_day === 1 ? 0 : 7 - start_day + 1, 'days').toDate(),
        end.add(7 - end_day + 1, 'days').toDate()
      ];
    })();
  }
  return [];
}

export default {
  name: 'histroysmmmary',
  components: {
    DatePicker,
    'my-summary': mySummary,
    'i-button': Button
  },
  data() {
    return {
      date: getDateRange('week', 1),

      inGetData: true,

      rangeInfo: '',

      rangeSettings: {
        // 快捷选择
        shortcuts: [
          {
            text: '前一周',
            value() {
              return getDateRange('week', 1);
            }
          },
          {
            text: '前两周',
            value() {
              return getDateRange('week', 2);
            }
          },
          {
            text: '前三周',
            value() {
              return getDateRange('week', 3);
            }
          },
          {
            text: '本月',
            value() {
              return getDateRange('month', 0);
            }
          },
          {
            text: '上月',
            value() {
              return getDateRange('month', 1);
            }
          }
        ],
        // 禁止选择超过今天的日期
        disabledDate(date) {
          // const day = date.getDay();
          // return day > 1 || (date > new Date());
          return date > new Date();
        }
      },
      data: [],
      isShow: false
    };
  },
  watch: {},
  computed: {
    dateRange() {
      let start_v = moment(this.date[0]).clone();
      let end_v = moment(this.date[1]).clone();
      // 开始时间为所选日期所在的周一
      let start = start_v
        .clone()
        .subtract(start_v.isoWeekday() - 1, 'days')
        .toDate();
      // 转化日期为所选日期所在的周日
      let day = end_v.isoWeekday();
      let end = end_v.clone();
      if (day === 1 && end_v.isAfter(start_v, 'day')) {
        end = end.toDate();
      } else {
        end = end.add(7 - day + 1, 'days').toDate();
      }
      return [start, end];
    },
    weeks() {
      return getWeeks(...this.dateRange);
    },
    fileName() {
      return (
        moment(this.dateRange[0]).format('MM.DD') +
        '~' +
        moment(this.dateRange[1]).format('MM.DD') +
        '周报'
      );
    }
  },
  methods: {
    search() {
      if (!this.date[0]) return;

      this.inGetData = true;
      this.rangeInfo =
        moment(this.dateRange[0]).format('YY年MM月DD日') +
        ' 到 ' +
        moment(this.dateRange[1]).format('YY年MM月DD日') +
        '，共' +
        this.weeks +
        '周。';

      getData(...this.dateRange, this.weeks).then(data => {
        this.isShow = true;
        this.inGetData = false;
        this.$set(this, 'data', data);
      });
    }
  }
};
</script>

<style>
.range-info {
  text-align: center;
  margin: 20px 0;
  font-size: 14px;
}
</style>
