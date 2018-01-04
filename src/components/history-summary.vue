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

// 获取数据
function getData(start, end) {
  return Promise.all([
    api.getAllUser(),
    api.getDataByRange(start, end)
  ]).then(results => {
    console.log(results);

    window.results = results;

    let reports = dealReports(results[1], results[0]);
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
    attrs.reportData = JSON.parse(attrs.reportData);
    reportData = attrs.reportData;
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
    }
  });

  return map;
}

// 处理为显示需要的数据
function dealReports(data, users) {
  let reports = [],
    userMap = toMap(users),
    // 已经提交人人员集合
    submitedUsers = {};

  data.forEach(item => {
    let attrs = item.attributes,
      reportData = JSON.parse(attrs.report);

    submitedUsers[attrs.userId] = true;
    reports.push(
      Object.assign(
        {
          userId: attrs.userId,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt
        },
        userMap[attrs.userId],
        reportData
      )
    );
  });

  // 补上未提交人员的
  for (let i = 0, l = users.length; i < l; ++i) {
    if (!submitedUsers[users[i].id]) {
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
      data: JSON.parse(
        '[{"userId":"5a0126e82f301e0069e964d8","createdAt":"2017-11-07T03:42:11.284Z","updatedAt":"2017-11-07T05:55:28.212Z","groupName":"Front End Support","username":"支撑人员1","emailVerified":false,"groupIndex":0,"mobilePhoneVerified":false,"workList":[{"id":"list-3","type":"task","typeText":"实际任务","content":"支撑工作1","showTime":false,"time":6.333333333333333},{"id":"list-4","type":"task","typeText":"实际任务","content":"支撑工作2","showTime":false,"time":6.333333333333333},{"id":"list-5","type":"task","typeText":"实际任务","content":"支撑工作3","showTime":false,"time":6.333333333333333},{"id":"list-6","type":"task","typeText":"实际任务","content":"维护工作1","showTime":false,"time":11.5},{"id":"list-7","type":"task","typeText":"实际任务","content":"维护工作2","showTime":false,"time":11.5},{"id":"list-8","type":"communication","typeText":"沟通管理","content":"问题讨论","showTime":true,"time":4}],"leaveList":[],"studyTime":0,"taskTime":42,"communicationTime":4,"leaveTime":0,"saturation":1.15},{"userId":"5a01277bfe88c20068352838","createdAt":"2017-11-07T06:25:48.710Z","updatedAt":"2017-11-07T06:25:48.710Z","groupName":"Front End Support","username":"支撑人员2","emailVerified":false,"groupIndex":0,"mobilePhoneVerified":false,"workList":[{"id":"list-1","type":"task","typeText":"实际任务","content":"是点击开发和接口申达股份接受多个 ","showTime":false,"time":6.666666666666667},{"id":"list-2","type":"task","typeText":"实际任务","content":"是打开返回即可申达股份","showTime":false,"time":6.666666666666667},{"id":"list-3","type":"task","typeText":"实际任务","content":"收到回复口接受多个附件库","showTime":false,"time":6.666666666666667},{"id":"list-4","type":"task","typeText":"实际任务","content":"收到回复给客户的顾客顾客的说风凉话个接口的覆盖","showTime":false,"time":6.666666666666667},{"id":"list-5","type":"task","typeText":"实际任务","content":"的返回个卡顿感客户给","showTime":false,"time":6.666666666666667},{"id":"list-6","type":"task","typeText":"实际任务","content":"后端反馈结构和","showTime":false,"time":6.666666666666667}],"leaveList":[],"studyTime":0,"taskTime":40,"communicationTime":0,"leaveTime":0,"saturation":1},{"uncommitted":true,"userId":"5a01134b1579a30045122e12","workList":[],"leaveList":[],"studyTime":0,"taskTime":0,"communicationTime":0,"leaveTime":0,"email":"516321242@qq.com","username":"管理员","emailVerified":false,"mobilePhoneVerified":false,"saturation":0}]'
      ),
      isShow: false
    };
  },
  watch: {},
  computed: {
    dateRange() {
      let start_v = moment(this.date[0]).clone();
      let end_v = moment(this.date[1]).clone();
      let start = start_v
        .clone()
        .subtract(start_v.isoWeekday() - 1, 'days')
        .toDate();
      let end = end_v
        .clone()
        .add(7 - end_v.isoWeekday() + 1, 'days')
        .toDate();
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
