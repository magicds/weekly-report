<template>
  <div class="histroysmmmary">
    请选择要查看的时间范围
    <DatePicker type="daterange" v-model="date" :options="rangeSettings" placement="bottom-start" placeholder="请选择一个时间段" style="width: 200px"></DatePicker>
    <i-button @click="search">查询</i-button>
    <my-summary v-if="isShow" :data="data"></my-summary>
  </div>
</template>
<script>
import mySummary from './summary/summary.vue';
import api from '@/api/index.js';
// import { Select, Option } from 'iview/src/components/select';
import DatePicker from 'iview/src/components/date-picker/';
import Button from 'iview/src/components/button/';
import Promise from 'bluebird';
import moment from 'moment';

// 获取两个日期之间的星期数目
function getWeeks(strat,end) {
  let s = moment(strat);
  let e = moment(end);

  return Math.ceil((e.dayOfYear() - s.dayOfYear()) / 7)
}
// 获取数据
function getData(start, end) {
  return Promise.all([
    api.getAllUser(),
    api.getDataByRange(start, end, { sort: 'asc', field: 'createdAt' })
  ]).then(results => {
    console.log(results);

    window.results = results;

    let reports = dealReports(results[1], results[0], getWeeks(start,end));
    window.reports = reports;

    return reports;
  });
}
// uses转化为map形式
function toMap(users) {
  let user = {};
  users.forEach(item => {
    user[item.id] = item.attributes;
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
      map[id] = attrs;
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
function dealReports(data, users) {
  let reports = [];
  let userMap = toMap(users);
  let reportMap = logToMap(data);
  // 已经提交人人员集合
  let submitedUsers = {};



  // data.forEach(item => {
  //   let attrs = item.attributes;
  //   let reportData = JSON.parse(attrs.report);

  //   if (!userMap[attrs.userId].noReport) {
  //     submitedUsers[attrs.userId] = true;
  //     reports.push(
  //       Object.assign(
  //         {
  //           userId: attrs.userId,
  //           createdAt: item.createdAt,
  //           updatedAt: item.updatedAt
  //         },
  //         userMap[attrs.userId],
  //         reportData
  //       )
  //     );
  //   }
  // });

  // 补上未提交人员的
  for (let i = 0, l = users.length; i < l; ++i) {
    if (!users[i].attributes.noReport && !submitedUsers[users[i].id]) {
      reports.push(
        Object.assign(
          {
            // 标识此用户未提交 并补充默认数据
            uncommitted: true,
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

  return reports;
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
        start.add(7 - start_day + 1, 'days').toDate(),
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
      date: getDateRange('month', 1),

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
        end = end.subtract(day, 'days').toDate();
      } else {
        end = end.add(7 - day + 1, 'days').toDate();
      }
      return [start, end];
    }
  },
  methods: {
    search() {
      if (!this.date[0]) return;
      getData(...this.dateRange).then(data => {
        this.isShow = true;
        this.$set(this, 'data', data);
      });
    }
  }
};
</script>

<style>

</style>
