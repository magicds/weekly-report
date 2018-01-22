<template>
  <div class="currweeksummary">
    <legend class="curr-summary-title">本周汇总<i  class="curr-summary-refresh icon icon-refresh" @click="refresh()" /></legend>
    <my-summary :data="data" :isloading="isloading" :export-name="fileName"></my-summary>
  </div>
</template>

<script>
import mySummary from './summary/summary.vue';
import api from '@/api/index.js';
import moment from 'moment/min/moment.min.js';
import Promise from 'bluebird';
import mergeSort from '@/util/sort.js';

// 获取数据
function getData() {
  return Promise.all([
    api.getAllUser(),
    api.getCurrWeekData()
  ]).then(results => {
    console.log(results);

    window.results = results;

    let reports = dealReports(results[1], results[0]);
    window.reports = reports;

    // 新增排序标识
    reports.forEach(item => {
      item._index = item.groupIndex * 100 + item.memberIndex;
    });

    return mergeSort(reports, '_index', 'asc');
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

// 处理为显示需要的数据
function dealReports(data, users) {
  let reports = [],
    userMap = toMap(users),
    // 已经提交人人员集合
    submitedUsers = {};

  data.forEach(item => {
    let attrs = item.attributes,
      reportData = JSON.parse(attrs.report);

    if (!userMap[attrs.userId].noReport) {
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
    }
  });

  // 补上未提交人员的
  for (let i = 0, l = users.length; i < l; ++i) {
    // 需要填写日志 但是没有填写的
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

export default {
  name: 'currweeksummary',
  components: {
    mySummary
  },
  data() {
    return {
      data: [],
      isloading: true
    };
  },
  computed: {
    fileName() {
      return (
        moment()
          .isoWeekday(1)
          .format('MM.DD') +
        '~' +
        moment()
          .isoWeekday(7)
          .format('MM.DD') +
        '周报'
      );
    }
  },
  created() {},
  mounted() {
    this.isloading = true;
    getData().then(data => {
      this.isloading = false;
      console.log(data);
      this.$set(this, 'data', data);
    });
  },
  methods: {
    refresh() {
      this.isloading = true;
      getData().then(data => {
        this.isloading = false;
        this.$set(this, 'data', data);
      });
    }
  }
};
</script>

<style>

.side-affix {
  display: inline-block;
}
.curr-summary-title {
  font-size: 18px;
  line-height: 35px;
  margin-bottom: 10px;
}
.curr-summary-refresh {
  margin-left: 10px;
  cursor: pointer;
}
</style>

